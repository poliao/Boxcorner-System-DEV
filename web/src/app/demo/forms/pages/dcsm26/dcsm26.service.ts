import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm26Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/print-job/save`, data);
  }

  saveProduction(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production-job/save`, data);
  }

  saveRecordOS(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/printing-record-os/save`, data);
  }

  savePrintLogOs(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/print-log-os/save`, data);
  }
 
  getOrdersWithSearch(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      id: filters.id || null,
      jobId: filters.jobId || null,
      customerJobName: filters.customerJobName || null,
      printerName: filters.printerName || null,
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.apiUrl}/print-job/searchOs`, { params: params });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/print-job/getById?id=${id}`);
  }

  getRecipesByJobId(jobId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipes/detailByJo?jobId=${jobId}`);
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

   getLogById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/print-log-os/getById?logId=${id}`);
  }
}
