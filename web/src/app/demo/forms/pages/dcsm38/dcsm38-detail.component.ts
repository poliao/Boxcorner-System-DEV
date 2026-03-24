import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm38Service } from './dcsm38.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm38-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm38-detail.component.html',
  styleUrls: ['./dcsm38-detail.component.scss']
})
export class Dcsm38DetailComponent implements OnInit {

  mainForm: FormGroup;
  id: number | null = null;
  materials: any[] = [];
  uoms: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: Dcsm38Service,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) {
    this.mainForm = this.fb.group({
      id: [null],
      material: [null, Validators.required],
      largeUom: [null, Validators.required],
      smallUom: [null, Validators.required],
      multiplier: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : null;
    this.loadMaterials();
    this.loadUoms();
    if (this.id) {
      this.loadData();
    }
  }

  loadMaterials() {
    this.service.getAllMaterials().subscribe(data => this.materials = data);
  }

  loadUoms() {
    this.service.getAllUoms().subscribe(data => this.uoms = data);
  }

  loadData() {
    this.loadingService.show();
    this.service.getConversionById(this.id!).subscribe({
      next: (data) => {
        this.mainForm.patchValue({
          ...data,
          material: data.material?.id,
          largeUom: data.largeUom?.id,
          smallUom: data.smallUom?.id
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
      material: { id: formValue.material },
      largeUom: { id: formValue.largeUom },
      smallUom: { id: formValue.smallUom }
    };

    this.service.saveConversion(payload).subscribe({
      next: () => {
        this.sweetAlert.success('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
        this.router.navigate(['/Dcsm38']);
      },
      error: () => this.loadingService.hide()
    });
  }

  delete() {
    this.sweetAlert.confirm('ยืนยันการลบ', 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?').then(res => {
      if (res.isConfirmed) {
        this.loadingService.show();
        this.service.deleteConversion(this.id!).subscribe({
          next: () => {
            this.sweetAlert.success('สำเร็จ', 'ลบข้อมูลเรียบร้อยแล้ว');
            this.router.navigate(['/Dcsm38']);
          },
          error: () => this.loadingService.hide()
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/Dcsm38']);
  }
}
