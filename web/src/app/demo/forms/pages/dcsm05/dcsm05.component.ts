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
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { AuthService } from 'src/app/services/auth.service';

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
  pageIndex = 0;
  approveShif = 0;
  notApproveShif = 0;
  clearFile = 0;
  inClearFile = 0;
  checkFile = 0;
  waitSample = 0;
  waitProcess = 0;
  backSample = 0;
  countEdit = 0;
  back = 0;

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'jobIdDisplay', label: 'รหัสงาน' },
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
    private dcsm05Service: Dcsm05Service,
    private statusColorService: StatusColorService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadData();
    this.Backlog();
    this.BacklogApproveShif();
    this.countBacklogNotApproveShif();
    this.countBacklogClearFile();
    this.countBacklogInClearFile();
    this.countBacklogCheckFile();
    this.countBacklogWaitSample();
    this.countBacklogWaitProcess();
    this.countBacklogBackSample();
    this.countBacklogSendBack();
    this.countEditSample();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      id: [''],
      jobId: [''],
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
          jobIdDisplay: item.qpId || item.jobId,
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

    this.dcsm05Service.getOrdersWithSearchSort(
      this.pageIndex,
      this.pageSize,
      filters
    ).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => ({
          ...item,
          jobIdDisplay: item.qpId || item.jobId,
          orderDate: this.formatDate(item.orderDate),
          deliveryDate: this.formatDate(item.deliveryDate)
        }));
        this.totalElements = res.totalElements;
      },
      error: (err) => {
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
    this.router.navigate(['/Dcsm05Detail']); // ปรับ Path ตามจริง
  }

  onRowClick(row: any): void {
    this.router.navigate(['/Dcsm05Detail', row.id]);
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
  countBacklogWaitProcess() {
    this.dcsm05Service.countBacklogWaitProcess().subscribe({
      next: (data: number) => {
        this.waitProcess = data;
      },
    });
  }

  onFilterwaitProcess() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('รอดำเนินการ');
    this.onSearch();
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
    this.onClearAll()
    this.searchForm.get('status')?.setValue('รอผู้รับผิดชอบอนุมัติ');
    this.onSearch();
  }

  BacklogApproveShif() {
    this.dcsm05Service.countBacklogApproveShif().subscribe({
      next: (data: number) => {
        this.approveShif = data;
      },
    });
  }

  onFilterApproveShif() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('อนุมัติขอเลื่อนส่ง');
    this.searchForm.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
    this.onSearch();
  }

  countBacklogNotApproveShif() {
    this.dcsm05Service.countBacklogNotApproveShif().subscribe({
      next: (data: number) => {
        this.notApproveShif = data;
      },
    });
  }

  onFilterNotApproveShif() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('ไม่อนุมัติเลื่อนส่ง');
    this.searchForm.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
    this.onSearch();
  }

  countBacklogClearFile() {
    this.dcsm05Service.countBacklogClearFile().subscribe({
      next: (data: number) => {
        this.clearFile = data;
      },
    });
  }

  onFilterClearFile() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('จัดส่งได้ รอเคลียร์ไฟล์');
    this.searchForm.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
    this.onSearch();
  }

  countBacklogInClearFile() {
    this.dcsm05Service.countBacklogInClearFile().subscribe({
      next: (data: number) => {
        this.inClearFile = data;
      },
    });
  }

  onFilterInClearFile() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('กำลังเคลียร์ไฟล์');
    this.searchForm.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
    this.onSearch();
  }

  countBacklogCheckFile() {
    this.dcsm05Service.countBacklogCheckFile().subscribe({
      next: (data: number) => {
        this.checkFile = data;
      },
    });
  }

  onFilterCheckFile() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('ไฟล์เสร็จ รอตรวจสอบไฟล์');
    this.searchForm.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
    this.onSearch();
  }

  countBacklogWaitSample() {
    this.dcsm05Service.countBacklogWaitSample().subscribe({
      next: (data: number) => {
        this.waitSample = data;
      },
    });
  }

  onFilterWaitSample() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('ไฟล์ถูกต้อง รอขึ้นตัวอย่าง');
    this.searchForm.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
    this.onSearch();
  }

  countBacklogBackSample() {
    this.dcsm05Service.countBacklogSendBackSample().subscribe({
      next: (data: number) => {
        this.backSample = data;
      },
    });
  }

  onFilterBackSample() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('ขึ้นตัวอย่างแล้ว');
    this.searchForm.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
    this.onSearch();
  }

  countBacklogSendBack() {
    this.dcsm05Service.countBacklogSendBack().subscribe({
      next: (data: number) => {
        this.back = data;
      },
    });
  }

  onFilterSample() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง');
    this.searchForm.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
    this.onSearch();
  }

  countEditSample() {
    this.dcsm05Service.countEditSample().subscribe({
      next: (data: number) => {
        this.countEdit = data;
      },
    });
  }

  onFilterEditSample() {
    this.onClearAll()
    this.searchForm.get('status')?.setValue('รอเคลียร์ไฟล์ใหม่');
    this.searchForm.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
    this.onSearch();
  }
}