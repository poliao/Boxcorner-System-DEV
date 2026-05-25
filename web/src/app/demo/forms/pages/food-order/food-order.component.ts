import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { AuthService } from 'src/app/services/auth.service';
import {
  FoodOrderItem,
  FoodOrderService,
  FoodOrderSession,
  FoodOrderView
} from './food-order.service';

@Component({
  selector: 'app-food-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './food-order.component.html',
  styleUrl: './food-order.component.scss'
})
export class FoodOrderComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  session: FoodOrderSession | null = null;
  items: FoodOrderItem[] = [];
  currentUser = '';
  canControl = false;

  openForm!: FormGroup;
  itemForm!: FormGroup;
  editingItemId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private foodOrderService: FoodOrderService,
    private sweetAlert: SweetAlertService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.openForm = this.fb.group({
      restaurantName: ['', Validators.required]
    });

    const defaultName = this.authService.getFullName();
    this.itemForm = this.fb.group({
      displayName: [defaultName === 'Unknown' ? '' : defaultName, Validators.required],
      menuName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.loadActive();

    this.foodOrderService.connect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadActive());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.foodOrderService.disconnect();
  }

  loadActive(): void {
    this.foodOrderService.getActive().subscribe({
      next: (view: FoodOrderView) => {
        this.session = view.session;
        this.items = view.items || [];
        this.currentUser = view.currentUser;
        this.canControl = view.canControl;

        if (this.itemForm && !this.itemForm.get('displayName')?.value) {
          this.itemForm.get('displayName')?.setValue(this.currentUser);
        }
      },
      error: (err) => {
        console.error('Failed to load food order', err);
      }
    });
  }

  get isOpen(): boolean {
    return this.session?.status === 'OPEN';
  }

  get isSent(): boolean {
    return this.session?.status === 'SENT';
  }

  isOwnItem(item: FoodOrderItem): boolean {
    return item.username === this.currentUser;
  }

  openBill(): void {
    if (this.openForm.invalid) {
      this.sweetAlert.error('Validation', 'กรุณากรอกชื่อร้านอาหาร');
      return;
    }
    const restaurantName = this.openForm.value.restaurantName?.trim();
    this.loadingService.show();
    this.foodOrderService.openSession(restaurantName).subscribe({
      next: () => {
        this.loadingService.hide();
        this.openForm.reset();
        this.loadActive();
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('เปิดบิลไม่สำเร็จ', err?.error?.message || 'เกิดข้อผิดพลาด');
      }
    });
  }

  addItem(): void {
    if (!this.session) return;
    if (this.itemForm.invalid) {
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const payload: FoodOrderItem = {
      sessionId: this.session.id,
      displayName: this.itemForm.value.displayName.trim(),
      menuName: this.itemForm.value.menuName.trim(),
      quantity: Number(this.itemForm.value.quantity)
    };

    if (this.editingItemId != null) {
      this.foodOrderService.updateItem(this.editingItemId, payload).subscribe({
        next: () => {
          this.cancelEdit();
          this.loadActive();
        },
        error: (err) => this.sweetAlert.error('แก้ไขไม่สำเร็จ', err?.error?.message || 'เกิดข้อผิดพลาด')
      });
    } else {
      this.foodOrderService.addItem(payload).subscribe({
        next: () => {
          this.itemForm.patchValue({ menuName: '', quantity: 1 });
          this.loadActive();
        },
        error: (err) => this.sweetAlert.error('เพิ่มไม่สำเร็จ', err?.error?.message || 'เกิดข้อผิดพลาด')
      });
    }
  }

  startEdit(item: FoodOrderItem): void {
    if (!this.isOpen || !this.isOwnItem(item) || item.id == null) return;
    this.editingItemId = item.id;
    this.itemForm.patchValue({
      displayName: item.displayName,
      menuName: item.menuName,
      quantity: item.quantity
    });
  }

  cancelEdit(): void {
    this.editingItemId = null;
    this.itemForm.patchValue({
      displayName: this.currentUser,
      menuName: '',
      quantity: 1
    });
  }

  deleteItem(item: FoodOrderItem): void {
    if (!this.isOpen || !this.isOwnItem(item) || item.id == null) return;
    Swal.fire({
      title: 'ลบรายการนี้?',
      text: `${item.displayName} - ${item.menuName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed && item.id != null) {
        this.foodOrderService.deleteItem(item.id).subscribe({
          next: () => this.loadActive(),
          error: (err) => this.sweetAlert.error('ลบไม่สำเร็จ', err?.error?.message || 'เกิดข้อผิดพลาด')
        });
      }
    });
  }

  sendToShop(): void {
    if (!this.session || !this.canControl) return;
    if (this.items.length === 0) {
      this.sweetAlert.warning('ยังไม่มีรายการ', 'ต้องมีอย่างน้อย 1 รายการ');
      return;
    }
    Swal.fire({
      title: 'ส่งให้ร้านค้า',
      text: 'หลังจากส่งแล้ว ทุกคนจะไม่สามารถแก้ไขได้ ยืนยันหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ส่ง',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed && this.session) {
        this.loadingService.show();
        this.foodOrderService.sendSession(this.session.id).subscribe({
          next: () => {
            this.loadingService.hide();
            this.sweetAlert.success('สำเร็จ', 'ส่งให้ร้านค้าเรียบร้อย');
            this.loadActive();
          },
          error: (err) => {
            this.loadingService.hide();
            this.sweetAlert.error('ส่งไม่สำเร็จ', err?.error?.message || 'เกิดข้อผิดพลาด');
          }
        });
      }
    });
  }

  copySummary(): void {
    if (!this.session) return;
    const lines: string[] = [];
    lines.push(`ร้าน: ${this.session.restaurantName}`);
    lines.push('');
    this.items.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item.displayName} - ${item.menuName} x ${item.quantity} กล่อง`);
    });
    lines.push('');
    lines.push(`รวม: ${this.totalBoxes} กล่อง`);
    const text = lines.join('\n');

    const fallbackCopy = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        this.sweetAlert.success('คัดลอกแล้ว');
      } catch {
        this.sweetAlert.error('คัดลอกไม่สำเร็จ');
      }
      document.body.removeChild(ta);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => this.sweetAlert.success('คัดลอกแล้ว'))
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  }

  newBill(): void {
    this.session = null;
    this.items = [];
    this.openForm.reset();
  }

  get totalBoxes(): number {
    return this.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  }
}
