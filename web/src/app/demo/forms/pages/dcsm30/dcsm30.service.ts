import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm30Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  search(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      itemName: filters.itemName || null,
      category: filters.category || null,
      paperSize: filters.paperSize || null,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') delete params[key];
    });
    return this.http.get(`${this.apiUrl}/unit-stock/search`, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/unit-stock/getById?id=${id}`);
  }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/unit-stock/save`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/unit-stock/delete?id=${id}`);
  }
}
