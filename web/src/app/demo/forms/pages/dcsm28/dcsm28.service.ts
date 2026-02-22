import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm28Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,private authService: AuthService,) { }

  search(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      activityId: filters.activityId || null,
      customerName: filters.customerName || null,
      contactPerson: filters.contactPerson || null,
      isNewCustomer: filters.isNewCustomer || null,
      startDate: filters.startDate || null,
      endDate: filters.endDate || null
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    this.authService.getUserFromToken().role
    if (this.authService.getUserFromToken().role == 'salesAdmin' || this.authService.getUserFromToken().role == 'SupperAdmin') {
      return this.http.get(`${this.apiUrl}/salesActivities/searchAdmin`, { params: params });
    }else{
      return this.http.get(`${this.apiUrl}/salesActivities/search`, { params: params });
    }
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/salesActivities/getById?id=${id}`);
  }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/salesActivities/create`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/salesActivities/delete?id=${id}`);
  }

  createQuotation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/quotations/create`, data);
  }

  reviseQuotation(activityId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/quotations/revise?activityId=${activityId}`, data);
  }

  getCurrentQuotation(activityId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quotations/current?activityId=${activityId}`);
  }

  searchProvinces(search?: string): Observable<any[]> {
    const url = search 
      ? `${this.apiUrl}/provinces/search?search=${search}`
      : `${this.apiUrl}/provinces/search`;
    return this.http.get<any[]>(url);
  }
}