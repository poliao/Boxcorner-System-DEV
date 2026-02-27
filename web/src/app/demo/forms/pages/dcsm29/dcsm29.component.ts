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
import { StatusColorService } from 'src/app/shared/services/status-color.service';

@Component({
  selector: 'app-dcsm29',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, DataTableComponent, FormsModule],
  templateUrl: './dcsm29.component.html',
  styleUrls: ['./dcsm29.component.scss']
})
export class Dcsm29Component implements OnInit {
  tableColumns = [
    { key: 'id', label: 'Job ID (DB)' },
    { key: 'jobId', label: 'Job ID' },
    { key: 'issampleStr', label: 'เป็นงานตัวอย่าง' },
    { key: 'jobStatusStr', label: 'สถานะงาน', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },
    { key: 'printerBrandsStr', label: 'เครื่องพิมพ์' },
    { key: 'totalPrintSheets', label: 'จำนวนพิมพ์' },
    { key: 'meterStatus', label: 'สถานะยอดมิเตอร์' }
  ];

  miscTableColumns = [
    { key: 'id', label: 'Log ID' },
    { key: 'jobId', label: 'ประเภท' },
    { key: 'printerBrandsStr', label: 'เครื่องพิมพ์' },
    { key: 'totalPrintSheets', label: 'ยอดมิเตอร์' }
  ];

  tableData: any[] = [];
  originalTableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  searchParams: any = {
    jobStatus: 'COMPLETED',
    issample: null,
    customerJobName: null,
    jobId: null,
    id: null,
    startDate: '',
    endDate: ''
  };

  summaryCanon: any = null;
  summaryRicoh: any = null;
  miscLogsData: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dcsm29Service: Dcsm29Service,
    private statusColorService: StatusColorService
  ) { }

  ngOnInit() {
    this.restoreState();
    this.loadData();
    this.loadStandaloneLogs();
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
        this.originalTableData = response.content.map((job: any) => {
          return {
            ...job,
            issampleStr: job.issample ? 'เป็น' : 'ไม่เป็น',
            jobStatusStr: job.jobStatus || '-',
            printerBrandsStr: 'กำลังโหลด...',
            meterStatus: 'กำลังโหลด...'
          };
        });

        this.totalElements = response.totalElements;

        if (this.originalTableData.length > 0) {
          const jobIds = this.originalTableData.map((r: any) => r.id);

          forkJoin({
            extraBatch: this.dcsm29Service.getBatchExtraPrints(jobIds),
            logsBatch: this.dcsm29Service.getBatchLogs(jobIds)
          }).subscribe({
            next: ({ extraBatch, logsBatch }: any) => {
              this.originalTableData.forEach(row => {
                const extra = extraBatch[row.id] || [];
                const allLogs = logsBatch[row.id] || [];

                // คำนวณ printerBrandsStr จาก brand ของ printer ใน logs
                const brands = new Set<string>();
                allLogs.forEach((l: any) => {
                  if (l.printer && l.printer.brand) {
                    brands.add(l.printer.brand);
                  }
                });
                const brandList = Array.from(brands);
                if (brandList.length === 0) {
                  row.printerBrandsStr = row.printerName || '-';
                } else if (brandList.length === 1) {
                  row.printerBrandsStr = brandList[0] === 'CANON' ? 'Canon' : (brandList[0] === 'RICOH' ? 'Ricoh' : brandList[0]);
                } else {
                  row.printerBrandsStr = 'Canon/Ricoh';
                }

                // คำนวณ extraPrintQuantity
                let extraPrintQuantity = 0;
                extra.forEach((e: any) => {
                  if (e.status !== 'REJECTED') {
                    extraPrintQuantity += e.additionalQty || 0;
                  }
                });

                // คำนวณ ordered quantity
                let ordered = (row.totalPrintSheets || 0) + (row.setupWaste || 0);

                let hasFront = false;
                let hasBack = false;
                let jobTotalImpressions = 0;

                allLogs.forEach((l: any) => {
                  if (l.printSide === 'FRONT') hasFront = true;
                  if (l.printSide === 'BACK') hasBack = true;

                  let colorD = 0, bwD = 0, specialD = 0;
                  if (l.meterColorEnd && l.meterColorStart) colorD = l.meterColorEnd - l.meterColorStart;
                  if (l.meterBwEnd && l.meterBwStart) bwD = l.meterBwEnd - l.meterBwStart;
                  if (l.meterSpecialEnd && l.meterSpecialStart) specialD = l.meterSpecialEnd - l.meterSpecialStart;
                  jobTotalImpressions += Math.max(colorD, bwD, specialD);
                });

                if (hasFront && hasBack) {
                  ordered = ordered * 2;
                }
                ordered += extraPrintQuantity;

                if (allLogs.length === 0) {
                  row.meterStatus = '-';
                } else if (ordered === 0) {
                  row.meterStatus = '-';
                } else {
                  const diff = jobTotalImpressions - ordered;
                  if (diff === 0) {
                    row.meterStatus = 'ปกติ';
                  } else if (diff < 0) {
                    row.meterStatus = `ขาด ${Math.abs(diff)}`;
                  } else {
                    row.meterStatus = `เกิน ${diff}`;
                  }
                }
              });
              this.tableData = [...this.originalTableData];
            },
            error: () => {
              this.tableData = [...this.originalTableData];
            }
          });
        } else {
          this.tableData = [];
        }
      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });

    this.dcsm29Service.getLogSummary(this.searchParams).subscribe({
      next: (res: any[]) => {
        this.summaryCanon = { totalClicks: 0, colorMin: 0, colorMax: 0, bwMin: 0, bwMax: 0, specialMin: 0, specialMax: 0 };
        this.summaryRicoh = { totalClicks: 0, colorMin: 0, colorMax: 0, bwMin: 0, bwMax: 0, specialMin: 0, specialMax: 0 };

        if (res && res.length > 0) {
          res.forEach(item => {
            const colorDiff = (Number(item.maxcolorend) || 0) - (Number(item.mincolorstart) || 0);
            const bwDiff = (Number(item.maxbwend) || 0) - (Number(item.minbwstart) || 0);
            const specialDiff = (Number(item.maxspecialend) || 0) - (Number(item.minspecialstart) || 0);
            const data = {
              printerNames: item.printernames || '',
              totalClicks: colorDiff + bwDiff + specialDiff,
              colorMin: Number(item.mincolorstart) || 0,
              colorMax: Number(item.maxcolorend) || 0,
              bwMin: Number(item.minbwstart) || 0,
              bwMax: Number(item.maxbwend) || 0,
              specialMin: Number(item.minspecialstart) || 0,
              specialMax: Number(item.maxspecialend) || 0
            };

            if (item.brand === 'CANON') {
              this.summaryCanon = data;
            } else if (item.brand === 'RICOH') {
              this.summaryRicoh = data;
            }
          });
        }
      },
      error: (err) => {
        console.error('Error loading summary:', err);
      }
    });

  }

  applyFrontendFilters() {
    // Data is already filtered by backend
    this.tableData = [...this.originalTableData];
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
    this.loadStandaloneLogs();
  }

  loadStandaloneLogs() {
    this.dcsm29Service.getStandaloneLogs(this.searchParams).subscribe({
      next: (logs: any[]) => {
        this.miscLogsData = (logs || []).map((log: any) => {
          const colorUsage = (log.meterColorEnd && log.meterColorStart) ? log.meterColorEnd - log.meterColorStart : 0;
          const bwUsage = (log.meterBwEnd && log.meterBwStart) ? log.meterBwEnd - log.meterBwStart : 0;
          const specialUsage = (log.meterSpecialEnd && log.meterSpecialStart) ? log.meterSpecialEnd - log.meterSpecialStart : 0;
          return {
            _isStandaloneLog: true,
            id: log.id,
            jobId: log.logType === 'CALIBRATE' ? 'Calibrate' : (log.logType === 'REPAIR' ? 'ซ่อมเครื่อง' : log.logType),
            issampleStr: '-',
            jobStatusStr: '-',
            printerBrandsStr: log.printer ? (log.printer.name || log.printer.printerName || '-') : '-',
            totalPrintSheets: `Color:${colorUsage} / B&W:${bwUsage}${specialUsage ? ' / Sp:' + specialUsage : ''}`,
            meterStatus: '-'
          };
        });
      },
      error: () => { this.miscLogsData = []; }
    });
  }

  clearSearch() {
    this.searchParams = {
      jobStatus: 'COMPLETED',
      issample: null,
      customerJobName: null,
      jobId: null,
      id: null,
      startDate: '',
      endDate: ''
    };
    this.summaryCanon = null;
    this.summaryRicoh = null;
    this.saveState();
    this.onSearch();
  }

  onRowClick(row: any) {
    if (row && row.id && !row._isStandaloneLog) {
      this.saveState();
      this.router.navigate(['/Dcsm29Detail', row.id]);
    }
  }

  add() {
    this.router.navigate(['/Dcsm29Detail']);
  }
}
