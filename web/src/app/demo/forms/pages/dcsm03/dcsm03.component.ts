import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm03Service } from './dcsm03.service';
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
import { E } from '@angular/material/error-options.d-CGdTZUYk';

@Component({
  selector: 'app-dcsm03.component',
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
  templateUrl: './dcsm03.component.html',
  styleUrl: './dcsm03.component.scss'
})
export class Dcsm03Component implements OnInit {
  process_status: string = '';
  assignee: string = '';

  startDate: Date | null = null;
  endDate: Date | null = null;
  countBacklog: number = 0;
  countInProgress: number = 0;
  pending: number = 0;
  checked: number = 0;
  edited: number = 0;
  completed: number = 0;

  private searchJobDetailsSubject = new Subject<string>();
  private searchOwnerListSubject = new Subject<string>();
  private searchAssigneeListSubject = new Subject<string>();
  private searchProcessListSubject = new Subject<string>();
  private searchConfirmListSubject = new Subject<string>();

  filterId: string = '';
  filterjo: string = '';
  filterjobdetails: string = '';
  filterowner: string = '';
  filterassignee: string = '';
  filterprocess: string = '';
  filterconfirm: string = ''; // Filter for process
  filterRemarkStatus: string = '';

  jobdetailsList: string[] = [];
  OwnerList: string[] = [];
  Assignee: string[] = [];
  Process: string[] = [];
  Confirm: string[] = [];
  isSortMode: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private dcsm03Service: Dcsm03Service,
    private router: Router,
    private loadingService: LoadingService) { }

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'joId', label: 'รหัสงาน' },
    { key: 'folderName', label: 'ชื่อโฟลเดอร์' },
    { key: 'jobOwner', label: 'เจ้าของงาน' },
    { key: 'assignee', label: 'ผู้รับผิดชอบ' },
    { key: 'deadlineDate', label: 'วันที่ต้องส่ง' },
    { key: 'deadlineTime', label: 'ภายในเวลา' },
    { key: 'processStatus', label: 'สถานะงาน', colorFunction: this.getProcessStatusColor.bind(this) },
    { key: 'confirmStatus', label: 'สถานะคอนเฟิร์ม', colorFunction: this.getConfirmStatusColor.bind(this) },
  ];

  tableData: any[] = [];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  detailsAddedCount = 0;

  ngOnInit() {
    this.loadData();
    this.useBacklog();
  }

  loadData() {
    this.loadingService.show();

    const startDateStr = this.startDate ? this.formatDateForApi(this.startDate) : '';
    const endDateStr = this.endDate ? this.formatDateForApi(this.endDate) : '';

    this.dcsm03Service.getAllDesignOrders(
      this.filterId,
      this.filterjobdetails,
      this.filterowner,
      this.filterprocess,
      this.filterassignee,
      this.filterjo,
      this.filterconfirm,
      startDateStr,
      endDateStr,
      this.pageIndex,
      this.pageSize,
      this.filterRemarkStatus
    )
      .subscribe({
        next: (response: any) => {
          let content = response.content || [];

          this.tableData = content.map((item: any) => ({
            ...item,
            joId: item.qpId || item.joId,

            _sortDate: item.sendDate || item.deadlineDate,

            orderDate: this.formatDate(item.orderDate),
            deadlineDate: this.formatDate(item.deadlineDate),
            sendDate: this.formatDate(item.sendDate)
          }));

          this.totalElements = response.totalElements;
          this.loadingService.hide();
        },
        error: (err) => {
          this.loadingService.hide();
        }
      });
  }

  sortByClosestDate() {
    this.pageIndex = 0;
    this.isSortMode = true;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadDataSorted();
  }

  loadDataSorted() {
    this.loadingService.show();

    const startDateStr = this.startDate ? this.formatDateForApi(this.startDate) : '';
    const endDateStr = this.endDate ? this.formatDateForApi(this.endDate) : '';

    this.dcsm03Service.getAllDesignOrdersSorted(
      this.filterId,
      this.filterjobdetails,
      this.filterowner,
      this.filterprocess,
      this.filterassignee,
      this.filterjo,
      this.filterconfirm,
      startDateStr,
      endDateStr,
      this.pageIndex,
      this.pageSize,
      this.filterRemarkStatus
    )
      .subscribe({
        next: (response: any) => {
          let content = response.content || [];

          this.tableData = content.map((item: any) => ({
            ...item,
            joId: item.qpId || item.joId,
            _sortDate: item.sendDate || item.deadlineDate,
            orderDate: this.formatDate(item.orderDate),
            deadlineDate: this.formatDate(item.deadlineDate),
            sendDate: this.formatDate(item.sendDate)
          }));

          this.totalElements = response.totalElements;
          this.loadingService.hide();
        },
        error: (err) => {
          this.loadingService.hide();
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
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isSortMode) {
      this.loadDataSorted();
    } else {
      this.loadData();
    }
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
      this.router.navigate(['/Dcsm03Detail', row.id]);
    }
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

  getProcessStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'รอดำเนินการ': return '#ffa600ff';
      case 'กำลังดำเนินการ': return '#ffd900ff';
      case 'เสร็จสิ้น': return '#66bb6a';
      case 'รอผู้รับผิดชอบยืนยัน': return '#9e9e9e';
      case 'รอดำเนินการแก้ไข': return '#ef5350';
      default: return '#9e9e9e';
    }
  }

  getConfirmStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'ผ่าน': return '#66bb6a';
      case 'รอดำเนินการ': return '#ffa600ff';
      case 'กำลังดำเนินการ': return '#ffd900ff';
      case 'รอตรวจสอบ': return '#aee76c';
      case 'ไม่ผ่าน': return '#ef5350';
      case 'รอผู้รับผิดชอบยืนยัน': return '#9e9e9e';
      default: return '#9e9e9e';
    }
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
    this.filterjo = '';
    this.filterjobdetails = '';
    this.filterowner = '';
    this.filterassignee = '';
    this.filterprocess = '';
    this.filterconfirm = '';
    this.filterRemarkStatus = '';
    this.startDate = null;
    this.endDate = null;
    this.onSearchChange();
  }

  useBacklog() {
    this.Backlog();
    this.countBacklogInProgress();
    this.countBacklogPending();
    this.countBacklogCheck();
    this.countBacklogEdit();
    this.countBacklogComplete();
    this.countDetailsAdded();
  }

  Backlog() {
    this.dcsm03Service.countBacklog().subscribe({
      next: (data: number) => {
        this.countBacklog = data;
      },
      error: (err) => { }
    });
  }

  onFilterUnassigned() {
    this.clearAll();
    this.filterassignee = 'รอผู้รับผิดชอบยืนยัน';
    this.onSearchChange();
  }

  countBacklogInProgress() {
    this.dcsm03Service.countBacklogInProgress().subscribe({
      next: (data: number) => {
        this.countInProgress = data;
      },
      error: (err) => { }
    });
  }

  onFilterInProgress() {
    this.clearAll();
    this.filterprocess = 'กำลังดำเนินการ';
    this.onSearchChange();
  }

  countBacklogPending() {
    this.dcsm03Service.countBacklogPending().subscribe({
      next: (data: number) => {
        this.pending = data;
      },
      error: (err) => { }
    });
  }

  onFilterPending() {
    this.clearAll();
    this.filterprocess = 'รอดำเนินการ';
    this.onSearchChange();
  }

  countBacklogCheck() {
    this.dcsm03Service.countBacklogCheck().subscribe({
      next: (data: number) => {
        this.checked = data;
      },
      error: (err) => { }
    });
  }

  onFilterCheck() {
    this.clearAll();
    this.filterconfirm = 'รอตรวจสอบ';
    this.onSearchChange();
  }

  countBacklogEdit() {
    this.dcsm03Service.countBacklogEdit().subscribe({
      next: (data: number) => {
        this.edited = data;
      },
      error: (err) => { }
    });
  }

  onFilterEdit() {
    this.clearAll();
    this.filterprocess = 'รอดำเนินการแก้ไข';
    this.onSearchChange();
  }

  countBacklogComplete() {
    this.dcsm03Service.countBacklogComplete().subscribe({
      next: (data: number) => {
        this.completed = data;
      },
      error: (err) => { }
    });
  }

  onFilterComplete() {
    this.clearAll();
    this.filterconfirm = 'ผ่าน';
    this.onSearchChange();
  }

  clearAll() {
    this.filterId = '';
    this.filterjobdetails = '';
    this.filterowner = '';
    this.filterassignee = '';
    this.filterjo = '';
    this.filterprocess = '';
    this.filterconfirm = '';
    this.filterRemarkStatus = '';
    this.startDate = null;
    this.endDate = null;
    // Don't call onSearchChange() here if we're using it as a helper
  }

  countDetailsAdded() {
    this.dcsm03Service.countDetailsAdded().subscribe({
      next: (data: number) => {
        this.detailsAddedCount = data;
      },
      error: (err) => { }
    });
  }

  onFilterDetailsAdded() {
    this.clearAll();
    this.filterRemarkStatus = 'เพิ่มรายละเอียดแล้ว';
    this.onSearchChange();
  }
}