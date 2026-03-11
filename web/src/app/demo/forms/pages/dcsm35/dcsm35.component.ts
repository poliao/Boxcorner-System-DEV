import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm35Service } from './dcsm35.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-dcsm35',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm35.component.html',
  styleUrls: ['./dcsm35.component.scss']
})
export class Dcsm35Component implements OnInit {


  tableColumns = [
    { key: 'salesName', label: 'พนักงานขาย' },
    { key: 'visitCount', label: 'จำนวนครั้งที่เข้าพบ' },
    { key: 'quotationCount', label: 'จำนวนใบเสนอราคา' },
    { key: 'totalSales', label: 'ยอดขายรวม' },
    { key: 'newCustomerCount', label: 'ลูกค้าใหม่' }
  ];

  tableData: any[] = [];
  searchParams = {
    startDate: '',
    endDate: ''
  };

  constructor(
    private dcsm35Service: Dcsm35Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    this.searchParams.startDate = lastMonth.toISOString().split('T')[0];
    this.searchParams.endDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.dcsm35Service.getSummaryReport(this.searchParams).subscribe({
      next: (data) => {
        this.tableData = data;
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', 'ไม่สามารถโหลดข้อมูลรายงานได้');
      }
    });
  }

  onSearch() {
    this.loadData();
  }

  onClearSearch() {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    this.searchParams.startDate = lastMonth.toISOString().split('T')[0];
    this.searchParams.endDate = today.toISOString().split('T')[0];
    this.loadData();
  }
}
