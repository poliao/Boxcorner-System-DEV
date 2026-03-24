import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm37Service {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getAllMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materials`);
  }

  getMaterialById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/materials/${id}`);
  }

  saveMaterial(material: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/materials`, material);
  }

  deleteMaterial(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/materials/${id}`);
  }

  getAllUoms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/uoms`);
  }
}
