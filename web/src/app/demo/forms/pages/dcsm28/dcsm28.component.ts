import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm28Service } from './dcsm28.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { delay, Subject } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm28.component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    DataTableComponent,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule
  ],
  templateUrl: './dcsm28.component.html',
  styleUrl: './dcsm28.component.scss'
})
export class Dcsm28Component implements OnInit {

  filterActivityId: string = '';
  filterSalesName: string = '';
  filterCustomerName: string = '';
  filterContactPerson: string = '';
  filterIsNewCustomer: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';
  filterActivityStartDate: string = '';
  filterActivityEndDate: string = '';

  // Role check
  isAdmin: boolean = false;

  salesUsers: any[] = [];

  // Fuel refill modal
  showFuelModal: boolean = false;
  fuelPrice: number = null;
  fuelOdometer: number = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private dcsm28Service: Dcsm28Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private authService: AuthService,
    private statusColorService: StatusColorService,) { }

  tableColumns = [
    { key: 'activityId', label: 'ลำดับ' },
    { key: 'activityDate', label: 'วันที่' },
    { key: 'salesName', label: 'พนักงานขาย' },
    { key: 'companyName', label: 'ชื่อบริษัท' },
    { key: 'contactPerson', label: 'ผู้ติดต่อ' },
    { key: 'contactChannel', label: 'ช่องทางติดต่อ' },
    { key: 'isNewCustomer', label: 'ลูกค้าใหม่' },
  ];

  tableData: any[] = [];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit() {
    const userRole = this.authService.getUserFromToken().role;
    this.isAdmin = userRole === 'salesAdmin' || userRole === 'SupperAdmin';
    this.loadSalesUsers();
    this.loadData();
  }

  loadSalesUsers() {
    this.dcsm28Service.getSalesUsers().subscribe({
      next: (res) => {
        this.salesUsers = res;
      },
      error: (err) => console.error('Error loading sales users:', err)
    });
  }

  loadData() {
    this.loadingService.show();
    const filters = {
      activityId: this.filterActivityId,
      salesName: this.filterSalesName,
      customerName: this.filterCustomerName,
      contactPerson: this.filterContactPerson,
      isNewCustomer: this.filterIsNewCustomer,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate,
      activityStartDate: this.filterActivityStartDate,
      activityEndDate: this.filterActivityEndDate
    };

    this.dcsm28Service.search(this.pageIndex, this.pageSize, filters)
      .subscribe({
        next: (response: any) => {
          this.tableData = response.content.map((item: any) => ({
            ...item,
            activityDate: this.formatDate(item.activityDate),
            isNewCustomer: item.isNewCustomer ? 'ใช่' : 'ไม่ใช่'
          }));
          this.totalElements = response.totalElements;
          this.loadingService.hide();
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.loadingService.hide();
          this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
      });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getStatusColumnStyle(columnKey: string, rowData: any): any {
    return {};
  }

  onSearchChange() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onRowClick(row: any) {
    if (row && row.activityId) {
      this.router.navigate(['/Dcsm28Detail', row.activityId]);
    }
  }

  clearAllFilters() {
    this.filterActivityId = '';
    this.filterSalesName = '';
    this.filterCustomerName = '';
    this.filterContactPerson = '';
    this.filterIsNewCustomer = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.filterActivityStartDate = '';
    this.filterActivityEndDate = '';
    this.onSearchChange();
  }

  createOD() {
    this.router.navigate(['/Dcsm28Detail']);
  }

  startWork() {
    if (navigator.geolocation) {
      this.loadingService.show();

      // 🌟 สิ่งที่ต้องเพิ่ม: กำหนด Options เพื่อบังคับความแม่นยำ
      const options = {
        enableHighAccuracy: true, // บังคับใช้ชิป GPS ดาวเทียม (สำคัญที่สุด)
        timeout: 15000,           // ถ้าระบุตำแหน่งไม่ได้ภายใน 15 วินาที ให้ Throw Error (ป้องกันแอปค้าง)
        maximumAge: 0             // บังคับหาตำแหน่งใหม่สดๆ ห้ามเอาพิกัดเก่าใน Cache มาใช้
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data = {
            startLat: position.coords.latitude,
            startLng: position.coords.longitude
          };

          // ทดสอบ Log ดูความคลาดเคลื่อน (หน่วยเป็นเมตร) ยิ่งน้อยยิ่งแม่น
          console.log('ความคลาดเคลื่อน: ' + position.coords.accuracy + ' เมตร');

          this.dcsm28Service.startWork(data).subscribe({
            next: (response) => {
              this.loadingService.hide();
              this.sweetAlert.success('สำเร็จ', 'เริ่มงานสำเร็จ');
            },
            error: (err) => {
              this.loadingService.hide();
              this.sweetAlert.error('เกิดข้อผิดพลาด', err.error || 'ไม่สามารถเริ่มงานได้');
            }
          });
        },
        (error) => {
          this.loadingService.hide();

          // 🌟 เพิ่มการดักจับ Error ให้ละเอียดขึ้น เพื่อให้รู้ว่าพลาดตรงไหน
          let errMsg = 'ไม่สามารถเข้าถึงตำแหน่งได้';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errMsg = 'คุณไม่อนุญาตให้ระบบเข้าถึงตำแหน่ง GPS';
              break;
            case error.POSITION_UNAVAILABLE:
              errMsg = 'ไม่มีสัญญาณ GPS ลองขยับไปที่โล่งแจ้งครับ';
              break;
            case error.TIMEOUT:
              errMsg = 'หมดเวลารอสัญญาณ GPS กรุณาลองใหม่';
              break;
          }
          this.sweetAlert.error('เกิดข้อผิดพลาด', errMsg);
        },
        options // 🌟 ใส่ options เป็นพารามิเตอร์ตัวที่ 3 ตรงนี้ครับ!
      );
    } else {
      this.sweetAlert.error('เกิดข้อผิดพลาด', 'เบราว์เซอร์ไม่รองรับ Geolocation');
    }
  }

  endWork() {
    if (navigator.geolocation) {
      this.loadingService.show();
      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data = {
            endLat: position.coords.latitude,
            endLng: position.coords.longitude
          };
          this.dcsm28Service.endWork(data).subscribe({
            next: (response) => {
              this.loadingService.hide();
              this.sweetAlert.success('สำเร็จ', 'เลิกงานสำเร็จ');
            },
            error: (err) => {
              this.loadingService.hide();
              this.sweetAlert.error('เกิดข้อผิดพลาด', err.error || 'ไม่สามารถเลิกงานได้');
            }
          });
        },
        (error) => {
          this.loadingService.hide();
          let errMsg = 'ไม่สามารถเข้าถึงตำแหน่งได้';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errMsg = 'คุณไม่อนุญาตให้ระบบเข้าถึงตำแหน่ง GPS';
              break;
            case error.POSITION_UNAVAILABLE:
              errMsg = 'ไม่มีสัญญาณ GPS ลองขยับไปที่โล่งแจ้งครับ';
              break;
            case error.TIMEOUT:
              errMsg = 'หมดเวลารอสัญญาณ GPS กรุณาลองใหม่';
              break;
          }
          this.sweetAlert.error('เกิดข้อผิดพลาด', errMsg);
        },
        options
      );
    } else {
      this.sweetAlert.error('เกิดข้อผิดพลาด', 'เบราว์เซอร์ไม่รองรับ Geolocation');
    }
  }

  openFuelModal() {
    this.fuelPrice = null;
    this.fuelOdometer = null;
    this.showFuelModal = true;
  }

  closeFuelModal() {
    this.showFuelModal = false;
  }

  submitFuelRefill() {
    if (!this.fuelPrice || !this.fuelOdometer) {
      this.sweetAlert.error('ข้อมูลไม่ครบ', 'กรุณากรอกราคาและเลขไมค์');
      return;
    }
    this.loadingService.show();
    const data = {
      price: this.fuelPrice,
      odometer: this.fuelOdometer
    };
    this.dcsm28Service.refillFuel(data).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.closeFuelModal();
        this.sweetAlert.success('สำเร็จ', 'บันทึกการเติมน้ำมันสำเร็จ');
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('เกิดข้อผิดพลาด', err.error || 'ไม่สามารถบันทึกได้');
      }
    });
  }
}