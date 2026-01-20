import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Dcsm16Service } from './dcsm16.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ThaiDatePipe } from 'src/app/shared/pipes/thai-date.pipe';

@Component({
  selector: 'app-dcsm16',
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
    MatDatepickerModule,
    MatNativeDateModule,
    ThaiDatePipe
  ],
  templateUrl: './dcsm16.component.html',
  styleUrls: ['./dcsm16.component.scss']
})
export class Dcsm16Component implements OnInit {
  
  searchForm!: FormGroup;

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  shif = 0;
  approveSample = 0;
  isSortMode: boolean = false;
  
  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'folderName', label: 'ชื่อโฟลเดอร์' },
    { key: 'jobOwner', label: 'เจ้าของงาน' },
    { key: 'responsiblePerson', label: 'ผู้รับผิดชอบ' },
    { key: 'status', label: 'สถานะ', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },
    { key: 'deliveryDate', label: 'วันที่ส่ง' },
    { key: 'deliveryTime', label: 'เวลาส่ง' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dcsm16Service: Dcsm16Service,
    private statusColorService: StatusColorService
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadData();
    this.BacklogShif();
    this.BacklogApproveSample();
  }

  // 1. สร้าง Form
  initSearchForm(): void {
    this.searchForm = this.fb.group({
      id: [''],
      folderName: [''],
      jobOwner: [''],
      responsiblePerson: [''],
      status: [''],
      startDate: [null],
      endDate: [{value: null, disabled: true}]
    });
  }

  loadData(): void {
    const filters = this.searchForm.value;

    this.dcsm16Service.getOrdersWithSearch(
      this.pageIndex,
      this.pageSize,
      filters 
    ).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item,
          orderDate: this.formatDate(item.orderDate),
          deliveryDate: this.formatDate(item.deliveryDate)
        }));
        this.totalElements = res.totalElements;
      },
      error: (err) => {
      }
    });
  }

  loadDataSort(): void {
    const filters = this.searchForm.value;

    this.dcsm16Service.getOrdersWithSearchSort(
      this.pageIndex,
      this.pageSize,
      filters 
    ).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item,
          orderDate: this.formatDate(item.orderDate),
          deliveryDate: this.formatDate(item.deliveryDate)
        }));
        this.totalElements = res.totalElements;
      },
      error: (err) => {
      }
    });
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
        startDate: null,
        endDate: null
    });
    this.searchForm.get('endDate')?.disable();
    this.onSearch();
  }

  get minEndDate(): Date | null {
    const startDate = this.searchForm.get('startDate')?.value;
    return startDate ? new Date(startDate) : null;
  }

  get isEndDateDisabled(): boolean {
    const startDate = this.searchForm.get('startDate')?.value;
    return !startDate;
  }

  onStartDateChange(): void {
    const startDate = this.searchForm.get('startDate')?.value;
    const endDate = this.searchForm.get('endDate')?.value;
    
    if (!startDate) {
      this.searchForm.get('endDate')?.disable();
      this.searchForm.patchValue({ endDate: null });
    }
    else {
      this.searchForm.get('endDate')?.enable();
      if (endDate && new Date(endDate) < new Date(startDate)) {
        this.searchForm.patchValue({ endDate: null });
      }
    }
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
    this.router.navigate(['/Dcsm16Detail']); 
  }

  onRowClick(row: any): void {
    this.router.navigate(['/Dcsm16Detail', row.id]);
  }

  BacklogShif() {
    this.dcsm16Service.countBacklogShif().subscribe({
      next: (data: number) => {
        this.shif = data;
      },
    });
  }

  onFilterUnassigned() {
    this.searchForm.get('status')?.setValue('ขอเลื่อนวันส่ง');
    this.onSearch();
  }

  BacklogApproveSample() {
    this.dcsm16Service.countBacklogApproveSample().subscribe({
      next: (data: number) => {
        this.approveSample = data;
      },
    });
  }

  onFilterApproveSample() {
    this.searchForm.get('status')?.setValue('สำเร็จ รออนุมัติไปตารางรอผลิต');
    this.onSearch();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }


}