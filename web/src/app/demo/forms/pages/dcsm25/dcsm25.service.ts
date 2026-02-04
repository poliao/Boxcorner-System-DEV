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
    return this.http.post(`${this.apiUrl}/production-job/save`, data);
  }
 
  getOrdersWithSearch(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      id: filters.id || '',
      jobId: filters.jobId || '',
      customerName: filters.customerName || '',
      printStatus: filters.printStatus || '',
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
    };

    Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    return this.http.get(`${this.apiUrl}/production-job/searchPrint`, { params: params });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-job/getById?id=${id}`);
  }

  getRecordById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/printing-records/getById?id=${id}`);
  }

  saveRecord(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/printing-records/save`, data);
  }
}
