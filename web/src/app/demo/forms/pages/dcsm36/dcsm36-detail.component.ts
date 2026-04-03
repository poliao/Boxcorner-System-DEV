import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm36Service } from './dcsm36.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { AuthService } from 'src/app/services/auth.service';
import { count } from 'rxjs';

@Component({
  selector: 'app-dcsm36-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm36-detail.component.html',
  styleUrls: ['./dcsm36-detail.component.scss']
})
export class Dcsm36DetailComponent implements OnInit {

  qcJobForm!: FormGroup;
  papOrderForm!: FormGroup;
  jobId: number | null = null;
  isLoading = false;
  isCompleteModalOpen = false;
  isStartModalOpen = false;
  selectedQcType = null;
  userRole: string = '';
  modalReceivedQty: number | null = null;
  usersList: any[] = [];


  activeTab: 'staff' | 'waste' = 'staff';
  qcWasteList: any[] = [];
  qcStaffList: any[] = [{ userName: '', packs: null, packsFraction: null, bundlesFraction: null, piecesFraction: null }];

  constructor(
    private fb: FormBuilder,
    private dcsm36Service: Dcsm36Service,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();

    const user = this.authService.getUserFromToken();
    if (user && user.role) {
      this.userRole = user.role.toLowerCase();
    }
    this.loadDropdown();
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.jobId = +idStr;
        this.loadJobDetails(this.jobId);
      }
    });
  }

  initForm() {
    this.qcJobForm = this.fb.group({
      id: [null],
      status: [null],
      joId: [null],
      jobName: [null],
      responsibleName: [null],
      deliveryDatetime: [null],
      productJobId: [null],
      papOrderId: [null],
      receivedQty: [null],
      passedQty: [null],
      bundlesPerPack: [null],
      boxesPerBundle: [null],
      passedQtyFraction: [null],
      bundlesPerPackFraction: [null],
      piecesFraction: [null],
      qcType: [null],
      startQcDatetime: [null],
      createdAt: [null],
      updatedAt: [null],
      qcDetail: [null],
      partName: [null]
    });

    this.papOrderForm = this.fb.group({
      qcRequiredQty: [''],
      orderedBy: [''],
      qcQa: [''],
      sale: [''],
      jobName: [''],
      qcDetail: [''],
      qcBookletSt: [''],
      qcNote: [''],
    });

    this.qcJobForm.disable();
    this.papOrderForm.disable();
  }

  loadJobDetails(id: number) {
    this.loadingService.show();
    this.dcsm36Service.getQcJobById(id).subscribe({
      next: (job) => {
        if (job.deliveryDatetime) job.deliveryDatetime = this.formatDate(job.deliveryDatetime);
        if (job.createdAt) job.createdAt = this.formatDate(job.createdAt);
        if (job.updatedAt) job.updatedAt = this.formatDate(job.updatedAt);

        this.qcJobForm.patchValue(job);

        if (job.papOrderId) {
          this.loadPapOrderDetails(job.papOrderId);
        } else {
          this.loadingService.hide();
        }
      },
      error: (err) => {
        console.error('Error loading QC job details', err);
        this.sweetAlert.error('Error', 'ไม่สามารถโหลดข้อมูลงาน QC ได้');
        this.loadingService.hide();
        this.goBack();
      }
    });
  }

  formatDate(dateStr: any): string {
    if (!dateStr) return '-';
    try {
      if (dateStr.includes('T')) {
        const [datePart, timePart] = dateStr.split('T');
        const [y, m, d] = datePart.split('-');
        const time = timePart.substring(0, 5);
        return `${d}/${m}/${y} ${time}`;
      }
      if (dateStr.includes('-')) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }
  loadPapOrderDetails(papOrderId: string) {
    const numericId = parseInt(papOrderId, 10);
    if (isNaN(numericId)) {
      this.loadingService.hide();
      return;
    }

    this.dcsm36Service.getPapOrderById(numericId).subscribe({
      next: (papData) => {
        this.papOrderForm.patchValue(papData);
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
      }
    });
  }

  startQc() {
    this.modalReceivedQty = this.qcJobForm.get('receivedQty')?.value;
    this.isStartModalOpen = true;
  }

  closeStartModal() {
    this.isStartModalOpen = false;
    this.modalReceivedQty = null;
  }

  onSubmitStart() {
    if (!this.modalReceivedQty || this.modalReceivedQty <= 0) {
      this.sweetAlert.error('Error', 'กรุณากรอกจำนวนที่ถูกต้อง');
      return;
    }

    const operatorName = this.authService.getFullName();
    this.loadingService.show();

    this.dcsm36Service.startQc(this.jobId!, this.modalReceivedQty, operatorName, this.qcJobForm.getRawValue().qcType).subscribe({
      next: () => {
        this.sweetAlert.success('สำเร็จ', 'เริ่มงาน QC เรียบร้อยแล้ว');
        this.closeStartModal();
        this.loadJobDetails(this.jobId!);
      },
      error: (err) => {
        console.error('Error starting QC', err);
        this.sweetAlert.error('Error', 'ไม่สามารถเริ่มงาน QC ได้');
        this.loadingService.hide();
      }
    });
  }

  completeQc() {
    this.isCompleteModalOpen = true;
    this.activeTab = 'staff';
    this.qcStaffList = [{ userName: null, packs: null, packsFraction: null, bundlesFraction: null, piecesFraction: null }];
    this.qcWasteList = [{ processName: null, wasteQty: null, remarks: null }];

  }

  closeCompleteModal() {
    this.isCompleteModalOpen = false;
  }

  addStaffRow() {
    this.qcStaffList.push({ userName: null, packs: null, packsFraction: null, bundlesFraction: null, piecesFraction: null });
  }

  removeStaffRow(index: number) {
    if (this.qcStaffList.length > 1) {
      this.qcStaffList.splice(index, 1);
    }
  }

  addWasteRow() {
    this.qcWasteList.push({ processName: null, wasteQty: null, remarks: null });
  }

  removeWasteRow(index: number) {
    if (this.qcWasteList.length > 1) {
      this.qcWasteList.splice(index, 1);
    }
  }


  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }

  onSubmitComplete() {
    const passedQtyInput = document.getElementById('modalPassedQty') as HTMLInputElement;
    const bundlesInput = document.getElementById('modalBundlesPerPack') as HTMLInputElement;
    const boxesInput = document.getElementById('modalBoxesPerBundle') as HTMLInputElement;
    const passedQtyFractionInput = document.getElementById('modalPassedQtyFraction') as HTMLInputElement;
    const bundlesPerPackFractionInput = document.getElementById('modalBundlesPerPackFraction') as HTMLInputElement;
    const piecesFractionInput = document.getElementById('modalPiecesFraction') as HTMLInputElement;

    for (let i = 0; i < this.qcStaffList.length; i++) {
      if (!this.qcStaffList[i].userName) {
        this.sweetAlert.error('Error', `กรุณาเลือกผู้ QC ในแถวที่ ${i + 1}`);
        return;
      }
    }

    for (const staff of this.qcStaffList) {
      staff.packs = this.parseNumber(staff.packs);
      staff.packsFraction = this.parseNumber(staff.packsFraction);
      staff.bundlesFraction = this.parseNumber(staff.bundlesFraction);
      staff.piecesFraction = this.parseNumber(staff.piecesFraction);
    }

    for (const waste of this.qcWasteList) {
      waste.wasteQty = this.parseNumber(waste.wasteQty);
    }

    const data = {
      id: this.jobId,
      passedQty: this.parseNumber(passedQtyInput.value),
      bundlesPerPack: this.parseNumber(bundlesInput.value),
      boxesPerBundle: this.parseNumber(boxesInput.value),
      passedQtyFraction: this.parseNumber(passedQtyFractionInput?.value),
      bundlesPerPackFraction: this.parseNumber(bundlesPerPackFractionInput?.value),
      piecesFraction: this.parseNumber(piecesFractionInput?.value),
      staffList: this.qcStaffList.filter(s => s.userName).map(s => {
        return {
          userName: s.userName,
          packs: s.packs,
          packsFraction: s.packsFraction,
          bundlesFraction: s.bundlesFraction,
          piecesFraction: s.piecesFraction
        };
      }),
      wasteReportList: this.qcWasteList.filter(w => w.processName),
    };

    this.loadingService.show();
    this.dcsm36Service.completeQc(data).subscribe({
      next: () => {
        this.updateCompletedStatusProductionJob();
        this.sweetAlert.success('สำเร็จ', 'บันทึกข้อมูล QC เสร็จสิ้นแล้ว');
        this.closeCompleteModal();
        this.loadJobDetails(this.jobId!);
      },
      error: (err) => {
        console.error('Error completing QC', err);
        this.sweetAlert.error('Error', 'ไม่สามารถบันทึกข้อมูล QC ได้');
        this.loadingService.hide();
      }
    });
  }

  goBack() {
    this.router.navigate(['/Dcsm36']);
  }

  updateCompletedStatusProductionJob() {
    this.dcsm36Service.getByIdProductionJob(this.qcJobForm.getRawValue().productJobId).subscribe({
      next: (data) => {
        data.printStatus = 'เสร็จสิ้น'
        this.dcsm36Service.updateProductionJob(data).subscribe({
          next: (updateResponse) => {
          },
        })
      },
      error: (err) => {
        console.error('Error fetching production job:', err);
      }
    });
  }

  dowloadReportQc() {
    this.loadingService.show();
    let data;
    if (this.qcJobForm.get('qcType')?.value == 'Qc STK') {
      data = {
        "reportName": "QcSTKReport",
        "jobId": this.qcJobForm.get('id')?.value,
      }
    } else {
      data = {
        "reportName": "QcReport",
        "jobId": this.qcJobForm.get('id')?.value,
      }
    }
    this.dcsm36Service.printReport(data).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'QcReport.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error printing report:', err);
        this.loadingService.hide();
      }
    });
  }

  printReportQc() {
    this.loadingService.show();
    let data;
    if (this.qcJobForm.get('qcType')?.value == 'Qc STK') {
      data = {
        "reportName": "QcSTKReport",
        "jobId": this.qcJobForm.get('id')?.value,
      }
    } else {
      data = {
        "reportName": "QcReport",
        "jobId": this.qcJobForm.get('id')?.value,
      }
    }

    this.dcsm36Service.printReport(data).subscribe({
      next: (response) => {
        this.loadingService.hide();
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        iframe.onload = () => {
          setTimeout(() => {
            iframe.contentWindow?.print();
          }, 100);
        };
        document.body.appendChild(iframe);
      },
      error: (err) => {
        console.error('Error printing report:', err);
        this.loadingService.hide
      }
    });
  }

  loadDropdown() {
    this.loadingService.show();
    if (this.userRole == 'stam') {
      this.dcsm36Service.DropdownList('OD').subscribe({
        next: (data) => {
          this.usersList = data;
          this.loadingService.hide();
        },
        error: () => this.loadingService.hide()
      });
    } else if (this.userRole == 'qc') {
      this.dcsm36Service.DropdownList('QC').subscribe({
        next: (data) => {
          this.usersList = data;
          this.loadingService.hide();
        },
        error: () => this.loadingService.hide()
      });
    }else {
      this.dcsm36Service.DropdownList('').subscribe({
        next: (data) => {
          this.usersList = data;
          this.loadingService.hide();
        },
        error: () => this.loadingService.hide()
      });
    }
  }
}
