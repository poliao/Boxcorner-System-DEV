import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Dcsm29Service } from './dcsm29.service';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-dcsm29',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, DataTableComponent, FormsModule],
  templateUrl: './dcsm29.component.html',
  styleUrls: ['./dcsm29.component.scss']
})
export class Dcsm29Component implements OnInit {
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'jobId', label: 'Job ID' },
    { key: 'customerJobName', label: 'ชื่อลูกค้า/ชื่องาน' },
    { key: 'issample', label: 'เป็นงานตัวอย่าง' },
    { key: 'deliveryDate', label: 'วันที่ส่ง' },
    { key: 'jobStatus', label: 'สถานะ' },
    { key: 'printerName', label: 'เครื่องพิมพ์' },
    { key: 'totalPrintSheets', label: 'จำนวนใบพิมพ์' },
    { key: 'printSidedness', label: 'รูปแบบการพิมพ์' },
    { key: 'meterStatus', label: 'ยอดส่วนต่างมิเตอร์' }
  ];

  tableData: any[] = [];
  originalTableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  searchParams: any = {
    jobStatus: null,
    issample: null,
    customerJobName: null,
    jobId: null,
    id: null,
    meterCategory: null
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dcsm29Service: Dcsm29Service
  ) { }

  ngOnInit() {
    this.restoreState();
    this.loadData();
  }

  restoreState() {
    const savedStateStr = sessionStorage.getItem('dcsm29State');
    if (savedStateStr) {
      try {
        const state = JSON.parse(savedStateStr);
        if (state && state.pageIndex !== undefined) {
          this.pageIndex = state.pageIndex;
          this.pageSize = state.pageSize;
          this.searchParams = state.searchParams;
        }
      } catch (e) {
        console.error('Failed to parse saved state for DCSM29', e);
      }
    } else {
      // Fallback for router state
      const state = history.state;
      if (state && window.history.state && window.history.state.pageIndex !== undefined) {
        this.pageIndex = window.history.state.pageIndex;
        this.pageSize = window.history.state.pageSize;
        this.searchParams = window.history.state.searchParams;
      } else if (state && state.pageIndex !== undefined) {
        this.pageIndex = state.pageIndex;
        this.pageSize = state.pageSize;
        this.searchParams = state.searchParams;
      }
    }
  }

  saveState() {
    const state = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      searchParams: this.searchParams
    };
    sessionStorage.setItem('dcsm29State', JSON.stringify(state));
  }

  loadData() {
    this.dcsm29Service.getOrdersWithSearch(this.pageIndex, this.pageSize, this.searchParams).subscribe({
      next: (response: any) => {
        this.originalTableData = response.content.map((row: any) => {
          return {
            ...row,
            issample: row.issample === 'Yes' ? 'เป็น' : 'ไม่เป็น'
          };
        });
        this.totalElements = response.totalElements;
        this.loadMeterDataForRows();
      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });
  }

  loadMeterDataForRows() {
    if (!this.originalTableData || this.originalTableData.length === 0) {
      this.tableData = [];
      return;
    }

    const jobIds = this.originalTableData.map(row => row.id);

    this.originalTableData.forEach(row => {
      row.meterStatus = 'กำลังโหลด...';
      row.meterCategory = null;
    });

    forkJoin({
      logsBatch: this.dcsm29Service.getBatchLogs(jobIds).pipe(catchError(() => of({}))),
      extraBatch: this.dcsm29Service.getBatchExtraPrints(jobIds).pipe(catchError(() => of({})))
    }).subscribe(results => {
      const { logsBatch, extraBatch } = results as any;

      this.originalTableData.forEach(row => {
        const logs = logsBatch[row.id] || [];
        const extra = extraBatch[row.id] || [];

        let totalImpressions = 0;
        let hasFront = false;
        let hasBack = false;
        let extraPrintQuantity = 0;

        if (extra && extra.length > 0) {
          extra.forEach((e: any) => {
            if (e.status !== 'REJECTED') {
              extraPrintQuantity += e.additionalQty || 0;
            }
          });
        }

        if (logs && logs.length > 0) {
          logs.forEach((log: any) => {
            if (log.printSide === 'FRONT') hasFront = true;
            if (log.printSide === 'BACK') hasBack = true;

            let colorDiff = 0;
            let bwDiff = 0;
            let specialDiff = 0;

            if (log.meterColorEnd && log.meterColorStart) colorDiff = log.meterColorEnd - log.meterColorStart;
            if (log.meterBwEnd && log.meterBwStart) bwDiff = log.meterBwEnd - log.meterBwStart;
            if (log.meterSpecialEnd && log.meterSpecialStart) specialDiff = log.meterSpecialEnd - log.meterSpecialStart;

            totalImpressions += Math.max(colorDiff, bwDiff, specialDiff);
          });

          let ordered = (row.totalPrintSheets || 0) + (row.setupWaste || 0);

          if (hasFront && hasBack) {
            ordered = ordered * 2;
            row.printSidedness = 'หน้า-หลัง (2 หน้า)';
          } else if (hasFront) {
            row.printSidedness = 'หน้าเดียว (Front)';
          } else if (hasBack) {
            row.printSidedness = 'หน้าเดียว (Back)';
          } else {
            row.printSidedness = 'ไม่ทราบ';
          }

          ordered += extraPrintQuantity;

          const diff = totalImpressions - ordered;

          if (diff === 0) {
            row.meterStatus = 'พอดี';
            row.meterCategory = 'พอดี';
          } else if (diff < 0) {
            row.meterStatus = `ขาด (${Math.abs(diff)})`;
            row.meterCategory = 'ขาด';
          } else {
            row.meterStatus = `เกิน (+${diff})`;
            row.meterCategory = 'เกิน';
          }
        } else {
          row.meterStatus = 'ไม่มีประวัติ';
          row.meterCategory = 'ไม่มีประวัติ';
          row.printSidedness = '-';
        }
      });

      this.applyFrontendFilters();
    });
  }

  applyFrontendFilters() {
    if (this.searchParams.meterCategory) {
      this.tableData = this.originalTableData.filter(row => row.meterCategory === this.searchParams.meterCategory);
    } else {
      this.tableData = [...this.originalTableData];
    }
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.saveState();
    this.loadData();
  }

  onSearch() {
    this.pageIndex = 0;
    this.saveState();
    this.loadData();
  }

  clearSearch() {
    this.searchParams = {
      jobStatus: null,
      issample: null,
      customerJobName: null,
      jobId: null,
      id: null,
      meterCategory: null
    };
    this.saveState();
    this.onSearch();
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.saveState();
      this.router.navigate(['/Dcsm29Detail', row.id]);
    }
  }

  add() {
    this.router.navigate(['/Dcsm29Detail']);
  }
}
