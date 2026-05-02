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
  
  // NEW OdPrinting API
  startOdPrintLog(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/od-printing/start`, data);
  }

  stopOdPrintLog(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/od-printing/stop`, data);
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


  saveCoatingJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/coating-jobs/create`, data);
  }

  getLogsByJobId(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/printing/logsByJobId?jobId=${jobId}`);
  }

  getLatestMeter(printerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/printing/latest-meter?printerId=${printerId}`);
  }
}
