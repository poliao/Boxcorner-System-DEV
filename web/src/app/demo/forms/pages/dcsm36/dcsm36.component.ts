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
    { key: 'status', label: 'สถานะ QC' },
    { key: 'responsibleName', label: 'ผู้รับผิดชอบ' },
    { key: 'deliveryDatetime', label: 'วันที่ส่งมอบ' }
  ];

  tableData: any[] = [];
  searchParams = {
    startDate: '',
    endDate: ''
  };

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dcsm36Service: Dcsm36Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.dcsm36Service.getQcJobs(this.pageIndex, this.pageSize, this.searchParams).subscribe({
      next: (res: any) => {
        this.tableData = res.content.map((item: any) => {
          if (item.deliveryDatetime) {
            item.deliveryDatetime = this.formatDate(item.deliveryDatetime);
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
    this.searchParams.startDate = '';
    this.searchParams.endDate = '';
    this.onSearchChange();
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['/Dcsm36Detail', row.id]);
    }
  }
}
