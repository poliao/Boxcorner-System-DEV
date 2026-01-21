import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { Dcsm09Service } from './dcsm09.service';
import { TokenService } from 'src/app/shared/token.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';

@Component({
  selector: 'app-dcsm09',
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
  templateUrl: './dcsm09.component.html',
  styleUrls: ['./dcsm09.component.scss']
})
export class Dcsm09Component implements OnInit {
  searchForm!: FormGroup;

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  countBacklog = 0;
  waitCheckFile = 0;
  waitSend = 0;
  waitSendFile = 0;
  isSortMode: boolean = false;

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'deadlineDate', label: 'กำหนดส่งลูกค้า' },
    { key: 'folderName', label: 'ชื่อโฟลเดอร์' },
    { key: 'jobOwner', label: 'เจ้าของงาน' },
    { key: 'operatorName', label: 'ผู้รับผิดชอบ' },
    { key: 'jobStatus', label: 'สถานะงาน', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },
    { key: 'processStatus', label: 'สถานะดำเนินการ', colorFunction: this.statusColorService.getProcessStatusColor.bind(this.statusColorService) },
    { key: 'moldStatus', label: 'สถานะแม่พิมพ์', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },
    { key: 'inspector', label: 'ผู้ตรวจ' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dcsm09Service: Dcsm09Service,
    private loadingService: LoadingService,
    private statusColorService: StatusColorService
  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadData();
    this.Backlog();
    this.BacklogWaitCheckFile();
    this.BacklogWaitSend();
    this.BacklogWaitSendFile();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      id: [''],
      folderName: [''],
      jobOwner: [''],
      responsiblePerson: [''],
      status: [''],
      processStatus: [''],
      moldStatus: [''],
      jobType: [''],
      startDate: [null],
      inspector: [''],
      endDate: [{ value: null, disabled: true }]
    });
  }

  loadData(): void {
    this.loadingService.show();
    const formValues = this.searchForm.getRawValue();
    const apiFilters = {
      id: formValues.id,
      folderName: formValues.folderName,
      jobOwner: formValues.jobOwner,
      operatorName: formValues.responsiblePerson,
      jobStatus: formValues.status,
      processStatus: formValues.processStatus,
      moldStatus: formValues.moldStatus,
      jobType: formValues.jobType,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      inspector: formValues.inspector,
      page: this.pageIndex,
      size: this.pageSize
    };
   
    this.dcsm09Service.getOrdersWithSearch(apiFilters).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item,
          deadlineDate: this.formatDate(item.deadlineDate),
          deliveryDate: this.formatDate(item.deliveryDate)
        }));
        this.totalElements = res.totalElements;
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Error loading data:', err);
      }
    });
  }

  loadDataSort(): void {
    this.loadingService.show();
    const formValues = this.searchForm.getRawValue();
    const apiFilters = {
      id: formValues.id,
      folderName: formValues.folderName,
      jobOwner: formValues.jobOwner,
      operatorName: formValues.responsiblePerson,
      jobStatus: formValues.status,
      processStatus: formValues.processStatus,
      moldStatus: formValues.moldStatus,
      jobType: formValues.jobType,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      inspector: formValues.inspector,
      page: this.pageIndex,
      size: this.pageSize
    };
   
    this.dcsm09Service.getOrdersWithSearchSort(apiFilters).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item,
          deadlineDate: this.formatDate(item.deadlineDate),
          deliveryDate: this.formatDate(item.deliveryDate)
        }));
        this.totalElements = res.totalElements;
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Error loading data:', err);
      }
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
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
    }else{
      this.loadData();
    }
  }

  add(): void {
    this.router.navigate(['/Dcsm09Detail']);
  }

  onRowClick(row: any): void {
    console.log(row.id);
    
    this.router.navigate(['/Dcsm09Detail', row.id]);
  }

   Backlog(){
    this.dcsm09Service.countBacklog().subscribe({
      next: (data: number) => {
        this.countBacklog = data;
      },
      error: (err) => {
      }
    });
  }

  onFilterUnassigned() {
    this.searchForm.patchValue({
      processStatus: 'เสร็จสิ้น รอตรวจสอบ',
    });
    this.onSearch();
  }

  BacklogWaitCheckFile(){
    this.dcsm09Service.countProcessStatus('ตรวจไฟล์แม่พิมพ์แล้ว').subscribe({
      next: (data: number) => {
        this.waitCheckFile = data;
      },
      error: (err) => {
      }
    });
  }

  onFilterProcessStatus() {
    this.searchForm.patchValue({
      processStatus: 'ตรวจไฟล์แม่พิมพ์แล้ว',
    });
    this.onSearch();
  }

  BacklogWaitSend(){
    this.dcsm09Service.countProcessStatus('ตรวจใบสั่งผลิตแล้ว').subscribe({
      next: (data: number) => {
        this.waitSend = data;
      },
      error: (err) => {
      }
    });
  }

  onFilterWaitSend() {
    this.searchForm.patchValue({
      processStatus: 'ตรวจใบสั่งผลิตแล้ว',
    });
    this.onSearch();
  }

  BacklogWaitSendFile(){
    this.dcsm09Service.countProcessStatus('ส่งใบสั่งผลิตแล้ว').subscribe({
      next: (data: number) => {
        this.waitSendFile = data;
      },
    });
  }

  onFilterWaitSendFile() {
    this.searchForm.patchValue({
      processStatus: 'ส่งใบสั่งผลิตแล้ว',
    });
    this.onSearch();
  }
}