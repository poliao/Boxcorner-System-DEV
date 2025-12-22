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
  startDate: string, // เพิ่มตัวที่ 5
  endDate: string,   // เพิ่มตัวที่ 6
  page: number,      // ตัวที่ 7
  size: number       // ตัวที่ 8
): Observable<any> {
  // สร้างพารามิเตอร์สำหรับส่งไปกับ URL
  const params = {
    job_details: job_details || '',
    job_owner: job_owner || '',
    process_status: process_status || '',
    assignee: assignee || '',
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
}
