import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm25Service } from './dcsm25.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm25',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatDialogModule, DataTableComponent],
  templateUrl: './dcsm25.component.html',
  styleUrls: ['./dcsm25.component.scss']
})
export class Dcsm25Component implements OnInit {

  showCalibrateModal = false;
  calibrateData = {
    printerId: null,
    meterColorStart: null,
    meterColorEnd: null,
    meterBwStart: null,
    meterBwEnd: null,
    note: null
  };
  printers: any[] = [];
  repairPrinterForm!: FormGroup;

  filterId: string = null;
  filterJobId: string = null;
  filterCustomerName: string = null;
  filterPrinterName: string = null;
  filterIssample: string = null;
  filterPrintStatus: string = null;
  filterStartDate: string = null;
  filterEndDate: string = null;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  tableData: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'jobId', label: 'JOB ID' },
    { key: 'customerJobName', label: 'ชื่อลูกค้า/ชื่องาน' },
    { key: 'deliveryDate', label: 'วันที่ส่งพิมพ์', },
    { key: 'printerName', label: 'พิมพ์ที่', },
    { key: 'issample', label: 'เป็นตัวอย่าง' },
    { key: 'extraPrintCount', label: 'พิมพ์เพิ่ม' },
    { key: 'jobStatus', label: 'สถานะงาน', colorFunction: this.statusColorService.getStatusColor.bind(this.statusColorService) },
  ];

  rowStyles(row: any) {
    if (row.hasRealJob && row.jobStatus === 'COMPLETED') {
      return { 'background-color': '#fff3cd' };
    }
    if (row.isClosedSample) {
      return { 'background-color': '#f0f0f0', 'color': '#888', 'opacity': '0.7' };
    }
    return {};
  }


  constructor(
    private fb: FormBuilder,
    private dcsm25Service: Dcsm25Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private statusColorService: StatusColorService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createRepairPrinterForm();
    this.loadData();
  }

  createRepairPrinterForm() {
    this.repairPrinterForm = this.fb.group({
      printerName: [null, Validators.required],
      meterColorStart: [null, Validators.required],
      meterColorEnd: [null, Validators.required],
      meterBwStart: [null, Validators.required],
      meterBwEnd: [null, Validators.required],
      meterSpecialStart: [null],
      meterSpecialEnd: [null],
      note: ['ซ่อมเครื่อง']
    });

    this.repairPrinterForm.get('printerName')?.valueChanges.subscribe(val => {
      if (val === 'Ricoh') {
        this.repairPrinterForm.get('meterSpecialStart')?.setValidators([Validators.required]);
        this.repairPrinterForm.get('meterSpecialEnd')?.setValidators([Validators.required]);
      } else {
        this.repairPrinterForm.get('meterSpecialStart')?.clearValidators();
        this.repairPrinterForm.get('meterSpecialEnd')?.clearValidators();
        this.repairPrinterForm.get('meterSpecialStart')?.setValue(null);
        this.repairPrinterForm.get('meterSpecialEnd')?.setValue(null);
      }
      this.repairPrinterForm.get('meterSpecialStart')?.updateValueAndValidity();
      this.repairPrinterForm.get('meterSpecialEnd')?.updateValueAndValidity();
    });
  }

  loadData() {
    this.loadingService.show();
    const filters = {
      id: this.filterId,
      jobId: this.filterJobId,
      customerJobName: this.filterCustomerName,
      printerName: this.filterPrinterName,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate,
      issample: this.filterIssample,
      jobStatus: this.filterPrintStatus
    };

    this.dcsm25Service.getOrdersWithSearch(this.pageIndex, this.pageSize, filters)
      .subscribe({
        next: (response: any) => {
          const jobs = response.content.map((item: any) => ({
            ...item,
            date: this.formatDate(item.date),
            printingDate: this.formatDate(item.printingDate),
            coatingDate: this.formatDate(item.coatingDate),
            stampingDate: this.formatDate(item.stampingDate),
            gluingDate: this.formatDate(item.gluingDate),
            qcDate: this.formatDate(item.qcDate),
            dueDate: this.formatDate(item.dueDate),
            issample: item.issample ? 'เป็น' : 'ไม่เป็น',
            isExtraPrint: false,
            isClosedSample: item.issample && item.jobStatus === 'COMPLETED' && !!item.productionOrderId,
            hasRealJob: item.hasRealJob
          }));
          console.log(jobs);
          
          // Load extra prints for each job
          this.loadExtraPrints(jobs);

          this.totalElements = response.totalElements;
          this.loadingService.hide();
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.loadingService.hide();
          this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
      });
  }

  loadExtraPrints(jobs: any[]) {
    const extraPrintRequests = jobs
      .filter(job => typeof job.id === 'number' && !isNaN(job.id))
      .map(job =>
        this.dcsm25Service.getExtraPrintsByJobId(job.id)
      );

    Promise.all(extraPrintRequests.map(req => req.toPromise()))
      .then(results => {
        const validJobs = jobs.filter(job => typeof job.id === 'number' && !isNaN(job.id));

        results.forEach((extraPrints: any[], index) => {
          const job = validJobs[index];
          // เพิ่ม extraPrints เป็น property ของงานหลัก
          job.extraPrints = extraPrints || [];
          job.extraPrintCount = extraPrints ? extraPrints.length : 0;
        });

        this.tableData = jobs;
      })
      .catch(err => {
        console.error('Error loading extra prints:', err);
        this.tableData = jobs;
      });
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

  onRowClick(row: any) {
    if (row && row.id && typeof row.id === 'number') {
      this.router.navigate(['/Dcsm25Detail', row.id]);
    }
  }

  clearAllFilters() {
    this.filterId = '';
    this.filterJobId = '';
    this.filterCustomerName = '';
    this.filterPrinterName = '';
    this.filterIssample = '';
    this.filterPrintStatus = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.onSearchChange();
  }

  openCalibrateModal() {
    this.loadPrinters();
    this.showCalibrateModal = true;
  }

  closeCalibrateModal() {
    this.showCalibrateModal = false;
    this.calibrateData = {
      printerId: null,
      meterColorStart: null,
      meterColorEnd: null,
      meterBwStart: null,
      meterBwEnd: null,
      note: null
    };
  }

  loadPrinters() {
    this.dcsm25Service.getPrinters().subscribe({
      next: (data) => this.printers = data,
      error: (err) => console.error('Error loading printers:', err)
    });
  }

  submitCalibrate() {
    if (!this.calibrateData.printerId) {
      this.sweetAlert.warning('คำเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    const payload = {
      printerId: this.calibrateData.printerId,
      printSide: 'CALIBRATE',
      logType: 'CALIBRATE',
      meterColorStart: this.calibrateData.meterColorStart,
      meterColorEnd: this.calibrateData.meterColorEnd,
      meterBwStart: this.calibrateData.meterBwStart,
      meterBwEnd: this.calibrateData.meterBwEnd,
      note: this.calibrateData.note
    };

    this.dcsm25Service.saveCalibrate(payload).subscribe({
      next: () => {
        this.loadingService.hide();
        this.sweetAlert.success('สำเร็จ', 'บันทึก Calibrate เรียบร้อย');
        this.closeCalibrateModal();
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('ผิดพลาด', 'ไม่สามารถบันทึก Calibrate ได้');
        console.error('Error saving calibrate:', err);
      }
    });
  }

  saveRepairLog() {
    if (this.repairPrinterForm.invalid) {
      this.repairPrinterForm.markAllAsTouched();
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const formVal = this.repairPrinterForm.getRawValue();
    const printerId = formVal.printerName === 'Canon' ? 2 : 1;

    // Step 1: Start Print Log (LogType = REPAIR)
    const startData = {
      jobId: null,
      printerId: printerId,
      printSide: 'REPAIR',
      logType: 'REPAIR',
      meterColorStart: formVal.meterColorStart,
      meterBwStart: formVal.meterBwStart,
      meterSpecialStart: formVal.meterSpecialStart,
      printerName: formVal.printerName
    };

    this.dcsm25Service.startPrintLog(startData).subscribe({
      next: (responseLog) => {
        // Step 2: Stop Print Log to record End meters
        const stopData = {
          logId: responseLog.logId,
          action: 'COMPLETED',
          meterColorEnd: formVal.meterColorEnd,
          meterBwEnd: formVal.meterBwEnd,
          meterSpecialEnd: formVal.meterSpecialEnd,
          note: formVal.note
        };
        this.dcsm25Service.stopPrintLog(stopData).subscribe({
          next: () => {
            this.sweetAlert.success('Success', 'บันทึกประวัติซ่อมเครื่องเรียบร้อย');
            this.repairPrinterForm.reset({ note: 'ซ่อมเครื่อง' });
            // Close modal using raw DOM
            const closeBtn = document.getElementById('closeRepairModalBtn');
            if (closeBtn) {
              closeBtn.click();
            }
          },
          error: (err) => {
            this.sweetAlert.error('Error', err.error?.error || 'Failed to complete repair log');
          }
        });
      },
      error: (err) => {
        this.sweetAlert.error('Error', err.error?.error || 'Failed to start repair log');
      }
    });
  }
}

