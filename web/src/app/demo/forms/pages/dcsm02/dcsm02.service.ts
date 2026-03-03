import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm02Service {

  // ใช้ค่า apiUrl จาก environment ตามที่คุณต้องการ
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ฟังก์ชันบันทึกข้อมูลตามรูปแบบที่คุณระบุ
  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/designs/save`, data);
  }

  // ดึงข้อมูลทั้งหมด
  getDesigns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/list`);
  }

  // ดึงข้อมูลตาม ID
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/getById?id=${id}`,);
  }

  getAllDesignOrders(
    id: string,
    folder_name: string,
    job_details: string,
    job_owner: string,
    process_status: string,
    assignee: string,
    jo_id: string,
    confirm_status: string,
    startDate: string,
    endDate: string,
    page: number,
    size: number,
    hasRemarkAdd?: boolean
  ): Observable<any> {
    const params: any = {
      id: id || '',
      folder_name: folder_name || '',
      job_details: job_details || '',
      job_owner: job_owner || '',
      process_status: process_status || '',
      assignee: assignee || '',
      jo_id: jo_id || '',
      confirm_status: confirm_status || '',
      startDate: startDate || '',
      endDate: endDate || '',
      page: page.toString(),
      size: size.toString()
    };

    if (hasRemarkAdd !== undefined) {
      params.hasRemarkAdd = hasRemarkAdd.toString();
    }

    return this.http.get(`${this.apiUrl}/designs/listDesign`, { params: params });
  }

  getAllDesignOrdersSort(
    id: string,
    folder_name: string,
    job_details: string,
    job_owner: string,
    process_status: string,
    assignee: string,
    jo_id: string,
    confirm_status: string,
    startDate: string,
    endDate: string,
    page: number,
    size: number
  ): Observable<any> {
    const params = {
      id: id || '',
      folder_name: folder_name || '',
      job_details: job_details || '',
      job_owner: job_owner || '',
      process_status: process_status || '',
      assignee: assignee || '',
      jo_id: jo_id || '',
      confirm_status: confirm_status || '',
      startDate: startDate || '',
      endDate: endDate || '',
      page: page.toString(),
      size: size.toString(),
      sortByDeadline: 'true'
    };

    return this.http.get(`${this.apiUrl}/designs/listDesign`, { params: params });
  }

  updateStatusApprove(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs/updateStatusApprove?id=${id}`, {});
  }

  updateStatusEdit(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs/updateStatusEdit?id=${id}`, {});
  }

  savesampleOrders(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sampleOrders/create`, data);
  }

  countBacklogCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/countBacklogCheck`);
  }

  countRequestDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/countRequestDetails`);
  }

  saveProduction(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production/save`, data);
  }
}
