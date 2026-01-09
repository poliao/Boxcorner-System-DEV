import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusColorService {

  getStatusColor(status: string): string {
    switch (status) {
      // สถานะเริ่มต้น
      case 'รอผู้รับผิดชอบอนุมัติ': return '#9e9e9e'; // สีเทา
      case 'รอผู้รับผิดชอบยืนยัน': return '#9e9e9e'; // สีเทา
      case 'รอดำเนินการ': return '#ff9800'; // สีส้ม
      case 'กำลังดำเนินการ': return '#2196f3'; // สีน้ำเงิน
      case 'เสร็จสิ้น': return '#4caf50'; // สีเขียว

      // สถานะการเลื่อนส่ง
      case 'ขอเลื่อนวันส่ง': return '#2196f3'; // สีน้ำเงิน
      case 'อนุมัติขอเลื่อนส่ง': return '#4caf50'; // สีเขียว
      case 'ไม่อนุมัติเลื่อนส่ง': return '#f44336'; // สีแดง

      // สถานะไฟล์
      case 'จัดส่งได้ รอเคลียร์ไฟล์': return '#673ab7'; // สีม่วง
      case 'กำลังเคลียร์ไฟล์': return '#3f51b5'; // สีน้ำเงินเข้ม
      case 'ไฟล์เสร็จ รอตรวจสอบไฟล์': return '#ff5722'; // สีส้มแดง
      case 'แก้ไขไฟล์': return '#e91e63'; // สีชมพู
      case 'ไฟล์ถูกต้อง': return '#4caf50'; // สีเขียว

      // สถานะตัวอย่าง
      case 'ไฟล์ถูกต้อง รอขึ้นตัวอย่าง': return '#009688'; // สีเขียวเข้ม
      case 'ขึ้นตัวอย่างแล้ว': return '#795548'; // สีน้ำตาล
      case 'ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง': return '#607d8b'; // สีเทาน้ำเงิน

      // สถานะการผลิต
      case 'เสร็จสิ้น รอตรวจสอบ': return '#ff5722'; // สีส้มแดง
      case 'ตรวจไฟล์แม่พิมพ์แล้ว': return '#4caf50'; // สีเขียว
      case 'ตรวจใบสั่งผลิตแล้ว': return '#4caf50'; // สีเขียว
      case 'ส่งใบสั่งผลิตแล้ว': return '#2196f3'; // สีน้ำเงิน
      case 'ส่งไฟล์แล้ว': return '#2196f3'; // สีน้ำเงิน

      // สถานะแม่พิมพ์
      case 'กำลังทำแม่พิมพ์': return '#ff9800'; // สีส้ม
      case 'แม่พิมพ์เสร็จแล้ว': return '#4caf50'; // สีเขียว
      case 'ส่งแม่พิมพ์': return '#2196f3'; // สีน้ำเงิน

      // สถานะสุดท้าย
      case 'สำเร็จ รออนุมัติไปตารางรอผลิต': return '#128012'; // สีเขียวเข้ม
      case 'แก้ไข': return '#ff9800'; // สีส้ม
      case 'ผ่าน': return '#4caf50'; // สีเขียวเข้ม

      // สถานะอื่นๆ
      case 'รอตรวจสอบ': return '#ff5722'; // สีส้มแดง
      case 'ยกเลิก': return '#f44336'; // สีแดง
      case 'หยุดชั่วคราว': return '#9e9e9e'; // สีเทา

      default: return '#9e9e9e'; // สีเทาเป็นค่าเริ่มต้น
    }
  }

  // สำหรับ process status
  getProcessStatusColor(status: string): string {
    return this.getStatusColor(status);
  }

  // สำหรับ confirm status
  getConfirmStatusColor(status: string): string {
    switch (status) {
      case 'รอตรวจสอบ': return '#ff5722'; // สีส้มแดง
      case 'ผ่าน': return '#4caf50'; // สีเขียว
      case 'ไม่ผ่าน': return '#f44336'; // สีแดง
      case 'รอดำเนินการ': return '#ff9800'; // สีส้ม
      case 'กำลังดำเนินการ': return '#2196f3'; // สีน้ำเงิน
      default: return this.getStatusColor(status);
    }
  }
}