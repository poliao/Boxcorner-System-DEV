import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm29Service {

  private apiUrl = environment.apiUrl;
  private odUrl = `${environment.apiUrl}/printing-od`;

  constructor(private http: HttpClient) { }

  getOrdersWithSearch(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      id: filters.id || null,
      jobId: filters.jobId || null,
      customerJobName: filters.customerJobName || null,
      issample: filters.issample === 'Yes' ? true : (filters.issample === 'No' ? false : null),
      jobStatus: filters.jobStatus || null,
      startDate: filters.startDate || null,
      endDate: filters.endDate || null
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.odUrl}/print-job/search`, { params: params });
  }

  getLogSummary(filters: any): Observable<any> {
    let params: any = {
      id: filters.id || null,
      jobId: filters.jobId || null,
      customerJobName: filters.customerJobName || null,
      issample: filters.issample === 'Yes' ? true : (filters.issample === 'No' ? false : null),
      jobStatus: filters.jobStatus || null,
      startDate: filters.startDate ? filters.startDate + 'T00:00:00' : null,
      endDate: filters.endDate ? filters.endDate + 'T23:59:59' : null
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.odUrl}/summary`, { params: params });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.odUrl}/print-job/getById?id=${id}`);
  }

  getLogsByJobId(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.odUrl}/logsByJobId?jobId=${jobId}`);
  }

  getExtraPrintsByJobId(printJobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.odUrl}/extra-prints/getByPrintJobId?printJobId=${printJobId}`);
  }

  getBatchLogs(jobIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.odUrl}/batchLogs`, jobIds);
  }

  getBatchExtraPrints(printJobIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.odUrl}/extra-prints/batchByPrintJobIds`, printJobIds);
  }

  getStandaloneLogs(filters: any): Observable<any[]> {
    let params: any = {
      startDate: filters.startDate ? filters.startDate + 'T00:00:00' : null,
      endDate: filters.endDate ? filters.endDate + 'T23:59:59' : null
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get<any[]>(`${this.odUrl}/standalone`, { params });
  }
}
