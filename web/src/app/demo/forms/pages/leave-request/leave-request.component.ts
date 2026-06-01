import { Component, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';

type Employee = {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  monthlySalary: number;
  personalLeaveDays: number; personalLeaveHours: number;
  sickLeaveDays: number; sickLeaveHours: number;
  vacationLeaveDays: number; vacationLeaveHours: number;
  maternityLeaveDays: number; maternityLeaveHours: number;
  ordinationLeaveDays: number; ordinationLeaveHours: number;
};

type LeaveBalance = { label: string; days: number; hours: number };

const LEAVE_TYPES = ['ลาป่วย', 'ลากิจ', 'ลาคลอด', 'ลาบวช', 'ลาพักร้อน'];
const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './leave-request.component.html',
})
export class LeaveRequestComponent implements OnInit {
  private http = inject(HttpClient);

  readonly leaveTypes = LEAVE_TYPES;
  readonly employees = signal<Employee[]>([]);
  readonly fileName = signal('');

  // ไฟล์แนบ: เก็บไว้เฉพาะหน้าจอ ไม่ส่งไป backend (ตามสเปก)
  selectedFile: File | null = null;

  form: {
    employeeId: number | null;
    leaveType: string;
    dateFrom: string;
    dateTo: string;
    timeFrom: string;
    timeTo: string;
    reason: string;
  } = { employeeId: null, leaveType: '', dateFrom: '', dateTo: '', timeFrom: '', timeTo: '', reason: '' };

  ngOnInit() {
    this.http.get<Employee[]>(`${environment.apiUrl}/dcsm44/employees`)
      .subscribe(d => this.employees.set(d || []));
  }

  // พนักงานที่เลือกอยู่ (ใช้แสดงการ์ดสรุป)
  get selectedEmployee(): Employee | null {
    if (this.form.employeeId === null) return null;
    return this.employees().find(e => e.id === Number(this.form.employeeId)) || null;
  }

  // สิทธิวันลาคงเหลือ — แสดงครบทุกประเภทเสมอ (ไม่ได้กำหนด = ไม่มีวันลา = 0)
  // หมายเหตุ: ยังไม่มีระบบหักวันลาที่ใช้ไป จึง "ใช้ไป 0" และคงเหลือ = สิทธิ์เต็ม
  get leaveBalance(): LeaveBalance[] {
    const e = this.selectedEmployee;
    if (!e) return [];
    return [
      { label: 'ลาพักร้อน', days: e.vacationLeaveDays || 0, hours: e.vacationLeaveHours || 0 },
      { label: 'ลาป่วย', days: e.sickLeaveDays || 0, hours: e.sickLeaveHours || 0 },
      { label: 'ลากิจ', days: e.personalLeaveDays || 0, hours: e.personalLeaveHours || 0 },
      { label: 'ลาคลอด', days: e.maternityLeaveDays || 0, hours: e.maternityLeaveHours || 0 },
      { label: 'ลาบวช', days: e.ordinationLeaveDays || 0, hours: e.ordinationLeaveHours || 0 },
    ];
  }

  // ---- ตรวจสอบว่าวันลาพอหรือไม่ (1 วัน = 8 ชม.) ----
  private timeToMinutes(t: string): number {
    const [h, m] = (t || '').split(':').map(Number);
    if (isNaN(h)) return 0;
    return h * 60 + (m || 0);
  }

  // ชั่วโมงที่ขอลา: วันเดียว+ระบุเวลา = คิดตามชั่วโมง, หลายวัน = จำนวนวัน × 8
  get requestedHours(): number | null {
    const { dateFrom, dateTo, timeFrom, timeTo } = this.form;
    if (!dateFrom || !dateTo) return null;
    const d1 = new Date(dateFrom);
    const d2 = new Date(dateTo);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 < d1) return null;
    const dayMs = 24 * 60 * 60 * 1000;
    const dayCount = Math.round((d2.getTime() - d1.getTime()) / dayMs) + 1;
    if (dayCount === 1 && timeFrom && timeTo) {
      const mins = this.timeToMinutes(timeTo) - this.timeToMinutes(timeFrom);
      return mins > 0 ? mins / 60 : 0;
    }
    return dayCount * 8;
  }

  // สิทธิ์คงเหลือของประเภทที่เลือก (หน่วยชั่วโมง)
  get availableHours(): number | null {
    if (!this.form.leaveType) return null;
    const b = this.leaveBalance.find(x => x.label === this.form.leaveType);
    if (!b) return null;
    return b.days * 8 + b.hours;
  }

  get isInsufficient(): boolean {
    const req = this.requestedHours;
    const avail = this.availableHours;
    if (req === null || avail === null) return false;
    return req > avail;
  }

  // แปลงชั่วโมง -> "X วัน Y ชม."
  hoursToText(h: number): string {
    const days = Math.floor(h / 8);
    const hrs = Math.round((h - days * 8) * 10) / 10;
    const parts: string[] = [];
    if (days) parts.push(`${days} วัน`);
    if (hrs) parts.push(`${hrs} ชม.`);
    return parts.length ? parts.join(' ') : '0';
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
    if (!this.form.employeeId) { alert('กรุณาเลือกพนักงาน'); return; }
    if (!this.form.leaveType) { alert('กรุณาเลือกประเภทการลา'); return; }
    if (!this.form.dateFrom || !this.form.dateTo) { alert('กรุณาเลือกวันที่ลา (จาก - ถึง)'); return; }
    // วันลาไม่พอ = แจ้งเตือนในฟอร์มเฉยๆ ไม่บล็อกการบันทึก (ยังลาได้)

    const emp = this.selectedEmployee;
    const payload = {
      employeeId: Number(this.form.employeeId),
      employeeName: emp ? `${emp.firstName} ${emp.lastName}`.trim() : '',
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
    this.form = { employeeId: null, leaveType: '', dateFrom: '', dateTo: '', timeFrom: '', timeTo: '', reason: '' };
    this.selectedFile = null;
    this.fileName.set('');
  }
}
