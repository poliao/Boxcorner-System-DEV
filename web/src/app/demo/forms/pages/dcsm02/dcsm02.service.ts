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
    // ปรับ Path ให้ตรงกับ Backend ของคุณ (ตัวอย่างเช่น /designs/save)
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

    return this.http.get(`${this.apiUrl}/designs/list`, { params: params });
  }

  getUniqueJobDetail(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownjobdetails?query=${query}`);
  }

  getUniqueOwner(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownjobowner?query=${query}`);
  }

  getUniqueAssignee(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownassignee?query=${query}`);
  }

  getUniqueProcess(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownprocess?query=${query}`);
  }

  getUniqueConfirm(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/designs/dropdownconfirm?query=${query}`);
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
}
