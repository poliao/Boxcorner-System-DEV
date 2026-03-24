import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm37Service } from './dcsm37.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm37-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm37-detail.component.html',
  styleUrls: ['./dcsm37-detail.component.scss']
})
export class Dcsm37DetailComponent implements OnInit {

  mainForm: FormGroup;
  id: number | null = null;
  uoms: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: Dcsm37Service,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) {
    this.mainForm = this.fb.group({
      id: [null],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      baseUom: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : null;
    this.loadUoms();
    if (this.id) {
      this.loadData();
    }
  }

  loadUoms() {
    this.service.getAllUoms().subscribe(data => this.uoms = data);
  }

  loadData() {
    this.loadingService.show();
    this.service.getMaterialById(this.id!).subscribe({
      next: (data) => {
        this.mainForm.patchValue({
          ...data,
          baseUom: data.baseUom?.id
        });
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide()
    });
  }

  save() {
    if (this.mainForm.invalid) {
      this.sweetAlert.error('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    const formValue = this.mainForm.getRawValue();
    const payload = {
      ...formValue,
      baseUom: { id: formValue.baseUom }
    };

    this.service.saveMaterial(payload).subscribe({
      next: () => {
        this.sweetAlert.success('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
        this.router.navigate(['/Dcsm37']);
      },
      error: () => this.loadingService.hide()
    });
  }

  delete() {
    this.sweetAlert.confirm('ยืนยันการลบ', 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?').then(res => {
      if (res.isConfirmed) {
        this.loadingService.show();
        this.service.deleteMaterial(this.id!).subscribe({
          next: () => {
            this.sweetAlert.success('สำเร็จ', 'ลบข้อมูลเรียบร้อยแล้ว');
            this.router.navigate(['/Dcsm37']);
          },
          error: () => this.loadingService.hide()
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/Dcsm37']);
  }
}
