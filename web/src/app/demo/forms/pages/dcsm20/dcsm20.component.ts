import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Dcsm20Service } from './dcsm20.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-dcsm20',
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
  templateUrl: './dcsm20.component.html',
  styleUrls: ['./dcsm20.component.scss']
})
export class Dcsm20Component implements OnInit {

  // Filter properties
  filterId: string = '';
  filterJobId: string = '';
  filterCustomerName: string = '';
  filterPrintStatus: string = '';
  filterDeliveryStatus: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';

  // Table properties
  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'jobId', label: 'JOB ID' },
    { key: 'printingDate', label: 'วันที่ส่งพิมพ์', styleFunction: this.getColumnStyle.bind(this), headerStyle: 'background: #dc3545; color: white;' },
    { key: 'printingResponsible', label: 'พิมพ์ที่', styleFunction: this.getColumnStyle.bind(this), headerStyle: 'background: #dc3545; color: white;' },
    { key: 'coatingDate', label: 'วันที่ส่งเคลือบ', styleFunction: this.getColumnStyle.bind(this), headerStyle: 'background: #ffc107; color: black;' },
    { key: 'coatingResponsible', label: 'เคลือบที่', styleFunction: this.getColumnStyle.bind(this), headerStyle: 'background: #ffc107; color: black;' },
    { key: 'stampingDate', label: 'วันที่ส่งปั้ม', styleFunction: this.getColumnStyle.bind(this), headerStyle: 'background: #007bff; color: white;' },
    { key: 'stampingResponsible', label: 'ปั้มที่', styleFunction: this.getColumnStyle.bind(this), headerStyle: 'background: #007bff; color: white;' },
    { key: 'gluingDate', label: 'วันที่ส่งปะ', styleFunction: this.getColumnStyle.bind(this), headerStyle: 'background: #17a2b8; color: white;' },
    { key: 'gluingResponsible', label: 'ปะที่', styleFunction: this.getColumnStyle.bind(this), headerStyle: 'background: #17a2b8; color: white;' },
    { key: 'qcDate', label: 'วันที่ส่งQC', styleFunction: this.getColumnStyle.bind(this), headerStyle: 'background: #670097ff; color: white;' },
    { key: 'dueDate', label: 'วันที่ส่งลูกค้า' },
    { key: 'printStatus', label: 'สถานะงาน', styleFunction: this.getStatusColumnStyle.bind(this) },
    { key: 'deliveryStatus', label: 'สถานะจัดส่ง', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dcsm20Service: Dcsm20Service,
    private statusColorService: StatusColorService,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();

    const filters = {
      id: this.filterId,
      jobId: this.filterJobId,
      customerName: this.filterCustomerName,
      printStatus: this.filterPrintStatus,
      deliveryStatus: this.filterDeliveryStatus,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate
    };

    this.dcsm20Service.getOrdersWithSearch(this.pageIndex, this.pageSize, filters)
      .subscribe({
        next: (response: any) => {
          this.tableData = response.content.map((item: any) => ({
            ...item,
            date: this.formatDate(item.date),
            printingDate: this.formatDate(item.printingDate),
            coatingDate: this.formatDate(item.coatingDate),
            stampingDate: this.formatDate(item.stampingDate),
            gluingDate: this.formatDate(item.gluingDate),
            qcDate: this.formatDate(item.qcDate),
            dueDate: this.formatDate(item.dueDate)
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

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearchChange() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['/Dcsm20Detail', row.id]);
    }
  }

  add() {
    this.router.navigate(['/Dcsm20Detail']);
  }

  clearAllFilters() {
    this.filterId = '';
    this.filterJobId = '';
    this.filterCustomerName = '';
    this.filterPrintStatus = '';
    this.filterDeliveryStatus = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.onSearchChange();
  }

  getStatusColumnStyle(columnKey: string, rowData: any): any {
    if (columnKey === 'printStatus') {
      const status = rowData.printStatus;

      // หาขั้นตอนสุดท้ายของงานนี้
      const isLastStep = this.isLastStepForJob(rowData, status);

      if (isLastStep) {
        return {
          'background-color': '#6c757d',
          'color': '#ffffff'
        };
      }

      const statusColor = this.statusColorService.getStatusColor(rowData.printStatus);
      return {
        'background-color': statusColor,
        'color': '#ffffffff'
      };
    }
    return {};
  }

  isLastStepForJob(rowData: any, currentStatus: string): boolean {
    const steps = [
      { status: 'พิมพ์แล้ว', hasData: rowData.printingDate || rowData.printingResponsible },
      { status: 'เคลือบแล้ว', hasData: rowData.coatingDate || rowData.coatingResponsible },
      { status: 'ปั้มแล้ว', hasData: rowData.stampingDate || rowData.stampingResponsible },
      { status: 'ปะแล้ว', hasData: rowData.gluingDate || rowData.gluingResponsible },
      { status: 'Qcแล้ว', hasData: rowData.qcDate }
    ];

    let lastStepWithData = null;
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].hasData) {
        lastStepWithData = steps[i].status;
        break;
      }
    }

    return currentStatus === lastStepWithData;
  }

  getColumnStyle(columnKey: string, rowData: any): any {
    const status = rowData.printStatus;

    const columnOrder = [
      'printingDate', 'printingResponsible',
      'coatingDate', 'coatingResponsible',
      'stampingDate', 'stampingResponsible',
      'gluingDate', 'gluingResponsible',
      'qcDate'
    ];

    const currentIndex = columnOrder.indexOf(columnKey);
    if (currentIndex === -1) return {};

    let highlightUntil = -1;

    if (status === 'กำลังเคลือบ') highlightUntil = 1;
    else if (status === 'กำลังปั้ม') highlightUntil = 3;
    else if (status === 'กำลังปะ') highlightUntil = 5;
    else if (status === 'เริ่มQc') highlightUntil = 7;
    else if (status === 'กำลังQc') highlightUntil = 7;
    else if (status === 'เสร็จสิ้น') highlightUntil = 8;

    // ถ้าเป็นคอลัมน์ที่ถูกปิดดำแล้ว
    if (currentIndex <= highlightUntil) {
      return { 'background-color': '#222222ff', 'color': '#777777ff' };
    }

    // ตรวจสอบวันที่สำหรับคอลัมน์วันที่แต่ละขั้นตอน
    const dateColumns = ['printingDate', 'coatingDate', 'stampingDate', 'gluingDate', 'qcDate'];
    if (dateColumns.includes(columnKey)) {
      const columnDate = rowData[columnKey];
      if (columnDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // แปลงวันที่จาก DD/MM/YYYY เป็น Date object
        const dateParts = columnDate.split('/');
        if (dateParts.length === 3) {
          const targetDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
          targetDate.setHours(0, 0, 0, 0);

          // ถ้าต้องส่งวันนี้ ให้เป็นสีแดง
          if (targetDate.getTime() === today.getTime()) {
            return { 'background-color': '#dc3545', 'color': '#ffffff' };
          }

          // ถ้าต้องส่งพรุ่งนี้ ให้เป็นสีเหลือง
          if (targetDate.getTime() === tomorrow.getTime()) {
            return { 'background-color': '#ffc107', 'color': '#000000' };
          }
        }
      }
    }

    return {};
  }
}