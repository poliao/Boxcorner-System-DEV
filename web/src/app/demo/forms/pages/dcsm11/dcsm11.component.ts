import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; // อย่าลืม import
import { Router } from '@angular/router';
import { Dcsm11Service } from './dcsm11.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-dcsm11',
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
  templateUrl: './dcsm11.component.html',
  styleUrls: ['./dcsm11.component.scss']
})
export class Dcsm11Component implements OnInit {

  searchForm!: FormGroup;

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  inspection = 0;
  isSortMode: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'orderDate', label: 'วันที่สั่ง' },
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
    private dcsm11Service: Dcsm11Service,
    private statusColorService: StatusColorService
  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadData();
    this.Inspection();
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
      endDate: [{ value: null, disabled: true }]
    });
  }

  loadData(): void {
    const filters = this.searchForm.value;

    this.dcsm11Service.getOrdersWithSearch(
      this.pageIndex,
      this.pageSize,
      filters
    ).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item,
          orderDate: item.orderDate ? new Date(item.orderDate).toLocaleDateString('th-TH') : ''
        }));
        this.totalElements = res.totalElements;
      },
      error: (err) => {
      }
    });
  }

  loadDataSort(): void {
    const filters = this.searchForm.value;

    this.dcsm11Service.getOrdersWithSearchSort(
      this.pageIndex,
      this.pageSize,
      filters
    ).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item,
          orderDate: item.orderDate ? new Date(item.orderDate).toLocaleDateString('th-TH') : ''
        }));
        this.totalElements = res.totalElements;
      },
      error: (err) => {
      }
    });
  }

  sortByClosestDate() {
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
    if (this.isSortMode) {
      this.loadDataSort(); // ถ้าเป็นโหมด Sort ให้เรียกอันนี้
    } else {
      this.loadData();     // ถ้าปกติ ให้เรียกอันนี้
    }
  }

  onRowClick(row: any): void {
    this.router.navigate(['/Dcsm11Detail', row.id]);
  }

  Inspection() {
    this.dcsm11Service.countBacklogInspection().subscribe({
      next: (data: number) => {
        this.inspection = data;
      },
    });
  }

  onFilterUnassigned() {
    this.searchForm.get('status')?.setValue('ไฟล์เสร็จ รอตรวจสอบไฟล์');
    this.onSearch();
  }
}