import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm36Service } from './dcsm36.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm36',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm36.component.html',
  styleUrls: ['./dcsm36.component.scss']
})
export class Dcsm36Component implements OnInit {


  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'joId', label: 'JOB ID' },
    { key: 'jobName', label: 'ชื่องาน' },
    { key: 'partName', label: 'ชิ้นส่วน' },
    { key: 'qcDetail', label: 'ความละเอียด QC' },
    { key: 'qcType', label: 'ประเภท QC' },
    { key: 'startQcDatetime', label: 'วันที่งานเข้า' },
    { key: 'deliveryDatetime', label: 'กำหนดส่ง', styleFunction: (key: string, row: any) => row._isOverdue ? { color: 'red', 'font-weight': 'bold' } : {} },
    { key: 'status', label: 'สถานะ QC', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },

  ];

  tableData: any[] = [];
  searchParams = {
    startDate: '', // For summary report
    endDate: '',   // For summary report
    joId: '',
    jobName: '',
    status: '',
    qcType: '',
    qcLocation: '',
    role: '',
    startFrom: '',
    startTo: '',
    deliveryFrom: '',
    deliveryTo: ''
  };

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  qcCounts = { jobsToDo: 0, jobsToSend: 0 };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dcsm36Service: Dcsm36Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private statusColorService: StatusColorService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.applyRoleFilters();
    this.loadData();
    this.loadCounts();
  }

  applyRoleFilters() {
    const user = this.authService.getUserFromToken();
    if (user && user.role) {
      this.searchParams.role = user.role;
      console.log(user.role);

    }
  }

  loadData() {
    this.loadingService.show();
    this.dcsm36Service.getQcJobs(this.pageIndex, this.pageSize, this.searchParams).subscribe({
      next: (res: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const applicableStatuses = ['รอส่งตรวจ', 'เข้าตรวจแล้ว', 'แบ่งส่ง', 'อยู่ระหว่างตรวจ'];

        this.tableData = res.content.map((item: any) => {
          if (item.deliveryDatetime) {
            const deadline = new Date(item.deliveryDatetime);
            deadline.setHours(0, 0, 0, 0);
            const diffTime = deadline.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            item._urgency = diffDays;
            item._isApplicable = applicableStatuses.includes(item.status);
            item._isOverdue = diffDays <= 0 && item._isApplicable;

            item.startQcDatetime = this.formatDate(item.startQcDatetime);
            item.deliveryDatetime = this.formatDate(item.deliveryDatetime);

            if (item._isOverdue) {
              item.deliveryDatetime = '! ' + item.deliveryDatetime;
            }
          }
          return item;
        });
        this.totalElements = res.totalElements;
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error fetching QC jobs', err);
        this.sweetAlert.error('Error', 'ไม่สามารถดึงข้อมูลงาน QC ได้');
        this.loadingService.hide();
      }
    });
  }

  formatDate(dateStr: any): string {
    if (!dateStr) return '-';
    try {
      if (dateStr.includes('T')) {
        const [datePart, timePart] = dateStr.split('T');
        const [y, m, d] = datePart.split('-');
        return `${d}/${m}/${y} ${timePart.substring(0, 5)}`;
      }
      if (dateStr.includes('-')) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
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

  clearAllFilters() {
    const defaultRole = this.searchParams.role; // Preserve role
    this.searchParams = {
      startDate: '',
      endDate: '',
      joId: '',
      jobName: '',
      status: '',
      qcType: '',
      qcLocation: '',
      role: defaultRole,
      startFrom: '',
      startTo: '',
      deliveryFrom: '',
      deliveryTo: ''
    };
    this.onSearchChange();
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['/Dcsm36Detail', row.id]);
    }
  }

  getRowStyles = (row: any) => {
    if (!row._isApplicable) return {};

    if (row._isOverdue) {
      return { 'background-color': '#ffcdd2' }; // Light Red (Red 100)
    }
    if (row._urgency !== undefined && row._urgency > 0 && row._urgency <= 3) {
      return { 'background-color': '#ffe0b2' }; // Light Orange (Orange 100)
    }
    if (row._urgency !== undefined && row._urgency > 3 && row._urgency <= 7) {
      return { 'background-color': '#fff9c4' }; // Light Yellow (Yellow 100)
    }
    if (row._urgency !== undefined && row._urgency > 7 && row._urgency <= 14) {
      return { 'background-color': '#c8e6c9' }; // Light Green (Green 100)
    }
    return {};
  }

  loadCounts() {
    this.dcsm36Service.getQcCounts(this.searchParams.role).subscribe({
      next: (res: any) => {
        this.qcCounts = res;
      },
      error: (err) => {
        console.error('Error fetching QC counts', err);
      }
    });
  }

  filterJobsToDo() {
    this.clearAllFilters();
    this.searchParams.status = 'รอส่งตรวจ'; // This is one of the to-do statuses
    // Or we could make it a special filter. For now, let's just set one.
    // Better yet, let's filter by the group in loadData if we want exact match.
    // But for simplicity, let's just set status and search.
    this.onSearchChange();
  }

  filterJobsToSend() {
    const today = new Date().toISOString().split('T')[0];
    this.clearAllFilters();
    this.searchParams.deliveryTo = today;
    this.searchParams.status = ''; // Any status not finished
    this.onSearchChange();
  }
}
