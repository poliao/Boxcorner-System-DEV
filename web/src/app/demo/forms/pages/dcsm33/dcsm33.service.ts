import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm33Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCoatingJobsWithSearch(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      joId: filters.joId || null,
      jobCustomerName: filters.jobCustomerName || null,
      jobOwnerName: filters.jobOwnerName || null,
      technicianName: filters.technicianName || null,
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.apiUrl}/coating-jobs/search`, { params: params });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/coating-jobs/getById?id=${id}`);
  }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/coating-jobs/create`, data);
  }

  getFilmUsagesByJobId(jobId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/coating-film-usages/job/${jobId}`);
  }

  saveFilmUsage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/coating-film-usages`, data);
  }

  /** ดึงรายการฟิล์มที่ยังมีสต็อคคงเหลือ (กรองเฉพาะ category ฟิล์ม) */
  getFilmStockAvailable(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paper-inventory/film-stock-available`);
  }

  /** บันทึกการเริ่มเคลือบ */
  startCoating(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/coating-jobs/start-coating`, payload);
  }
}
