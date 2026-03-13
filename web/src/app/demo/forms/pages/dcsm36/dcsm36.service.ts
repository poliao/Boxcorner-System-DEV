import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm36Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getSummaryReport(filters: any): Observable<any[]> {
    let params: any = {
      startDate: filters.startDate || null,
      endDate: filters.endDate || null
    };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });
    return this.http.get<any[]>(`${this.apiUrl}/salesActivities/summaryReport`, { params });
  }

  getQcJobs(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      startDate: filters.startDate || null,
      endDate: filters.endDate || null
    };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });
    return this.http.get<any>(`${this.apiUrl}/qc/jobs`, { params });
  }

  getQcJobById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/qc/getById`, { params: { id } });
  }

  getPapOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pap/getById`, { params: { id } });
  }

  startQc(id: number, receivedQty: number, operatorName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/qc/start`, null, { 
      params: { id, receivedQty, operatorName } 
    });
  }

  completeQc(id: number, passedQty: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/qc/complete`, null, {
      params: { id, passedQty }
    });
  }

  getByIdProductionJob(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-job/getById?id=${id}`);
  }

  updateProductionJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production-job/save`, data);
  }
}
