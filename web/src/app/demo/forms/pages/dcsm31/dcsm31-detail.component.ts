import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dcsm31Service } from './dcsm31.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm31Service: Dcsm31Service
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      unitStockId: [null, Validators.required],
      currentMajorQty: [0, [Validators.required, Validators.min(0)]],
      currentMinorQty: [0, [Validators.required, Validators.min(0)]],
      warehouseLocation: [''],
    });

    // Load unit stock dropdown
    this.dcsm31Service.getUnitStockList().subscribe({
      next: (list) => {
        this.unitStockList = list;
        // If editing, pre-select unit stock info card
        const currentId = this.form.value.unitStockId;
        if (currentId) {
          this.selectedUnitStock = this.unitStockList.find(u => u.id == currentId) || null;
        }
      },
      error: (err) => console.error(err)
    });

    // Check if editing (resolver provides data)
    const resolved = this.route.snapshot.data['printJob'];
    if (resolved?.inventoryId) {
      this.isEdit = true;
      this.inventoryId = resolved.inventoryId;
      this.form.patchValue({
        unitStockId: resolved.unitStockId,
        currentMajorQty: resolved.currentMajorQty,
        currentMinorQty: resolved.currentMinorQty,
        warehouseLocation: resolved.warehouseLocation || '',
      });
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

    const payload: any = {
      ...this.form.value,
      unitStockId: Number(this.form.value.unitStockId),
    };
    if (this.isEdit && this.inventoryId) {
      payload.inventoryId = this.inventoryId;
    }

    this.dcsm31Service.save(payload).subscribe({
      next: () => {
        Swal.fire('บันทึกสำเร็จ', '', 'success').then(() => {
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

