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
  ],
  templateUrl: './dcsm28.component.html',
  styleUrl: './dcsm28.component.scss'
})
export class Dcsm28Component implements OnInit {

  filterActivityId: string = null;
  filterCustomerName: string = null;
  filterContactPerson: string = null;
  filterIsNewCustomer: string = null;
  filterStartDate: string = null;
  filterEndDate: string = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private dcsm28Service: Dcsm28Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private statusColorService: StatusColorService,) { }

  tableColumns = [
    { key: 'activityId', label: 'ลำดับ' },
    { key: 'activityDate', label: 'วันที่' },
    { key: 'customerName', label: 'ชื่อลูกค้า' },
    { key: 'contactPerson', label: 'ผู้ติดต่อ' },
    { key: 'contactChannel', label: 'ช่องทางติดต่อ' },
    { key: 'isNewCustomer', label: 'ลูกค้าใหม่' },
  ];

  tableData: any[] = [];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit() {
    this.loadData();

  }

  loadData() {
    this.loadingService.show();
    const filters = {
      activityId: this.filterActivityId,
      customerName: this.filterCustomerName,
      contactPerson: this.filterContactPerson,
      isNewCustomer: this.filterIsNewCustomer,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate
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
    this.filterCustomerName = '';
    this.filterContactPerson = '';
    this.filterIsNewCustomer = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.onSearchChange();
  }

  createOD() {
    this.router.navigate(['/Dcsm28Detail']);
  }
}