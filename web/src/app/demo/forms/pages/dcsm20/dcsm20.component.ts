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
    { key: 'date', label: 'วันที่' },
    { key: 'jobId', label: 'JOB ID' },
    { key: 'printingDate', label: 'วันที่ส่งพิมพ์' },
    { key: 'printingResponsible', label: 'พิมพ์ที่' },
    { key: 'coatingDate', label: 'วันที่ส่งเคลือบ' },
    { key: 'coatingResponsible', label: 'เคลือบที่' },
    { key: 'stampingDate', label: 'วันที่ส่งปั้ม'},
    { key: 'stampingResponsible', label: 'ปั้มที่' },
    { key: 'gluingDate', label: 'วันที่ส่งปะ' },
    { key: 'gluingResponsible', label: 'ปะที่' },
    { key: 'qcDate', label: 'วันที่ส่งQC' },
    { key: 'dueDate', label: 'วันที่ส่งลูกค้า' },
    { key: 'printStatus', label: 'สถานะ', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService)  },
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
      startDate: this.filterStartDate,
      endDate: this.filterEndDate
    };

    this.dcsm20Service.getOrdersWithSearch(this.pageIndex, this.pageSize, filters)
      .subscribe({
        next: (response: any) => {
          this.tableData = response.content.map((item: any) => ({
            ...item,
            date: this.formatDate(item.date),
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
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.onSearchChange();
  }
}