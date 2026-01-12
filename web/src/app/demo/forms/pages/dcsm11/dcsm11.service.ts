import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm11Service {

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
      endDate: filters.endDate || ''
    };

    Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    return this.http.get(`${this.apiUrl}/sampleOrders/searchVerify`, { params: params });
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
      sortByDeadline: 'true'
    };

    Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    return this.http.get(`${this.apiUrl}/sampleOrders/searchVerify`, { params: params });
  }
  
  updateFileChecked(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateFileChecked?id=${id}`, {});
  }

  updateEditFile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateEditFile`,data);
  }

  updateConfirmSample(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateConfirmSample?id=${id}`, {});
  }

  updateEditConfirmSample(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateEditConfirmSample?id=${id}`, {});
  }

  saveProduction(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production/save`, data);
  }

  countBacklogInspection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogCheckFile`);
  }

  countBacklogApproveShif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogApproveShif`);
  }

  
}
