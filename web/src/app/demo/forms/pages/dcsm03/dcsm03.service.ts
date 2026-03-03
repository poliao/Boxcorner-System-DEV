import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm03Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/designs/save`, data);
  }

  getDesigns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/list`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/getById?id=${id}`,);
  }

  getAllDesignOrders(
    id: string,
    folder_name: string,
    job_owner: string,
    process_status: string,
    assignee: string,
    jo_id: string,
    confirm_status: string,
    startDate: string,
    endDate: string,
    page: number,
    size: number,
    remark_status?: string
  ): Observable<any> {
    const params = {
      id: id || '',
      folder_name: folder_name || '',
      job_owner: job_owner || '',
      process_status: process_status || '',
      assignee: assignee || '',
      jo_id: jo_id || '',
      confirm_status: confirm_status || '',
      startDate: startDate || '',
      endDate: endDate || '',
      page: page.toString(),
      size: size.toString(),
      remark_status: remark_status || ''
    };

    return this.http.get(`${this.apiUrl}/designs/listDesign`, { params: params });
  }

  getAllDesignOrdersSorted(
    id: string,
    folder_name: string,
    job_owner: string,
    process_status: string,
    assignee: string,
    jo_id: string,
    confirm_status: string,
    startDate: string,
    endDate: string,
    page: number,
    size: number,
    remark_status?: string
  ): Observable<any> {
    const params = {
      id: id || '',
      folder_name: folder_name || '',
      job_owner: job_owner || '',
      process_status: process_status || '',
      assignee: assignee || '',
      jo_id: jo_id || '',
      confirm_status: confirm_status || '',
      startDate: startDate || '',
      endDate: endDate || '',
      page: page.toString(),
      size: size.toString(),
      sortByDeadline: 'true',
      remark_status: remark_status || ''
    };

    return this.http.get(`${this.apiUrl}/designs/listDesign`, { params: params });
  }

  countBacklog(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/countBacklog`);
  }

  countBacklogPending(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/countBacklogPending`);
  }

  countBacklogInProgress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/countBacklogInProgress`);
  }

  countBacklogCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/countBacklogCheckDe`);
  }

  countBacklogEdit(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/countBacklogEdit`);
  }

  countBacklogComplete(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/countBacklogComplete`);
  }

  countDetailsAdded(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/countDetailsAdded`);
  }
}
