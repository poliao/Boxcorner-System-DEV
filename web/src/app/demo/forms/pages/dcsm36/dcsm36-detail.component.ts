import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm36Service } from './dcsm36.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { AuthService } from 'src/app/services/auth.service';

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
  isPartialMode = false;
  isStartModalOpen = false;

  splitPrintData = {
    jobName: '',
    customerName: '',
    partName: '',
    qtyPerPack: '',
    bundlesPerPack: '',
    totalQty: '',
    startPack: 1,
    endPack: 1,
    deliveryDate: ''
  };
  userRole: string = '';
  modalReceivedQty: number | null = null;
  usersList: any[] = [];

  activeTab: 'staff' | 'waste' = 'staff';
  qcWasteList: any[] = [];
  qcStaffList: any[] = [{ userName: '', totalPieces: null }];

  // ─── โครงสร้างบรรจุ (กรอกครั้งเดียว) ───
  modalBoxesPerBundle: number | null = null;  // ชิ้น/แพค (หรือ ดวง/แผ่น)
  modalBundlesPerPack: number | null = null;  // แพค/ห่อ (หรือ แผ่น/ห่อ)

  // ─── ยอดรวม (input เดียว) ───
  modalTotalPassedPieces: number | null = null;

  // ─── คำนวณอัตโนมัติ (read-only) ───
  modalPassedQty: number = 0;
  modalPassedQtyFraction: number = 0;
  modalBundlesPerPackFraction: number = 0;
  modalPiecesFraction: number = 0;

  // ─── ข้อควรระวัง ───
  modalQcCaution: string = '';

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
      id: [null], status: [null], joId: [null], jobName: [null],
      responsibleName: [null], deliveryDatetime: [null], productJobId: [null],
      papOrderId: [null], receivedQty: [null], passedQty: [null],
      bundlesPerPack: [null], boxesPerBundle: [null], passedQtyFraction: [null],
      bundlesPerPackFraction: [null], piecesFraction: [null], qcType: [null],
      startQcDatetime: [null], createdAt: [null], updatedAt: [null],
      qcDetail: [null], partName: [null], qcCaution: [null], reorderFromJoId: [null],
    });
    this.papOrderForm = this.fb.group({
      qcRequiredQty: [''], orderedBy: [''], qcQa: [''], sale: [''],
      jobName: [''], qcDetail: [''], qcBookletSt: [''], qcNote: [''],
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
        return `${d}/${m}/${y} ${timePart.substring(0, 5)}`;
      }
      if (dateStr.includes('-')) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
      }
      return dateStr;
    } catch (e) { return dateStr; }
  }

  loadPapOrderDetails(papOrderId: string) {
    const numericId = parseInt(papOrderId, 10);
    if (isNaN(numericId)) { this.loadingService.hide(); return; }
    this.dcsm36Service.getPapOrderById(numericId).subscribe({
      next: (papData) => { this.papOrderForm.patchValue(papData); this.loadingService.hide(); },
      error: () => this.loadingService.hide()
    });
  }

  // ─── helper: ชิ้นต่อห่อ ───
  get piecesPerBundle(): number {
    return (this.modalBoxesPerBundle || 0) * (this.modalBundlesPerPack || 0);
  }

  // ─── คำนวณ ห่อ/เศษ จากยอดชิ้นรวม ───
  recalcTotal() {
    const total = this.modalTotalPassedPieces || 0;
    const ppb = this.piecesPerBundle;
    if (ppb <= 0) { this.modalPassedQty = 0; this.modalPassedQtyFraction = 0; this.modalBundlesPerPackFraction = 0; this.modalPiecesFraction = 0; return; }
    this.modalPassedQty = Math.floor(total / ppb);
    const rem = total % ppb;
    const ppp = this.modalBoxesPerBundle || 0;
    this.modalPassedQtyFraction = rem > 0 ? 1 : 0;
    this.modalBundlesPerPackFraction = ppp > 0 ? Math.floor(rem / ppp) : 0;
    this.modalPiecesFraction = ppp > 0 ? rem % ppp : rem;
  }

  // ─── คำนวณห่อ/เศษสำหรับพนักงานแต่ละคน ───
  recalcStaff(staff: any) {
    const total = staff.totalPieces || 0;
    const ppb = this.piecesPerBundle;
    if (ppb <= 0) { staff.packs = 0; staff.packsFraction = 0; staff.bundlesFraction = 0; staff.piecesFraction = 0; return; }
    staff.packs = Math.floor(total / ppb);
    const rem = total % ppb;
    const ppp = this.modalBoxesPerBundle || 0;
    staff.packsFraction = rem > 0 ? 1 : 0;
    staff.bundlesFraction = ppp > 0 ? Math.floor(rem / ppp) : 0;
    staff.piecesFraction = ppp > 0 ? rem % ppp : rem;
  }

  startQc() {
    this.modalReceivedQty = this.qcJobForm.get('receivedQty')?.value;
    this.isStartModalOpen = true;
  }

  closeStartModal() { this.isStartModalOpen = false; this.modalReceivedQty = null; }

  onSubmitStart() {
    if (!this.modalReceivedQty || this.modalReceivedQty <= 0) {
      this.sweetAlert.error('Error', 'กรุณากรอกจำนวนที่ถูกต้อง'); return;
    }
    const operatorName = this.authService.getFullName();
    this.loadingService.show();
    this.dcsm36Service.startQc(this.jobId!, this.modalReceivedQty, operatorName, this.qcJobForm.getRawValue().qcType).subscribe({
      next: () => { this.sweetAlert.success('สำเร็จ', 'เริ่มงาน QC เรียบร้อยแล้ว'); this.closeStartModal(); this.loadJobDetails(this.jobId!); },
      error: (err) => { console.error('Error starting QC', err); this.sweetAlert.error('Error', 'ไม่สามารถเริ่มงาน QC ได้'); this.loadingService.hide(); }
    });
  }

  completeQc() {
    this.isCompleteModalOpen = true;
    this.activeTab = 'staff';
    this.qcStaffList = [{ userName: null, totalPieces: null, packs: 0, packsFraction: 0, bundlesFraction: 0, piecesFraction: 0 }];
    this.qcWasteList = [{ processName: null, wasteQty: null, remarks: null }];
    this.modalBoxesPerBundle = null;
    this.modalBundlesPerPack = null;
    this.modalTotalPassedPieces = null;
    this.modalPassedQty = 0;
    this.modalPassedQtyFraction = 0;
    this.modalBundlesPerPackFraction = 0;
    this.modalPiecesFraction = 0;
    this.modalQcCaution = '';
  }

  closeCompleteModal() { this.isCompleteModalOpen = false; }

  addStaffRow() {
    this.qcStaffList.push({ userName: null, totalPieces: null, packs: 0, packsFraction: 0, bundlesFraction: 0, piecesFraction: 0 });
  }

  removeStaffRow(index: number) {
    if (this.qcStaffList.length > 1) this.qcStaffList.splice(index, 1);
  }

  addWasteRow() { this.qcWasteList.push({ processName: null, wasteQty: null, remarks: null }); }

  removeWasteRow(index: number) {
    if (this.qcWasteList.length > 1) this.qcWasteList.splice(index, 1);
  }

  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }

  onSubmitComplete() {
    if (!this.modalBoxesPerBundle || !this.modalBundlesPerPack) {
      this.sweetAlert.error('Error', 'กรุณากรอกโครงสร้างบรรจุ (ชิ้น/แพค และ แพค/ห่อ) ให้ครบ'); return;
    }
    if (!this.modalTotalPassedPieces || this.modalTotalPassedPieces <= 0) {
      this.sweetAlert.error('Error', 'กรุณากรอกยอดชิ้นที่ QC ผ่าน'); return;
    }
    for (let i = 0; i < this.qcStaffList.length; i++) {
      if (!this.qcStaffList[i].userName) {
        this.sweetAlert.error('Error', `กรุณาเลือกผู้ QC ในแถวที่ ${i + 1}`); return;
      }
    }

    // คำนวณเศษให้ทุกคนก่อน submit
    this.qcStaffList.forEach(s => this.recalcStaff(s));

    const data = {
      id: this.jobId,
      passedQty: this.modalPassedQty,
      bundlesPerPack: this.modalBundlesPerPack,
      boxesPerBundle: this.modalBoxesPerBundle,
      passedQtyFraction: this.modalPassedQtyFraction,
      bundlesPerPackFraction: this.modalBundlesPerPackFraction,
      piecesFraction: this.modalPiecesFraction,
      staffList: this.qcStaffList.filter(s => s.userName).map(s => ({
        userName: s.userName,
        packs: s.packs,
        packsFraction: s.packsFraction,
        bundlesFraction: s.bundlesFraction,
        piecesFraction: s.piecesFraction
      })),
      wasteReportList: this.qcWasteList.filter(w => w.processName).map(w => ({
        ...w, wasteQty: this.parseNumber(w.wasteQty)
      })),
      qcCaution: this.modalQcCaution || null
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

  goBack() { this.router.navigate(['/Dcsm36']); }

  updateCompletedStatusProductionJob() {
    this.dcsm36Service.getByIdProductionJob(this.qcJobForm.getRawValue().productJobId).subscribe({
      next: (data) => {
        data.printStatus = 'เสร็จสิ้น';
        this.dcsm36Service.updateProductionJob(data).subscribe();
      },
      error: (err) => console.error('Error fetching production job:', err)
    });
  }

  dowloadReportQc() {
    this.loadingService.show();
    const isStk = this.qcJobForm.get('qcType')?.value === 'Qc STK';
    const data = { reportName: isStk ? 'QcSTKReport' : 'QcReport', jobId: this.qcJobForm.get('id')?.value };
    this.dcsm36Service.printReport(data).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'QcReport.pdf'; a.click();
        window.URL.revokeObjectURL(url);
        this.loadingService.hide();
      },
      error: (err) => { console.error('Error printing report:', err); this.loadingService.hide(); }
    });
  }

  printReportQc() {
    this.loadingService.show();
    const isStk = this.qcJobForm.get('qcType')?.value === 'Qc STK';
    const data = { reportName: isStk ? 'QcSTKReport' : 'QcReport', jobId: this.qcJobForm.get('id')?.value };
    this.dcsm36Service.printReport(data).subscribe({
      next: (response) => {
        this.loadingService.hide();
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none'; iframe.src = url;
        iframe.onload = () => setTimeout(() => iframe.contentWindow?.print(), 100);
        document.body.appendChild(iframe);
      },
      error: (err) => { console.error('Error printing report:', err); this.loadingService.hide(); }
    });
  }

  printPackageLabel() {
    this.loadingService.show();
    const data = { reportName: 'PackageLabel', jobId: this.jobId };
    this.dcsm36Service.printReport(data).subscribe({
      next: (response) => {
        this.loadingService.hide();
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none'; iframe.src = url;
        iframe.onload = () => setTimeout(() => iframe.contentWindow?.print(), 100);
        document.body.appendChild(iframe);
      },
      error: (err) => { 
        console.error('Error printing package label:', err); 
        this.sweetAlert.error('Error', 'ไม่สามารถพิมพ์ใบแปะหน้าได้');
        this.loadingService.hide(); 
      }
    });
  }

  loadDropdown() {
    this.loadingService.show();
    const group = this.userRole === 'stam' ? 'OD' : this.userRole === 'qc' ? 'QC' : '';
    this.dcsm36Service.DropdownList(group).subscribe({
      next: (data) => { this.usersList = data; this.loadingService.hide(); },
      error: () => this.loadingService.hide()
    });
  }

  jobHistory() {
    this.router.navigate(['/Dcsm37Detail', this.qcJobForm.getRawValue().reorderFromJoId]);
  }

  // ─── แบ่ง QC (Partial QC) ───
  openSplitPrintModal() {
    this.isPartialMode = true;
    this.modalBoxesPerBundle = this.qcJobForm.get('boxesPerBundle')?.value;
    this.modalBundlesPerPack = this.qcJobForm.get('bundlesPerPack')?.value;
    this.modalTotalPassedPieces = null;
    this.qcStaffList = [{ userName: '', totalPieces: null, packs: 0, packsFraction: 0, bundlesFraction: 0, piecesFraction: 0 }];
    this.qcWasteList = [{ processName: '', wasteQty: null, remarks: '' }];
    this.modalQcCaution = this.qcJobForm.get('qcCaution')?.value || '';
    this.activeTab = 'staff';
    this.isCompleteModalOpen = true;
  }

  onSubmitPartial() {
    const totalInput = this.qcStaffList.reduce((sum, item) => sum + (item.totalPieces || 0), 0);
    if (totalInput !== this.modalTotalPassedPieces) {
      this.sweetAlert.error('ยอดไม่ตรงกัน', 'ยอดรวมที่พนักงานทำ ต้องเท่ากับ ยอดรวมงานดีทั้งหมด');
      return;
    }

    // validate waste
    const validWaste = this.qcWasteList.filter(w => w.processName && w.wasteQty != null && w.wasteQty > 0);

    const payload = {
      id: this.jobId,
      passedQty: this.modalTotalPassedPieces,
      bundlesPerPack: this.modalBundlesPerPack,
      boxesPerBundle: this.modalBoxesPerBundle,
      passedQtyFraction: this.modalPassedQtyFraction,
      bundlesPerPackFraction: this.modalBundlesPerPackFraction,
      piecesFraction: this.modalPiecesFraction,
      staffList: this.qcStaffList,
      wasteReportList: validWaste,
      qcColorMatch: this.qcJobForm.get('qcColorMatch')?.value,
      qcColorConsistency: this.qcJobForm.get('qcColorConsistency')?.value,
      qcInkResidue: this.qcJobForm.get('qcInkResidue')?.value,
      qcInkTransfer: this.qcJobForm.get('qcInkTransfer')?.value,
      qcStains: this.qcJobForm.get('qcStains')?.value,
      qcAlignment: this.qcJobForm.get('qcAlignment')?.value,
      qcScratches: this.qcJobForm.get('qcScratches')?.value,
      qcMixedJobs: this.qcJobForm.get('qcMixedJobs')?.value,
      qcCaution: this.modalQcCaution
    };

    this.sweetAlert.confirm('ยืนยันแบ่ง QC', 'ระบบจะบันทึกยอดสะสมและเปิดใบปะหน้าให้ทันที ยืนยันหรือไม่?').then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm36Service.partialQc(payload).subscribe({
          next: (logId: any) => {
            this.loadingService.hide();
            this.sweetAlert.success('บันทึกสำเร็จ', 'กำลังพิมพ์ใบหน้าห่อ...');
            this.closeCompleteModal();
            this.loadJobDetails(this.jobId!);
            
            // Print Jasper Report right after
            const data = { reportName: 'PackageLabel', jobId: this.jobId, logId: logId };
            this.dcsm36Service.printReport(data).subscribe({
              next: (response) => {
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none'; iframe.src = url;
                iframe.onload = () => setTimeout(() => iframe.contentWindow?.print(), 100);
                document.body.appendChild(iframe);
              },
              error: (err) => console.error('Error printing split label:', err)
            });
          },
          error: (err) => {
            console.error('Error saving partial qc:', err);
            this.sweetAlert.error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
            this.loadingService.hide();
          }
        });
      }
    });
  }
}
