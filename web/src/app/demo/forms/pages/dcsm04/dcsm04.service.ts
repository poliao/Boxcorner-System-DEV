import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm04Service {

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

    return this.http.get(`${this.apiUrl}/sampleOrders/search`, { params: params });
  }
  
  getOrdersWithSearchSort(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      id: filters.id || '',
      folderName: filters.folderName || '',
      jobOwner: filters.jobOwner || '',
      responsiblePerson: filters.responsiblePerson || '',
      status: filters.status || '',
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      sortByDeadline: 'true'
    };

    Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    return this.http.get(`${this.apiUrl}/sampleOrders/search`, { params: params });
  }
  
  updateFileChecked(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateFileChecked?id=${id}`, {});
  }

  updateEditFile(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateEditFile?id=${id}`, {});
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

  countBacklogShif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogShif`);
  }

  countBacklogApproveShif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogApproveShif`);
  }

  countBacklogApproveSample(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogApproveSample`);
  }

  countBacklogSampleCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogSampleCheck`);
  }
}
