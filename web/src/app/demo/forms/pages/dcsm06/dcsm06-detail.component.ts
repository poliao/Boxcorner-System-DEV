import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm06Service } from './dcsm06.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-dcsm06-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm06-detail.component.html',
  styleUrl: './dcsm06-detail.component.scss'
})
export class Dcsm06DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isSampleOrderId = false
  isSave = false

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm06Service: Dcsm06Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
    }

    if (this.mainForm.getRawValue().sampleOrderId != null && this.mainForm.getRawValue().sampleOrderId != '') {
      this.isSampleOrderId = true
    } else {
      this.isSampleOrderId = false
    }

    if (this.mainForm.getRawValue().id == null || this.mainForm.getRawValue().id == '' || (this.mainForm.getRawValue().jobStatus == 'รอผู้รับผิดชอบยืนยัน' && this.authService.getUserFromToken().sub == this.mainForm.getRawValue().jobOwner)) {
      this.mainForm.get('usedFile')?.enable();
      this.mainForm.get('colorSample')?.enable();
      this.mainForm.get('deadlineDate')?.enable();
      this.mainForm.get('deadlineTime')?.enable();
      this.mainForm.get('folderName')?.enable();
      this.mainForm.get('remarks')?.enable();
      this.isSave = true
    }
  }

  initForm(): void {
    this.mainForm = this.fb.group({
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      usedFile: [''],
      colorSample: [''],
      jobOwner: [''],
      deadlineDate: [''],
      deadlineTime: [''],
      deliveryDate: [''],
      jobStatus: [''],
      processStatus: [''],
      operatorName: [''],
      inspectionDate: [''],
      remarks: [''],
      moldStatus: [''],
      jobType: [''],
      createdAt: [''],
      updatedAt: [''],
      sampleOrderId: [''],
    });
    this.mainForm.get('sampleOrderId')?.disable();
    this.mainForm.get('id')?.disable();
    this.mainForm.get('orderDate')?.disable();
    this.mainForm.get('folderName')?.disable();
    this.mainForm.get('usedFile')?.disable();
    this.mainForm.get('colorSample')?.disable();
    this.mainForm.get('jobOwner')?.disable();
    this.mainForm.get('deadlineDate')?.disable();
    this.mainForm.get('deadlineTime')?.disable();
    this.mainForm.get('jobStatus')?.disable();
    this.mainForm.get('processStatus')?.disable();
    this.mainForm.get('inspectionDate')?.disable();
    this.mainForm.get('moldStatus')?.disable();
    this.mainForm.get('jobType')?.disable({ emitEvent: false });
    this.mainForm.get('operatorName')?.disable({ emitEvent: false });
    this.mainForm.get('deliveryDate')?.disable({ emitEvent: false });
    this.mainForm.get('remarks')?.disable({ emitEvent: false });
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
  }

  onSubmit() {
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      this.sweetAlert.warning('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    Swal.fire({
      title: 'ยืนยันบันทึกข้อมูล',
      text: "ยืนยันบันทึกข้อมูล ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm06Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.sweetAlert.success('บันทึกข้อมูลสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm06']);
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    });
  }

  formatDateThai(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }

  getThaiDateInput(controlName: string): string {
    const value = this.mainForm.get(controlName)?.value;
    return this.formatDateThai(value);
  }

  onThaiDateInput(event: any, controlName: string): void {
    let value = event.target.value.replace(/[^0-9]/g, '');
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 7);
    }
    
    event.target.value = value;
    
    if (value.length === 8) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        let year = parseInt(parts[2]);
        
        if (year <= 50) {
          year += 2000;
        } else {
          year += 1900;
        }
        
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
          const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          if (this.mainForm.get(controlName)) {
            this.mainForm.get(controlName)?.setValue(isoDate);
          }
        }
      }
    } else {
      if (this.mainForm.get(controlName)) {
        this.mainForm.get(controlName)?.setValue('');
      }
    }
  }
}
