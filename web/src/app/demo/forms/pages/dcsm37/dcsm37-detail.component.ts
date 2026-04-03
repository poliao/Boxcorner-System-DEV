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
  showComingSoonModal = false;     // ประเภทอื่นที่ยังไม่รองรับ
  comingSoonType = '';

  designForm = {
    joId: '',
    qtId: '',
    qpId: '',
    deadlineDate: '',
    deadlineTime: '',
    jobDetails: '',
    remarks: '',
  };

  constructor(
    private service: Dcsm37Service,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
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
    this.showComingSoonModal = false;
  }

  selectType(type: 'design' | 'sample' | 'production') {
    this.showTypeModal = false;
    if (type === 'design') {
      // Pre-fill form from existing data
      this.designForm = { joId: '', qtId: '', qpId: '', deadlineDate: '', deadlineTime: '', jobDetails: '', remarks: '' };
      this.showDesignModal = true;
    } else {
      this.comingSoonType = type === 'sample' ? 'สั่งขึ้นตัวอย่าง' : 'สั่งผลิต';
      this.showComingSoonModal = true;
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
