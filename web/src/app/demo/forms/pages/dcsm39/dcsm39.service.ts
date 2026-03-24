import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm39Service {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getAllSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suppliers`);
  }
  saveSupplier(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/suppliers`, data);
  }
  deleteSupplier(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/suppliers/${id}`);
  }

  getAllBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/brands`);
  }
  saveBrand(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/brands`, data);
  }
  deleteBrand(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/brands/${id}`);
  }

  getAllUoms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/uoms`);
  }
  saveUom(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/uoms`, data);
  }
  deleteUom(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/uoms/${id}`);
  }
}
