import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';

type Employee = { code: string; firstName: string; lastName: string; online?: boolean };

type Scan = { id: string; name: string; date: string; sec: number; timeStr: string };

// 1 แถวในรายงาน = 1 พนักงาน ต่อ 1 วัน
type ScanRow = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD (ใช้เรียงลำดับ)
  dateDisplay: string; // D/M/YYYY (ตามภาพ)
  morningIn: string; // เข้าเช้า  = สแกนแรกของวัน
  noonOut: string; // ออกเที่ยง = สแกนช่วงพักเที่ยงตัวแรก
  noonIn: string; // เข้าบ่าย  = สแกนช่วงพักเที่ยงตัวสุดท้าย
  eveningOut: string; // ออกเย็น   = สแกนสุดท้ายของวัน
  scanCount: number;
  inRegistry: boolean; // false = รหัสนี้มีในไฟล์แต่ไม่มีในทะเบียนพนักงาน
  online: boolean; // true = พนักงานทำงานออนไลน์ → แสดง "ออนไลน์" รวม 4 ช่องเวลา
};

@Component({
  selector: 'app-scan-import',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './scan-import.component.html',
})
export class ScanImportComponent implements OnInit {
  private http = inject(HttpClient);

  readonly fileName = signal('');
  readonly employees = signal<Employee[]>([]);
  readonly employeesError = signal(false);
  readonly totalScans = signal(0);
  readonly error = signal('');
  readonly parsing = signal(false);
  readonly exporting = signal(false);

  // ข้อมูลดิบจากไฟล์สแกน
  private readonly scanGroups = signal<Map<string, Scan[]>>(new Map()); // key = `${id}__${date}`
  private readonly scanDates = signal<string[]>([]); // วันที่ที่พบในไฟล์ (เรียงแล้ว)
  private readonly fileNames = signal<Map<string, string>>(new Map()); // id -> ชื่อจากไฟล์ (ใช้กรณีไม่มีในทะเบียน)

  ngOnInit() {
    this.http.get<Employee[]>(`${environment.apiUrl}/dcsm44/employees`).subscribe({
      next: (d) => this.employees.set(d || []),
      error: () => this.employeesError.set(true),
    });
  }

  // เซ็ตรหัสที่มีสแกนในไฟล์
  private readonly scanIdSet = computed(() => {
    const s = new Set<string>();
    for (const k of this.scanGroups().keys()) s.add(k.slice(0, k.lastIndexOf('__')));
    return s;
  });
  private readonly rosterCodeSet = computed(() => new Set(this.employees().map((e) => (e.code || '').trim())));

  readonly rosterCount = computed(() => this.employees().length);
  readonly scannedCount = computed(() => this.scanIdSet().size);
  readonly onlineCount = computed(() => this.employees().filter((e) => e.online).length);
  readonly absentCount = computed(() => {
    if (!this.employees().length || !this.scanDates().length) return 0;
    const scanned = this.scanIdSet();
    // ไม่มาสแกน = ไม่อยู่ในไฟล์ และ ไม่ใช่คนออนไลน์ (คนออนไลน์นับแยก)
    return this.employees().filter((e) => !scanned.has((e.code || '').trim()) && !e.online).length;
  });
  readonly unmatchedIds = computed(() => {
    const roster = this.rosterCodeSet();
    return [...this.scanIdSet()].filter((id) => !roster.has(id)).sort();
  });

  // เชื่อมทะเบียนพนักงาน × ไฟล์สแกน → แถวรายงาน (recompute อัตโนมัติเมื่อ roster หรือไฟล์เปลี่ยน)
  readonly rows = computed<ScanRow[]>(() => {
    const emps = this.employees();
    const groups = this.scanGroups();
    const dates = this.scanDates();
    if (!dates.length) return [];

    const usingRoster = emps.length > 0;
    const rosterCodes = this.rosterCodeSet();
    const baseEmps = usingRoster ? [...emps].sort((a, b) => (a.code || '').localeCompare(b.code || '')) : [];
    const fnames = this.fileNames();
    const out: ScanRow[] = [];

    const idsOnDate = (date: string) =>
      [...new Set([...groups.keys()].filter((k) => k.endsWith(`__${date}`)).map((k) => k.slice(0, k.lastIndexOf('__'))))];

    for (const date of dates) {
      if (usingRoster) {
        // ทุกคนในทะเบียน (มี/ไม่มีสแกนก็แสดง)
        for (const e of baseEmps) {
          const code = (e.code || '').trim();
          out.push(this.makeRow(code, `${e.firstName || ''} ${e.lastName || ''}`.trim(), date, groups.get(`${code}__${date}`) || [], true, !!e.online));
        }
        // รหัสในไฟล์ที่ไม่มีในทะเบียน → ต่อท้าย (กันข้อมูลหาย)
        for (const id of idsOnDate(date).filter((id) => !rosterCodes.has(id)).sort()) {
          out.push(this.makeRow(id, fnames.get(id) || '', date, groups.get(`${id}__${date}`) || [], false, false));
        }
      } else {
        // fallback: ดึงทะเบียนไม่ได้ → แสดงเฉพาะคนที่สแกน
        for (const id of idsOnDate(date).sort()) {
          out.push(this.makeRow(id, fnames.get(id) || '', date, groups.get(`${id}__${date}`) || [], false, false));
        }
      }
    }
    return out;
  });

  readonly previewRows = computed(() => this.rows().slice(0, 300));
  readonly dateRange = computed(() => {
    const ds = this.scanDates();
    if (!ds.length) return '';
    return ds.length === 1 ? this.fmtDate(ds[0]) : `${this.fmtDate(ds[0])} - ${this.fmtDate(ds[ds.length - 1])}`;
  });

  private makeRow(id: string, name: string, date: string, list: Scan[], inRegistry: boolean, online: boolean): ScanRow {
    const sorted = [...list].sort((a, b) => a.sec - b.sec);
    const [morningIn, noonOut, noonIn, eveningOut] = this.assignColumns(sorted);
    return {
      id,
      name,
      date,
      dateDisplay: this.fmtDate(date),
      morningIn,
      noonOut,
      noonIn,
      eveningOut,
      scanCount: sorted.length,
      inRegistry,
      online,
    };
  }

  async onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.reset();
    this.fileName.set(file.name);
    this.parsing.set(true);
    try {
      const buf = await file.arrayBuffer();
      const text = this.decode(buf);
      this.parse(text);
    } catch (e) {
      console.error(e);
      this.error.set('อ่านไฟล์ไม่สำเร็จ — ตรวจสอบว่าเป็นไฟล์ .txt จากเครื่องสแกน');
    } finally {
      this.parsing.set(false);
    }
  }

  // ตรวจ encoding จาก BOM (ไฟล์เครื่องสแกนเป็น UTF-16 LE)
  private decode(buf: ArrayBuffer): string {
    const b = new Uint8Array(buf);
    let enc = 'utf-8';
    if (b.length >= 2 && b[0] === 0xff && b[1] === 0xfe) enc = 'utf-16le';
    else if (b.length >= 2 && b[0] === 0xfe && b[1] === 0xff) enc = 'utf-16be';
    return new TextDecoder(enc).decode(buf);
  }

  // รูปแบบไฟล์เครื่องสแกน: รหัส \t YYYY-MM-DD HH:MM:SS (บางรุ่นมีคอลัมน์ชื่อคั่นกลาง: รหัส \t ชื่อ \t วันเวลา)
  // แยกทีละบรรทัดแล้วยึด timestamp เป็นหลัก — รหัสคือเลขหน้าสุดของบรรทัด, ชื่อ (ถ้ามี) คือข้อความระหว่างรหัสกับวันเวลา
  private parse(text: string) {
    const dtRe = /(\d{4})-(\d{2})-(\d{2})[ \t]+(\d{1,2}):(\d{2}):(\d{2})/;
    const groups = new Map<string, Scan[]>();
    const names = new Map<string, string>();
    const dateSet = new Set<string>();
    let total = 0;
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.replace(/^\uFEFF/, '');
      const m = dtRe.exec(line);
      if (!m) continue; // บรรทัดที่ไม่มีวันเวลา (หัวตาราง/บรรทัดว่าง) → ข้าม
      const head = line.slice(0, m.index).split('\t');
      const id = (head[0] || '').trim();
      if (!/^[0-9]+$/.test(id)) continue; // สแกนไม่ติด (ไม่มีรหัส) → ข้าม
      total++;
      const name = head.slice(1).join(' ').replace(/\s+/g, ' ').trim();
      const date = `${m[1]}-${m[2]}-${m[3]}`;
      const hh = +m[4];
      const sec = hh * 3600 + +m[5] * 60 + +m[6];
      const timeStr = `${String(hh).padStart(2, '0')}:${m[5]}:${m[6]}`;
      const k = `${id}__${date}`;
      const g = groups.get(k);
      if (g) g.push({ id, name, date, sec, timeStr });
      else groups.set(k, [{ id, name, date, sec, timeStr }]);
      dateSet.add(date);
      if (name && !names.has(id)) names.set(id, name);
    }

    this.scanGroups.set(groups);
    this.fileNames.set(names);
    this.scanDates.set([...dateSet].sort());
    this.totalScans.set(total);
    if (!groups.size) this.error.set('ไม่พบรายการสแกนในไฟล์ — รูปแบบไฟล์อาจไม่ถูกต้อง (ต้องเป็น รหัส / วันเวลา คั่นด้วย Tab)');
  }

  // จับคู่เวลาสแกนเป็น 4 ช่อง: เข้าเช้า / ออกเที่ยง / เข้าบ่าย / ออกเย็น
  private assignColumns(list: Scan[]): [string, string, string, string] {
    const n = list.length;
    if (n === 0) return ['', '', '', ''];
    const LUNCH_START = 11 * 3600; // 11:00
    const LUNCH_END = 14 * 3600; // 14:00
    const first = 0;
    const last = n - 1;
    const morningIn = list[first].timeStr;
    const eveningOut = n >= 2 ? list[last].timeStr : '';
    const lunch: number[] = [];
    for (let i = 0; i < n; i++) {
      if (i === first || i === last) continue;
      if (list[i].sec >= LUNCH_START && list[i].sec < LUNCH_END) lunch.push(i);
    }
    const noonOut = lunch.length >= 1 ? list[lunch[0]].timeStr : '';
    const noonIn = lunch.length >= 2 ? list[lunch[lunch.length - 1]].timeStr : '';
    return [morningIn, noonOut, noonIn, eveningOut];
  }

  fmtDate(ymd: string): string {
    const [y, mo, d] = ymd.split('-');
    return `${+d}/${+mo}/${y}`;
  }

  private reset() {
    this.scanGroups.set(new Map());
    this.scanDates.set([]);
    this.fileNames.set(new Map());
    this.totalScans.set(0);
    this.error.set('');
  }

  async exportXlsx() {
    if (!this.rows().length) return;
    this.exporting.set(true);
    try {
      const ExcelJS = await import('exceljs');
      const wb = new ExcelJS.Workbook();
      wb.creator = 'BCA ERP / HR';
      const ws = wb.addWorksheet('บันทึกการสแกน', { views: [{ state: 'frozen', ySplit: 1 }] });
      const widths = [13, 12, 26, 12, 12, 12, 12];
      widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));

      const thinB = this.thinBorder();
      const HEAD = ['รหัสพนักงาน', 'วันที่', 'ชื่อ-สกุล', 'เข้าเช้า', 'ออกเที่ยง', 'เข้าบ่าย', 'ออกเย็น'];
      const hr = ws.getRow(1);
      HEAD.forEach((h, i) => {
        const c = hr.getCell(i + 1);
        c.value = h;
        c.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        c.fill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF2F4050' } };
        c.alignment = { vertical: 'middle', horizontal: 'center' };
        c.border = thinB;
      });
      hr.height = 22;

      let r = 2;
      for (const row of this.rows()) {
        const xr = ws.getRow(r);
        xr.getCell(1).value = row.id;
        xr.getCell(2).value = row.dateDisplay;
        xr.getCell(3).value = row.name;
        if (row.online) {
          // ออนไลน์ → รวม 4 ช่องเวลาเป็นช่องเดียว แสดง "ออนไลน์"
          ws.mergeCells(r, 4, r, 7);
          const oc = xr.getCell(4);
          oc.value = 'ออนไลน์';
          oc.font = { bold: true, color: { argb: 'FF0F6FC2' } };
        } else {
          xr.getCell(4).value = row.morningIn;
          xr.getCell(5).value = row.noonOut;
          xr.getCell(6).value = row.noonIn;
          xr.getCell(7).value = row.eveningOut;
        }
        for (let c = 1; c <= 7; c++) {
          xr.getCell(c).border = thinB;
          xr.getCell(c).alignment = { vertical: 'middle', horizontal: c === 3 ? 'left' : 'center' };
        }
        // รหัสนอกทะเบียน → เน้นพื้นเหลืองอ่อนให้สังเกตเห็น
        if (!row.inRegistry) {
          for (let c = 1; c <= 7; c++) {
            xr.getCell(c).fill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFFF3CD' } };
          }
        }
        r++;
      }

      const buf = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const base = this.fileName().replace(/\.[^.]+$/, '') || 'scan';
      a.download = `${base}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('สร้างไฟล์ Excel ไม่สำเร็จ');
    } finally {
      this.exporting.set(false);
    }
  }

  private thinBorder(): any {
    const b = { style: 'thin' as const, color: { argb: 'FFCCCCCC' } };
    return { top: b, left: b, bottom: b, right: b };
  }
}
