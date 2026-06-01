import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from 'src/environments/environment';

export type Position = {
  id: number;
  code: string;
  nameTh: string;
  nameEn: string;
};

export type Approver = {
  id: number;
  userId: string;
  userName: string;
  positionIds: number[];
};

export type UserOption = {
  value: string;
  text: string;
};

type PositionForm = {
  id: number | null;
  code: string;
  nameTh: string;
  nameEn: string;
};

type PickerState = {
  open: boolean;
  approverId: number | null;
  selected: number[];
};

@Component({
  selector: 'app-dcsm45',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatTabsModule],
  templateUrl: './dcsm45.component.html',
})
export class Dcsm45Component implements OnInit {
  private http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/dcsm45`;

  readonly positions = signal<Position[]>([]);
  readonly approvers = signal<Approver[]>([]);
  readonly users = signal<UserOption[]>([]);

  // ฟอร์มตำแหน่ง (เพิ่ม/แก้ไข)
  positionForm: PositionForm = { id: null, code: '', nameTh: '', nameEn: '' };

  // เลือก user เพื่อสร้างผู้อนุมัติ
  selectedUserValue = '';

  // modal เลือกตำแหน่งที่อนุมัติได้
  readonly picker = signal<PickerState>({ open: false, approverId: null, selected: [] });

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.http.get<Position[]>(`${this.api}/positions`).subscribe(d => this.positions.set(d || []));
    this.http.get<Approver[]>(`${this.api}/approvers`).subscribe(d => this.approvers.set(d || []));
    this.http.get<UserOption[]>(`${environment.apiUrl}/user/all`).subscribe(d => this.users.set(d || []));
  }

  // ---------------- ตำแหน่ง ----------------
  get isEditingPosition(): boolean {
    return this.positionForm.id !== null;
  }

  savePosition() {
    const nameTh = this.positionForm.nameTh.trim();
    if (!nameTh) {
      alert('กรุณากรอกชื่อตำแหน่ง (ภาษาไทย)');
      return;
    }
    const payload = { nameTh, nameEn: this.positionForm.nameEn.trim() };

    if (this.positionForm.id === null) {
      this.http.post<Position>(`${this.api}/positions`, payload).subscribe(saved => {
        this.positions.update(prev => [...prev, saved]);
        this.resetPositionForm();
      });
    } else {
      this.http.put<Position>(`${this.api}/positions/${this.positionForm.id}`, payload).subscribe(saved => {
        this.positions.update(prev => prev.map(p => (p.id === saved.id ? saved : p)));
        this.resetPositionForm();
      });
    }
  }

  editPosition(p: Position) {
    this.positionForm = { id: p.id, code: p.code, nameTh: p.nameTh, nameEn: p.nameEn };
  }

  resetPositionForm() {
    this.positionForm = { id: null, code: '', nameTh: '', nameEn: '' };
  }

  deletePosition(p: Position) {
    if (!window.confirm(`ต้องการลบตำแหน่ง "${p.nameTh}" ใช่ไหม?`)) return;
    this.http.delete(`${this.api}/positions/${p.id}`).subscribe(() => {
      this.positions.update(prev => prev.filter(x => x.id !== p.id));
      // ถ้ากำลังแก้ไขตำแหน่งที่ลบอยู่ ให้เคลียร์ฟอร์ม
      if (this.positionForm.id === p.id) this.resetPositionForm();
    });
  }

  // ---------------- ผู้อนุมัติ ----------------
  // เหลือเฉพาะ user ที่ยังไม่ได้เป็นผู้อนุมัติ
  readonly availableUsers = computed(() => {
    const used = new Set(this.approvers().map(a => a.userId));
    return this.users().filter(u => !used.has(u.value));
  });

  createApprover() {
    const user = this.users().find(u => u.value === this.selectedUserValue);
    if (!user) {
      alert('กรุณาเลือกผู้ใช้');
      return;
    }
    const payload = { userId: user.value, userName: user.text, positionIds: [] as number[] };
    this.http.post<Approver>(`${this.api}/approvers`, payload).subscribe(saved => {
      this.approvers.update(prev => [...prev, saved]);
      this.selectedUserValue = '';
    });
  }

  deleteApprover(a: Approver) {
    if (!window.confirm(`ต้องการลบผู้อนุมัติ "${a.userName}" ใช่ไหม?`)) return;
    this.http.delete(`${this.api}/approvers/${a.id}`).subscribe(() => {
      this.approvers.update(prev => prev.filter(x => x.id !== a.id));
    });
  }

  // ตำแหน่งของผู้อนุมัติ (กรองเฉพาะตำแหน่งที่ยังมีอยู่จริง)
  approverPositions(a: Approver): Position[] {
    const map = new Map(this.positions().map(p => [p.id, p]));
    return a.positionIds
      .map(id => map.get(id))
      .filter((p): p is Position => !!p);
  }

  removePositionFromApprover(a: Approver, positionId: number) {
    const positionIds = a.positionIds.filter(id => id !== positionId);
    this.saveApproverPositions(a, positionIds);
  }

  // ---------------- modal เลือกตำแหน่ง ----------------
  openPicker(a: Approver) {
    this.picker.set({ open: true, approverId: a.id, selected: [...a.positionIds] });
  }

  closePicker() {
    this.picker.set({ open: false, approverId: null, selected: [] });
  }

  isPicked(positionId: number): boolean {
    return this.picker().selected.includes(positionId);
  }

  togglePicker(positionId: number, checked: boolean) {
    this.picker.update(s => {
      const selected = checked
        ? [...new Set([...s.selected, positionId])]
        : s.selected.filter(id => id !== positionId);
      return { ...s, selected };
    });
  }

  confirmPicker() {
    const state = this.picker();
    const a = this.approvers().find(x => x.id === state.approverId);
    if (!a) {
      this.closePicker();
      return;
    }
    this.saveApproverPositions(a, state.selected, () => this.closePicker());
  }

  private saveApproverPositions(a: Approver, positionIds: number[], done?: () => void) {
    const payload: Approver = { ...a, positionIds };
    this.http.put<Approver>(`${this.api}/approvers/${a.id}`, payload).subscribe(saved => {
      this.approvers.update(prev => prev.map(x => (x.id === saved.id ? saved : x)));
      if (done) done();
    });
  }
}
