import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm20Service } from './dcsm20.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm20-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './dcsm20-detail.component.html',
  styleUrl: './dcsm20-detail.component.scss'
})
export class Dcsm20DetailComponent implements OnInit {
  productionForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isPrint = false;
  isCoating = false;
  isStamping = false;
  isGluing = false;
  isQc = false;
  isAddress = false;
  isWaitDelivery = false;
  isDelivery = false;
  isDeliveryComplete = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm20Service: Dcsm20Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    this.initForm();

    const resolvedData = this.route.snapshot.data['productionOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
    }
    this.disableForm();
    this.checkButton();
  }

  checkButton(){
    if (this.productionForm.getRawValue().printingDate != null && this.productionForm.getRawValue().printStatus != 'พิมพ์แล้ว' && this.productionForm.getRawValue().printStatus != 'เคลือบแล้ว' && this.productionForm.getRawValue().stampingDate != null && this.productionForm.getRawValue().printStatus != 'ปั้มแล้ว' && this.productionForm.getRawValue().printStatus != 'ปะแล้ว'&& this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().printStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().printStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย') {
      this.isPrint = true
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    }else if (this.productionForm.getRawValue().coatingDate != null && this.productionForm.getRawValue().printStatus != 'เคลือบแล้ว' && this.productionForm.getRawValue().printStatus != 'ปั้มแล้ว' && this.productionForm.getRawValue().printStatus != 'ปะแล้ว' && this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().printStatus != 'รอที่อยู่จัดส่ง'  && this.productionForm.getRawValue().printStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย') {
      this.isCoating = true
      this.isPrint = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    }else if (this.productionForm.getRawValue().stampingDate != null && this.productionForm.getRawValue().printStatus != 'ปั้มแล้ว' && this.productionForm.getRawValue().printStatus != 'ปะแล้ว' && this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().printStatus != 'รอที่อยู่จัดส่ง'  && this.productionForm.getRawValue().printStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย') {
      this.isStamping = true
      this.isPrint = false
      this.isCoating = false
      this.isGluing = false
      this.isQc = false
    }else  if (this.productionForm.getRawValue().gluingDate != null && this.productionForm.getRawValue().printStatus != 'ปะแล้ว' && this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().printStatus != 'รอที่อยู่จัดส่ง'  && this.productionForm.getRawValue().printStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย') {
      this.isGluing = true
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isQc = false
    }else if (this.productionForm.getRawValue().qcDate != null && this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().printStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().printStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย') {
      this.isQc = true
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
    }else if (this.productionForm.getRawValue().printStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().printStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = true
      this.isWaitDelivery = true
      this.isDelivery = false
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    }else if (this.productionForm.getRawValue().printStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = false
      this.isWaitDelivery = true
      this.isDelivery = false
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    }else if (this.productionForm.getRawValue().printStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = false
      this.isWaitDelivery = false
      this.isDelivery = true
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    }else if (this.productionForm.getRawValue().printStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = false
      this.isWaitDelivery = false
      this.isDelivery = false
      this.isDeliveryComplete = true
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    }else{
      this.isAddress = false 
      this.isWaitDelivery = false
      this.isDelivery = false
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    }
  }

  initForm(): void {
    this.productionForm = this.fb.group({
      id: [null],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      jobId: ['', Validators.required],
      customerJobName: ['', Validators.required],
      printQuantity: [0],
      productionQuantity: [0],
      printingDate: [null],
      printingResponsible: [''],
      coatingDate: [null],
      coatingResponsible: [''],
      stampingDate: [null],
      stampingResponsible: [''],
      gluingDate: [null],
      gluingResponsible: [''],
      qcDate: [''],
      qcStatus: [''],
      dueDate: ['', Validators.required],
      printStatus: [''],
      shippingAddress: ['']
    });
  }

  disableForm(): void {
    if (this.productionForm.getRawValue().id != null) {
      this.productionForm.get('date')?.disable();
      this.productionForm.get('jobId')?.disable();
      this.productionForm.get('customerJobName')?.disable();
      this.productionForm.get('printQuantity')?.disable();
      this.productionForm.get('productionQuantity')?.disable();
      this.productionForm.get('printingDate')?.disable();
      this.productionForm.get('printingResponsible')?.disable();
      this.productionForm.get('coatingDate')?.disable();
      this.productionForm.get('coatingResponsible')?.disable();
      this.productionForm.get('stampingDate')?.disable();
      this.productionForm.get('stampingResponsible')?.disable();
      this.productionForm.get('gluingDate')?.disable();
      this.productionForm.get('gluingResponsible')?.disable();
      this.productionForm.get('qcDate')?.disable();
      this.productionForm.get('qcStatus')?.disable();
      this.productionForm.get('dueDate')?.disable();
      this.productionForm.get('printStatus')?.disable();
     
    }
  }

  patchFormData(data: any): void {
    this.productionForm.patchValue(data);
  }

  onSubmit(): void {
    if (this.productionForm.valid) {
      this.loadingService.show();
      const data = this.productionForm.getRawValue();

      this.dcsm20Service.save(data).subscribe({
        next: (response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
          this.router.navigate(['/Dcsm20']);
        },
        error: (error) => {
          this.loadingService.hide();
          this.sweetAlert.error('Save', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
      });
    } else {
      this.markFormGroupTouched();
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  onCancel(): void {
    this.router.navigate(['/Dcsm20']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productionForm.controls).forEach(key => {
      const control = this.productionForm.get(key);
      control?.markAsTouched();
    });
  }

  onUpdatePrint(status: string): void {
    if (this.productionForm.valid) {
      this.loadingService.show();
      if (status === 'Print') {
        this.productionForm.get('printStatus')?.setValue('พิมพ์แล้ว');
      }else if (status === 'Coating') {
        this.productionForm.get('printStatus')?.setValue('เคลือบแล้ว');
      }else if (status === 'Stamping') {
        this.productionForm.get('printStatus')?.setValue('ปั้มแล้ว');
      }else if (status === 'Gluing') {
        this.productionForm.get('printStatus')?.setValue('ปะแล้ว');
      }else if (status === 'Qc') {
        this.productionForm.get('printStatus')?.setValue('Qcแล้ว');
      }else if (status === 'Address') {
        this.productionForm.get('printStatus')?.setValue('รอที่อยู่จัดส่ง');
      }else if (status === 'WaitDelivery') {
        this.productionForm.get('printStatus')?.setValue('รอจัดส่ง');
      }else if (status === 'Delivery') {
        this.productionForm.get('printStatus')?.setValue('กำลังส่ง');
      }else if (status === 'DeliveryComplete') {
        this.productionForm.get('printStatus')?.setValue('จัดส่งเรียบร้อย');
      }
      
      const data = this.productionForm.getRawValue();

      this.dcsm20Service.save(data).subscribe({
        next: (response) => {
          this.patchFormData(response);
          this.checkButton();
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
        },
        error: (error) => {
          this.loadingService.hide();
          this.sweetAlert.error('Save', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
      });
    } else {
      this.markFormGroupTouched();
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
}
