import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dcsm27Service } from './dcsm27.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-dcsm27',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, DataTableComponent],
  templateUrl: './dcsm27.component.html',
  styleUrls: ['./dcsm27.component.scss']
})
export class Dcsm27Component implements OnInit {
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'jobId', label: 'Job ID' },
    { key: 'customerJobName', label: 'ชื่อลูกค้า/ชื่องาน' },
    { key: 'deliveryDate', label: 'วันที่ส่ง' },
    { key: 'jobStatus', label: 'สถานะ' },
    { key: 'printerName', label: 'เครื่องพิมพ์' },
    { key: 'totalPrintSheets', label: 'จำนวนใบพิมพ์' }
  ];

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private router: Router,
    private dcsm27Service: Dcsm27Service
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dcsm27Service.getOrdersWithSearch(this.pageIndex, this.pageSize, {}).subscribe({
      next: (response: any) => {
        this.tableData = response.content;
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
