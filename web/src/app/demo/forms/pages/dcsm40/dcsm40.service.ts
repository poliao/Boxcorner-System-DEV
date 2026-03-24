import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm40Service {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getAllLots(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lots`);
  }

  getLotById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lots/${id}`);
  }

  saveLot(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lots`, data);
  }

  deleteLot(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/lots/${id}`);
  }

  getAllMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materials`);
  }

  getAllSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suppliers`);
  }

  getAllBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/brands`);
  }

  getConversionsByMaterial(materialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/material-conversions/material/${materialId}`);
  }
}
