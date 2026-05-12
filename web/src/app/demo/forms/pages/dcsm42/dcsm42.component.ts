import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';

type MenuKey = 'lalamove' | 'transportCash' | 'officeCash';
type WalletType = 'carry' | 'topup' | 'expense' | 'other';
type WalletTypeFilter = WalletType | 'all';
type CashType = 'topup' | 'expense';
type CashTypeFilter = CashType | 'all';

export type JobStatus = string;

export type WalletEntry = {
  id: number;
  date: string;
  time: string;
  type: WalletType;
  paymentType?: string;
  jobStatus?: JobStatus;
  jobNo: string;
  jobOwner?: string;
  customer: string;
  description: string;
  amount: number;
  recorder: string;
  note: string;
};

export type UserOption = {
  value: string;
  text: string;
};

export type WalletRow = WalletEntry & {
  income: number;
  expense: number;
  balance: number;
};

export type CashEntry = {
  id: number;
  cashType: CashType;
  menuKey: string;
  date: string;
  time: string;
  withdrawer: string;
  approver: string;
  department: string;
  category: string;
  jobNo: string;
  jobStatus?: JobStatus;
  description: string;
  amount: number;
  recorder: string;
  note: string;
};

export type CashRow = CashEntry & {
  income: number;
  expense: number;
  balance: number;
};

type WalletFilters = {
  jobNo: string;
  type: WalletTypeFilter;
  dateFrom: string;
  dateTo: string;
};

type CashFilters = {
  keyword: string;
  withdrawer: string;
  cashType: CashTypeFilter;
  category: string;
  dateFrom: string;
  dateTo: string;
};

type DetailModalState = {
  open: boolean;
  title: string;
  fields: Array<{ label: string; value: string }>;
};

const today = new Date().toISOString().slice(0, 10);
const currentMonth = today.slice(0, 7);
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];
const NEW_LINE = String.fromCharCode(10);
const BOM = String.fromCharCode(0xfeff);

const pettyCashCategories = [
  'เติมเงินสดย่อย',
  'เบิกซื้อของ',
  'เบิกค่าเดินทาง',
  'เบิกค่าอาหาร',
  'เบิกค่าเอกสาร',
  'อื่นๆ'
];

const walletTypeMap: Record<WalletType, { label: string, badge: string }> = {
  carry: { label: 'ยอดยกมา', badge: 'bg-secondary text-white' },
  topup: { label: 'เติมเงิน', badge: 'bg-primary text-white' },
  expense: { label: 'เรียก Lalamove', badge: 'bg-danger text-white' },
  other: { label: 'อื่นๆ', badge: 'bg-warning text-dark' }
};

const jobStatusMap: Record<string, { badge: string }> = {
  'ส่งตัวอย่าง': { badge: 'bg-info text-dark' },
  'ส่งงานจริง': { badge: 'bg-primary text-white' },
  'ส่งงานเพิ่มเติม': { badge: 'bg-warning text-dark' },
  'เสร็จสิ้น': { badge: 'bg-success text-white' },
  'N/A': { badge: 'bg-light text-muted border' },
};

function nextWalletJobRound(entries: WalletEntry[], jobNo: string): JobStatus {
  if (!jobNo || jobNo === '-') return 'N/A';
  const count = entries.filter((e) => e.type === 'expense' && e.jobNo === jobNo).length;
  return `ส่งรอบ ${count + 1}`;
}

function nextCashJobRound(entries: CashEntry[], jobNo: string): JobStatus {
  if (!jobNo || jobNo === '-') return 'N/A';
  const count = entries.filter((e) => e.cashType === 'expense' && e.jobNo === jobNo).length;
  return `ส่งรอบ ${count + 1}`;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function getCurrentTime() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function thb(value: number | string | null | undefined) {
  return Number(value || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function csvEscape(value: unknown) {
  const safeValue = String(value ?? '');
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function makeCsv(headers: string[], dataRows: Array<Array<string | number>>) {
  return [headers, ...dataRows].map((line) => line.map(csvEscape).join(',')).join(NEW_LINE);
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

function calculateWalletRows(entries: WalletEntry[]): WalletRow[] {
  let balance = 0;
  return entries.map(entry => {
    const isIncome = entry.type === 'carry' || entry.type === 'topup';
    const income = isIncome ? entry.amount : 0;
    const expense = !isIncome ? entry.amount : 0;
    balance += income - expense;
    return { ...entry, income, expense, balance };
  });
}

function calculateCashRows(entries: CashEntry[]): CashRow[] {
  let balance = 0;
  return entries.map(entry => {
    const income = entry.cashType === 'topup' ? entry.amount : 0;
    const expense = entry.cashType === 'expense' ? entry.amount : 0;
    balance += income - expense;
    return { ...entry, income, expense, balance };
  });
}

function filterWalletRows(rows: WalletRow[], filters: WalletFilters): WalletRow[] {
  return rows.filter(row => {
    if (filters.jobNo && !row.jobNo.includes(filters.jobNo)) return false;
    if (filters.type !== 'all' && row.type !== filters.type) return false;
    if (filters.dateFrom && row.date < filters.dateFrom) return false;
    if (filters.dateTo && row.date > filters.dateTo) return false;
    return true;
  });
}

function filterCashRows(rows: CashRow[], filters: CashFilters, month: string): CashRow[] {
  return rows.filter(row => {
    if (filters.keyword && !row.description.includes(filters.keyword) && !row.jobNo.includes(filters.keyword)) return false;
    if (filters.withdrawer && !row.withdrawer.includes(filters.withdrawer)) return false;
    if (filters.cashType !== 'all' && row.cashType !== filters.cashType) return false;
    if (filters.category !== 'all' && row.category !== filters.category) return false;
    if (filters.dateFrom && row.date < filters.dateFrom) return false;
    if (filters.dateTo && row.date > filters.dateTo) return false;
    return true;
  });
}

@Component({
  selector: 'app-dcsm42',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './dcsm42.component.html',
})
export class Dcsm42Component implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private currentRecorder = this.authService.getFullName();
  readonly userRole = this.authService.getUserFromToken()?.role || '';

  readonly today = today;
  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly pettyCashCategories = pettyCashCategories;
  readonly String = String;
  readonly thb = thb;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<WalletEntry[]>(`${environment.apiUrl}/dcsm42/lalamove`).subscribe(data => {
      this.walletEntries.set(data || []);
    });
    this.http.get<CashEntry[]>(`${environment.apiUrl}/dcsm42/pettyCash`).subscribe(data => {
      const allCash = data || [];
      this.transportCashEntries.set(allCash.filter(c => c.menuKey === 'transportCash'));
      this.officeCashEntries.set(allCash.filter(c => c.menuKey === 'officeCash'));
    });
    this.http.get<UserOption[]>(`${environment.apiUrl}/user/all`).subscribe(data => {
      this.users.set(data || []);
    });
  }

  readonly activeMenu = signal<MenuKey>('lalamove');
  readonly month = signal(currentMonth);
  readonly showReport = signal(false);
  readonly walletPage = signal(1);
  readonly walletPageSize = signal(10);
  readonly cashPage = signal(1);
  readonly cashPageSize = signal(10);
  readonly detailModal = signal<DetailModalState>({ open: false, title: '', fields: [] });

  readonly walletEntries = signal<WalletEntry[]>([]);
  readonly transportCashEntries = signal<CashEntry[]>([]);
  readonly officeCashEntries = signal<CashEntry[]>([]);
  readonly users = signal<UserOption[]>([]);

  readonly filterTrigger = signal(0);
  onFilterChange() {
    this.filterTrigger.update(v => v + 1);
  }

  walletFilters: WalletFilters = { jobNo: '', type: 'all', dateFrom: '', dateTo: '' };
  transportCashFilters: CashFilters = { keyword: '', withdrawer: '', cashType: 'all', category: 'all', dateFrom: '', dateTo: '' };
  officeCashFilters: CashFilters = { keyword: '', withdrawer: '', cashType: 'all', category: 'all', dateFrom: '', dateTo: '' };

  walletForm = { date: today, type: 'expense' as WalletType, paymentType: 'จ่ายเอง', jobNo: '', jobOwner: '', customer: '', description: '', amount: '', recorder: this.currentRecorder, note: '' };
  transportCashForm = { cashType: 'expense' as CashType, withdrawer: '', approver: '', department: 'ขนส่ง', category: 'เบิกซื้อของ', jobNo: '', description: '', amount: '', recorder: this.currentRecorder, note: '' };
  officeCashForm = { cashType: 'expense' as CashType, withdrawer: '', approver: '', department: 'ออฟฟิศ', category: 'เบิกค่าเอกสาร', jobNo: '', description: '', amount: '', recorder: this.currentRecorder, note: '' };

  readonly isOfficeCash = computed(() => this.activeMenu() === 'officeCash');

  get themeName() {
    if (this.activeMenu() === 'lalamove') return 'Lalamove';
    if (this.activeMenu() === 'transportCash') return 'เงินสดย่อยขนส่ง';
    return 'เงินสดย่อยออฟฟิศ';
  }

  readonly walletRows = computed(() => calculateWalletRows(this.walletEntries()));
  readonly walletMonthRows = computed(() => this.walletRows().filter((row) => row.date.startsWith(this.month())));
  readonly filteredWalletRows = computed(() => {
    this.filterTrigger();
    const hasDateFilter = this.walletFilters.dateFrom || this.walletFilters.dateTo;
    const baseRows = hasDateFilter ? this.walletRows() : this.walletMonthRows();
    return filterWalletRows(baseRows, this.walletFilters);
  });
  readonly walletPaging = computed(() => paginateRows(this.filteredWalletRows(), this.walletPage(), this.walletPageSize()));

  readonly transportCashRows = computed(() => calculateCashRows(this.transportCashEntries()));
  readonly officeCashRows = computed(() => calculateCashRows(this.officeCashEntries()));
  readonly activeCashRowsAll = computed(() => (this.isOfficeCash() ? this.officeCashRows() : this.transportCashRows()));
  readonly activeCashFilters = computed(() => {
    this.filterTrigger();
    return this.isOfficeCash() ? this.officeCashFilters : this.transportCashFilters;
  });
  readonly activeCashForm = computed(() => (this.isOfficeCash() ? this.officeCashForm : this.transportCashForm));
  readonly filteredCashRows = computed(() => {
    this.filterTrigger();
    const filters = this.activeCashFilters();
    const hasDateFilter = filters.dateFrom || filters.dateTo;
    let baseRows = this.activeCashRowsAll();
    if (!hasDateFilter) {
      baseRows = baseRows.filter(row => row.date.startsWith(this.month()));
    }
    return filterCashRows(baseRows, filters, this.month());
  });
  readonly cashPaging = computed(() => paginateRows(this.filteredCashRows(), this.cashPage(), this.cashPageSize()));

  readonly walletSummary = computed(() => {
    const monthRows = this.walletMonthRows();
    const totalIncome = monthRows.reduce((sum, row) => sum + row.income, 0);
    const totalExpense = monthRows.reduce((sum, row) => sum + row.expense, 0);
    const currentBalance = this.walletRows().length ? this.walletRows()[this.walletRows().length - 1].balance : 0;
    const lalamoveCount = monthRows.filter((row) => row.type === 'expense').length;
    const otherExpenseCount = monthRows.filter((row) => row.type === 'other').length;
    return { totalIncome, totalExpense, currentBalance, lalamoveCount, otherExpenseCount };
  });

  readonly walletSearchSummary = computed(() => {
    const rows = this.filteredWalletRows();
    return {
      totalExpense: rows.reduce((sum, row) => sum + row.expense, 0),
      lalamoveExpense: rows.filter((row) => row.type === 'expense').reduce((sum, row) => sum + row.expense, 0),
      otherExpense: rows.filter((row) => row.type === 'other').reduce((sum, row) => sum + row.expense, 0),
      count: rows.length,
    };
  });

  readonly cashSummary = computed(() => {
    const monthRows = this.activeCashRowsAll().filter((row) => row.date.startsWith(this.month()));
    const filteredRows = this.filteredCashRows();
    return {
      totalTopup: monthRows.reduce((sum, row) => sum + row.income, 0),
      totalExpense: monthRows.reduce((sum, row) => sum + row.expense, 0),
      currentBalance: this.activeCashRowsAll().length ? this.activeCashRowsAll()[this.activeCashRowsAll().length - 1].balance : 0,
      count: filteredRows.length,
      uniqueWithdrawers: new Set(filteredRows.filter((row) => row.cashType === 'expense').map((row) => row.withdrawer)).size,
    };
  });

  currentTime() {
    return getCurrentTime();
  }

  setMenuByIndex(index: number) {
    const menus: MenuKey[] = ['lalamove', 'transportCash', 'officeCash'];
    this.activeMenu.set(menus[index]);
    this.walletPage.set(1);
    this.cashPage.set(1);
  }

  walletTypeLabel(type: WalletType) {
    return walletTypeMap[type].label;
  }

  walletBadge(type: WalletType) {
    return walletTypeMap[type].badge;
  }

  walletReportSummaryItems() {
    const summary = this.walletSummary();
    return [
      { title: 'เงินเข้าเดือนนี้', value: thb(summary.totalIncome), color: 'text-primary' },
      { title: 'ใช้เงินเดือนนี้', value: thb(summary.totalExpense), color: 'text-danger' },
      { title: 'คงเหลือล่าสุด', value: thb(summary.currentBalance), color: 'text-success' },
      { title: 'รายการค่าใช้จ่าย', value: String(summary.lalamoveCount + summary.otherExpenseCount), color: 'text-dark' },
    ];
  }

  cashReportSummaryItems() {
    const summary = this.cashSummary();
    return [
      { title: 'เติมเงินเดือนนี้', value: thb(summary.totalTopup), color: 'text-primary' },
      { title: 'เบิกเงินเดือนนี้', value: thb(summary.totalExpense), color: 'text-danger' },
      { title: 'คงเหลือล่าสุด', value: thb(summary.currentBalance), color: 'text-success' },
      { title: 'จำนวนรายการ', value: String(summary.count), color: 'text-dark' },
    ];
  }

  clearWalletFilters() {
    this.walletFilters = { jobNo: '', type: 'all', dateFrom: '', dateTo: '' };
    this.onFilterChange();
  }

  clearCashFilters() {
    if (this.isOfficeCash()) {
      this.officeCashFilters = { keyword: '', withdrawer: '', cashType: 'all', category: 'all', dateFrom: '', dateTo: '' };
    } else {
      this.transportCashFilters = { keyword: '', withdrawer: '', cashType: 'all', category: 'all', dateFrom: '', dateTo: '' };
    }
    this.onFilterChange();
  }

  setCashType(type: CashType) {
    const form = this.activeCashForm();
    form.cashType = type;
    if (type === 'topup') {
      form.category = 'เติมเงินสดย่อย';
      form.withdrawer = '';
    } else if (form.category === 'เติมเงินสดย่อย') {
      form.category = 'เบิกซื้อของ';
    }
  }

  readonly addWalletEntry = () => {
    const amount = Number(this.walletForm.amount);
    if (!amount || amount <= 0) return alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
    if (this.walletForm.type === 'expense' && !this.walletForm.jobNo.trim()) return alert('รายการค่า Lalamove ต้องระบุเลขที่จ๊อบ');
    const d = new Date();
    const entryDate = this.walletForm.date || d.toISOString().slice(0, 10);
    const entryTime = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const description = this.walletForm.description.trim() || this.getWalletDefaultDescription(this.walletForm.type);
    
    const jobNo = this.walletForm.jobNo.trim() || '-';
    const payload = {
      date: entryDate,
      time: entryTime,
      type: this.walletForm.type,
      paymentType: this.walletForm.paymentType,
      jobStatus: this.walletForm.type === 'expense' ? nextWalletJobRound(this.walletEntries(), jobNo) : 'N/A',
      jobNo,
      jobOwner: this.walletForm.jobOwner.trim() || '-',
      customer: this.walletForm.customer.trim() || '-',
      description,
      amount,
      recorder: this.walletForm.recorder.trim() || '-',
      note: this.walletForm.note.trim() || '-',
    };

    this.http.post<WalletEntry>(`${environment.apiUrl}/dcsm42/lalamove`, payload).subscribe(newEntry => {
      this.walletEntries.update((prev) => [...prev, newEntry]);
      this.resetWalletForm();
    });
  };

  readonly resetWalletForm = () => {
    this.walletForm = { date: today, type: 'expense', paymentType: 'จ่ายเอง', jobNo: '', jobOwner: '', customer: '', description: '', amount: '', recorder: this.currentRecorder, note: '' };
  };

  getWalletDefaultDescription(type: WalletType) {
    if (type === 'topup') return 'เติมเงินเข้า Lalamove Wallet';
    if (type === 'carry') return 'ยอดเงินคงเหลือยกมา';
    if (type === 'other') return 'ค่าใช้จ่ายอื่นๆ';
    return 'ค่าเรียก Lalamove ส่งงาน';
  }

  readonly addCashEntry = () => {
    const form = this.activeCashForm();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
    if (form.cashType === 'expense' && !form.withdrawer.trim()) return alert(`กรุณาระบุคนที่เบิกไป${this.themeName}`);
    const d = new Date();
    const entryDate = d.toISOString().slice(0, 10);
    const entryTime = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    
    const jobNo = form.jobNo.trim() || '-';
    const jobStatus = this.activeMenu() === 'transportCash' && form.cashType === 'expense'
      ? nextCashJobRound(this.transportCashEntries(), jobNo)
      : 'N/A';
    const payload = {
      cashType: form.cashType,
      menuKey: this.activeMenu(),
      date: entryDate,
      time: entryTime,
      withdrawer: form.cashType === 'topup' ? '-' : form.withdrawer.trim(),
      approver: form.approver.trim() || form.recorder.trim() || '-',
      department: form.department.trim() || this.themeName,
      category: form.cashType === 'topup' ? 'เติมเงินสดย่อย' : form.category,
      jobNo,
      jobStatus,
      description: form.description.trim() || (form.cashType === 'topup' ? `เติมเงินสดย่อย${this.themeName}` : form.category),
      amount,
      recorder: form.recorder.trim() || '-',
      note: form.note.trim() || '-',
    };

    this.http.post<CashEntry>(`${environment.apiUrl}/dcsm42/pettyCash`, payload).subscribe(newEntry => {
      if (newEntry.menuKey === 'officeCash') {
        this.officeCashEntries.update((prev) => [...prev, newEntry]);
        this.resetOfficeCashForm();
      } else {
        this.transportCashEntries.update((prev) => [...prev, newEntry]);
        this.resetTransportCashForm();
      }
    });
  };

  readonly resetCashForm = () => {
    if (this.isOfficeCash()) this.resetOfficeCashForm();
    else this.resetTransportCashForm();
  };

  resetTransportCashForm() {
    this.transportCashForm = { cashType: 'expense', withdrawer: '', approver: '', department: 'ขนส่ง', category: 'เบิกซื้อของ', jobNo: '', description: '', amount: '', recorder: this.currentRecorder, note: '' };
  }

  resetOfficeCashForm() {
    this.officeCashForm = { cashType: 'expense', withdrawer: '', approver: '', department: 'ออฟฟิศ', category: 'เบิกค่าเอกสาร', jobNo: '', description: '', amount: '', recorder: this.currentRecorder, note: '' };
  }

  deleteWalletEntry(id: number) {
    if (window.confirm('ต้องการลบรายการนี้ใช่ไหม?')) {
      this.http.delete(`${environment.apiUrl}/dcsm42/lalamove/${id}`).subscribe(() => {
        this.walletEntries.update((prev) => prev.filter((entry) => entry.id !== id));
      });
    }
  }

  closeWalletJob(jobNo: string) {
    if (!jobNo || jobNo === '-') return;
    if (!window.confirm(`ยืนยันปิดงาน JO: ${jobNo} ?\nทุกรายการของจ๊อบนี้จะถูกปิดพร้อมกัน`)) return;
    const encodedJobNo = encodeURIComponent(jobNo);
    this.http.patch<WalletEntry[]>(`${environment.apiUrl}/dcsm42/lalamove/close-by-job/${encodedJobNo}`, {}).subscribe(() => {
      this.walletEntries.update((prev) =>
        prev.map(entry =>
          entry.jobNo === jobNo && entry.type === 'expense'
            ? { ...entry, jobStatus: 'เสร็จสิ้น' as JobStatus }
            : entry
        )
      );
    });
  }

  closeCashJob(jobNo: string) {
    if (!jobNo || jobNo === '-') return;
    if (!window.confirm(`ยืนยันปิดงาน JO: ${jobNo} ?\nทุกรายการของจ๊อบนี้จะถูกปิดพร้อมกัน`)) return;
    const encodedJobNo = encodeURIComponent(jobNo);
    this.http.patch<CashEntry[]>(`${environment.apiUrl}/dcsm42/pettyCash/close-by-job/${encodedJobNo}`, {}).subscribe(() => {
      this.transportCashEntries.update((prev) =>
        prev.map(entry =>
          entry.jobNo === jobNo && entry.cashType === 'expense'
            ? { ...entry, jobStatus: 'เสร็จสิ้น' as JobStatus }
            : entry
        )
      );
    });
  }

  deleteCashEntry(id: number) {
    if (!window.confirm(`ต้องการลบรายการ${this.themeName}นี้ใช่ไหม?`)) return;
    this.http.delete(`${environment.apiUrl}/dcsm42/pettyCash/${id}`).subscribe(() => {
      if (this.isOfficeCash()) this.officeCashEntries.update((prev) => prev.filter((entry) => entry.id !== id));
      else this.transportCashEntries.update((prev) => prev.filter((entry) => entry.id !== id));
    });
  }

  jobStatusLabel(status: JobStatus | undefined) {
    return status || 'N/A';
  }

  jobStatusBadge(status: JobStatus | undefined) {
    if (!status) return jobStatusMap['N/A'].badge;
    if (jobStatusMap[status]) return jobStatusMap[status].badge;
    if (status.startsWith('ส่งรอบ')) return 'bg-primary text-white';
    return jobStatusMap['N/A'].badge;
  }

  openWalletDetail(row: WalletRow) {
    this.detailModal.set({
      open: true,
      title: 'รายละเอียดรายการ Lalamove',
      fields: [
        { label: 'วันที่', value: row.date },
        { label: 'เวลา', value: row.time },
        { label: 'ประเภท', value: this.walletTypeLabel(row.type) },
        { label: 'การจ่ายเงิน', value: row.paymentType || '-' },
        { label: 'สถานะงาน JO', value: row.jobStatus || 'N/A' },
        { label: 'เลขที่จ๊อบ', value: row.jobNo },
        { label: 'เจ้าของงาน', value: row.jobOwner || '-' },
        { label: 'ลูกค้า', value: row.customer },
        { label: 'รายละเอียด', value: row.description },
        { label: 'เงินเข้า', value: row.income ? thb(row.income) : '-' },
        { label: 'เงินออก', value: row.expense ? thb(row.expense) : '-' },
        { label: 'คงเหลือ', value: thb(row.balance) },
        { label: 'ผู้บันทึก', value: row.recorder },
        { label: 'หมายเหตุ', value: row.note },
      ],
    });
  }

  openCashDetail(row: CashRow) {
    this.detailModal.set({
      open: true,
      title: `รายละเอียด${this.themeName}`,
      fields: [
        { label: 'วันที่', value: row.date },
        { label: 'เวลา', value: row.time },
        { label: 'รายการ', value: row.cashType === 'topup' ? 'เติมเงิน' : 'เบิกเงิน' },
        { label: 'คนที่เบิกไป', value: row.withdrawer },
        { label: 'ผู้อนุมัติให้เบิก', value: row.approver },
        { label: 'ฝ่าย', value: row.department },
        { label: 'ประเภท', value: row.category },
        { label: 'จ๊อบ/อ้างอิง', value: row.jobNo },
        { label: 'สถานะงาน JO', value: row.jobStatus || 'N/A' },
        { label: 'รายละเอียด', value: row.description },
        { label: 'เงินเข้า', value: row.income ? thb(row.income) : '-' },
        { label: 'เงินออก', value: row.expense ? thb(row.expense) : '-' },
        { label: 'คงเหลือ', value: thb(row.balance) },
        { label: 'ผู้บันทึก', value: row.recorder },
        { label: 'หมายเหตุ', value: row.note },
      ],
    });
  }

  closeDetail() {
    this.detailModal.set({ open: false, title: '', fields: [] });
  }

  onPageChange(type: 'wallet' | 'cash', event: PageEvent) {
    if (type === 'wallet') {
      this.walletPage.set(event.pageIndex + 1);
      this.walletPageSize.set(event.pageSize);
    } else {
      this.cashPage.set(event.pageIndex + 1);
      this.cashPageSize.set(event.pageSize);
    }
  }

  exportPDF() {
    window.print();
  }

  exportExcel() {
    const csvContent = this.activeMenu() === 'lalamove'
      ? makeCsv(['วันที่', 'เวลา', 'ประเภท', 'การจ่ายเงิน', 'สถานะงาน JO', 'เลขที่จ๊อบ', 'เจ้าของงาน', 'ลูกค้า', 'รายละเอียด', 'เงินเข้า', 'เงินออก', 'คงเหลือ', 'ผู้บันทึก', 'หมายเหตุ'], this.filteredWalletRows().map((row) => [row.date, row.time, this.walletTypeLabel(row.type), row.paymentType || '-', row.jobStatus || 'N/A', row.jobNo, row.jobOwner || '-', row.customer, row.description, row.income || '', row.expense || '', row.balance, row.recorder, row.note]))
      : makeCsv(['วันที่', 'เวลา', 'รายการ', 'คนที่เบิกไป', 'ผู้อนุมัติให้เบิก', 'ฝ่าย', 'ประเภท', 'เลขที่จ๊อบ', 'รายละเอียด', 'เงินเข้า', 'เงินออก', 'คงเหลือ', 'ผู้บันทึก', 'หมายเหตุ'], this.filteredCashRows().map((row) => [row.date, row.time, row.cashType === 'topup' ? 'เติมเงิน' : 'เบิกเงิน', row.withdrawer, row.approver, row.department, row.category, row.jobNo, row.description, row.income || '', row.expense || '', row.balance, row.recorder, row.note]));
    const fileName = this.activeMenu() === 'lalamove' ? `lalamove-report-${this.month()}.csv` : this.isOfficeCash() ? `office-cash-report-${this.month()}.csv` : `transport-cash-report-${this.month()}.csv`;
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
