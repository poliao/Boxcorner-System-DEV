import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Dcsm28Service } from './dcsm28.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { forkJoin, catchError, of } from 'rxjs';

// Fix for default marker icons in Leaflet with webpack
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

/**
 * Custom Router using OSRM public API
 * วาดเส้นทางตาม ORDER ที่กำหนด (ไม่ re-optimize ลำดับ) :
 * จุดเริ่มต้น → จุดเช็คอิน (เรียงตามเวลา) → จุดสิ้นสุด
 */
const OsrmOrderedRouter = L.Class.extend({
    options: {
        serviceUrl: 'https://router.project-osrm.org/route/v1/driving/'
    },

    initialize: function (options: any) {
        L.Util.setOptions(this, options);
    },

    route: function (waypoints: any[], callback: (err: any, routes: any[]) => void, context: any) {
        const validWps = waypoints.filter(wp => wp.latLng);

        if (validWps.length < 2) {
            callback({ message: 'At least two waypoints are required' }, []);
            return;
        }

        // สร้าง coordinate string สำหรับ OSRM: lng,lat;lng,lat;...
        const coords = validWps.map((wp: any) => `${wp.latLng.lng},${wp.latLng.lat}`).join(';');
        const url = `${this.options.serviceUrl}${coords}?overview=full&geometries=geojson`;

        fetch(url)
            .then(async res => {
                if (!res.ok) throw new Error(`OSRM error (${res.status}): ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                if (!data.routes || !data.routes[0]) {
                    throw new Error('No route found in OSRM response');
                }
                const r = data.routes[0];
                const coordinates = r.geometry.coordinates; // [lng, lat]
                const latLngs = coordinates.map((c: any) => L.latLng(c[1], c[0]));

                const route = {
                    name: 'Route',
                    summary: {
                        totalDistance: r.distance,
                        totalTime: r.duration
                    },
                    coordinates: latLngs,
                    waypoints: waypoints,
                    inputWaypoints: waypoints,
                    instructions: []
                };
                callback.call(context, null, [route]);
            })
            .catch(err => {
                console.error('OSRM Router Error:', err);
                callback.call(context, err, []);
            });

        return this;
    }
});

(L as any).Routing.osrmOrdered = function (options?: any) {
    return new (OsrmOrderedRouter as any)(options);
};

@Component({
    selector: 'app-dcsm28-map',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
    templateUrl: './dcsm28-map.component.html',
    styleUrls: ['./dcsm28.component.scss']
})
export class Dcsm28MapComponent implements OnInit, OnDestroy, AfterViewChecked {
    private map: L.Map | undefined;
    private tileLayer: L.TileLayer | undefined;
    private mapInitialized: boolean = false; // ป้องกันการ init ซ้ำ

    public routeDistances: { salesName: string, distanceKm: string }[] = [];
    private distanceAccumulator: Map<string, number> = new Map(); // รวมระยะทางตามชื่อพนักงาน
    public isAdmin: boolean = false;
    public salesUsers: any[] = [];
    public mapReady: boolean = false;  // แสดงแผนที่เมื่อเลือกพนักงานแล้ว

    // Filters
    public filterActivityDate: string = '';
    public filterSalesName: string = '';

    constructor(
        private router: Router,
        private dcsm28Service: Dcsm28Service,
        private loadingService: LoadingService,
        private sweetAlert: SweetAlertService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const userRole = this.authService.getUserFromToken().role;
        this.isAdmin = userRole === 'salesAdmin' || userRole === 'SupperAdmin';

        if (!this.isAdmin) {
            this.sweetAlert.error('Access Denied', 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
            this.router.navigate(['/Dcsm28']);
            return;
        }

        this.loadSalesUsers();
        // ไม่โหลดข้อมูลก่อน เพราะต้องเลือกพนักงานก่อน
    }

    ngAfterViewChecked(): void {
        // init แผนที่เมื่อ div#map ปรากฏใน DOM แล้ว (หลัง mapReady = true)
        if (this.mapReady && !this.mapInitialized) {
            const mapDiv = document.getElementById('map');
            if (mapDiv) {
                this.mapInitialized = true;
                this.initMap();
            }
        }
    }

    private loadSalesUsers(): void {
        this.dcsm28Service.getSalesUsers().subscribe({
            next: (users: any[]) => {
                this.salesUsers = users;
            },
            error: (err) => {
                console.error('Error loading sales users:', err);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

    private initMap(): void {
        // กำหนดจุดศูนย์กลางเบื้องต้นที่ประเทศไทย
        this.map = L.map('map', {
            center: [13.736717, 100.523186],
            zoom: 6
        });

        this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }

    public onSearch(): void {
        if (!this.filterSalesName || !this.filterActivityDate) {
            this.sweetAlert.warning('กรุณาเลือกข้อมูล ให้ครบถ้วน', 'กรุณาเลือกพนักงานขาย และวันที่ก่อนค้นหา');
            return;
        }
        this.mapReady = true;
        this.cdr.detectChanges();
        setTimeout(() => this.loadMapData(), 100);
    }

    public onSalesChange(): void {
        // ต้องเลือกทั้งพนักงานและวันที่ก่อนจึงแสดงแผนที่
        if (this.filterSalesName && this.filterActivityDate) {
            this.mapReady = true;
            this.cdr.detectChanges();
            setTimeout(() => this.loadMapData(), 100);
        } else {
            this.mapReady = false;
            this.mapInitialized = false;
            if (this.map) {
                this.map.remove();
                this.map = undefined;
            }
            this.clearMapLayers();
            this.routeDistances = [];
        }
    }

    public onDateChange(): void {
        // ต้องเลือกทั้งพนักงานและวันที่ก่อนจึงแสดงแผนที่
        if (this.filterSalesName && this.filterActivityDate) {
            this.mapReady = true;
            this.cdr.detectChanges();
            setTimeout(() => this.loadMapData(), 100);
        } else {
            this.mapReady = false;
            this.mapInitialized = false;
            if (this.map) {
                this.map.remove();
                this.map = undefined;
            }
            this.clearMapLayers();
            this.routeDistances = [];
        }
    }

    public clearFilters(): void {
        this.filterActivityDate = '';
        this.filterSalesName = '';
        this.mapReady = false;
        this.mapInitialized = false;
        if (this.map) {
            this.map.remove();
            this.map = undefined;
        }
        this.routeDistances = [];
    }

    private clearMapLayers(): void {
        if (!this.map) return;
        this.map.eachLayer((layer: any) => {
            if (layer !== this.tileLayer) {
                this.map?.removeLayer(layer);
            }
        });

        // Remove routing controls specifically since they might attach outside the standard layer system
        const routingContainers = document.querySelectorAll('.leaflet-routing-container');
        routingContainers.forEach(container => container.remove());
    }

    private loadMapData(): void {
        this.loadingService.show();
        this.clearMapLayers();
        this.routeDistances = [];
        this.distanceAccumulator.clear(); // ล้างตัวสะสมทุกครั้ง

        const filters = {
            startDate: this.filterActivityDate,
            endDate: this.filterActivityDate,
            salesName: this.filterSalesName
        };

        forkJoin({
            activities: this.dcsm28Service.search(0, 500, filters).pipe(catchError(() => of({ content: [] }))),
            dailyRoutes: this.dcsm28Service.getDailyRoutes(filters).pipe(catchError(() => of([])))
        }).subscribe({
            next: (response: any) => {
                this.loadingService.hide();
                const activities = response.activities.content || [];
                const dailyRoutes = response.dailyRoutes || [];
                let bounds = L.latLngBounds([]);

                if (activities.length === 0 && dailyRoutes.length === 0) {
                    this.sweetAlert.warning('ไม่พบข้อมูล', 'ไม่มีข้อมูลในช่วงเวลานี้');
                    return;
                }

                const routesMap = new Map<number, any>();

                // 1. นำเอาเส้นทางประจำวันมาตั้งต้น
                dailyRoutes.forEach((dr: any) => {
                    // หา salesName จาก employeeId 
                    const salesUser = this.salesUsers.find(u => u.id === dr.employeeId);
                    routesMap.set(dr.id, {
                        dailyRoute: dr,
                        salesName: salesUser ? salesUser.username : 'ไม่ระบุ',
                        activities: []
                    });
                });
                activities.forEach((activity: any) => {
                    if (!activity.checkInLat || !activity.checkInLng) return; // ไม่มีพิกัด ข้ามไป

                    const drId = activity.dailyRoute?.id;

                    if (drId && routesMap.has(drId)) {
                        // กรณีปกติ: มี dailyRoute ที่ตรงกันใน routesMap
                        routesMap.get(drId).activities.push(activity);
                    } else if (drId && !routesMap.has(drId)) {
                        // มี dailyRoute reference แต่ไม่ได้โหลดมา — สร้าง entry ใหม่
                        routesMap.set(drId, {
                            dailyRoute: activity.dailyRoute,
                            salesName: activity.salesName || 'ไม่ระบุ',
                            activities: [activity]
                        });
                    } else {
                        // ไม่มี dailyRoute — ลอง merge เข้า routesMap ของ salesName เดียวกัน
                        const salesName = activity.salesName || '';
                        let matched = false;
                        routesMap.forEach((routeData) => {
                            if (!matched && (routeData.salesName === salesName || routeData.salesName === 'ไม่ระบุ')) {
                                routeData.activities.push(activity);
                                matched = true;
                            }
                        });
                        if (!matched) {
                            // ไม่มี routesMap เลย: สร้าง standalone entry ด้วย check-in เป็น waypoint เดียว
                            const fakeKey = `isolated_${salesName}_${Date.now()}_${Math.random()}`;
                            routesMap.set(fakeKey as any, {
                                dailyRoute: { startLat: null, startLng: null, endLat: null, endLng: null, startTime: null, endTime: null },
                                salesName: salesName || 'ไม่ระบุ',
                                activities: [activity]
                            });
                        }
                    }
                });

                // Loop เพื่อวาดเส้นและจุดของแต่ละรอบทำงาน
                routesMap.forEach((routeData, drId) => {
                    const dr = routeData.dailyRoute;
                    const latlngs: L.LatLng[] = [];
                    let totalDistanceMeters = 0;
                    let startMarker: L.CircleMarker | null = null;

                    // 1. หมุดจุดเริ่มงาน
                    if (dr.startLat && dr.startLng) {
                        const startPoint = L.latLng(parseFloat(dr.startLat), parseFloat(dr.startLng));
                        latlngs.push(startPoint);
                        bounds.extend(startPoint);

                        startMarker = L.circleMarker(startPoint, { color: 'green', fillColor: '#28a745', fillOpacity: 0.8, radius: 8 });
                        startMarker.bindPopup(`<b>📍 จุดเริ่มงาน</b><br>พนักงาน: ${routeData.salesName}<br>เวลา: ${dr.startTime ? new Date(dr.startTime).toLocaleString('th-TH') : 'ไม่ระบุ'}`);
                        if (this.map) startMarker.addTo(this.map);
                    }

                    // 2. หมุดเช็คอินทำงาน (เรียงตามเวลาก่อน-หลัง)
                    routeData.activities.sort((a: any, b: any) => {
                        const timeA = a.checkInTime ? new Date(a.checkInTime).getTime() : 0;
                        const timeB = b.checkInTime ? new Date(b.checkInTime).getTime() : 0;
                        return timeA - timeB;
                    });

                    routeData.activities.forEach((act: any, index: number) => {
                        const cp = L.latLng(parseFloat(act.checkInLat), parseFloat(act.checkInLng));
                        latlngs.push(cp);
                        bounds.extend(cp);

                        // หมุดพร้อมหมายเลขลำดับที่ไป
                        const numberIcon = L.divIcon({
                            className: '',
                            html: `<div style="
                                background:#007bff;
                                color:#fff;
                                border-radius:50%;
                                width:28px;
                                height:28px;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                font-weight:bold;
                                font-size:13px;
                                border:2px solid #fff;
                                box-shadow:0 2px 4px rgba(0,0,0,0.4);
                            ">${index + 1}</div>`,
                            iconSize: [28, 28],
                            iconAnchor: [14, 14]
                        });
                        const marker = L.marker(cp, { icon: numberIcon });
                        const checkInTimeStr = act.checkInTime ? new Date(act.checkInTime).toLocaleString('th-TH') : 'ไม่ระบุ';
                        marker.bindPopup(`
              <div style="font-family: 'Kanit', sans-serif;">
                <h6 style="margin-bottom: 5px; font-weight: bold; color: #007bff;">จุดที่ ${index + 1}: ${act.customerName || 'ไม่ระบุชื่อลูกค้า'}</h6>
                <div><b>พนักงาน:</b> ${act.salesName || 'ไม่ระบุ'}</div>
                <div><b>เช็คอินเมื่อ:</b> ${checkInTimeStr}</div>
                <div><b>ช่องทาง:</b> ${act.contactChannel || '-'}</div>
              </div>
            `);
                        if (this.map) marker.addTo(this.map);
                    });

                    // 3. หมุดจุดเลิกงาน
                    if (dr.endLat && dr.endLng) {
                        const endPoint = L.latLng(parseFloat(dr.endLat), parseFloat(dr.endLng));
                        latlngs.push(endPoint);
                        bounds.extend(endPoint);

                        const endMarker = L.circleMarker(endPoint, { color: 'red', fillColor: '#dc3545', fillOpacity: 0.8, radius: 8 });
                        endMarker.bindPopup(`<b>📍 จุดเลิกงาน</b><br>พนักงาน: ${routeData.salesName}<br>เวลา: ${dr.endTime ? new Date(dr.endTime).toLocaleString('th-TH') : 'ไม่ระบุ'}`);
                        if (this.map) endMarker.addTo(this.map);
                    }

                    // 4. วาดเส้นทางจริงตามถนน โดยเรียก OSRM โดยตรง (เร็วกว่า LRM control มาก)
                    // เรียงลำดับ: เริ่มต้น → เช็คอิน(ตามเวลา) → สิ้นสุด
                    if (latlngs.length > 1) {
                        this.drawRouteViaOSRM(latlngs, routeData.salesName, startMarker, dr);
                    }
                });

                // ปรับมุมมองแผนที่ให้ครอบคลุมทุกหมุด
                if (bounds.isValid() && this.map) {
                    this.map.fitBounds(bounds, { padding: [50, 50] });
                }
            },
            error: (err) => {
                console.error('Error loading map data:', err);
                this.loadingService.hide();
                this.sweetAlert.error('Error', 'ไม่สามารถโหลดข้อมูลแผนที่ได้');
            }
        });
    }

    /**
     * วาดเส้นทางตามถนน โดยเรียก OSRM โดยตรง (ไม่ผ่าน Leaflet Routing Machine)
     * เร็วกว่ามากเพราะตัด overhead ของ LRM control ออกทั้งหมด
     */
    private drawRouteViaOSRM(
        latlngs: L.LatLng[],
        salesName: string,
        startMarker: L.CircleMarker | null,
        dr: any
    ): void {
        const coords = latlngs.map(ll => `${ll.lng},${ll.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`OSRM error ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!data.routes || !data.routes[0]) throw new Error('No route');
                const r = data.routes[0];
                const routeLatLngs: L.LatLng[] = r.geometry.coordinates.map(
                    (c: number[]) => L.latLng(c[1], c[0])
                );

                // วาด polyline ทันทีที่ได้ข้อมูล
                if (this.map) {
                    L.polyline(routeLatLngs, {
                        color: '#007bff',
                        opacity: 0.8,
                        weight: 5
                    }).addTo(this.map);
                }

                const totalKm = r.distance / 1000;
                if (startMarker && dr.startLat && dr.startLng) {
                    startMarker.bindPopup(`<b>📍 จุดเริ่มงาน</b><br>พนักงาน: ${salesName}<br><b>ระยะทางเดินรถจริง:</b> ${totalKm.toFixed(2)} กม.<br>เวลาเริ่ม: ${dr.startTime ? new Date(dr.startTime).toLocaleString('th-TH') : 'ไม่ระบุ'}`);
                }
                // สะสมระยะทางตามชื่อพนักงาน (รวมแต่ละ session เข้าด้วยกัน)
                const prev = this.distanceAccumulator.get(salesName) ?? 0;
                this.distanceAccumulator.set(salesName, prev + totalKm);

                // อัปเดต routeDistances ให้แสดรวมสรุปเสมอ (overwrite ใหม่)
                this.routeDistances = Array.from(this.distanceAccumulator.entries()).map(([name, km]) => ({
                    salesName: name,
                    distanceKm: km.toFixed(2)
                }));
                this.cdr.detectChanges();
            })
            .catch(err => {
                console.warn('OSRM failed, skipping route line:', err);
            });
    }

    // เผื่อมีรายการเก่าๆ ที่ไม่ได้พ่วง DailyRoute
    private plotIsolatedActivity(activity: any, bounds: L.LatLngBounds): void {
        const cp = L.latLng(parseFloat(activity.checkInLat), parseFloat(activity.checkInLng));
        bounds.extend(cp);
        const marker = L.marker(cp);
        const checkInTimeStr = activity.checkInTime ? new Date(activity.checkInTime).toLocaleString('th-TH') : 'ไม่ระบุ';
        marker.bindPopup(`
      <div style="font-family: 'Kanit', sans-serif;">
        <h6 style="margin-bottom: 5px; font-weight: bold; color: #6c757d;">(ข้อมูลตกหล่น) ${activity.customerName || 'ไม่ระบุชื่อลูกค้า'}</h6>
        <div><b>พนักงาน:</b> ${activity.salesName || 'ไม่ระบุ'}</div>
        <div><b>เช็คอินเมื่อ:</b> ${checkInTimeStr}</div>
      </div>
    `);
        if (this.map) marker.addTo(this.map);
    }

    goBack(): void {
        this.router.navigate(['/Dcsm28']);
    }
}
