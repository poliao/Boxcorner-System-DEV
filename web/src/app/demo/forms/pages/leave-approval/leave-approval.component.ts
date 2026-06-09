import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

type Position = { id: number; code: string; nameTh: string; nameEn: string };
type Approver = { id: number; userId: string; userName: string; positionIds: number[] };
type Employee = {
  id: number; code: string; firstName: string; lastName: string; positionId: number | null;
  vacationLeaveDays: number; vacationLeaveHours: number;
  sickLeaveDays: number; sickLeaveHours: number;
  personalLeaveDays: number; personalLeaveHours: number;
  annualPersonalLeaveDays: number; annualPersonalLeaveHours: number;
  maternityLeaveDays: number; maternityLeaveHours: number;
  ordinationLeaveDays: number; ordinationLeaveHours: number;
};
type LeaveRequest = {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  reason: string;
  status: string;
  approvedBy: string;
};
type ApprovalRow = { req: LeaveRequest; emp: Employee };

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

function paginateRows<T>(rows: T[], page: number, pageSize: number) {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), total, totalPages, page: safePage };
}

@Component({
  selector: 'app-leave-approval',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './leave-approval.component.html',
})
export class LeaveApprovalComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  readonly currentUser = this.auth.getFullName(); // username (token.sub)
  readonly currentYear = new Date().getFullYear();

  readonly positions = signal<Position[]>([]);
  readonly approvers = signal<Approver[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly requests = signal<LeaveRequest[]>([]);

  ngOnInit() {
    this.http.get<Position[]>(`${environment.apiUrl}/dcsm45/positions`).subscribe(d => this.positions.set(d || []));
    this.http.get<Approver[]>(`${environment.apiUrl}/dcsm45/approvers`).subscribe(d => this.approvers.set(d || []));
    this.http.get<Employee[]>(`${environment.apiUrl}/dcsm44/employees`).subscribe(d => this.employees.set(d || []));
    this.http.get<LeaveRequest[]>(`${environment.apiUrl}/leave-request`).subscribe(d => this.requests.set(d || []));
  }

  readonly isApprover = computed(() => this.approvers().some(a => a.userName === this.currentUser));

  // ตำแหน่งที่ user คนนี้อนุมัติได้ (สายอนุมัติของตน)
  readonly myPositionIds = computed(() => {
    const me = this.approvers().find(a => a.userName === this.currentUser);
    return new Set<number>(me ? me.positionIds : []);
  });

  private readonly empMap = computed(() => {
    const m = new Map<number, Employee>();
    for (const e of this.employees()) m.set(e.id, e);
    return m;
  });

  // คำขอลาที่อยู่ในสายอนุมัติของเรา (พนักงานอยู่ในตำแหน่งที่เราดูแล) — pending ขึ้นก่อน
  readonly myRequests = computed<ApprovalRow[]>(() => {
    const map = this.empMap();
    const posSet = this.myPositionIds();
    const rows: ApprovalRow[] = [];
    for (const req of this.requests()) {
      const emp = map.get(req.employeeId);
      if (emp && emp.positionId != null && posSet.has(emp.positionId)) {
        rows.push({ req, emp });
      }
    }
    // เรียงตามสถานะ: รออนุมัติ -> อนุมัติแล้ว -> ไม่อนุมัติ (ในกลุ่มเดียวกัน ใหม่สุดก่อน)
    const rank = (s: string) => {
      const v = s || 'pending';
      if (v === 'pending') return 0;
      if (v === 'approved') return 1;
      return 2; // rejected
    };
    return rows.sort((a, b) => rank(a.req.status) - rank(b.req.status) || b.req.id - a.req.id);
  });

  readonly pendingCount = computed(() => this.myRequests().filter(x => !x.req.status || x.req.status === 'pending').length);

  // แบ่งหน้า
  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly paging = computed(() => paginateRows(this.myRequests(), this.page(), this.pageSize()));

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  positionName(id: number | null | undefined): string {
    if (id == null) return '-';
    const p = this.positions().find(x => x.id === id);
    return p ? `${p.nameTh} (${p.code})` : '-';
  }

  // ---- วันลาคงเหลือรายปี (หักจากใบลาที่อนุมัติแล้ว) ----
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
  private entitlementHours(emp: Employee, type: string): number {
    const map: Record<string, [number, number]> = {
      'ลาพักร้อน': [emp.vacationLeaveDays || 0, emp.vacationLeaveHours || 0],
      'ลาป่วย': [emp.sickLeaveDays || 0, emp.sickLeaveHours || 0],
      'ลากิจ': [emp.personalLeaveDays || 0, emp.personalLeaveHours || 0],
      'ลากิจประจำปี': [emp.annualPersonalLeaveDays || 0, emp.annualPersonalLeaveHours || 0],
      'ลาคลอด': [emp.maternityLeaveDays || 0, emp.maternityLeaveHours || 0],
      'ลาบวช': [emp.ordinationLeaveDays || 0, emp.ordinationLeaveHours || 0],
    };
    const [d, h] = map[type] || [0, 0];
    return d * 8 + h;
  }
  private usedHours(emp: Employee, type: string, year: number): number {
    return this.requests()
      .filter(r => r.employeeId === emp.id && r.leaveType === type && r.status === 'approved' && this.yearOf(r.dateFrom) === year)
      .reduce((sum, r) => sum + this.durationHours(r.dateFrom, r.dateTo, r.timeFrom, r.timeTo), 0);
  }
  hoursToText(h: number): string {
    const days = Math.floor(h / 8);
    const hrs = Math.round((h - days * 8) * 10) / 10;
    const parts: string[] = [];
    if (days) parts.push(`${days} วัน`);
    if (hrs) parts.push(`${hrs} ชม.`);
    return parts.length ? parts.join(' ') : '0';
  }
  reqYear(row: ApprovalRow): number {
    return this.yearOf(row.req.dateFrom) || this.currentYear;
  }
  // คงเหลือของพนักงานคนนี้ ประเภทนี้ ในปีของใบลา (อัปเดตหลังอนุมัติ)
  remainingText(row: ApprovalRow): string {
    const year = this.reqYear(row);
    const ent = this.entitlementHours(row.emp, row.req.leaveType);
    const used = this.usedHours(row.emp, row.req.leaveType, year);
    return this.hoursToText(Math.max(0, ent - used));
  }

  statusInfo(status: string): { label: string; cls: string } {
    const s = status || 'pending';
    if (s === 'approved') return { label: 'อนุมัติแล้ว', cls: 'bg-success text-white' };
    if (s === 'rejected') return { label: 'ไม่อนุมัติ', cls: 'bg-danger text-white' };
    return { label: 'รออนุมัติ', cls: 'bg-warning text-dark' };
  }

  approve(r: LeaveRequest) {
    this.http.post<LeaveRequest>(`${environment.apiUrl}/leave-request/${r.id}/approve`, { approvedBy: this.currentUser })
      .subscribe(updated => this.requests.update(prev => prev.map(x => (x.id === updated.id ? updated : x))));
  }

  reject(r: LeaveRequest) {
    if (!window.confirm('ยืนยันไม่อนุมัติคำขอลานี้?')) return;
    this.http.post<LeaveRequest>(`${environment.apiUrl}/leave-request/${r.id}/reject`, { approvedBy: this.currentUser })
      .subscribe(updated => this.requests.update(prev => prev.map(x => (x.id === updated.id ? updated : x))));
  }
}
