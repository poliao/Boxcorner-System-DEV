import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm25Service {

  private apiUrl = environment.apiUrl;
  private odUrl = `${environment.apiUrl}/printing-od`;

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.post(`${this.odUrl}/print-job/save`, data);
  }

  getOrdersWithSearch(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      id: filters.id || null,
      jobId: filters.jobId || null,
      customerJobName: filters.customerJobName || null,
      printerName: filters.printerName || null,
      startDate: filters.startDate || null,
      endDate: filters.endDate || null,
      issample: filters.issample || null,
      jobStatus: filters.jobStatus || null
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.odUrl}/print-job/search`, { params: params });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.odUrl}/print-job/getById?id=${id}`);
  }

  getByIdProductionJob(id: number): Observable<any> {
    return this.http.get(`${this.odUrl}/production-job/getById?id=${id}`);
  }

  saveProductionJob(data: any): Observable<any> {
    return this.http.post(`${this.odUrl}/production-job/save`, data);
  }

  startPrintLog(data: any): Observable<any> {
    return this.http.post(`${this.odUrl}/start`, data);
  }

  stopPrintLog(data: any): Observable<any> {
    return this.http.put(`${this.odUrl}/stop`, data);
  }

  getLogById(id: number): Observable<any> {
    return this.http.get(`${this.odUrl}/logById?logId=${id}`);
  }

  getExtraPrintsByJobId(printJobId: number): Observable<any> {
    return this.http.get(`${this.odUrl}/extra-prints/getByPrintJobId?printJobId=${printJobId}`);
  }

  getBatchExtraPrints(printJobIds: number[]): Observable<any> {
    return this.http.post(`${this.odUrl}/extra-prints/batchByPrintJobIds`, printJobIds);
  }

  updateExtraPrint(data: any): Observable<any> {
    return this.http.post(`${this.odUrl}/extra-prints/save`, data);
  }

  returnPaper(data: any): Observable<any> {
    return this.http.post(`${this.odUrl}/return-paper`, data);
  }

  // ── APIs ที่ไม่มีใน dcsm26 — ยังใช้ path เดิม ──────────────────────────

  saveCalibrateLog(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/printing/saveCalibrateLog`, data);
  }

  getPrinters(): Observable<any> {
    return this.http.get(`${this.apiUrl}/printer/getAll`);
  }

  saveCalibrate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/printing/saveCalibrate`, data);
  }

  checkStock(lotId: number, requiredSheets: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lots/${lotId}/check-stock?requiredSheets=${requiredSheets}`);
  }

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inventory`);
  }

  getLotsByMaterial(materialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lots/material/${materialId}`);
  }

  saveCoatingJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/coating-jobs/create`, data);
  }
}
