import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

type WalletType = 'carry' | 'topup' | 'expense' | 'other';

type WalletEntry = {
  id: number;
  date: string;
  time: string;
  type: WalletType;
  paymentType?: string;
  jobStatus?: string;
  jobNo: string;
  jobOwner?: string;
  customer: string;
  description: string;
  amount: number;
  recorder: string;
  note: string;
};

type CloseRequest = {
  id?: number;
  jobNo: string;
  jobOwner?: string;
  reason: string;
  requestedBy: string;
  requestedAt?: string;
  status: 'pending' | 'approved';
  approvedBy?: string;
  approvedAt?: string;
};

type JobGroup = {
  jobNo: string;
  jobOwner: string;
  customer: string;
  firstDate: string;
  lastDate: string;
  totalExpense: number;
  rounds: number;
  lastStatus: string;
  requestStatus?: 'pending' | 'approved' | 'none';
  requestReason?: string;
  requestedBy?: string;
  requestedAt?: string;
};

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

function thb(value: number | string | null | undefined) {
  return Number(value || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function paginateRows<T>(rows: T[], page: number, pageSize: number) {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    total,
    totalPages,
    page: safePage,
  };
}

@Component({
  selector: 'app-dcsm43',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './dcsm43.component.html',
})
export class Dcsm43Component implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  readonly currentUser = this.authService.getFullName();
  readonly userRole = this.authService.getUserFromToken()?.role || '';
  readonly isAdmin = this.userRole === 'SupperAdmin';

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly thb = thb;

  readonly walletEntries = signal<WalletEntry[]>([]);
  readonly closeRequests = signal<CloseRequest[]>([]);

  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly keyword = signal('');
  readonly statusFilter = signal<'all' | 'open' | 'pending' | 'approved'>('all');

  readonly requestModal = signal<{ open: boolean; jobNo: string; reason: string; existing?: CloseRequest }>(
    { open: false, jobNo: '', reason: '' }
  );

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<WalletEntry[]>(`${environment.apiUrl}/dcsm42/lalamove`).subscribe(data => {
      this.walletEntries.set(data || []);
    });
    this.http.get<CloseRequest[]>(`${environment.apiUrl}/dcsm43/close-requests`).subscribe(data => {
      this.closeRequests.set(data || []);
    });
  }

  readonly jobGroups = computed<JobGroup[]>(() => {
    const requests = this.closeRequests();
    const reqMap = new Map<string, CloseRequest>();
    for (const r of requests) reqMap.set(r.jobNo, r);

    const expenseEntries = this.walletEntries().filter(
      (e) => e.type === 'expense' && e.jobNo && e.jobNo !== '-'
    );

    const groups = new Map<string, JobGroup>();
    for (const e of expenseEntries) {
      const existing = groups.get(e.jobNo);
      if (existing) {
        existing.totalExpense += e.amount;
        existing.rounds += 1;
        if (e.date < existing.firstDate) existing.firstDate = e.date;
        if (e.date > existing.lastDate) {
          existing.lastDate = e.date;
          existing.lastStatus = e.jobStatus || 'N/A';
        }
        if (!existing.jobOwner && e.jobOwner) existing.jobOwner = e.jobOwner;
        if (!existing.customer && e.customer) existing.customer = e.customer;
      } else {
        groups.set(e.jobNo, {
          jobNo: e.jobNo,
          jobOwner: e.jobOwner || '-',
          customer: e.customer || '-',
          firstDate: e.date,
          lastDate: e.date,
          totalExpense: e.amount,
          rounds: 1,
          lastStatus: e.jobStatus || 'N/A',
        });
      }
    }

    const result: JobGroup[] = [];
    for (const g of groups.values()) {
      if (g.lastStatus === 'เสร็จสิ้น') continue;
      const req = reqMap.get(g.jobNo);
      if (req) {
        g.requestStatus = req.status;
        g.requestReason = req.reason;
        g.requestedBy = req.requestedBy;
        g.requestedAt = req.requestedAt;
      } else {
        g.requestStatus = 'none';
      }
      result.push(g);
    }

    if (!this.isAdmin) {
      const me = this.currentUser;
      return result
        .filter((g) => g.jobOwner === me)
        .sort((a, b) => (a.lastDate < b.lastDate ? 1 : -1));
    }
    return result.sort((a, b) => (a.lastDate < b.lastDate ? 1 : -1));
  });

  readonly filteredGroups = computed(() => {
    const k = this.keyword().trim().toLowerCase();
    const s = this.statusFilter();
    return this.jobGroups().filter((g) => {
      if (k) {
        const hay = `${g.jobNo} ${g.jobOwner} ${g.customer}`.toLowerCase();
        if (!hay.includes(k)) return false;
      }
      if (s === 'open' && g.requestStatus !== 'none') return false;
      if (s === 'pending' && g.requestStatus !== 'pending') return false;
      if (s === 'approved' && g.requestStatus !== 'approved') return false;
      return true;
    });
  });

  readonly paging = computed(() => paginateRows(this.filteredGroups(), this.page(), this.pageSize()));

  readonly summary = computed(() => {
    const groups = this.jobGroups();
    return {
      total: groups.length,
      pending: groups.filter((g) => g.requestStatus === 'pending').length,
      open: groups.filter((g) => g.requestStatus === 'none').length,
    };
  });

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  openRequestModal(group: JobGroup) {
    const existing = this.closeRequests().find((r) => r.jobNo === group.jobNo && r.status === 'pending');
    this.requestModal.set({
      open: true,
      jobNo: group.jobNo,
      reason: existing?.reason || '',
      existing,
    });
  }

  closeRequestModal() {
    this.requestModal.set({ open: false, jobNo: '', reason: '' });
  }

  setRequestReason(reason: string) {
    this.requestModal.update((s) => ({ ...s, reason }));
  }

  submitCloseRequest() {
    const state = this.requestModal();
    const reason = state.reason.trim();
    if (!reason) {
      alert('กรุณากรอกเหตุผลที่ขอปิดงาน');
      return;
    }
    const group = this.jobGroups().find((g) => g.jobNo === state.jobNo);
    const payload: CloseRequest = {
      jobNo: state.jobNo,
      jobOwner: group?.jobOwner || this.currentUser,
      reason,
      requestedBy: this.currentUser,
      status: 'pending',
    };
    this.http.post<CloseRequest>(`${environment.apiUrl}/dcsm43/close-requests`, payload).subscribe((saved) => {
      this.closeRequests.update((prev) => {
        const filtered = prev.filter((r) => r.jobNo !== saved.jobNo);
        return [...filtered, saved];
      });
      this.closeRequestModal();
    });
  }

  approveRequest(group: JobGroup) {
    if (!this.isAdmin) return;
    if (!window.confirm(`ยืนยันอนุมัติปิดงาน JO: ${group.jobNo} ?`)) return;
    const payload: CloseRequest = {
      jobNo: group.jobNo,
      reason: group.requestReason || '',
      requestedBy: group.requestedBy || '',
      approvedBy: this.currentUser,
      status: 'approved',
    };
    this.http.post<CloseRequest>(`${environment.apiUrl}/dcsm43/close-requests/${encodeURIComponent(group.jobNo)}/approve`, payload).subscribe(() => {
      this.loadData();
    });
  }
}
