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
    { key: 'id', label: 'Log ID' },
    { key: 'jobIdStr', label: 'Job ID' },
    { key: 'customerJobNameStr', label: 'ชื่อลูกค้า/รายละเอียด' },
    { key: 'logType', label: 'ประเภทการพิมพ์' },
    { key: 'issample', label: 'เป็นงานตัวอย่าง' },
    { key: 'jobStatus', label: 'สถานะงาน', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },
    { key: 'printerNameStr', label: 'เครื่องพิมพ์' },
    { key: 'startedAtStr', label: 'เวลาเริ่ม' },
    { key: 'endedAtStr', label: 'เวลาจบ' },
    { key: 'totalImpressions', label: 'ยอดมิเตอร์ที่ใช้' },
    { key: 'meterStatus', label: 'สถานะยอดมิเตอร์' }
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
    startDate: '',
    endDate: ''
  };

  summaryCanon: any = null;
  summaryRicoh: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dcsm29Service: Dcsm29Service,
    private statusColorService: StatusColorService
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
        this.originalTableData = response.content.map((log: any) => {
          const job = log.job;
          let colorDiff = 0, bwDiff = 0, specialDiff = 0;
          if (log.meterColorEnd && log.meterColorStart) colorDiff = log.meterColorEnd - log.meterColorStart;
          if (log.meterBwEnd && log.meterBwStart) bwDiff = log.meterBwEnd - log.meterBwStart;
          if (log.meterSpecialEnd && log.meterSpecialStart) specialDiff = log.meterSpecialEnd - log.meterSpecialStart;
          const totalUsage = Math.max(colorDiff, bwDiff, specialDiff);

          return {
            ...log,
            jobIdNum: job ? job.id : null,
            jobIdStr: job ? job.jobId : (log.logType === 'REPAIR' ? 'ซ่อมเครื่อง' : (log.logType === 'CALIBRATE' ? 'Calibrate' : '-')),
            customerJobNameStr: job ? job.customerJobName : (log.note || '-'),
            issample: job && job.issample ? 'เป็น' : 'ไม่เป็น',
            jobStatus: job ? job.jobStatus : '-',
            printerNameStr: log.printer ? log.printer.printerName : '-',
            startedAtStr: log.startedAt ? new Date(log.startedAt).toLocaleString('th-TH') : '-',
            endedAtStr: log.endedAt ? new Date(log.endedAt).toLocaleString('th-TH') : 'กำลังพิมพ์',
            totalImpressions: totalUsage,
            meterStatus: 'กำลังโหลด...'
          };
        });

        this.totalElements = response.totalElements;

        if (this.originalTableData.length > 0) {
          const jobIds = [...new Set(this.originalTableData.filter(r => r.jobIdNum).map(r => r.jobIdNum))];

          if (jobIds.length > 0) {
            forkJoin({
              extraBatch: this.dcsm29Service.getBatchExtraPrints(jobIds),
              logsBatch: this.dcsm29Service.getBatchLogs(jobIds)
            }).subscribe({
              next: ({ extraBatch, logsBatch }: any) => {
                this.originalTableData.forEach(row => {
                  if (row.jobIdNum) {
                    const extra = extraBatch[row.jobIdNum] || [];
                    const allLogs = logsBatch[row.jobIdNum] || [];

                    let extraPrintQuantity = 0;
                    if (extra && extra.length > 0) {
                      extra.forEach((e: any) => {
                        if (e.status !== 'REJECTED') {
                          extraPrintQuantity += e.additionalQty || 0;
                        }
                      });
                    }

                    const job = row.job;
                    let ordered = job ? (job.totalPrintSheets || 0) + (job.setupWaste || 0) : 0;

                    let hasFront = false;
                    let hasBack = false;
                    let jobTotalImpressions = 0;

                    if (allLogs && allLogs.length > 0) {
                      allLogs.forEach((l: any) => {
                        if (l.printSide === 'FRONT') hasFront = true;
                        if (l.printSide === 'BACK') hasBack = true;

                        let colorD = 0;
                        let bwD = 0;
                        let specialD = 0;
                        if (l.meterColorEnd && l.meterColorStart) colorD = l.meterColorEnd - l.meterColorStart;
                        if (l.meterBwEnd && l.meterBwStart) bwD = l.meterBwEnd - l.meterBwStart;
                        if (l.meterSpecialEnd && l.meterSpecialStart) specialD = l.meterSpecialEnd - l.meterSpecialStart;

                        jobTotalImpressions += Math.max(colorD, bwD, specialD);
                      });
                    }

                    if (hasFront && hasBack) {
                      ordered = ordered * 2;
                    }

                    ordered += extraPrintQuantity;

                    if (ordered === 0) {
                      row.meterStatus = '-';
                    } else {
                      const diff = jobTotalImpressions - ordered;
                      if (diff === 0) {
                        row.meterStatus = 'พอดี';
                      } else if (diff < 0) {
                        row.meterStatus = `ขาด (${Math.abs(diff)})`;
                      } else {
                        row.meterStatus = `เกิน (+${diff})`;
                      }
                    }

                  } else {
                    row.meterStatus = '-'; // For Calibrate / Repair
                  }
                });
                this.tableData = [...this.originalTableData];
              },
              error: () => {
                this.tableData = [...this.originalTableData];
              }
            });
          } else {
            this.tableData = [...this.originalTableData];
          }
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
            const data = {
              totalClicks: (Number(item.sumcolor) || 0) + (Number(item.sumbw) || 0) + (Number(item.sumspecial) || 0),
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
  }

  clearSearch() {
    this.searchParams = {
      jobStatus: null,
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
    if (row && row.jobIdNum) {
      this.saveState();
      this.router.navigate(['/Dcsm29Detail', row.jobIdNum]);
    }
  }

  add() {
    this.router.navigate(['/Dcsm29Detail']);
  }
}
