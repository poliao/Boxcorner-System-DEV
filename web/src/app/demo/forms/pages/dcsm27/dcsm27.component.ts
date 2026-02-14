import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm27Service } from './dcsm27.service';
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
  selector: 'app-dcsm27.component',
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
  templateUrl: './dcsm27.component.html',
  styleUrl: './dcsm27.component.scss'
})
export class Dcsm27Component implements OnInit {

  filterId: string = null;
  filterJobId: string = null;
  filterCustomerName: string = null;
  filterPrinterName: string = null;
  filterIssample: string = null;
  filterPrintStatus: string = null;
  filterStartDate: string = null;
  filterEndDate: string = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private dcsm27Service: Dcsm27Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private statusColorService: StatusColorService,) { }

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'jobId', label: 'JOB ID' },
    { key: 'customerJobName', label: 'ชื่อลูกค้า/ชื่องาน' },
    { key: 'deliveryDate', label: 'วันที่ส่งพิมพ์', },
    { key: 'printerName', label: 'พิมพ์ที่', },
    { key: 'issample', label: 'เป็นตัวอย่าง' },
    { key: 'jobStatus', label: 'สถานะงาน', styleFunction: this.getStatusColumnStyle.bind(this) },
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
      id: this.filterId,
      jobId: this.filterJobId,
      customerJobName: this.filterCustomerName,
      printerName: this.filterPrinterName,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate,
      issample: this.filterIssample,
      jobStatus: this.filterPrintStatus
    };

    this.dcsm27Service.getOrdersWithSearch(this.pageIndex, this.pageSize, filters)
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
            dueDate: this.formatDate(item.dueDate),
            issample: item.issample ? 'เป็น' : 'ไม่เป็น'
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
    if (columnKey === 'printStatus') {
      const statusColor = this.statusColorService.getStatusColor(rowData.printStatus);
      return {
        'background-color': statusColor,
        'color': '#ffffffff'
      };
    }
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
    if (row && row.id) {
      this.router.navigate(['/Dcsm27Detail', row.id]);
    }
  }

  clearAllFilters() {
    this.filterId = '';
    this.filterJobId = '';
    this.filterCustomerName = '';
    this.filterPrinterName = '';
    this.filterIssample = '';
    this.filterPrintStatus = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.onSearchChange();
  }

  createOD() {
    this.router.navigate(['/Dcsm27Detail']);
  }
}