import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm05Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sampleOrders/create`, data);
  }
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/getById?id=${id}`,);
  }

  getOrdersWithSearch(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      folderName: filters.folderName || '',           // เดิม job_details
      jobOwner: filters.jobOwner || '',               // เดิม job_owner
      responsiblePerson: filters.responsiblePerson || '', // เดิม assignee
      status: filters.status || '',                   // เดิม process_status
      startDate: filters.startDate || '',
      endDate: filters.endDate || ''
    };

    Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    return this.http.get(`${this.apiUrl}/sampleOrders/searchDetail`, { params: params });
  }
  
  countBacklog(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklog`);
  }

  countBacklogShif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogShif`);
  }

  updateStatusConfirm(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateAssign?id=${id}`, {});
  }

  updateStatusDeliver(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusDeliver?id=${id}`, {});
  }

  updateStatusClearFile(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusClearFile?id=${id}`, {});
  }

  updateStatusInspection(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusInspection?id=${id}`, {});
  }

  updateStatusSamples(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusSamples?id=${id}`, {});
  }

  updateStatusSucsess(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusSucsess?id=${id}`, {});
  }

  countBacklogApproveShif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogApproveShif`);
  }

  countBacklogNotApproveShif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogNotApproveShif`);
  }

  countBacklogClearFile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogClearFile`);
  }
}
