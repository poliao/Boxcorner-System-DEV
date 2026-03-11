import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm35Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getSummaryReport(filters: any): Observable<any[]> {
    let params: any = {
      startDate: filters.startDate || null,
      endDate: filters.endDate || null
    };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });
    return this.http.get<any[]>(`${this.apiUrl}/salesActivities/summaryReport`, { params });
  }
}
