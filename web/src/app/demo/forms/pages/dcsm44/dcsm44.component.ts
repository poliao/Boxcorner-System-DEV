import { Component, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';

export type Position = {
  id: number;
  code: string;
  nameTh: string;
  nameEn: string;
};

export type UserOption = {
  value: string;
  text: string;
};

export type Employee = {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  positionId: number | null;
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

type EmployeeForm = {
  id: number | null;
  code: string;
  firstName: string;
  lastName: string;
  positionId: number | null;
  username: string | null;
  monthlySalary: number | null;
  personalLeaveDays: number; personalLeaveHours: number;
  sickLeaveDays: number; sickLeaveHours: number;
  vacationLeaveDays: number; vacationLeaveHours: number;
  maternityLeaveDays: number; maternityLeaveHours: number;
  ordinationLeaveDays: number; ordinationLeaveHours: number;
};

function emptyForm(): EmployeeForm {
  return {
    id: null, code: '', firstName: '', lastName: '', positionId: null, username: null, monthlySalary: null,
    personalLeaveDays: 0, personalLeaveHours: 0,
    sickLeaveDays: 0, sickLeaveHours: 0,
    vacationLeaveDays: 0, vacationLeaveHours: 0,
    maternityLeaveDays: 0, maternityLeaveHours: 0,
    ordinationLeaveDays: 0, ordinationLeaveHours: 0,
  };
}

function thb(value: number | string | null | undefined): string {
  return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

@Component({
  selector: 'app-dcsm44',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm44.component.html',
})
export class Dcsm44Component implements OnInit {
  private http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/dcsm44`;

  readonly employees = signal<Employee[]>([]);
  readonly positions = signal<Position[]>([]);
  readonly users = signal<UserOption[]>([]);
  readonly requests = signal<LeaveRequest[]>([]);
  readonly thb = thb;
  readonly currentYear = new Date().getFullYear();

  // ---- ออกรายงานสรุปการลาเป็น Excel ----
  readonly THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  exportFrom = '';
  exportTo = '';
  empSearch = '';
  readonly selectedEmpIds = signal<Set<number>>(new Set<number>());
  readonly exporting = signal(false);

  employeeForm: EmployeeForm = emptyForm();

  readonly leaveTypes = [
    { label: 'ลากิจ', daysKey: 'personalLeaveDays', hoursKey: 'personalLeaveHours' },
    { label: 'ลาป่วย', daysKey: 'sickLeaveDays', hoursKey: 'sickLeaveHours' },
    { label: 'ลาพักร้อน', daysKey: 'vacationLeaveDays', hoursKey: 'vacationLeaveHours' },
    { label: 'ลาคลอด', daysKey: 'maternityLeaveDays', hoursKey: 'maternityLeaveHours' },
    { label: 'ลาบวช', daysKey: 'ordinationLeaveDays', hoursKey: 'ordinationLeaveHours' },
  ];

  ngOnInit() {
    this.loadEmployees();
    this.http.get<Position[]>(`${environment.apiUrl}/dcsm45/positions`).subscribe(d => this.positions.set(d || []));
    this.http.get<UserOption[]>(`${environment.apiUrl}/user/all`).subscribe(d => this.users.set(d || []));
    this.http.get<LeaveRequest[]>(`${environment.apiUrl}/leave-request`).subscribe(d => this.requests.set(d || []));
  }

  loadEmployees() {
    this.http.get<Employee[]>(`${this.api}/employees`).subscribe(d => this.employees.set(d || []));
  }

  positionName(id: number | null | undefined): string {
    if (id == null) return '-';
    const p = this.positions().find(x => x.id === id);
    return p ? `${p.nameTh} (${p.code})` : '-';
  }

  // พิมพ์รายงาน "แบบบันทึกการลา" (HR FM-01) ของพนักงานคนนี้ ปีปัจจุบัน
  printLeaveReport(e: Employee) {
    const url = `${environment.apiUrl}/leave-request/report?employeeId=${e.id}&year=${this.currentYear}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const u = URL.createObjectURL(blob);
        window.open(u, '_blank');
        setTimeout(() => URL.revokeObjectURL(u), 60000);
      },
      error: () => alert('สร้างรายงานไม่สำเร็จ — ตรวจสอบว่า restart backend แล้วหรือยัง'),
    });
  }

  get isEditing(): boolean {
    return this.employeeForm.id !== null;
  }

  // เงินเดือนรายวัน = เงินเดือน/เดือน ÷ 30 , รายชั่วโมง = รายวัน ÷ 8
  daily(monthly: number | null): number {
    return (Number(monthly) || 0) / 30;
  }
  hourly(monthly: number | null): number {
    return this.daily(monthly) / 8;
  }

  // เข้าถึงฟิลด์วันลาแบบ dynamic (form เป็น flat)
  leaveVal(key: string): number {
    return (this.employeeForm as any)[key] ?? 0;
  }
  setLeaveVal(key: string, v: unknown) {
    (this.employeeForm as any)[key] = Math.max(0, Number(v) || 0);
  }

  saveEmployee() {
    const firstName = this.employeeForm.firstName.trim();
    if (!firstName) {
      alert('กรุณากรอกชื่อพนักงาน');
      return;
    }
    const { id, code, ...rest } = this.employeeForm;
    const payload = {
      ...rest,
      firstName,
      lastName: this.employeeForm.lastName.trim(),
      monthlySalary: Number(this.employeeForm.monthlySalary) || 0,
    };

    if (id === null) {
      this.http.post<Employee>(`${this.api}/employees`, payload).subscribe(saved => {
        this.employees.update(prev => [...prev, saved]);
        this.resetForm();
      });
    } else {
      this.http.put<Employee>(`${this.api}/employees/${id}`, payload).subscribe(saved => {
        this.employees.update(prev => prev.map(e => (e.id === saved.id ? saved : e)));
        this.resetForm();
      });
    }
  }

  editEmployee(e: Employee) {
    this.employeeForm = { ...e };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm() {
    this.employeeForm = emptyForm();
  }

  deleteEmployee(e: Employee) {
    if (!window.confirm(`ต้องการลบพนักงาน "${e.firstName} ${e.lastName}" ใช่ไหม?`)) return;
    this.http.delete(`${this.api}/employees/${e.id}`).subscribe(() => {
      this.employees.update(prev => prev.filter(x => x.id !== e.id));
      if (this.employeeForm.id === e.id) this.resetForm();
    });
  }

  // ===== ออกรายงานสรุปการลา (Excel) =====
  get sortedEmployees(): Employee[] {
    return [...this.employees()].sort((a, b) => (a.code || '').localeCompare(b.code || ''));
  }

  isEmpSelected(id: number): boolean {
    return this.selectedEmpIds().has(id);
  }

  toggleEmp(id: number) {
    this.selectedEmpIds.update(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // รายชื่อพนักงานที่ผ่านการค้นหา (ชื่อ-นามสกุล หรือ รหัส)
  get filteredEmployees(): Employee[] {
    const q = this.empSearch.trim().toLowerCase();
    const list = this.sortedEmployees;
    if (!q) return list;
    return list.filter(e =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) || (e.code || '').toLowerCase().includes(q));
  }

  // ติ๊กทั้งหมด = อิงเฉพาะรายการที่ค้นหาเจอ (ไม่ยุ่งกับที่เลือกไว้นอกตัวกรอง)
  get allFilteredSelected(): boolean {
    const list = this.filteredEmployees;
    return list.length > 0 && list.every(e => this.selectedEmpIds().has(e.id));
  }

  toggleAllFiltered() {
    const list = this.filteredEmployees;
    const allSel = this.allFilteredSelected;
    this.selectedEmpIds.update(prev => {
      const next = new Set(prev);
      for (const e of list) {
        if (allSel) next.delete(e.id); else next.add(e.id);
      }
      return next;
    });
  }

  get canExport(): boolean {
    return !!this.exportFrom && !!this.exportTo && this.exportFrom <= this.exportTo
      && this.selectedEmpIds().size > 0 && !this.exporting();
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

  private fmtDate(d: string): string {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${dt.getFullYear()}`;
  }

  private thinBorder(): any {
    const b = { style: 'thin' as const, color: { argb: 'FFCCCCCC' } };
    return { top: b, left: b, bottom: b, right: b };
  }

  async exportXlsx() {
    if (!this.canExport) return;
    this.exporting.set(true);
    try {
      const ExcelJS = await import('exceljs');
      const from = new Date(this.exportFrom);
      const to = new Date(this.exportTo);
      const selected = this.selectedEmpIds();

      // ประเภทการลา + คีย์สิทธิ์ใน Employee
      const TYPES = [
        { label: 'ลาป่วย', match: 'ป่วย', dKey: 'sickLeaveDays', hKey: 'sickLeaveHours' },
        { label: 'ลากิจ', match: 'กิจ', dKey: 'personalLeaveDays', hKey: 'personalLeaveHours' },
        { label: 'ลาพักร้อน', match: 'พักร้อน', dKey: 'vacationLeaveDays', hKey: 'vacationLeaveHours' },
        { label: 'ลาคลอด', match: 'คลอด', dKey: 'maternityLeaveDays', hKey: 'maternityLeaveHours' },
        { label: 'ลาบวช', match: 'บวช', dKey: 'ordinationLeaveDays', hKey: 'ordinationLeaveHours' },
      ];

      const empList = this.employees().filter(e => selected.has(e.id))
        .sort((a, b) => (a.code || '').localeCompare(b.code || ''));
      const approved = this.requests().filter(r => r.status === 'approved' && selected.has(r.employeeId));

      const entHours = (e: Employee, t: { dKey: string; hKey: string }) =>
        ((e as any)[t.dKey] || 0) * 8 + ((e as any)[t.hKey] || 0);
      const dhText = (h: number) => {
        const d = Math.floor(h / 8);
        const hr = Math.round((h - d * 8) * 10) / 10;
        return `${d} วัน ${hr} ชม.`;
      };

      const wb = new ExcelJS.Workbook();
      wb.creator = 'BCA ERP / HR';

      const FIXED = ['ลำดับ', 'รหัสพนักงาน', 'ชื่อ-นามสกุล', 'ตำแหน่ง'];
      const NCOLS = FIXED.length + TYPES.length * 3; // ต่อประเภท 3 คอลัมน์ (สิทธิ์/ใช้ไป/คงเหลือ)
      const thinB = this.thinBorder();
      const HEAD = 'FF2F4050';
      const typeFill = ['FF2E5A88', 'FF3C7A5A', 'FFB8860B', 'FF8A5A2B', 'FF6A4C93']; // สีหัวกลุ่มแต่ละประเภท

      // วนทีละเดือนในช่วงที่เลือก: 1 ชีต = 1 เดือน
      let cur = new Date(from.getFullYear(), from.getMonth(), 1);
      const last = new Date(to.getFullYear(), to.getMonth(), 1);
      while (cur <= last) {
        const y = cur.getFullYear();
        const m = cur.getMonth();

        const ws = wb.addWorksheet(`${this.THAI_MONTHS[m]} ${y + 543}`, { views: [{ state: 'frozen', ySplit: 4 }] });
        ws.getColumn(1).width = 6; ws.getColumn(2).width = 13; ws.getColumn(3).width = 22; ws.getColumn(4).width = 20;
        TYPES.forEach((t, ti) => {
          const base = FIXED.length + 1 + ti * 3;
          ws.getColumn(base).width = 8;        // สิทธิ์
          ws.getColumn(base + 1).width = 14;   // ใช้ไป
          ws.getColumn(base + 2).width = 14;   // คงเหลือ
        });

        // หัวเรื่อง + คำอธิบาย
        ws.mergeCells(1, 1, 1, NCOLS);
        const title = ws.getCell(1, 1);
        title.value = `สรุปการลาประจำเดือน ${this.THAI_MONTHS[m]} ${y + 543}`;
        title.font = { bold: true, size: 16 };
        title.alignment = { vertical: 'middle', horizontal: 'center' };
        ws.getRow(1).height = 24;

        ws.mergeCells(2, 1, 2, NCOLS);
        const info = ws.getCell(2, 1);
        info.value = `ช่วงข้อมูล ${this.fmtDate(this.exportFrom)} - ${this.fmtDate(this.exportTo)}   |   สิทธิ์ / ใช้ไป / คงเหลือ = ยอดทั้งปี ${y + 543}  (สิทธิ์ = ใช้ไป + คงเหลือ)`;
        info.font = { size: 11, color: { argb: 'FF666666' } };
        info.alignment = { horizontal: 'center' };

        // ส่วนหัว 2 แถว: แถว 3 = ชื่อกลุ่ม (ประเภทลา), แถว 4 = สิทธิ์ / ใช้ไป / คงเหลือ
        const setHead = (cell: any, val: string, argb: string) => {
          cell.value = val;
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
          cell.fill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb } };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        };
        FIXED.forEach((h, i) => { ws.mergeCells(3, i + 1, 4, i + 1); setHead(ws.getCell(3, i + 1), h, HEAD); });
        TYPES.forEach((t, ti) => {
          const base = FIXED.length + 1 + ti * 3;
          ws.mergeCells(3, base, 3, base + 2);
          setHead(ws.getCell(3, base), t.label, typeFill[ti]);
          setHead(ws.getCell(4, base), 'สิทธิ์\n(วัน)', typeFill[ti]);
          setHead(ws.getCell(4, base + 1), 'ใช้ไป', typeFill[ti]);
          setHead(ws.getCell(4, base + 2), 'คงเหลือ', typeFill[ti]);
        });
        ws.getRow(3).height = 18; ws.getRow(4).height = 28;
        for (let r = 3; r <= 4; r++) for (let c = 1; c <= NCOLS; c++) ws.getCell(r, c).border = thinB;

        // แถวข้อมูล: 1 พนักงาน = 1 แถว (เฉพาะคนที่มีใบลาอนุมัติในเดือนนี้)
        let rowIdx = 5, seq = 1;
        for (const emp of empList) {
          const monthLeaves = approved.filter(r => {
            if (r.employeeId !== emp.id) return false;
            const d = new Date(r.dateFrom);
            return !isNaN(d.getTime()) && d >= from && d <= to && d.getFullYear() === y && d.getMonth() === m;
          });
          if (monthLeaves.length === 0) continue;

          const row = ws.getRow(rowIdx);
          row.getCell(1).value = seq;
          row.getCell(2).value = emp.code || '';
          row.getCell(3).value = `${emp.firstName} ${emp.lastName}`.trim();
          row.getCell(4).value = this.positionName(emp.positionId);

          TYPES.forEach((t, ti) => {
            const ent = entHours(emp, t);
            const usedYear = approved.filter(r => r.employeeId === emp.id && (r.leaveType || '').includes(t.match)
              && new Date(r.dateFrom).getFullYear() === y)
              .reduce((s, r) => s + this.durationHours(r.dateFrom, r.dateTo, r.timeFrom, r.timeTo), 0);
            const remain = Math.max(0, ent - usedYear);
            const base = FIXED.length + 1 + ti * 3;
            row.getCell(base).value = Math.round((ent / 8) * 100) / 100;
            row.getCell(base + 1).value = usedYear > 0 ? dhText(usedYear) : '';
            row.getCell(base + 2).value = dhText(remain);
          });

          for (let c = 1; c <= NCOLS; c++) {
            row.getCell(c).border = thinB;
            row.getCell(c).alignment = { vertical: 'middle', horizontal: c >= 2 && c <= 4 ? 'left' : 'center' };
          }
          rowIdx++; seq++;
        }

        if (seq === 1) {
          ws.mergeCells(5, 1, 5, NCOLS);
          const empty = ws.getCell(5, 1);
          empty.value = 'ไม่มีข้อมูลการลาในเดือนนี้';
          empty.alignment = { horizontal: 'center' };
          empty.font = { italic: true, color: { argb: 'FF999999' } };
        }

        cur = new Date(y, m + 1, 1);
      }

      const buf = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leave-summary_${this.exportFrom}_${this.exportTo}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('สร้างไฟล์ Excel ไม่สำเร็จ');
    } finally {
      this.exporting.set(false);
    }
  }
}
