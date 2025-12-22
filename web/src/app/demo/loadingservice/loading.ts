import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // สร้างตัวแปรเก็บสถานะ (เริ่มต้นเป็น false คือไม่หมุน)
  private _loading = new BehaviorSubject<boolean>(false);
  
  // ตัวแปรนี้เอาไว้ให้ Component อื่นมาคอยฟัง (Subscribe)
  public readonly loading$ = this._loading.asObservable();

  constructor() { }

  // คำสั่งเปิด
  show() {
    this._loading.next(true);
  }

  // คำสั่งปิด
  hide() {
    this._loading.next(false);
  }
}