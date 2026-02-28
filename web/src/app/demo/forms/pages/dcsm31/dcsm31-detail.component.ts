import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dcsm31Service } from './dcsm31.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm31-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm31-detail.component.html',
  styleUrls: ['./dcsm31-detail.component.scss']
})
export class Dcsm31DetailComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  inventoryId: number | null = null;
  unitStockList: any[] = [];
  selectedUnitStock: any = null;

  // Current stock (read-only display)
  currentMajorQty = 0;
  currentMinorQty = 0;
  warehouseLocation = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm31Service: Dcsm31Service,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Form for ADD mode only — fields are how much to ADD
    this.form = this.fb.group({
      unitStockId: [null, Validators.required],
      addMajorQty: [0, [Validators.required, Validators.min(0)]],
      addMinorQty: [0, [Validators.required, Validators.min(0)]],
      transactionNote: [''],
    });

    // Load unit stock dropdown
    this.dcsm31Service.getUnitStockList().subscribe({
      next: (list) => {
        this.unitStockList = list;
        const currentId = this.form.value.unitStockId;
        if (currentId) {
          this.selectedUnitStock = this.unitStockList.find(u => u.id == currentId) || null;
        }
      },
      error: (err) => console.error(err)
    });

    // If editing, load current data as read-only display
    const resolved = this.route.snapshot.data['printJob'];
    if (resolved?.inventoryId) {
      this.isEdit = true;
      this.inventoryId = resolved.inventoryId;
      this.currentMajorQty = resolved.currentMajorQty ?? 0;
      this.currentMinorQty = resolved.currentMinorQty ?? 0;
      this.warehouseLocation = resolved.warehouseLocation ?? '';
      this.form.patchValue({
        unitStockId: resolved.unitStockId,
      });
      // Lock the unit stock dropdown when editing
      this.form.get('unitStockId')?.disable();
    }
  }

  onUnitStockChange() {
    const id = this.form.value.unitStockId;
    this.selectedUnitStock = this.unitStockList.find(u => u.id == id) || null;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const addMajor = Number(this.form.value.addMajorQty) || 0;
    const addMinor = Number(this.form.value.addMinorQty) || 0;

    if (addMajor === 0 && addMinor === 0) {
      Swal.fire('แจ้งเตือน', 'กรุณากรอกจำนวนที่ต้องการเพิ่มอย่างน้อย 1 รายการ', 'warning');
      return;
    }

    const payload: any = {
      unitStockId: Number(this.form.getRawValue().unitStockId),
      // Send new total = current + added
      currentMajorQty: this.currentMajorQty + addMajor,
      currentMinorQty: this.currentMinorQty + addMinor,
      warehouseLocation: this.warehouseLocation,
      operatorName: this.authService.getFullName(),
      transactionNote: this.form.value.transactionNote || null,
    };

    if (this.isEdit && this.inventoryId) {
      payload.inventoryId = this.inventoryId;
    }

    this.dcsm31Service.save(payload).subscribe({
      next: () => {
        Swal.fire('เพิ่มสต็อกสำเร็จ', `เพิ่ม ${addMajor} ${this.selectedUnitStock?.majorUnit || ''} ${addMinor} ${this.selectedUnitStock?.minorUnit || ''} เรียบร้อยแล้ว`, 'success').then(() => {
          this.router.navigate(['/Dcsm31']);
        });
      },
      error: (err) => {
        Swal.fire('เกิดข้อผิดพลาด', err?.error?.error || 'กรุณาลองใหม่', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['/Dcsm31']);
  }
}
