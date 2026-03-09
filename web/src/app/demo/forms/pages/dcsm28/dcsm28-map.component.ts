import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
 * Custom Router for Generoute.io integration with Leaflet Routing Machine
 */
const GenerouteRouter = L.Class.extend({
    options: {
        apiKey: 'IO1r4sqgGUaSPrrhHSmP0oiV4h1E7wfQ81LUytRd4U3mVD8x',
        serviceUrl: 'https://api.generoute.io/v1/trip'
    },

    initialize: function (apiKey: string, options: any) {
        this.options.apiKey = apiKey || this.options.apiKey;
        L.Util.setOptions(this, options);
    },

    route: function (waypoints: any[], callback: (err: any, routes: any[]) => void, context: any) {
        const locations = waypoints.filter(wp => wp.latLng).map((wp, idx) => ({
            coordinates: [wp.latLng.lng, wp.latLng.lat],
            title: `Waypoint ${idx + 1}`,
            data: { id: `wp_${idx}` }
        }));

        if (locations.length < 2) {
            callback({ message: 'At least two waypoints are required' }, []);
            return;
        }

        const body = {
            region: "TH", // Default to TH for this project
            locations: locations
        };

        fetch(this.options.serviceUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.options.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(async res => {
                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Generoute API error (${res.status}): ${errText || res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Generoute API Response:', data);
                // Generoute returns geometry in trip[0].geometry (GeoJSON)
                // We need to parse it into an array of L.LatLng
                if (!data.trips || !data.trips[0]) {
                    throw new Error('No route found in Generoute response');
                }

                const trip = data.trips[0];
                const coordinates = trip.geometry.coordinates; // [lng, lat]
                const latLngs = coordinates.map((c: any) => L.latLng(c[1], c[0]));

                // Calculate distance manually based on road path if API doesn't provide it
                let calculatedDistance = 0;
                for (let i = 0; i < latLngs.length - 1; i++) {
                    calculatedDistance += latLngs[i].distanceTo(latLngs[i + 1]);
                }

                const route = {
                    name: 'Generoute Route',
                    summary: {
                        totalDistance: trip.distance || calculatedDistance,
                        totalTime: trip.duration || 0
                    },
                    coordinates: latLngs,
                    waypoints: waypoints,
                    inputWaypoints: waypoints,
                    instructions: [] // Generoute trip endpoint might not provide verbal instructions by default
                };

                callback.call(context, null, [route]);
            })
            .catch(err => {
                console.error('Generoute Router Error:', err);
                callback.call(context, err, []);
            });

        return this;
    }
});

(L as any).Routing.generoute = function (apiKey: string, options?: any) {
    return new (GenerouteRouter as any)(apiKey, options);
};

@Component({
    selector: 'app-dcsm28-map',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
    templateUrl: './dcsm28-map.component.html',
    styleUrls: ['./dcsm28.component.scss']
})
export class Dcsm28MapComponent implements OnInit, OnDestroy {
    private map: L.Map | undefined;
    private tileLayer: L.TileLayer | undefined;

    public routeDistances: { salesName: string, distanceKm: string }[] = [];
    public isAdmin: boolean = false;
    public salesUsers: any[] = [];

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
        this.initMap();
        this.loadMapData();
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
        this.loadMapData();
    }

    public clearFilters(): void {
        this.filterActivityDate = '';
        this.filterSalesName = '';
        this.loadMapData();
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
                    if (activity.dailyRoute) {
                        const drId = activity.dailyRoute.id;
                        if (!routesMap.has(drId)) {
                            routesMap.set(drId, {
                                dailyRoute: activity.dailyRoute,
                                salesName: activity.salesName || 'ไม่ระบุ',
                                activities: []
                            });
                        }
                        if (activity.checkInLat && activity.checkInLng) {
                            routesMap.get(drId).activities.push(activity);
                        }
                    } else if (activity.checkInLat && activity.checkInLng) {
                        // กรณีเก่าๆที่ไม่มี dailyRoute แต่มีพิกัด
                        this.plotIsolatedActivity(activity, bounds);
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

                    // 2. หมุดเช็คอินทำงาน (เรียงตามเวลา)
                    routeData.activities.sort((a: any, b: any) => {
                        const timeA = a.checkInTime ? new Date(a.checkInTime).getTime() : 0;
                        const timeB = b.checkInTime ? new Date(b.checkInTime).getTime() : 0;
                        return timeA - timeB;
                    });

                    routeData.activities.forEach((act: any, index: number) => {
                        const cp = L.latLng(parseFloat(act.checkInLat), parseFloat(act.checkInLng));
                        latlngs.push(cp);
                        bounds.extend(cp);

                        const marker = L.marker(cp);
                        const checkInTimeStr = act.checkInTime ? new Date(act.checkInTime).toLocaleString('th-TH') : 'ไม่ระบุ';
                        marker.bindPopup(`
              <div style="font-family: 'Kanit', sans-serif;">
                <h6 style="margin-bottom: 5px; font-weight: bold; color: #007bff;">${index + 1}. ${act.customerName || 'ไม่ระบุชื่อลูกค้า'}</h6>
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

                    // 4. วาดเส้นทางจริงตามถนนและคำนวณระยะทาง
                    if (latlngs.length > 1) {
                        const routingControl = (L as any).Routing.control({
                            router: (L as any).Routing.generoute('IO1r4sqgGUaSPrrhHSmP0oiV4h1E7wfQ81LUytRd4U3mVD8x'),
                            waypoints: latlngs,
                            routeWhileDragging: false,
                            addWaypoints: false,
                            show: false, // ซ่อน panel บอกทาง
                            createMarker: () => null, // ไม่ต้องสร้างหมุดซ้ำ
                            lineOptions: {
                                styles: [{ color: '#007bff', opacity: 0.7, weight: 5 }]
                            },
                            fitSelectedRoutes: false
                        });

                        if (this.map) {
                            routingControl.addTo(this.map);
                        }

                        routingControl.on('routesfound', (e: any) => {
                            const routes = e.routes;
                            if (routes && routes.length > 0) {
                                const summary = routes[0].summary;
                                const totalKm = (summary.totalDistance / 1000).toFixed(2);

                                // อัปเดต Popup ของจุดเริ่มงานให้มีระยะทางบอกด้วย
                                if (startMarker && dr.startLat && dr.startLng) {
                                    startMarker.bindPopup(`<b>📍 จุดเริ่มงาน</b><br>พนักงาน: ${routeData.salesName}<br><b>ระยะทางเดินรถจริง:</b> ${totalKm} กม.<br>เวลาเริ่ม: ${dr.startTime ? new Date(dr.startTime).toLocaleString('th-TH') : 'ไม่ระบุ'}`);
                                }

                                // นำระยะทางไปแสดงใน Card ข้างนอกแผนที่
                                this.routeDistances.push({
                                    salesName: routeData.salesName,
                                    distanceKm: totalKm
                                });
                                this.cdr.detectChanges(); // บังคับให้ Angular อัปเดตหน้าจอ
                            }
                        });

                        // FALLBACK: ถ้า Routing พัง (เช่น API Key ผิดหรือ Timeout) ให้วาดเส้นตรงแทน
                        routingControl.on('routingerror', (err: any) => {
                            console.warn('Mapbox Routing error, falling back to straight lines:', err);

                            // วาดเส้นตรง (Polyline)
                            const fallbackLine = L.polyline(latlngs, {
                                color: '#6c757d', // สีเทาสำหรับ fallback
                                weight: 4,
                                dashArray: '5, 10',
                                opacity: 0.6
                            });

                            if (this.map) {
                                fallbackLine.addTo(this.map);
                            }

                            // คำนวณระยะทางแบบเส้นตรงคร่าวๆ (Haversine)
                            let fallbackDistM = 0;
                            for (let i = 0; i < latlngs.length - 1; i++) {
                                fallbackDistM += latlngs[i].distanceTo(latlngs[i + 1]);
                            }
                            const totalKm = (fallbackDistM / 1000).toFixed(2);

                            if (startMarker && dr.startLat && dr.startLng) {
                                startMarker.bindPopup(`<b>📍 จุดเริ่มงาน</b><br>พนักงาน: ${routeData.salesName}<br><b>ระยะทาง (เส้นตรง):</b> ${totalKm} กม.<br><small style="color:red;">*ไม่สามารถดึงข้อมูลเส้นทางถนนได้</small>`);
                            }

                            this.routeDistances.push({
                                salesName: routeData.salesName,
                                distanceKm: totalKm + ' (ตรง)'
                            });
                            this.cdr.detectChanges();
                        });
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
