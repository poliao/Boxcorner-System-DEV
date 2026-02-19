import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { StatusColorService } from '../../../../shared/services/status-color.service';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm02Service } from './dcsm02.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-dcsm02.component',
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
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule, // เพิ่มเข้าในลิสต์
    MatNativeDateModule, // เพิ่มเข้าในลิสต์
  ],
  templateUrl: './dcsm02.component.html',
  styleUrl: './dcsm02.component.scss'
})
export class Dcsm02Component implements OnInit {
  process_status: string = '';
  assignee: string = '';

  startDate: Date | null = null;
  endDate: Date | null = null;
  checked: number = 0;

  private searchJobDetailsSubject = new Subject<string>();
  private searchOwnerListSubject = new Subject<string>();
  private searchAssigneeListSubject = new Subject<string>();
  private searchProcessListSubject = new Subject<string>();
  private searchConfirmListSubject = new Subject<string>();

  filterfolder: string = '';
  filterjobdetails: string = '';
  filterowner: string = '';
  filterassignee: string = '';
  filterprocess: string = '';
  filterconfirm: string = '';
  filterId: string = '';
  filterremarks: string = '';

  jobdetailsList: string[] = [];
  OwnerList: string[] = [];
  Assignee: string[] = [];
  Process: string[] = [];
  Confirm: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private dcsm02Service: Dcsm02Service, private router: Router, private statusColorService: StatusColorService) { }
  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'folderName', label: 'ชื่อโฟลเดอร์' },
    { key: 'jobOwner', label: 'เจ้าของงาน' },
    { key: 'assignee', label: 'ผู้รับผิดชอบ' },
    { key: 'deadlineDate', label: 'วันที่ต้องส่ง' },
    { key: 'processStatus', label: 'สถานะงาน', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService)},
    { key: 'confirmStatus', label: 'สถานะคอนเฟิร์ม', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService)},
  ];

  tableData: any[] = [];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  isSortMode: boolean = false;

  ngOnInit() {
    this.loadData();
    this.countBacklogCheck();
  }

  loadData() {
    const startDateStr = this.startDate ? this.formatDateForApi(this.startDate) : '';
    const endDateStr = this.endDate ? this.formatDateForApi(this.endDate) : '';

    this.dcsm02Service.getAllDesignOrders(
      this.filterId,
      this.filterfolder,
      this.filterjobdetails,
      this.filterowner,
      this.filterprocess,
      this.filterassignee,
      this.filterconfirm,
      startDateStr,
      endDateStr,
      this.pageIndex,
      this.pageSize,
    )
      .subscribe({
        next: (response: any) => {
          this.tableData = response.content.map((item: any) => ({
            ...item,
            orderDate: this.formatDate(item.orderDate),
            deadlineDate: this.formatDate(item.deadlineDate)
          }));
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error loading data:', err);
        }
      });
  }

  loadDataSort() {
    const startDateStr = this.startDate ? this.formatDateForApi(this.startDate) : '';
    const endDateStr = this.endDate ? this.formatDateForApi(this.endDate) : '';

    this.dcsm02Service.getAllDesignOrdersSort(
      this.filterId,
      this.filterfolder,
      this.filterjobdetails,
      this.filterowner,
      this.filterprocess,
      this.filterassignee,
      this.filterconfirm,
      startDateStr,
      endDateStr,
      this.pageIndex,
      this.pageSize,
    )
      .subscribe({
        next: (response: any) => {
          this.tableData = response.content.map((item: any) => ({
            ...item,
            orderDate: this.formatDate(item.orderDate),
            deadlineDate: this.formatDate(item.deadlineDate)
          }));
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error loading data:', err);
        }
      });
  }

  formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2); // เอาแค่ 2 หลักท้าย
    return `${day}/${month}/${year}`;
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isSortMode == true) {
      this.loadDataSort();
    } else {
      this.loadData();
    }
  }

  onSearchSort(): void {
    this.isSortMode = true;
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadDataSort();
  }

  onSearchChange() {
    this.isSortMode = false;
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['/Dcsm02Detail', row.id]);
    }
  }

  add() {
    this.router.navigate(['/Dcsm02Detail']);
  }

  onJobSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.searchJobDetailsSubject.next(value);
  }

  onOwnerSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.searchOwnerListSubject.next(value);
  }

  onAssigneeSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.searchAssigneeListSubject.next(value);
  }

  onProcessSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.searchProcessListSubject.next(value);
  }

  onConfirmSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.searchConfirmListSubject.next(value);
  }

  onStartDateChange() {
    if (this.startDate && (!this.endDate || this.endDate < this.startDate)) {
      this.endDate = this.startDate;
    }
    this.onSearchChange();
  }

  onEndDateChange() {
    this.onSearchChange();
  }
  clearStartDate() {
    this.startDate = null;
    this.endDate = null;
    this.onSearchChange();
  }

  clearEndDate() {
    this.endDate = null;
    this.onSearchChange();
  }

  clearAllFilters() {
    this.filterId = '';
    this.filterfolder = '';
    this.filterjobdetails = '';
    this.filterowner = '';
    this.filterassignee = '';
    this.filterprocess = '';
    this.filterconfirm = '';
    this.startDate = null;
    this.endDate = null;
    this.onSearchChange();
  }

  countBacklogCheck() {
    this.dcsm02Service.countBacklogCheck().subscribe({
      next: (data: number) => {
        this.checked = data;
      },
      error: (err) => { }
    });
  }

   onFilterCheck() {
    this.clearAll();
    this.filterconfirm = 'รอตรวจสอบ';
    this.filterfolder = '';
    setTimeout(() => {
      this.onSearchChange();
    }, 0);
  }

   clearAll() {
    this.filterId = '';
    this.filterfolder = '';
    this.filterjobdetails = '';
    this.filterowner = '';
    this.filterassignee = '';
    this.filterprocess = '';
    this.filterconfirm = '';
    this.startDate = null;
    this.endDate = null;
  }

}