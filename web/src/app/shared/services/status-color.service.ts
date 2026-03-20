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
      case 'แก้ไขงานตัวอย่าง': return '#ff0000'
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
      case 'รอเจ้าของงานตรวจสอบ': return '#ff5722'; // สีแดง
      case 'แก้ไขไฟล์': return '#e91e63'; // สีชมพู
      case 'ไฟล์ถูกต้อง': return '#4caf50'; // สีเขียว

      // สถานะตัวอย่าง
      case 'ไฟล์ถูกต้อง รอขึ้นตัวอย่าง': return '#009688'; // สีเขียวเข้ม
      case 'ขึ้นตัวอย่างแล้ว': return '#795548'; // สีน้ำตาล
      case 'ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง': return '#607d8b';
      case 'ขอปรู๊ฟหน้าแท่น': return '#a200ff'; // สีเทาน้ำเงิน
      case 'เริ่มเคลียร์ไฟล์ Proof': return '#9e0094';
      case 'ไฟล์Proofเสร็จ รอตรวจ': return '#9e0094';
      case 'ไฟล์Proofถูกต้อง รอส่งไปช่างพิมพ์': return '#480044';
      case 'ส่งProofหน้าแท่นแล้ว': return '#1d0048';
      case 'Proofสำเร็จ รออนุมัติไปตารางรอผลิต': return '#00ff62';


      // สถานะการผลิต
      case 'เสร็จสิ้น รอตรวจสอบ': return '#ff5722'; // สีส้มแดง
      case 'ตรวจไฟล์แม่พิมพ์แล้ว': return '#4caf50'; // สีเขียว
      case 'ตรวจใบสั่งผลิตแล้ว': return '#4caf50'; // สีเขียว
      case 'ส่งข้อมูลไปตารางจัดส่ง': return '#ff00c8ff'; // สีเขียว
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
      case 'ส่ง Supplier': return '#2196f3';
      case 'รับของจากซัพพลายเออร์แล้ว': return '#36f4a5';
      case 'รับงานแล้วรอส่งกลับ': return '#36f4a5';
      case 'งาน Supplier ส่งกลับแล้ว': return '#36f4a5';

      case 'กำลังพิมพ์': return '#dc3545'; // สีส้มแดง
      case 'กำลังเคลือบ': return '#ffc107'; // สีแดง
      case 'กำลังปั้ม': return '#007bff'; // สีเทา
      case 'กำลังปะ': return '#17a2b8';
      case 'กำลังQc': return '#a61ee6ff';
      case 'รอที่อยู่จัดส่ง': return '#001affff'; // สีส้มแดง
      case 'รอจัดส่ง': return '#7f36f4ff'; // สีแดง
      case 'เริ่มQc': return 'rgb(83, 0, 56)'; // สีเทา
      case 'กำลังส่ง': return '#ff05acff'; // สีเทา
      case 'จัดส่งเรียบร้อย': return '#00af0fff';
      case 'ส่งQc': return 'rgb(83, 0, 56)';


      case 'PENDING': return '#ff9800'; // สีส้ม
      case 'IN_PROGRESS': return '#cddb00ff';
      case 'COMPLETED': return '#2bff00ff';
      case 'PAUSED': return '#ff2600ff';
      case 'WAITPAGE2': return '#ff9800';
      case 'PAUSED_PAGE2': return '#ff2600ff';
      case 'IN_PROGRESS_PAGE2': return '#cddb00ff';
      case 'PROOF': return '#449490ff';
      case 'PROOFCOMPLETED': return '#00312fff';

      case 'รอส่งตรวจ': return '#3f3f3fff';
      case 'รอตรวจ': return '#c76a00ff';
      case 'กำลังตรวจ': return '#b6a024ff';
      case 'เสร็จสิ้น': return '#0fb900ff';

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