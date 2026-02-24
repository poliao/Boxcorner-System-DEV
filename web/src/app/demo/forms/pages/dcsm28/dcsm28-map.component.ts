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

        this.dcsm28Service.search(0, 500, filters).subscribe({
            next: (response: any) => {
                this.loadingService.hide();
                const activities = response.content;
                let bounds = L.latLngBounds([]);

                if (!activities || activities.length === 0) {
                    this.sweetAlert.warning('ไม่พบข้อมูล', 'ไม่มีข้อมูลกิจกรรมในช่วงเวลานี้');
                    return;
                }

                const routesMap = new Map<number, any>();

                // จัดกลุ่มตาม dailyRoute (แต่ละ 1 วันการทำงานต่อเซล)
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

                    routeData.activities.forEach((act: any) => {
                        const cp = L.latLng(parseFloat(act.checkInLat), parseFloat(act.checkInLng));
                        latlngs.push(cp);
                        bounds.extend(cp);

                        const marker = L.marker(cp);
                        const checkInTimeStr = act.checkInTime ? new Date(act.checkInTime).toLocaleString('th-TH') : 'ไม่ระบุ';
                        marker.bindPopup(`
              <div style="font-family: 'Kanit', sans-serif;">
                <h6 style="margin-bottom: 5px; font-weight: bold; color: #007bff;">${act.customerName || 'ไม่ระบุชื่อลูกค้า'}</h6>
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
