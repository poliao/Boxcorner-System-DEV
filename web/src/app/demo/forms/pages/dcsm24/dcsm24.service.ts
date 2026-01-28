import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm24Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/designs-diecut/save`, data);
  }

  getDesigns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/list`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/getById?id=${id}`,);
  }

  getAllDesignOrders(
    id: string,
    folder_name: string,
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
      folder_name: folder_name || '',
      job_owner: job_owner || '',
      process_status: process_status || '',
      assignee: assignee || '',
      confirm_status: confirm_status || '',
      startDate: startDate || '',
      endDate: endDate || '',
      page: page.toString(),
      size: size.toString()
    };

    return this.http.get(`${this.apiUrl}/designs-diecut/listDesign`, { params: params });
  }

  getUniqueJobDetail(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/dropdownjobdetails?query=${query}`);
  }

  getUniqueOwner(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/dropdownjobowner?query=${query}`);
  }

  getUniqueAssignee(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/dropdownassignee?query=${query}`);
  }

  getUniqueProcess(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/dropdownprocess?query=${query}`);
  }

  getUniqueConfirm(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/dropdownconfirm?query=${query}`);
  }

  updateStatus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs-diecut/updateStatus?id=${id}`, {});
  }

  updateStatusWork(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs-diecut/updateStatusWork?id=${id}`, {});
  }

  updateStatusComplete(completeData : any): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs-diecut/updateStatusCompleteWithFile?id=${completeData.id}&fileName=${completeData.fileName}`, {});
  }

  getAllDesignOrdersSorted(
    id: string,
    folder_name: string,
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
      folder_name: folder_name || '',
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

    return this.http.get(`${this.apiUrl}/designs-diecut/listDesign`, { params: params });
  }

  countBacklog(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/countBacklog`);
  }

  countBacklogPending(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/countBacklogPending`);
  }

  countBacklogInProgress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/countBacklogInProgress`);
  }

  countBacklogCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/countBacklogCheckDe`);
  }

  countBacklogEdit(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/countBacklogEdit`);
  }

  countBacklogComplete(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-diecut/countBacklogComplete`);
  }
}
