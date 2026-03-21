import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DropdownOption {
  value: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})

export class Dcsm07Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production/save`, data);
  }
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production/getById?id=${id}`,);
  }

  getOrdersWithSearch(apiFilters: any): Observable<any> {
    let params: any = {
      page: apiFilters.page.toString(),
      size: apiFilters.size.toString(),
      id: apiFilters.id,
      jobId: apiFilters.jobId,
      folderName: apiFilters.folderName,
      jobOwner: apiFilters.jobOwner,
      jobStatus: apiFilters.jobStatus,
      operatorName: apiFilters.operatorName,
      processStatus: apiFilters.processStatus,
      moldStatus: apiFilters.moldStatus,
      jobType: apiFilters.jobType,
      startDate: apiFilters.startDate,
      endDate: apiFilters.endDate
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.apiUrl}/production/search`, { params: params });
  }

  getOrdersWithSearchSort(apiFilters: any): Observable<any> {
    let params: any = {
      page: apiFilters.page.toString(),
      size: apiFilters.size.toString(),
      id: apiFilters.id,
      jobId: apiFilters.jobId,
      folderName: apiFilters.folderName,
      jobOwner: apiFilters.jobOwner,
      jobStatus: apiFilters.jobStatus,
      operatorName: apiFilters.operatorName,
      processStatus: apiFilters.processStatus,
      moldStatus: apiFilters.moldStatus,
      jobType: apiFilters.jobType,
      startDate: apiFilters.startDate,
      endDate: apiFilters.endDate
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.apiUrl}/production/search`, { params: params });
  }

  getPlanningOperators(): Observable<DropdownOption[]> {
    return this.http.get<DropdownOption[]>(`${this.apiUrl}/user/planning`);
  }

  countBacklog(): Observable<any> {
    return this.http.get(`${this.apiUrl}/production/countBacklogHPlanning`);
  }

  countProcessStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/production/countProcessStatus?processStatus=${status}`);
  }

  updateJobStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/production/updateJobStatus?id=${id}&jobStatus=${status}`, {});
  }
  updateProcessStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/production/updateProcessStatus?id=${id}&processStatus=${status}`, {});
  }
  updateMoldStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/production/updateMoldStatus?id=${id}&moldStatus=${status}`, {});
  }

  updatePostPoneDeadline(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/production/updatePostPoneDeadline`, data);
  }

  getPartsByOrderId(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/production-parts/getByOrderId?orderId=${orderId}`);
  }

  saveParts(orderId: number, parts: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/production-parts/saveAll?orderId=${orderId}`, parts);
  }
}
