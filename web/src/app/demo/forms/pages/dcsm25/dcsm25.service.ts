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

  getRecordById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/printing-records/getById?id=${id}`);
  }

  saveRecord(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/printing-records/save`, data);
  }

  saveSample(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sampleOrders/create`, data);
  }

  getByIdSample(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/getById?id=${id}`,);
  }

  getByIdProductionJob(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-job/getById?id=${id}`);
  }

  saveProductionJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production-job/save`, data);
  }

  getProductionOrderById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production/getById?id=${id}`,);
  }
  saveProductionOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production/save`, data);
  }
}
