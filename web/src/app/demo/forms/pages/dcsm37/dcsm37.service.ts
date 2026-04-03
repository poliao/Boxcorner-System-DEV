import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class Dcsm37Service {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  search(params: any): Observable<any> {
    const p: any = {};
    Object.keys(params).forEach(k => { if (params[k] !== null && params[k] !== '') p[k] = params[k]; });
    return this.http.get<any>(`${this.api}/reorder/search`, { params: p });
  }

  getDetail(productionOrderId: number): Observable<any> {
    return this.http.get<any>(`${this.api}/reorder/detail`, { params: { productionOrderId } });
  }

  getJobHistory(jobId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/reorder/job-history`, { params: { jobId } });
  }

  reorderDesign(body: any): Observable<any> {
    return this.http.post<any>(`${this.api}/reorder/reorder-design`, body);
  }
}
