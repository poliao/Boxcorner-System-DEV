import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm22Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/designs-inside/save`, data);
  }

  getDesigns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/list`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/getById?id=${id}`,);
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

    return this.http.get(`${this.apiUrl}/designs-inside/listDesign`, { params: params });
  }

  getUniqueJobDetail(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/dropdownjobdetails?query=${query}`);
  }

  getUniqueOwner(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/dropdownjobowner?query=${query}`);
  }

  getUniqueAssignee(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/dropdownassignee?query=${query}`);
  }

  getUniqueProcess(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/dropdownprocess?query=${query}`);
  }

  getUniqueConfirm(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/dropdownconfirm?query=${query}`);
  }

  updateStatus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs-inside/updateStatus?id=${id}`, {});
  }

  updateStatusWork(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs-inside/updateStatusWork?id=${id}`, {});
  }

  updateStatusComplete(completeData : any): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs-inside/updateStatusCompleteWithFile?id=${completeData.id}&fileName=${completeData.fileName}`, {});
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

    return this.http.get(`${this.apiUrl}/designs-inside/listDesign`, { params: params });
  }

  countBacklog(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/countBacklog`);
  }

  countBacklogPending(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/countBacklogPending`);
  }

  countBacklogInProgress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/countBacklogInProgress`);
  }

  countBacklogCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/countBacklogCheckDe`);
  }

  countBacklogEdit(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/countBacklogEdit`);
  }

  countBacklogComplete(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/countBacklogComplete`);
  }
}
