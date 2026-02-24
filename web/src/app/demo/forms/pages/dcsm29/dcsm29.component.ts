import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dcsm29Service } from './dcsm29.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-dcsm29',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, DataTableComponent],
  templateUrl: './dcsm29.component.html',
  styleUrls: ['./dcsm29.component.scss']
})
export class Dcsm29Component implements OnInit {
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'jobId', label: 'Job ID' },
    { key: 'customerJobName', label: 'ชื่อลูกค้า/ชื่องาน' },
    { key: 'deliveryDate', label: 'วันที่ส่ง' },
    { key: 'jobStatus', label: 'สถานะ' },
    { key: 'printerName', label: 'เครื่องพิมพ์' },
    { key: 'totalPrintSheets', label: 'จำนวนใบพิมพ์' },
    { key: 'meterStatus', label: 'ยอดส่วนต่างมิเตอร์' }
  ];

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private router: Router,
    private dcsm29Service: Dcsm29Service
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dcsm29Service.getOrdersWithSearch(this.pageIndex, this.pageSize, {}).subscribe({
      next: (response: any) => {
        this.tableData = response.content;
        this.totalElements = response.totalElements;
        this.loadMeterDataForRows();
      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });
  }

  loadMeterDataForRows() {
    this.tableData.forEach(row => {
      row.meterStatus = 'กำลังโหลด...';
      this.dcsm29Service.getLogsByJobId(row.id).subscribe({
        next: (logs) => {
          let totalImpressions = 0;
          logs.forEach(log => {
            if (log.meterColorEnd && log.meterColorStart) totalImpressions += (log.meterColorEnd - log.meterColorStart);
            if (log.meterBwEnd && log.meterBwStart) totalImpressions += (log.meterBwEnd - log.meterBwStart);
            if (log.meterSpecialEnd && log.meterSpecialStart) totalImpressions += (log.meterSpecialEnd - log.meterSpecialStart);
          });

          const ordered = (row.totalPrintSheets || 0) + (row.setupWaste || 0);
          const diff = totalImpressions - ordered;

          if (!logs || logs.length === 0) {
            row.meterStatus = 'ไม่มีประวัติ';
          } else if (diff <= 0) {
            row.meterStatus = `ยอดตรง/ขาด (${diff})`;
          } else {
            row.meterStatus = `เกิน (+${diff})`;
          }
        },
        error: () => {
          row.meterStatus = 'Error';
        }
      });
    });
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['/Dcsm29Detail', row.id]);
    }
  }

  add() {
    this.router.navigate(['/Dcsm29Detail']);
  }
}
