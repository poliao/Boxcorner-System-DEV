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
  selectedQcType = 'ปะ+QC';
  modalReceivedQty: number | null = null;
  usersList: any[] = [];
  activeTab: 'staff' | 'waste' = 'staff';
  qcWasteList: any[] = [];
  qcStaffList: any[] = [{ userId: '', userName: '', packs: null, bundles: null, packsFraction: null, bundlesFraction: null, piecesFraction: null }];

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
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.jobId = +idStr;
        this.loadJobDetails(this.jobId);
        this.loadUsers();
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
      createdAt: [null],
      updatedAt: [null]
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

  loadUsers() {
    this.dcsm36Service.getAllUsers().subscribe({
      next: (users) => {
        this.usersList = users;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
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
    this.selectedQcType = null;
    this.modalReceivedQty = null;
  }

  onSubmitStart() {
    if (!this.modalReceivedQty || this.modalReceivedQty <= 0) {
      this.sweetAlert.error('Error', 'กรุณากรอกจำนวนที่ถูกต้อง');
      return;
    }

    const operatorName = this.authService.getFullName();
    this.loadingService.show();

    this.dcsm36Service.startQc(this.jobId!, this.modalReceivedQty, operatorName, this.selectedQcType).subscribe({
      next: () => {
        this.updateQcStatusProductionJob(this.selectedQcType);
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
    this.qcStaffList = [{ userId: '', userName: '', packs: null, bundles: null, packsFraction: null, bundlesFraction: null, piecesFraction: null }];
    this.qcWasteList = [{ processName: '', technicianName: '', wasteQty: null, remarks: '' }];
  }

  closeCompleteModal() {
    this.isCompleteModalOpen = false;
  }

  addStaffRow() {
    this.qcStaffList.push({ userId: '', userName: '', packs: null, bundles: null, packsFraction: null, bundlesFraction: null, piecesFraction: null });
  }

  removeStaffRow(index: number) {
    if (this.qcStaffList.length > 1) {
      this.qcStaffList.splice(index, 1);
    }
  }

  addWasteRow() {
    this.qcWasteList.push({ processName: '', technicianName: '', wasteQty: null, remarks: '' });
  }

  removeWasteRow(index: number) {
    if (this.qcWasteList.length > 1) {
      this.qcWasteList.splice(index, 1);
    }
  }

  onStaffUserChange(index: number, event: any) {
    const userId = event.target.value;
    const user = this.usersList.find(u => u.value === userId);
    if (user) {
      this.qcStaffList[index].userId = parseInt(userId, 10);
      this.qcStaffList[index].userName = user.text;
    }
  }

  onSubmitComplete() {
    const passedQtyInput = document.getElementById('modalPassedQty') as HTMLInputElement;
    const bundlesInput = document.getElementById('modalBundlesPerPack') as HTMLInputElement;
    const boxesInput = document.getElementById('modalBoxesPerBundle') as HTMLInputElement;

    const passedQtyFractionInput = document.getElementById('modalPassedQtyFraction') as HTMLInputElement;
    const bundlesPerPackFractionInput = document.getElementById('modalBundlesPerPackFraction') as HTMLInputElement;
    const piecesFractionInput = document.getElementById('modalPiecesFraction') as HTMLInputElement;

    const passedQty = parseInt(passedQtyInput.value, 10);
    const bundlesPerPack = parseInt(bundlesInput.value, 10);
    const boxesPerBundle = parseInt(boxesInput.value, 10);

    const passedQtyFraction = parseInt(passedQtyFractionInput?.value, 10) || 0;
    const bundlesPerPackFraction = parseInt(bundlesPerPackFractionInput?.value, 10) || 0;
    const piecesFraction = parseInt(piecesFractionInput?.value, 10) || 0;

    if (isNaN(passedQty) || passedQty < 0) {
      this.sweetAlert.error('Error', 'กรุณากรอกจำนวนห่อเต็มที่ถูกต้อง');
      return;
    }
    if (isNaN(bundlesPerPack) || bundlesPerPack <= 0) {
      this.sweetAlert.error('Error', 'กรุณากรอกจำนวนแพคต่อห่อที่ถูกต้อง');
      return;
    }
    if (isNaN(boxesPerBundle) || boxesPerBundle <= 0) {
      this.sweetAlert.error('Error', 'กรุณากรอกจำนวนชิ้นต่อแพคที่ถูกต้อง');
      return;
    }

    // Validate staff list
    for (const staff of this.qcStaffList) {
      staff.packsFraction = parseInt(staff.packsFraction, 10) || null;
      staff.bundlesFraction = parseInt(staff.bundlesFraction, 10) || null;
      staff.piecesFraction = parseInt(staff.piecesFraction, 10) || null;
    }

    const data = {
      id: this.jobId,
      passedQty,
      bundlesPerPack,
      boxesPerBundle,
      passedQtyFraction,
      bundlesPerPackFraction,
      piecesFraction,
      staffList: this.qcStaffList.filter(s => s.userId),
      wasteReportList: this.qcWasteList.filter(w => w.processName)
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

  updateQcStatusProductionJob(qcType: string) {
    this.dcsm36Service.getByIdProductionJob(this.qcJobForm.getRawValue().productJobId).subscribe({
      next: (data) => {
        data.printStatus = 'เริ่มQc (' + qcType + ')';
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
    const data = {
      "reportName": "QcReport",
      "jobId": this.qcJobForm.get('joId')?.value,
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
    if (this.qcJobForm.get('qcType')?.value == 'QC STK') {
      data = {
        "reportName": "QcSTKReport",
        "jobId": this.qcJobForm.get('joId')?.value,
      }
    } else {
      data = {
        "reportName": "QcReport",
        "jobId": this.qcJobForm.get('joId')?.value,
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
}
