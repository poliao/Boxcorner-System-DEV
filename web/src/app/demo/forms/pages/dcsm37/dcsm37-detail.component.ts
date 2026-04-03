import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Dcsm37Service } from './dcsm37.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { Dcsm04Service } from '../dcsm04/dcsm04.service';

@Component({
  selector: 'app-dcsm37-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './dcsm37-detail.component.html',
  styleUrls: ['./dcsm37-detail.component.scss']
})
export class Dcsm37DetailComponent implements OnInit {
  data: any = null;
  jobId!: string;
  expandedRounds: Set<number> = new Set([0]);

  // ─── ReOrder modal state ───────────────────────────────────────────
  showTypeModal = false;           // Step 1: เลือกประเภท
  showDesignModal = false;         // Step 2: ฟอร์มสั่งออกแบบ
  showSampleModal = false;         // Step 2: ฟอร์มสั่งขึ้นตัวอย่าง
  showProductionModal = false;     // Step 2: ฟอร์มสั่งผลิต
  showComingSoonModal = false;     // ประเภทอื่นที่ยังไม่รองรับ
  comingSoonType = '';
  prodModalTab: 'info' | 'decision' = 'info';

  designForm = {
    joId: '',
    qtId: '',
    qpId: '',
    deadlineDate: '',
    deadlineTime: '',
    jobDetails: '',
    remarks: '',
  };

  sampleForm = {
    joId: '',
    qtId: '',
    qpId: '',
    deliveryDate: '',
    deliveryTime: '',
    quantity: null as number | null,
    unit: '',
    note: '',
  };

  productionForm = {
    joId: '',
    qtId: '',
    qpId: '',
    deadlineDate: '',
    deadlineTime: '',
    remarks: '',
    decisionAuthority: '',
    decisionAuthorityRemarks: '',
    // Technical Spec
    searchId: '',
    sampleJobType: '',
    samplePrintingSystem: '',
    samplePrintingStyle: '',
    samplePrintingColor: '',
    samplePaperSize: '',
    samplePaperGrammage: '',
    sampleCoatingStyle: '',
    sampleDiecutStyle: '',
    sampleSpecialInstructions: '',
    sampleDeliveryTimestamp: '',
  };

  constructor(
    private service: Dcsm37Service,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private dcsm04Service: Dcsm04Service
  ) {}

  ngOnInit() {
    this.jobId = this.route.snapshot.params['id'];
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.service.getJobHistory(this.jobId).subscribe({
      next: (res) => { this.data = res; this.loadingService.hide(); },
      error: () => { this.sweetAlert.error('ผิดพลาด', 'ไม่สามารถดึงข้อมูลได้'); this.loadingService.hide(); }
    });
  }

  // ─── Accordion ────────────────────────────────────────────────────
  toggleRound(index: number) {
    if (this.expandedRounds.has(index)) {
      this.expandedRounds.delete(index);
    } else {
      this.expandedRounds.add(index);
    }
  }

  isRoundExpanded(index: number): boolean {
    return this.expandedRounds.has(index);
  }

  // ─── ReOrder Modal ────────────────────────────────────────────────
  openReorderModal() {
    this.showTypeModal = true;
  }

  closeAllModals() {
    this.showTypeModal = false;
    this.showDesignModal = false;
    this.showSampleModal = false;
    this.showProductionModal = false;
    this.showComingSoonModal = false;
  }

  selectType(type: 'design' | 'sample' | 'production') {
    this.showTypeModal = false;
    if (type === 'design') {
      // Pre-fill form from existing data
      this.designForm = { joId: '', qtId: '', qpId: '', deadlineDate: '', deadlineTime: '', jobDetails: '', remarks: '' };
      this.showDesignModal = true;
    } else if (type === 'sample') {
      this.sampleForm = {
        joId: '',
        qtId: '',
        qpId: '',
        deliveryDate: '',
        deliveryTime: '',
        quantity: null,
        unit: 'Pcs',
        note: '',
      };
      this.showSampleModal = true;
    } else if (type === 'production') {
      // Find latest production order to pre-fill specs
      const latestProd = this.data?.productionHistory && this.data.productionHistory.length > 0
        ? this.data.productionHistory[0]
        : null;

      this.productionForm = {
        joId: '',
        qtId: '',
        qpId: '',
        deadlineDate: '',
        deadlineTime: '',
        remarks: '',
        decisionAuthority: '',
        decisionAuthorityRemarks: '',
        // Fill from latest if exists
        searchId: '',
        sampleJobType: latestProd?.sampleJobType || '',
        samplePrintingSystem: latestProd?.samplePrintingSystem || '',
        samplePrintingStyle: latestProd?.samplePrintingStyle || '',
        samplePrintingColor: latestProd?.samplePrintingColor || '',
        samplePaperSize: latestProd?.samplePaperSize || '',
        samplePaperGrammage: latestProd?.samplePaperGrammage || '',
        sampleCoatingStyle: latestProd?.sampleCoatingStyle || '',
        sampleDiecutStyle: latestProd?.sampleDiecutStyle || '',
        sampleSpecialInstructions: latestProd?.sampleSpecialInstructions || '',
        sampleDeliveryTimestamp: latestProd?.sampleDeliveryTimestamp || '',
      };
      this.prodModalTab = 'info';
      this.showProductionModal = true;
    }
  }

  submitDesignOrder() {
    if (!this.designForm.joId || !this.designForm.deadlineDate) {
      this.sweetAlert.error('กรุณากรอกข้อมูล', 'JO ใหม่ และ วันที่กำหนดส่งงาน จำเป็นต้องกรอก');
      return;
    }
    const body = {
      reorderFromJoId: this.jobId,
      joId: this.designForm.joId,
      qtId: this.designForm.qtId || null,
      qpId: this.designForm.qpId || null,
      deadlineDate: this.designForm.deadlineDate,
      deadlineTime: this.designForm.deadlineTime || null,
      folderName: this.data?.folderName || null,
      jobOwner: this.data?.jobOwner || null,
      customerName: this.data?.customerName || null,
      jobDetails: this.designForm.jobDetails || null,
      remarks: this.designForm.remarks || null,
    };
    this.loadingService.show();
    this.service.reorderDesign(body).subscribe({
      next: () => {
        this.loadingService.hide();
        this.closeAllModals();
        this.sweetAlert.success('สำเร็จ', 'สร้าง Design Order ใหม่แล้ว');
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('ผิดพลาด', err?.error?.error || 'ไม่สามารถบันทึกได้');
      }
    });
  }

  submitSampleOrder() {
    if (!this.sampleForm.joId || !this.sampleForm.deliveryDate) {
      this.sweetAlert.error('กรุณากรอกข้อมูล', 'JO ใหม่ และ วันที่กำหนดส่ง จำเป็นต้องกรอก');
      return;
    }
    const body = {
      reorderFromJoId: this.jobId,
      jobId: this.sampleForm.joId,
      qtId: this.sampleForm.qtId || null,
      qpId: this.sampleForm.qpId || null,
      deliveryDate: this.sampleForm.deliveryDate,
      deliveryTime: this.sampleForm.deliveryTime || null,
      quantity: this.sampleForm.quantity,
      unit: this.sampleForm.unit || null,
      note: this.sampleForm.note || null,
      folderName: this.data?.folderName || null,
      jobOwner: this.data?.jobOwner || null,
      customerName: this.data?.customerName || null,
    };
    this.loadingService.show();
    this.service.reorderSample(body).subscribe({
      next: () => {
        this.loadingService.hide();
        this.closeAllModals();
        this.sweetAlert.success('สำเร็จ', 'สร้าง Sample Order ใหม่แล้ว');
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('ผิดพลาด', err?.error?.error || 'ไม่สามารถบันทึกได้');
      }
    });
  }

  submitProductionOrder() {
    if (!this.productionForm.joId || !this.productionForm.deadlineDate || !this.productionForm.decisionAuthority) {
      this.sweetAlert.error('กรุณากรอกข้อมูล', 'JO ใหม่, วันที่ส่งงาน และ ผู้มีอำนาจตัดสินใจ จำเป็นต้องกรอก');
      return;
    }
    const body = {
      reorderFromJoId: this.jobId,
      jobId: this.productionForm.joId,
      qtId: this.productionForm.qtId || null,
      qpId: this.productionForm.qpId || null,
      deadlineDate: this.productionForm.deadlineDate,
      deadlineTime: this.productionForm.deadlineTime || null,
      remarks: this.productionForm.remarks || null,
      decisionAuthority: this.productionForm.decisionAuthority || null,
      decisionAuthorityRemarks: this.productionForm.decisionAuthorityRemarks || null,
      // Technical Spec
      sampleJobType: this.productionForm.sampleJobType || null,
      samplePrintingSystem: this.productionForm.samplePrintingSystem || null,
      samplePrintingStyle: this.productionForm.samplePrintingStyle || null,
      samplePrintingColor: this.productionForm.samplePrintingColor || null,
      samplePaperSize: this.productionForm.samplePaperSize || null,
      samplePaperGrammage: this.productionForm.samplePaperGrammage || null,
      sampleCoatingStyle: this.productionForm.sampleCoatingStyle || null,
      sampleDiecutStyle: this.productionForm.sampleDiecutStyle || null,
      sampleSpecialInstructions: this.productionForm.sampleSpecialInstructions || null,
      sampleDeliveryTimestamp: this.productionForm.sampleDeliveryTimestamp || null,
      
      folderName: this.data?.folderName || null,
      jobOwner: this.data?.jobOwner || null,
      customerName: this.data?.customerName || null,
    };
    this.loadingService.show();
    this.service.reorderProduction(body).subscribe({
      next: () => {
        this.loadingService.hide();
        this.closeAllModals();
        this.sweetAlert.success('สำเร็จ', 'สร้าง Production Order ใหม่แล้ว');
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('ผิดพลาด', err?.error?.error || 'ไม่สามารถบันทึกได้');
      }
    });
  }

  fetchPapData() {
    if (!this.productionForm.searchId) {
      this.sweetAlert.warning('สเปกงาน', 'กรุณาระบุ PAP ID ที่ต้องการดึงข้อมูล');
      return;
    }
    this.loadingService.show();
    this.dcsm04Service.getSobPAP(Number(this.productionForm.searchId)).subscribe({
      next: (res: any) => {
        this.loadingService.hide();
        if (res && res.job_specifications) {
          const spec = res.job_specifications;
          this.productionForm.sampleJobType = spec.work_type || '';
          this.productionForm.samplePrintingSystem = spec.print_system || '';
          this.productionForm.samplePrintingStyle = spec.print_style || '';
          this.productionForm.samplePrintingColor = spec.print_colors || '';
          this.productionForm.samplePaperSize = spec.paper_size || '';
          this.productionForm.samplePaperGrammage = spec.paper_weight || '';
          this.productionForm.sampleCoatingStyle = spec.coating_style || '';
          this.productionForm.sampleDiecutStyle = spec.diecut_style || '';
          this.sweetAlert.success('ดึงข้อมูลสำเร็จ', 'อัปเดตรายละเอียดสเปกงานแล้ว');
        } else {
          this.sweetAlert.error('ไม่พบข้อมูล', 'ไม่พบสเปกงานสำหรับ ID ที่ระบุ');
        }
      },
      error: () => {
        this.loadingService.hide();
        this.sweetAlert.error('ผิดพลาด', 'ไม่สามารถเชื่อมต่อเพื่อดึงสเปกงานได้');
      }
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────
  formatDate(d: string | null): string {
    if (!d) return '-';
    try {
      if (d.includes('T')) {
        const [dp, tp] = d.split('T');
        const [y, m, day] = dp.split('-');
        return `${day}/${m}/${y} ${tp.substring(0, 5)}`;
      }
      const [y, m, day] = d.split('-');
      return `${day}/${m}/${y}`;
    } catch { return d; }
  }

  formatMinutes(min: number | null): string {
    if (min == null) return '-';
    if (min < 60) return `${min} นาที`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h} ชม. ${m} นาที` : `${h} ชม.`;
  }

  getRoundBadge(round: any): { label: string; class: string } {
    if (round.jobStatus === 'ยกเลิก' || round.processStatus === 'ยกเลิก') {
      return { label: 'ยกเลิก', class: 'badge bg-danger' };
    }
    if (round.isNewProof) {
      return { label: 'ปรู๊ฟไม่ผ่าน (สั่งใหม่)', class: 'badge bg-warning text-dark' };
    }
    return { label: round.processStatus || '-', class: 'badge bg-primary' };
  }

  translateAuthority(value: string | null): string {
    if (!value) return '-';
    const map: Record<string, string> = {
      customerOnSite:      'ลูกค้าเข้าดูงานหน้างาน',
      sampleToCustomer:    'ขึ้นตัวอย่างส่งลูกค้าตรวจ',
      salesDecision:       'เซลล์ตัดสินใจแทนลูกค้า',
      planningDecision:    'ฝ่ายแผนตัดสินใจ',
      operatorQaDecision:  'ช่างพิมพ์ + QA ร่วมกัน',
    };
    return map[value] ?? value;
  }

  back() { this.router.navigate(['/Dcsm37']); }
}
