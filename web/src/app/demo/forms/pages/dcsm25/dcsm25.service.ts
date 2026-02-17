import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm25Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/print-job/save`, data);
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

    return this.http.get(`${this.apiUrl}/print-job/search`, { params: params });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/print-job/getById?id=${id}`);
  }

  getByIdProductionJob(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-job/getById?id=${id}`);
  }

  saveProductionJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production-job/save`, data);
  }

  startPrintLog(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/printing/start`, data);
  }

  stopPrintLog(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/printing/stop`, data);
  }

  getLogById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/printing/logById?logId=${id}`);
  }

  saveCalibrateLog(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/printing/saveCalibrateLog`, data);
  }

  getPrinters(): Observable<any> {
    return this.http.get(`${this.apiUrl}/printer/getAll`);
  }

  saveCalibrate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/printing/saveCalibrate`, data);
  }
}
