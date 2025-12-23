import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; // อย่าลืม import
import { Router } from '@angular/router';
import { Dcsm04Service } from './dcsm04.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
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

@Component({
  selector: 'app-dcsm04',
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
  templateUrl: './dcsm04.component.html',
  styleUrls: ['./dcsm04.component.scss']
})
export class Dcsm04Component implements OnInit {
  
  searchForm!: FormGroup;

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0; // Angular Material Paginator เริ่มที่ 0
  
  tableColumns = [
    { key: 'id', label: 'รหัสสั่งผลิต' },
    { key: 'orderDate', label: 'วันที่สั่ง' },
    { key: 'folderName', label: 'ชื่อโฟลเดอร์' },
    { key: 'jobOwner', label: 'เจ้าของงาน' },
    { key: 'responsiblePerson', label: 'ผู้รับผิดชอบ' },
    { key: 'status', label: 'สถานะ' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dcsm04Service: Dcsm04Service
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadData();
  }

  // 1. สร้าง Form
  initSearchForm(): void {
    this.searchForm = this.fb.group({
      folderName: [''],
      jobOwner: [''],
      responsiblePerson: [''],
      status: [''],
      startDate: [null],
      endDate: [{value: null, disabled: true}]
    });
  }

  // 2. ฟังก์ชันโหลดข้อมูล (หัวใจหลัก)
  loadData(): void {
    const filters = this.searchForm.value;

    this.dcsm04Service.getOrdersWithSearch(
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

  // 3. เมื่อกดปุ่มค้นหา
  onSearch(): void {
    this.pageIndex = 0; // รีเซ็ตกลับไปหน้าแรกเสมอเมื่อกดค้นหาใหม่
    this.loadData();
  }

  // 4. เมื่อกดปุ่มล้างค่า
  onClear(): void {
    this.searchForm.reset({
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

  // ฟังก์ชันควบคุมการเลือกวันที่
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
    
    // ถ้าไม่มีวันที่จาก ให้ disable และลบวันที่ถึง
    if (!startDate) {
      this.searchForm.get('endDate')?.disable();
      this.searchForm.patchValue({ endDate: null });
    }
    // ถ้ามีวันที่จาก ให้ enable วันที่ถึง
    else {
      this.searchForm.get('endDate')?.enable();
      // ถ้าวันที่ถึงน้อยกว่าวันที่จาก ให้ลบวันที่ถึง
      if (endDate && new Date(endDate) < new Date(startDate)) {
        this.searchForm.patchValue({ endDate: null });
      }
    }
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  // 6. กดปุ่มเพิ่ม
  add(): void {
    this.router.navigate(['/Dcsm04Detail']); // ปรับ Path ตามจริง
  }

  // 7. กดที่แถวเพื่อแก้ไข
  onRowClick(row: any): void {
    this.router.navigate(['/Dcsm04Detail', row.id]);
  }
}