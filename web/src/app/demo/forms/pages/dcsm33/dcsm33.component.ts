import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm33Service } from './dcsm33.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-dcsm33',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm33.component.html',
  styleUrls: ['./dcsm33.component.scss']
})
export class Dcsm33Component implements OnInit {

  searchParams = {
    joId: '',
    jobCustomerName: '',
    jobOwnerName: '',
    technicianName: ''
  };

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'joId', label: 'JO Number' },
    { key: 'jobCustomerName', label: 'ชื่องาน/ลูกค้า' },
    { key: 'requiredSheetsQty', label: 'ยอดผลิต/กล่อง' },
    { key: 'receivedSheetsQty', label: 'ยอดใบพิมพ์' },
    { key: 'isSample', label: 'เป็นตัวอย่าง' },
    { key: 'deliveryDatetime', label: 'วันกำหนดส่ง', type: 'datetime' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dcsm33Service: Dcsm33Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.dcsm33Service.getCoatingJobsWithSearch(this.pageIndex, this.pageSize, this.searchParams)
      .subscribe({
        next: (response: any) => {
          this.tableData = response.content;
          this.totalElements = response.totalElements;
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          this.sweetAlert.error('Error', 'ไม่สามารถโหลดข้อมูลตารางได้');
        }
      });
  }

  onSearch() {
    this.pageIndex = 0;
    this.loadData();
  }

  onClearSearch() {
    this.searchParams = {
      joId: '',
      jobCustomerName: '',
      jobOwnerName: '',
      technicianName: ''
    };
    this.onSearch();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['/Dcsm33Detail', row.id]);
    }
  }
}
