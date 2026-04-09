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

  getAllSuppliers(page?: number, size?: number): Observable<any> {
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return this.http.get<any>(`${this.apiUrl}/suppliers`, { params });
  }
  saveSupplier(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/suppliers`, data);
  }
  deleteSupplier(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/suppliers/${id}`);
  }

  getAllBrands(page?: number, size?: number): Observable<any> {
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return this.http.get<any>(`${this.apiUrl}/brands`, { params });
  }
  saveBrand(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/brands`, data);
  }
  deleteBrand(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/brands/${id}`);
  }

  getAllUoms(page?: number, size?: number): Observable<any> {
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return this.http.get<any>(`${this.apiUrl}/uoms`, { params });
  }
  saveUom(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/uoms`, data);
  }
  deleteUom(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/uoms/${id}`);
  }

  getAllMaterialTypes(page?: number, size?: number): Observable<any> {
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return this.http.get<any>(`${this.apiUrl}/material-types`, { params });
  }
  saveMaterialType(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/material-types`, data);
  }
  deleteMaterialType(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/material-types/${id}`);
  }

  getAllMaterials(page?: number, size?: number): Observable<any> {
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return this.http.get<any>(`${this.apiUrl}/materials`, { params });
  }
  getMaterialById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/materials/${id}`);
  }
  saveMaterial(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/materials`, data);
  }
  deleteMaterial(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/materials/${id}`);
  }
}
