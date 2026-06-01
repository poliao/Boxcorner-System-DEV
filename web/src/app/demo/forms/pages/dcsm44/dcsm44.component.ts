import { Component, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';

export type Employee = {
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

type EmployeeForm = {
  id: number | null;
  code: string;
  firstName: string;
  lastName: string;
  monthlySalary: number | null;
  personalLeaveDays: number; personalLeaveHours: number;
  sickLeaveDays: number; sickLeaveHours: number;
  vacationLeaveDays: number; vacationLeaveHours: number;
  maternityLeaveDays: number; maternityLeaveHours: number;
  ordinationLeaveDays: number; ordinationLeaveHours: number;
};

function emptyForm(): EmployeeForm {
  return {
    id: null, code: '', firstName: '', lastName: '', monthlySalary: null,
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
  readonly thb = thb;

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
  }

  loadEmployees() {
    this.http.get<Employee[]>(`${this.api}/employees`).subscribe(d => this.employees.set(d || []));
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
}
