import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm21Service {

  // ใช้ค่า apiUrl จาก environment ตามที่คุณต้องการ
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ฟังก์ชันบันทึกข้อมูลตามรูปแบบที่คุณระบุ
  save(data: any): Observable<any> {
    // ปรับ Path ให้ตรงกับ Backend ของคุณ (ตัวอย่างเช่น /designs-inside/save)
    return this.http.post(`${this.apiUrl}/designs-inside/save`, data);
  }

  // ดึงข้อมูลทั้งหมด
  getDesigns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/list`);
  }

  // ดึงข้อมูลตาม ID
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/getById?id=${id}`,);
  }

  getAllDesignOrders(
    id: string,
    folder_name: string,
    job_details: string,
    job_owner: string,
    process_status: string,
    assignee: string,
    confirm_status: string, // เพิ่มตัวแปรนี้
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
      confirm_status: confirm_status || '', // ส่งไปยัง backend
      startDate: startDate || '',
      endDate: endDate || '',
      page: page.toString(),
      size: size.toString()
    };

    return this.http.get(`${this.apiUrl}/designs-inside/listDesign`, { params: params });
  }

  getAllDesignOrdersSort(
    id: string,
    folder_name: string,
    job_details: string,
    job_owner: string,
    process_status: string,
    assignee: string,
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
      confirm_status: confirm_status || '',
      startDate: startDate || '',
      endDate: endDate || '',
      page: page.toString(),
      size: size.toString(),
      sortByDeadline: 'true'
    };

    return this.http.get(`${this.apiUrl}/designs-inside/listDesign`, { params: params });
  }

  updateStatusApprove(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs-inside/updateStatusApprove?id=${id}`, {});
  }

  updateStatusEdit(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/designs-inside/updateStatusEdit?id=${id}`, {});
  }

  countBacklogCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs-inside/countBacklogCheck`);
  }
}
