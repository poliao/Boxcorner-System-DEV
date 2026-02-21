import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm27Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

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

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/print-job/save`, data);
  }

  // Extra Print APIs
  getExtraPrintsByJobId(printJobId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/extra-prints/getByPrintJobId?printJobId=${printJobId}`);
  }

  saveExtraPrint(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/extra-prints/save`, data);
  }

  deleteExtraPrint(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/extra-prints/deleteById?id=${id}`);
  }
}
