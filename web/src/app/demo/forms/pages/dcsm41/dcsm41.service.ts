import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm41Service {

  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) { }

  getInventory(page?: number, size?: number): Observable<any> {
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return this.http.get<any>(this.apiUrl, { params });
  }

  getMaterial(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/materials/${id}`);
  }

  getLotsByMaterial(materialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/lots/material/${materialId}`);
  }

  getLotLogs(lotId: number, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/lots/${lotId}/logs`, {
      params: { page, size }
    });
  }

  getLotById(lotId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/lots/${lotId}`);
  }

  getMaterialConversions(materialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/material-conversions/material/${materialId}`);
  }
}
