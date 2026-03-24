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

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMaterial(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/materials/${id}`);
  }

  getLotsByMaterial(materialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/lots/material/${materialId}`);
  }

  getLotLogs(lotId: number, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lots/${lotId}/logs`, {
      params: { page, size }
    });
  }

  getMaterialConversions(materialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/material-conversions/material/${materialId}`);
  }
}
