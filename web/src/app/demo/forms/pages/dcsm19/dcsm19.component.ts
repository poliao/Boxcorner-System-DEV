import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; // อย่าลืม import
import { Router } from '@angular/router';
import { Dcsm19Service } from './dcsm19.service';
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
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-dcsm19',
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
  templateUrl: './dcsm19.component.html',
  styleUrls: ['./dcsm19.component.scss']
})
export class Dcsm19Component implements OnInit {
  countBacklog: number = 0;
  searchForm!: FormGroup;

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  approveShif = 0;
  notApproveShif = 0;
  clearFile = 0;
  inClearFile = 0;
  checkFile = 0;
  waitSample = 0;
  waitProcess = 0;
  backSample = 0;
  back = 0;

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
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
    private dcsm19Service: Dcsm19Service,
    private statusColorService: StatusColorService
  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadData();
    this.Backlog();

    this.countBacklogBackSample();
   
  }

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

    this.dcsm19Service.getOrdersWithSearch(
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

    this.dcsm19Service.getOrdersWithSearchSort(
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
    this.router.navigate(['/Dcsm19Detail']); // ปรับ Path ตามจริง
  }

  onRowClick(row: any): void {
    this.router.navigate(['/Dcsm19Detail', row.id]);
  }

  onClearAll(): void {
    this.searchForm.reset({
      id: '',
      folderName: '',
      jobOwner: '',
      responsiblePerson: '',
      status: '',
      startDate: null,
      endDate: null
    });
  }


  onFilterwaitProcess() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('รอดำเนินการ');
    this.onSearch();
  }

  Backlog() {
    this.dcsm19Service.countBacklog().subscribe({
      next: (data: number) => {
        this.countBacklog = data;
      },
      error: (err) => {
      }
    });
  }

  countBacklogBackSample() {
    this.dcsm19Service.countBacklogSendBackSample().subscribe({
      next: (data: number) => {
        this.backSample = data;
      },
    });
  }

  onFilterBackSample() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('ขึ้นตัวอย่างแล้ว');
    this.onSearch();
  }

}