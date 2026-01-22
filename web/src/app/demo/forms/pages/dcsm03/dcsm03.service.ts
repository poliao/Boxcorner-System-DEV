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
    job_details: string,
    job_owner: string,
    process_status: string,
    assignee: string,
    confirm_status: string,
    startDate: string,
    endDate: string,
    page: number,
    size: number
  ): Observable<any> {
    const params = {
      id: id || '',
      job_details: job_details || '',
      job_owner: job_owner || '',
      process_status: process_status || '',
      assignee: assignee || '',
      confirm_status: confirm_status || '',
      startDate: startDate || '',
      endDate: endDate || '',
      page: page.toString(),
      size: size.toString()
    };

    return this.http.get(`${this.apiUrl}/designs/listDesign`, { params: params });
  }

  getUniqueJobDetail(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownjobdetails?query=${query}`);
  }

  getUniqueOwner(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownjobowner?query=${query}`);
  }

  getUniqueAssignee(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownassignee?query=${query}`);
  }

  getUniqueProcess(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownprocess?query=${query}`);
  }

  getUniqueConfirm(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownconfirm?query=${query}`);
  }

  updateStatus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs/updateStatus?id=${id}`, {});
  }

  updateStatusWork(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs/updateStatusWork?id=${id}`, {});
  }

  updateStatusComplete(completeData : any): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs/updateStatusCompleteWithFile?id=${completeData.id}&fileName=${completeData.fileName}`, {});
  }

  getAllDesignOrdersSorted(
    id: string,
    job_details: string,
    job_owner: string,
    process_status: string,
    assignee: string,
    confirm_status: string,
    startDate: string,
    endDate: string,
    page: number,
    size: number
  ): Observable<any> {
    const params = {
      id: id || '',
      job_details: job_details || '',
      job_owner: job_owner || '',
      process_status: process_status || '',
      assignee: assignee || '',
      confirm_status: confirm_status || '',
      startDate: startDate || '',
      endDate: endDate || '',
      page: page.toString(),
      size: size.toString(),
      sortByDeadline: 'true'
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
}
