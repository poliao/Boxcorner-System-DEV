import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm15Service } from './dcsm15.service';

@Component({
  selector: 'app-dcsm15',
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm15.component.html',
  styleUrls: ['./dcsm15.component.scss']
})
export class Dcsm15Component implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'reportDate', label: 'วันที่รายงาน' },
    { key: 'jobOrderNo', label: 'เลขที่ใบสั่งงาน' },
    { key: 'jobName', label: 'ชื่องาน' },
    { key: 'stampingType', label: 'ประเภทงานปั๊ม' },
    { key: 'quantity', label: 'จำนวน' },
    { key: 'reporterName', label: 'ผู้รายงาน' }
  ];

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filterId = '';
  filterJobOrderNo = '';
  filterJobName = '';

  constructor(private dcsm15Service: Dcsm15Service, private router: Router) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dcsm15Service.getAll(this.pageIndex, this.pageSize, {
      id: this.filterId,
      jobOrderNo: this.filterJobOrderNo,
      jobName: this.filterJobName
    }).subscribe({
      next: (response: any) => {
        this.tableData = response.content.map((item: any) => ({
          ...item,
          reportDate: this.formatDate(item.reportDate),
          stampingType: this.getStampingType(item)
        }));
        this.totalElements = response.totalElements;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  getStampingType(item: any): string {
    if (item.stampingType === 'embossing') return 'ปั๊มนูน';
    if (item.stampingType === 'diecutting') return 'ไดคัท';
    return '-';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
    this.filterId = '';
    this.filterJobOrderNo = '';
    this.filterJobName = '';
    this.onSearchChange();
  }

  add() {
    this.router.navigate(['/Dcsm15Detail']);
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['/Dcsm15Detail', row.id]);
    }
  }
}
