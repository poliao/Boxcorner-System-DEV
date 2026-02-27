import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dcsm30Service } from './dcsm30.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm30',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, DataTableComponent, FormsModule],
  templateUrl: './dcsm30.component.html',
  styleUrls: ['./dcsm30.component.scss']
})
export class Dcsm30Component implements OnInit {

  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'itemName', label: 'ชื่อสินค้า' },
    { key: 'category', label: 'ประเภท' },
    { key: 'paperSize', label: 'ขนาด' },
    { key: 'majorQuantity', label: 'ยอดหลัก' },
    { key: 'majorUnit', label: 'หน่วยหลัก' },
    { key: 'minorQuantity', label: 'ยอดรอง' },
    { key: 'minorUnit', label: 'หน่วยรอง' },
  ];

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  searchParams: any = {
    itemName: '',
    category: '',
    paperSize: ''
  };

  constructor(
    private router: Router,
    private dcsm30Service: Dcsm30Service
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dcsm30Service.search(this.pageIndex, this.pageSize, this.searchParams).subscribe({
      next: (res: any) => {
        this.tableData = res.content || [];
        this.totalElements = res.totalElements || 0;
      },
      error: (err) => console.error(err)
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearch() {
    this.pageIndex = 0;
    this.loadData();
  }

  clearSearch() {
    this.searchParams = { itemName: '', category: '', paperSize: '' };
    this.pageIndex = 0;
    this.loadData();
  }

  onRowClick(row: any) {
    if (row?.id) {
      this.router.navigate(['/Dcsm30Detail', row.id]);
    }
  }

  add() {
    this.router.navigate(['/Dcsm30Detail']);
  }

  deleteItem(row: any, event: Event) {
    event.stopPropagation();
    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: `ลบ "${row.itemName}" ออกจากสต็อก`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33'
    }).then(result => {
      if (result.isConfirmed) {
        this.dcsm30Service.delete(row.id).subscribe({
          next: () => {
            Swal.fire('ลบแล้ว', '', 'success');
            this.loadData();
          },
          error: () => Swal.fire('เกิดข้อผิดพลาด', '', 'error')
        });
      }
    });
  }
}
