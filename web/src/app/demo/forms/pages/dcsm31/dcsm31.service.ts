import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm31Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ---- Paper Inventory ----
  search(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      itemName: filters.itemName || null,
      category: filters.category || null,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') delete params[key];
    });
    return this.http.get(`${this.apiUrl}/paper-inventory/search`, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paper-inventory/getById?id=${id}`);
  }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/paper-inventory/save`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/paper-inventory/delete?id=${id}`);
  }

  // ---- UnitStock dropdown list ----
  getUnitStockList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paper-inventory/unit-stock-list`);
  }
}

