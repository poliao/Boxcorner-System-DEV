import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dcsm27Service } from './dcsm27.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { AuthService } from 'src/app/services/auth.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dcsm27',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, DataTableComponent],
  templateUrl: './dcsm27.component.html',
  styleUrls: ['./dcsm27.component.scss']
})
export class Dcsm27Component implements OnInit {
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'jobId', label: 'Job ID' },
    { key: 'customerJobName', label: 'ชื่อลูกค้า/ชื่องาน' },
    { key: 'deliveryDate', label: 'วันที่ส่ง' },
    { key: 'jobStatus', label: 'สถานะ', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },
    { key: 'printerName', label: 'เครื่องพิมพ์' },
    { key: 'issample', label: 'เป็นตัวอย่าง' },
    { key: 'totalPrintSheets', label: 'จำนวนใบพิมพ์' }
  ];

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filterJobId: string = '';
  filterCustomerName: string = '';
  filterPrintStatus: string = '';
  filterIssample: string = '';

  constructor(
    private router: Router,
    private dcsm27Service: Dcsm27Service,
    private statusColorService: StatusColorService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const filters = {
      jobId: this.filterJobId,
      customerJobName: this.filterCustomerName,
      jobStatus: this.filterPrintStatus,
      issample: this.filterIssample
    };

    this.dcsm27Service.getOrdersWithSearch(this.pageIndex, this.pageSize, filters).subscribe({
      next: (response: any) => {
        const jobs = response.content.map((item: any) => ({
          ...item,
          issample: item.issample ? 'เป็น' : 'ไม่เป็น'
        }));
        this.tableData = jobs;
        this.totalElements = response.totalElements;
      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearchChange() {
    this.pageIndex = 0;
    this.loadData();
  }

  clearAllFilters() {
    this.filterJobId = '';
    this.filterCustomerName = '';
    this.filterPrintStatus = '';
    this.filterIssample = '';
    this.onSearchChange();
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['/Dcsm27Detail', row.id]);
    }
  }

  add() {
    this.router.navigate(['/Dcsm27Detail']);
  }

  createInternalJob() {
    this.router.navigate(['/Dcsm27Detail'], { queryParams: { type: 'internal' } });
  }
}
