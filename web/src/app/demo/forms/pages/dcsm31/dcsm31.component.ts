import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dcsm31Service } from './dcsm31.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm31',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, DataTableComponent, FormsModule],
  templateUrl: './dcsm31.component.html',
  styleUrls: ['./dcsm31.component.scss']
})
export class Dcsm31Component implements OnInit {

  tableColumns = [
    { key: 'inventoryId', label: 'ID' },
    { key: 'itemName', label: 'ชื่อสินค้า' },
    { key: 'category', label: 'ประเภท' },
    { key: 'paperSize', label: 'ขนาด' },
    { key: 'currentMajorQty', label: 'ยอดหลัก' },
    { key: 'majorUnit', label: 'หน่วยหลัก' },
    { key: 'currentMinorQty', label: 'ยอดรอง' },
    { key: 'minorUnit', label: 'หน่วยรอง' },
    { key: 'warehouseLocation', label: 'ตำแหน่งจัดเก็บ' },
  ];

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  searchParams: any = {
    itemName: '',
    category: '',
  };

  constructor(
    private router: Router,
    private dcsm31Service: Dcsm31Service
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dcsm31Service.search(this.pageIndex, this.pageSize, this.searchParams).subscribe({
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
    this.searchParams = { itemName: '', category: '' };
    this.pageIndex = 0;
    this.loadData();
  }

  onRowClick(row: any) {
    if (row?.inventoryId) {
      this.router.navigate(['/Dcsm31Detail', row.inventoryId]);
    }
  }

  add() {
    this.router.navigate(['/Dcsm31Detail']);
  }

  deleteItem(row: any, event: Event) {
    event.stopPropagation();
    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: `ลบสต็อก "${row.itemName}" ออก`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33'
    }).then(result => {
      if (result.isConfirmed) {
        this.dcsm31Service.delete(row.inventoryId).subscribe({
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

