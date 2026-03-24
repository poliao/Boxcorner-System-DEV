import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm38Service {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getAllConversions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/material-conversions`);
  }

  getConversionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/material-conversions/${id}`);
  }

  saveConversion(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/material-conversions`, data);
  }

  deleteConversion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/material-conversions/${id}`);
  }

  getAllMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materials`);
  }

  getAllUoms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/uoms`);
  }
}
