import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
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

  private searchJobDetailsSubject = new Subject<string>();
  private searchOwnerListSubject = new Subject<string>();
  private searchAssigneeListSubject = new Subject<string>();
  private searchProcessListSubject = new Subject<string>();
  private searchConfirmListSubject = new Subject<string>();

  filterjobdetails: string = '';
  filterowner: string = '';
  filterassignee: string = '';
  filterprocess: string = '';
  filterconfirm: string = ''; // Filter for process

  jobdetailsList: string[] = [];
  OwnerList: string[] = [];
  Assignee: string[] = [];
  Process: string[] = [];
  Confirm: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private dcsm02Service: Dcsm02Service, private router: Router) { }
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'folderName', label: 'ชื่อโฟลเดอร์' },
    { key: 'orderDate', label: 'วันที่สั่งงาน' },
    { key: 'jobDetails', label: 'รายละเอียดงาน' },
    { key: 'jobOwner', label: 'เจ้าของงาน' },
    { key: 'assignee', label: 'ผู้รับผิดชอบ' },
    { key: 'deadlineDate', label: 'วันที่ต้องส่ง' },
    { key: 'deadlineTime', label: 'ภายในเวลา' },
    { key: 'remarks', label: 'หมายเหตุ' },
    { key: 'processStatus', label: 'สถานะงาน' },
    { key: 'confirmStatus', label: 'สถานะคอนเฟิร์ม' },
  ];

  tableData: any[] = [];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit() {
    this.loadData();
    this.prepareDropdownData();
  }

  loadData() {
    const startDateStr = this.startDate ? this.startDate.toISOString().split('T')[0] : '';
    const endDateStr = this.endDate ? this.endDate.toISOString().split('T')[0] : '';
    
    this.dcsm02Service.getAllDesignOrders(
      this.filterjobdetails,
      this.filterowner,
      this.filterprocess,
      this.filterassignee,
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
        },
        error: (err) => {

        }
      });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
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

  prepareDropdownData() {
    this.searchJobDetailsSubject.pipe(
    ).subscribe(searchValue => {
      this.fetchJobDetailFromDB(searchValue);
    });

    this.searchOwnerListSubject.pipe(
    ).subscribe(searchValue => {
      this.fetchOwnerListFromDB(searchValue);
    });

    this.searchAssigneeListSubject.pipe(
    ).subscribe(searchValue => {
      this.fetchAssigneeFromDB(searchValue);
    });

    this.searchProcessListSubject.pipe(
    ).subscribe(searchValue => {
      this.fetchProcessFromDB(searchValue);
    });

    this.searchProcessListSubject.pipe(
    ).subscribe(searchValue => {
      this.fetchConfirmFromDB(searchValue);
    });

    this.fetchJobDetailFromDB('');
    this.fetchOwnerListFromDB('');
    this.fetchAssigneeFromDB('');
    this.fetchProcessFromDB('');
    this.fetchConfirmFromDB('');
  }

  fetchJobDetailFromDB(query: string) {
    this.dcsm02Service.getUniqueJobDetail(query).subscribe({
      next: (data: string[]) => {
        this.jobdetailsList = data;
      },
      error: (err) => {
        console.error('Error fetching jobdetails from DB:', err);
      }
    });
  }

  fetchOwnerListFromDB(query: string) {
    this.dcsm02Service.getUniqueOwner(query).subscribe({
      next: (data: string[]) => {
        this.OwnerList = data;
      },
      error: (err) => {
        console.error('Error fetching OwnerList from DB:', err);
      }
    });
  }

  fetchAssigneeFromDB(query: string) {
    this.dcsm02Service.getUniqueAssignee(query).subscribe({
      next: (data: string[]) => {
        this.Assignee = data;
      },
      error: (err) => {
        console.error('Error fetching Assignee from DB:', err);
      }
    });
  }

  fetchProcessFromDB(query: string) {
    this.dcsm02Service.getUniqueProcess(query).subscribe({
      next: (data: string[]) => {
        this.Process = data;
      },
      error: (err) => {
        console.error('Error fetching Process from DB:', err);
      }
    });
  }

  fetchConfirmFromDB(query: string) {
    this.dcsm02Service.getUniqueConfirm(query).subscribe({
      next: (data: string[]) => {
        this.Confirm = data;
      },
      error: (err) => {
        console.error('Error fetching Process from DB:', err);
      }
    });
  }

  onStartDateChange() {
    if (this.startDate) {
      this.endDate = this.startDate;
    }
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

}