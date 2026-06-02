import { Component, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

type Employee = {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  username: string | null;
  monthlySalary: number;
  personalLeaveDays: number; personalLeaveHours: number;
  sickLeaveDays: number; sickLeaveHours: number;
  vacationLeaveDays: number; vacationLeaveHours: number;
  maternityLeaveDays: number; maternityLeaveHours: number;
  ordinationLeaveDays: number; ordinationLeaveHours: number;
};

type LeaveRequest = {
  id: number;
  employeeId: number;
  leaveType: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  status: string;
};

type LeaveBalance = {
  label: string;
  entitlementHours: number;
  usedHours: number;
  remainingHours: number;
};

const LEAVE_ORDER = ['ลาพักร้อน', 'ลาป่วย', 'ลากิจ', 'ลาคลอด', 'ลาบวช'];
const LEAVE_TYPES = ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน', 'ลาคลอด', 'ลาบวช'];
const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './leave-request.component.html',
})
export class LeaveRequestComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  readonly currentUser = this.auth.getFullName(); // username (token.sub)
  readonly currentYear = new Date().getFullYear();
  readonly leaveTypes = LEAVE_TYPES;
  readonly employees = signal<Employee[]>([]);
  readonly requests = signal<LeaveRequest[]>([]);
  readonly fileName = signal('');

  // ไฟล์แนบ: เก็บไว้เฉพาะหน้าจอ ไม่ส่งไป backend (ตามสเปก)
  selectedFile: File | null = null;

  form: {
    leaveType: string;
    dateFrom: string;
    dateTo: string;
    timeFrom: string;
    timeTo: string;
    reason: string;
  } = { leaveType: '', dateFrom: '', dateTo: '', timeFrom: '', timeTo: '', reason: '' };

  ngOnInit() {
    this.http.get<Employee[]>(`${environment.apiUrl}/dcsm44/employees`).subscribe(d => this.employees.set(d || []));
    this.http.get<LeaveRequest[]>(`${environment.apiUrl}/leave-request`).subscribe(d => this.requests.set(d || []));
  }

  // พนักงานที่ผูกกับบัญชีที่ล็อกอิน — ขอลาได้เฉพาะของตัวเอง
  get selectedEmployee(): Employee | null {
    return this.employees().find(e => e.username === this.currentUser) || null;
  }

  // ปีของยอดคงเหลือ = ปีของวันที่เริ่มลา (ถ้าเลือกแล้ว) ไม่งั้นปีปัจจุบัน — ขึ้นปีใหม่ยอดใช้รีเซ็ต
  get balanceYear(): number {
    return this.yearOf(this.form.dateFrom) || this.currentYear;
  }

  private yearOf(d: string): number {
    if (!d) return 0;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? 0 : dt.getFullYear();
  }

  private timeToMinutes(t: string): number {
    const [h, m] = (t || '').split(':').map(Number);
    if (isNaN(h)) return 0;
    return h * 60 + (m || 0);
  }

  // จำนวนชั่วโมงของช่วงลา: วันเดียว+ระบุเวลา = คิดตามชั่วโมง, หลายวัน = จำนวนวัน × 8
  private durationHours(dateFrom: string, dateTo: string, timeFrom: string, timeTo: string): number {
    if (!dateFrom || !dateTo) return 0;
    const d1 = new Date(dateFrom), d2 = new Date(dateTo);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 < d1) return 0;
    const dayMs = 24 * 60 * 60 * 1000;
    const dayCount = Math.round((d2.getTime() - d1.getTime()) / dayMs) + 1;
    if (dayCount === 1 && timeFrom && timeTo) {
      const mins = this.timeToMinutes(timeTo) - this.timeToMinutes(timeFrom);
      return mins > 0 ? mins / 60 : 0;
    }
    return dayCount * 8;
  }

  private entitlementHours(type: string): number {
    const e = this.selectedEmployee;
    if (!e) return 0;
    const map: Record<string, [number, number]> = {
      'ลาพักร้อน': [e.vacationLeaveDays || 0, e.vacationLeaveHours || 0],
      'ลาป่วย': [e.sickLeaveDays || 0, e.sickLeaveHours || 0],
      'ลากิจ': [e.personalLeaveDays || 0, e.personalLeaveHours || 0],
      'ลาคลอด': [e.maternityLeaveDays || 0, e.maternityLeaveHours || 0],
      'ลาบวช': [e.ordinationLeaveDays || 0, e.ordinationLeaveHours || 0],
    };
    const [d, h] = map[type] || [0, 0];
    return d * 8 + h;
  }

  // ใช้ไป = รวมใบลาที่ "อนุมัติแล้ว" ของประเภทนี้ ในปี balanceYear
  private usedHours(type: string): number {
    const e = this.selectedEmployee;
    if (!e) return 0;
    const year = this.balanceYear;
    return this.requests()
      .filter(r => r.employeeId === e.id && r.leaveType === type && r.status === 'approved' && this.yearOf(r.dateFrom) === year)
      .reduce((sum, r) => sum + this.durationHours(r.dateFrom, r.dateTo, r.timeFrom, r.timeTo), 0);
  }

  get leaveBalance(): LeaveBalance[] {
    if (!this.selectedEmployee) return [];
    return LEAVE_ORDER.map(type => {
      const ent = this.entitlementHours(type);
      const used = this.usedHours(type);
      return { label: type, entitlementHours: ent, usedHours: used, remainingHours: Math.max(0, ent - used) };
    });
  }

  get requestedHours(): number | null {
    const { dateFrom, dateTo, timeFrom, timeTo } = this.form;
    if (!dateFrom || !dateTo) return null;
    const d1 = new Date(dateFrom), d2 = new Date(dateTo);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 < d1) return null;
    return this.durationHours(dateFrom, dateTo, timeFrom, timeTo);
  }

  // สิทธิ์คงเหลือของประเภทที่เลือก (หน่วยชั่วโมง) = สิทธิ์ - ใช้ไป
  get availableHours(): number | null {
    if (!this.form.leaveType) return null;
    const b = this.leaveBalance.find(x => x.label === this.form.leaveType);
    return b ? b.remainingHours : null;
  }

  get isInsufficient(): boolean {
    const req = this.requestedHours;
    const avail = this.availableHours;
    if (req === null || avail === null) return false;
    return req > avail;
  }

  hoursToText(h: number): string {
    const days = Math.floor(h / 8);
    const hrs = Math.round((h - days * 8) * 10) / 10;
    const parts: string[] = [];
    if (days) parts.push(`${days} วัน`);
    if (hrs) parts.push(`${hrs} ชม.`);
    return parts.length ? parts.join(' ') : '0';
  }

  // ---- ดูใบลาของฉันในปีนั้น ----
  readonly showHistory = signal(false);

  // ใบลาของพนักงานคนนี้ทั้งหมดในปี balanceYear (ทุกสถานะ) ใหม่สุดก่อน
  get yearRequests(): LeaveRequest[] {
    const e = this.selectedEmployee;
    if (!e) return [];
    const year = this.balanceYear;
    return this.requests()
      .filter(r => r.employeeId === e.id && this.yearOf(r.dateFrom) === year)
      .sort((a, b) => b.id - a.id);
  }

  reqDuration(r: LeaveRequest): string {
    return this.hoursToText(this.durationHours(r.dateFrom, r.dateTo, r.timeFrom, r.timeTo));
  }

  statusInfo(status: string): { label: string; cls: string } {
    const s = status || 'pending';
    if (s === 'approved') return { label: 'อนุมัติแล้ว', cls: 'bg-success text-white' };
    if (s === 'rejected') return { label: 'ไม่อนุมัติ', cls: 'bg-danger text-white' };
    return { label: 'รออนุมัติ', cls: 'bg-warning text-dark' };
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    if (file && file.size > MAX_FILE_BYTES) {
      alert('ไฟล์แนบต้องมีขนาดไม่เกิน 100 MB');
      input.value = '';
      this.selectedFile = null;
      this.fileName.set('');
      return;
    }
    this.selectedFile = file;
    this.fileName.set(file ? file.name : '');
  }

  submit() {
    const emp = this.selectedEmployee;
    if (!emp) {
      alert('บัญชีของคุณยังไม่ได้ผูกกับข้อมูลพนักงาน');
      return;
    }
    if (!this.form.leaveType) { alert('กรุณาเลือกประเภทการลา'); return; }
    if (!this.form.dateFrom || !this.form.dateTo) { alert('กรุณาเลือกวันที่ลา (จาก - ถึง)'); return; }
    // วันลาไม่พอ = แจ้งเตือนในฟอร์มเฉยๆ ไม่บล็อกการบันทึก

    const payload = {
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`.trim(),
      leaveType: this.form.leaveType,
      dateFrom: this.form.dateFrom,
      dateTo: this.form.dateTo,
      timeFrom: this.form.timeFrom,
      timeTo: this.form.timeTo,
      reason: this.form.reason.trim(),
    };

    this.http.post(`${environment.apiUrl}/leave-request`, payload).subscribe({
      next: () => { alert('บันทึกคำขอลาเรียบร้อยแล้ว'); this.reset(); },
      error: () => alert('บันทึกไม่สำเร็จ — ตรวจสอบว่า restart backend แล้วหรือยัง'),
    });
  }

  reset() {
    this.form = { leaveType: '', dateFrom: '', dateTo: '', timeFrom: '', timeTo: '', reason: '' };
    this.selectedFile = null;
    this.fileName.set('');
  }
}
