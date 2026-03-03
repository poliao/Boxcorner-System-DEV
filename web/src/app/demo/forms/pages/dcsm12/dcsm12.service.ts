import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm12Service {

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
      id: filters.id || '',
      folderName: filters.folderName || '',           // เดิม job_details
      jobOwner: filters.jobOwner || '',               // เดิม job_owner
      responsiblePerson: filters.responsiblePerson || '', // เดิม assignee
      status: filters.status || '',                   // เดิม process_status
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      jobId: filters.jobId || '',
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.apiUrl}/sampleOrders/searchDetail`, { params: params });
  }

  getOrdersWithSearchSort(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      id: filters.id || '',
      folderName: filters.folderName || '',           // เดิม job_details
      jobOwner: filters.jobOwner || '',               // เดิม job_owner
      responsiblePerson: filters.responsiblePerson || '', // เดิม assignee
      status: filters.status || '',                   // เดิม process_status
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      jobId: filters.jobId || '',
      sortByDeadline: 'true'
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

  countBacklogWaitProcess(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogWaitProcess`);
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
  countBacklogInClearFile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogInClearFile`);
  }

  countBacklogCheckFile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogCheckFile`);
  }

  countBacklogFileComplete(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogFileComplete`);
  }

  countBacklogWaitSample(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogWaitSample`);
  }

  countBacklogSendBackSample(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogSendBackSample`);
  }

  countBacklogSendBack(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogSendBack`);
  }

  updateStatusCancel(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusCancel?id=${id}`, {});
  }

}
