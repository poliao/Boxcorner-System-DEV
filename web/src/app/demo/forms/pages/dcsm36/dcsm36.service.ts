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

  getQcJobs(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      startDate: filters.startDate || null,
      endDate: filters.endDate || null,
      joId: filters.joId || null,
      jobName: filters.jobName || null,
      status: filters.status || null,
      qcType: filters.qcType || null,
      qcLocation: filters.qcLocation || null,
      role: filters.role || null,
      startFrom: filters.startFrom || null,
      startTo: filters.startTo || null,
      deliveryFrom: filters.deliveryFrom || null,
      deliveryTo: filters.deliveryTo || null
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

  startQc(id: number, receivedQty: number, operatorName: string, qcType: string | null): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/qc/start`, null, {
      params: { id, receivedQty, operatorName, qcType: qcType || '' }
    });
  }

  completeQc(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/qc/complete`, data);
  }

  partialQc(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/qc/partial`, data);
  }

  getByIdProductionJob(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-job/getById?id=${id}`);
  }

  updateProductionJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production-job/save`, data);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/all`);
  }

  printReport(data: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/test-report/pdf`, data, { responseType: 'blob' });
  }

  DropdownList(department: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/userQc/getUserQc?department=${department}`);
  }
}
