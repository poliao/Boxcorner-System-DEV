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

import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { Dcsm06Service } from './dcsm06.service';

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

  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'deadlineDate', label: 'กำหนดส่งลูกค้า' }, 
    { key: 'folderName', label: 'ชื่อโฟลเดอร์' },
    { key: 'jobOwner', label: 'เจ้าของงาน' },
    { key: 'operatorName', label: 'ผู้รับผิดชอบ' },
    { key: 'jobStatus', label: 'สถานะงาน' },
    { key: 'processStatus', label: 'สถานะดำเนินการ' },
    { key: 'moldStatus', label: 'สถานะแม่พิมพ์' },
    { key: 'jobType', label: 'ประเภทงาน' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dcsm06Service: Dcsm06Service
  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadData();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      id: [''],              // เพิ่ม id
      folderName: [''],
      jobOwner: [''],
      responsiblePerson: [''],
      status: [''],
      processStatus: [''],   // เพิ่ม processStatus
      moldStatus: [''],      // เพิ่ม moldStatus
      jobType: [''],         // เพิ่ม jobType
      startDate: [null],
      endDate: [{ value: null, disabled: true }]
    });
    
  }

  loadData(): void {
    const formValues = this.searchForm.getRawValue();

    // Map ข้อมูลให้ตรงกับ Service ที่เตรียมไว้
    const apiFilters = {
      id: formValues.id,                   // ส่ง id
      folderName: formValues.folderName,
      jobOwner: formValues.jobOwner,
      operatorName: formValues.responsiblePerson, 
      jobStatus: formValues.status,             
      processStatus: formValues.processStatus,
      moldStatus: formValues.moldStatus,
      jobType: formValues.jobType,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      page: this.pageIndex,
      size: this.pageSize
    };

    this.dcsm06Service.getOrdersWithSearch(apiFilters).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item,
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
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  onSearch(): void {
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
    this.loadData();
  }

  add(): void {
    this.router.navigate(['/Dcsm06Detail']); 
  }

  onRowClick(row: any): void {
    this.router.navigate(['/Dcsm06Detail', row.id]);
  }
}