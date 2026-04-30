import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { Dcsm06Service } from './dcsm06.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm06',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DataTableComponent
  ],
  templateUrl: './dcsm06.component.html',
  styleUrls: ['./dcsm06.component.scss']
})
export class Dcsm06Component implements OnInit {
  searchForm!: FormGroup;
  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  isSortMode: boolean = false;
  isPostpone = 0;
  isWaitingApproval = 0;

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'jobId', label: 'รหัสงาน' },
    { key: 'folderName', label: 'ชื่อโฟลเดอร์' },
    { key: 'jobOwner', label: 'เจ้าของงาน' },
    { key: 'operatorName', label: 'ผู้รับผิดชอบ' },
    { key: 'jobStatus', label: 'สถานะงาน', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },
    { key: 'processStatus', label: 'สถานะดำเนินการ', colorFunction: this.statusColorService.getProcessStatusColor.bind(this.statusColorService) },
    { key: 'moldStatus', label: 'สถานะแม่พิมพ์', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },
    { key: 'deadlineDate', label: 'กำหนดส่งลูกค้า' },
    { key: 'jobType', label: 'ประเภทงาน' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dcsm06Service: Dcsm06Service,
    private statusColorService: StatusColorService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadData();
    this.countBacklogPostpone();
    this.countBacklogWaitingApproval();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      id: [''],              // เพิ่ม id
      jobId: [''],
      folderName: [''],
      jobOwner: [''],
      responsiblePerson: [''],
      status: [''],
      processStatus: [''],   // เพิ่ม processStatus
      moldStatus: [''],      // เพิ่ม moldStatus
      jobType: [''],
      postpone: [''],
      startDate: [null],
      endDate: [{ value: null, disabled: true }]
    });

  }

  loadData(): void {
    const formValues = this.searchForm.getRawValue();

    // Map ข้อมูลให้ตรงกับ Service ที่เตรียมไว้
    const apiFilters = {
      id: formValues.id,                   // ส่ง id
      jobId: formValues.jobId,
      folderName: formValues.folderName,
      jobOwner: formValues.jobOwner,
      operatorName: formValues.responsiblePerson,
      jobStatus: formValues.status,
      processStatus: formValues.processStatus,
      moldStatus: formValues.moldStatus,
      jobType: formValues.jobType,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      postpone: formValues.postpone,
      page: this.pageIndex,
      size: this.pageSize
    };

    this.dcsm06Service.getOrdersWithSearch(apiFilters).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item, jobId: item.qpId || item.jobId,
          deadlineDate: this.formatDate(item.deadlineDate),
          deliveryDate: this.formatDate(item.deliveryDate)
        }));
        this.totalElements = res.totalElements;
      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });
  }

  loadDataSort(): void {
    const formValues = this.searchForm.getRawValue();

    const apiFilters = {
      id: formValues.id,
      jobId: formValues.jobId,
      folderName: formValues.folderName,
      jobOwner: formValues.jobOwner,
      operatorName: formValues.responsiblePerson,
      jobStatus: formValues.status,
      processStatus: formValues.processStatus,
      moldStatus: formValues.moldStatus,
      jobType: formValues.jobType,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      postpone: formValues.postpone,
      page: this.pageIndex,
      size: this.pageSize
    };

    this.dcsm06Service.getOrdersWithSearchSort(apiFilters).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item, jobId: item.qpId || item.jobId,
          deadlineDate: this.formatDate(item.deadlineDate),
          deliveryDate: this.formatDate(item.deliveryDate)
        }));
        this.totalElements = res.totalElements;
      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }

  onSearchSort(): void {
    this.isSortMode = true;
    this.pageIndex = 0;
    this.loadDataSort();
  }

  onSearch(): void {
    this.isSortMode = false;
    this.pageIndex = 0;
    this.loadData();
  }

  onClear(): void {
    this.searchForm.reset({
      id: '',
      jobId: '',
      folderName: '',
      jobOwner: '',
      responsiblePerson: '',
      status: '',
      processStatus: '',
      moldStatus: '',
      jobType: '',
      startDate: null,
      endDate: null
    });
    this.searchForm.get('endDate')?.disable();
    this.onSearch();
  }

  onStartDateChange(): void {
    const startDate = this.searchForm.get('startDate')?.value;
    const endDateControl = this.searchForm.get('endDate');

    if (startDate) {
      endDateControl?.enable();
      const endDate = endDateControl?.value;
      if (endDate && new Date(endDate) < new Date(startDate)) {
        endDateControl?.setValue(null);
      }
    } else {
      endDateControl?.disable();
      endDateControl?.setValue(null);
    }
  }

  get minEndDate(): Date | null {
    const startDate = this.searchForm.get('startDate')?.value;
    return startDate ? new Date(startDate) : null;
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isSortMode == true) {
      this.loadDataSort();
    } else {
      this.loadData();
    }
  }

  add(): void {
    this.router.navigate(['/Dcsm06Detail']);
  }

  onRowClick(row: any): void {
    this.router.navigate(['/Dcsm06Detail', row.id]);
  }

  countBacklogPostpone() {
    this.dcsm06Service.countBacklogPostpone().subscribe({
      next: (data: number) => {
        this.isPostpone = data;
      },
    });
  }

  onFilterPostpone() {
    this.searchForm.patchValue({
      postpone: 'มีการเลื่อนเวลาส่ง',
      jobOwner: this.authService.getUserFromToken().sub,
    });
    this.onSearch();
  }

  countBacklogWaitingApproval() {
    this.dcsm06Service.countBacklogWaitingApproval().subscribe({
      next: (data: number) => {
        this.isWaitingApproval = data;
      },
    });
  }

  onFilterWaitingApproval() {
    this.searchForm.patchValue({
      processStatus: 'รอการอนุมัติผลิต',
      jobOwner: this.authService.getUserFromToken().sub,
    });
    this.onSearch();
  }
}
