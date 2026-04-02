import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './dcsm37-detail.component.html',
  styleUrls: ['./dcsm37-detail.component.scss']
})
export class Dcsm37DetailComponent implements OnInit {
  data: any = null;
  id!: number;

  steps = [
    { key: 'design', label: 'ออกแบบ', icon: 'design_services', color: '#6366f1' },
    { key: 'sample', label: 'ขึ้นตัวอย่าง', icon: 'science', color: '#f59e0b' },
    { key: 'print', label: 'พิมพ์', icon: 'print', color: '#3b82f6' },
    { key: 'coating', label: 'เคลือบ', icon: 'layers', color: '#10b981' },
    { key: 'stamping', label: 'ปั๊ม/ตัด', icon: 'content_cut', color: '#ef4444' },
    { key: 'qc', label: 'QC', icon: 'verified', color: '#8b5cf6' },
  ];

  constructor(
    private service: Dcsm37Service,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.service.getDetail(this.id).subscribe({
      next: (res) => { this.data = res; this.loadingService.hide(); },
      error: () => { this.sweetAlert.error('ผิดพลาด', 'ไม่สามารถดึงข้อมูลได้'); this.loadingService.hide(); }
    });
  }

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

  formatDateTime(date: string | null, time: string | null): string {
    if (!date) return '-';
    const formattedDate = this.formatDate(date);
    if (!time) return formattedDate;
    return `${formattedDate} ${time.substring(0, 5)}`;
  }

  formatMinutes(min: number | null): string {
    if (min == null) return '-';
    if (min < 60) return `${min} นาที`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h} ชม. ${m} นาที` : `${h} ชม.`;
  }

  getStepStatus(key: string): 'done' | 'active' | 'pending' {
    if (!this.data) return 'pending';
    switch (key) {
      case 'design': return this.data.designOrderId ? 'done' : 'pending';
      case 'sample': return this.data.sampleOrderId ? 'done' : 'pending';
      case 'print': return this.data.printJobId ? 'done' : 'pending';
      case 'coating': return this.data.coatingJobId ? 'done' : 'pending';
      case 'stamping': return (this.data.stampingLogs?.length > 0) ? 'done' : 'pending';
      case 'qc': return this.data.qcJobId ? (this.data.qcStatus === 'เสร็จสิ้น' ? 'done' : 'active') : 'pending';
      default: return 'pending';
    }
  }

  back() { this.router.navigate(['/Dcsm37']); }
}
