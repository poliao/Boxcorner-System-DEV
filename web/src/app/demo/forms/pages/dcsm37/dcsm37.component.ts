import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm37Service } from './dcsm37.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';

@Component({
  selector: 'app-dcsm37',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm37.component.html',
  styleUrls: ['./dcsm37.component.scss']
})
export class Dcsm37Component implements OnInit {

  tableColumns = [
    { key: 'productionOrderId', label: 'เลขที่' },
    { key: 'jobId', label: 'Job ID' },
    { key: 'folderName', label: 'ชื่องาน' },
    { key: 'customerName', label: 'ลูกค้า' },
    { key: 'jobOwner', label: 'เจ้าของงาน' },
    { key: 'jobType', label: 'ประเภทงาน' },
  ];

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  searchParams = {
    jobId: '', folderName: '', customerName: '',
    jobOwner: '', jobStatus: '', processStatus: '',
    startDate: '', endDate: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: Dcsm37Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private statusColor: StatusColorService
  ) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loadingService.show();
    const params = { ...this.searchParams, page: this.pageIndex, size: this.pageSize };
    this.service.search(params).subscribe({
      next: (res: any) => {
        this.tableData = (res.content || []).map((item: any) => ({
          ...item,
          deadlineDate: this.formatDate(item.deadlineDate)
        }));
        this.totalElements = res.totalElements;
        this.loadingService.hide();
      },
      error: () => { this.sweetAlert.error('ผิดพลาด', 'ไม่สามารถดึงข้อมูลได้'); this.loadingService.hide(); }
    });
  }

  formatDate(d: string): string {
    if (!d) return '-';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  onSearchChange() {
    this.pageIndex = 0;
    if (this.paginator) this.paginator.pageIndex = 0;
    this.loadData();
  }

  clearFilters() {
    this.searchParams = { jobId: '', folderName: '', customerName: '', jobOwner: '', jobStatus: '', processStatus: '', startDate: '', endDate: '' };
    this.onSearchChange();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onRowClick(row: any) {
    if (row?.productionOrderId) this.router.navigate(['/Dcsm37Detail', row.productionOrderId]);
  }
}
