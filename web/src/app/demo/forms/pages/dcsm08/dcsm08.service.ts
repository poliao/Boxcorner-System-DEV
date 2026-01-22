import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm08Service {

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

    return this.http.get(`${this.apiUrl}/production/searchProduct`, { params: params });
  }

  getOrdersWithSearchSort(apiFilters: any): Observable<any> {
    let params: any = {
      page: apiFilters.page.toString(),
      size: apiFilters.size.toString(),
      id: apiFilters.id,
      folderName: apiFilters.folderName,
      jobOwner: apiFilters.jobOwner,
      jobStatus: apiFilters.jobStatus,
      operatorName: apiFilters.operatorName,
      processStatus: apiFilters.processStatus,
      moldStatus: apiFilters.moldStatus,
      jobType: apiFilters.jobType,
      startDate: apiFilters.startDate,
      endDate: apiFilters.endDate,
      sortByDeadline: 'true'
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.apiUrl}/production/searchProduct`, { params: params });
  }

  updateProcessStatus(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/production/updateProcessStatus?id=${data.id}&processStatus=${data.processStatus}`, {});
  }

  updateJobStatus(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/production/updateJobStatus?id=${data.id}&jobStatus=${data.jobStatus}`, {});
  }

  countBacklog(): Observable<any> {
    return this.http.get(`${this.apiUrl}/production/countBacklog`);
  }
  countProcessStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/production/countProcessStatus?processStatus=${status}`);
  }

  updateMoldStatus(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/production/updateMoldStatus?id=${data.id}&moldStatus=${data.moldStatus}`, {});
  }
}
