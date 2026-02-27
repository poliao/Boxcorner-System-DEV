import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dcsm30Service } from './dcsm30.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm30-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm30-detail.component.html',
  styleUrls: ['./dcsm30-detail.component.scss']
})
export class Dcsm30DetailComponent implements OnInit {

  form!: FormGroup;
  id: number | null = null;
  isNew = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm30Service: Dcsm30Service
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      itemName: [null, Validators.required],
      category: [null],
      paperSize: [null],
      majorQuantity: [0, [Validators.required, Validators.min(0)]],
      majorUnit: [null],
      minorQuantity: [0, [Validators.required, Validators.min(0)]],
      minorUnit: [null],
      rowVersion: [null]
    });

    const resolvedData = this.route.snapshot.data['printJob'];
    if (resolvedData && resolvedData.id) {
      this.id = resolvedData.id;
      this.isNew = false;
      this.form.patchValue(resolvedData);
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue();
    this.dcsm30Service.save(data).subscribe({
      next: (res: any) => {
        Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 1200, showConfirmButton: false });
        this.router.navigate(['/Dcsm30']);
      },
      error: () => Swal.fire('เกิดข้อผิดพลาด', '', 'error')
    });
  }

  back() {
    this.router.navigate(['/Dcsm30']);
  }
}
