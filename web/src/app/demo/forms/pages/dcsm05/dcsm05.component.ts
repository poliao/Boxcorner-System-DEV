import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; // อย่าลืม import
import { Router } from '@angular/router';
import { Dcsm05Service } from './dcsm05.service';
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
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-dcsm05',
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
  ],
  templateUrl: './dcsm05.component.html',
  styleUrls: ['./dcsm05.component.scss']
})
export class Dcsm05Component implements OnInit {
  countBacklog: number = 0;
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
    { key: 'status', label: 'สถานะ' },
    { key: 'deliveryDate', label: 'วันที่ส่ง' },
    { key: 'deliveryTime', label: 'เวลาส่ง' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dcsm05Service: Dcsm05Service,

  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadData();
    this.Backlog();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
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

    this.dcsm05Service.getOrdersWithSearch(
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

  onSearch(): void {
    this.pageIndex = 0;
    this.loadData();
  }

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
    this.loadData();
  }

  add(): void {
    this.router.navigate(['/Dcsm05Detail']); // ปรับ Path ตามจริง
  }

  onRowClick(row: any): void {
    this.router.navigate(['/Dcsm05Detail', row.id]);
  }

  Backlog() {
    this.dcsm05Service.countBacklog().subscribe({
      next: (data: number) => {
        this.countBacklog = data;
      },
      error: (err) => {
      }
    });
  }

  onFilterUnassigned() {
    this.searchForm.get('status')?.setValue('รอผู้รับผิดชอบอนุมัติ');
    this.onSearch();
  }

}