import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm04Service } from './dcsm04.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ThaiDatePipe } from 'src/app/shared/pipes/thai-date.pipe';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dcsm04-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, ThaiDatePipe],
  templateUrl: './dcsm04-detail.component.html',
  styleUrl: './dcsm04-detail.component.scss'
})
export class Dcsm04DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isDesign = false
  isBtnSave = false
  isBtnApprove = false
  isBtnReject = false
  isBtnApproveSample = false
  isBtnRejectSample = false
  isUpdateDelivery = false


  showApproveModal = false;
  usedFile = new FormControl('', Validators.required);
  colorSample = new FormControl('');
  deadlineDate = new FormControl('');
  deadlineTime = new FormControl('');
  remarks = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm04Service: Dcsm04Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    this.initForm();

    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
      if (resolvedData.designOrderId != null) {
        this.isDesign = true
      }
    }

    if (this.mainForm.getRawValue().status === 'จัดส่งได้ รอเคลียร์ไฟล์' || this.mainForm.getRawValue().status === 'กำลังเคลียร์ไฟล์' || this.mainForm.getRawValue().status === 'ไฟล์เสร็จ รอตรวจสอบไฟล์' || this.mainForm.getRawValue().status === 'ขึ้นตัวอย่างแล้ว' || this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง' || this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง รอขึ้นตัวอย่าง' || this.mainForm.getRawValue().status === 'สำเร็จ ส่งตรวจสอบ' || this.mainForm.getRawValue().status === 'ผ่าน' || this.mainForm.getRawValue().status === 'สำเร็จ รออนุมัติไปตารางรอผลิต' || this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง' || this.mainForm.getRawValue().status === 'รอเจ้าของงานตรวจสอบ') {
      this.mainForm.controls['folderName'].disable({ emitEvent: false });
      this.mainForm.controls['deliveryDate'].disable({ emitEvent: false });
      this.mainForm.controls['deliveryTime'].disable({ emitEvent: false });
      this.mainForm.controls['quantity'].disable({ emitEvent: false });
      this.mainForm.controls['unit'].disable({ emitEvent: false });
      this.mainForm.controls['isCreateSample'].disable({ emitEvent: false });
      this.mainForm.controls['note'].disable({ emitEvent: false });
      this.mainForm.controls['customerName'].disable({ emitEvent: false });
    }
    this.checkBtn();
    if (this.mainForm.getRawValue().status == 'ขอเลื่อนวันส่ง' && this.getCurrentUserFromToken() == this.mainForm.getRawValue().jobOwner) {
      this.isUpdateDelivery = true
    }
  }

  initForm(): void {
    this.mainForm = this.fb.group({
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      jobOwner: [''],
      deliveryDate: ['', Validators.required],
      deliveryTime: ['', Validators.required],
      responsiblePerson: ['รอผู้รับผิดชอบอนุมัติ'],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
      isCreateSample: [true],
      status: ['รอผู้รับผิดชอบอนุมัติ'],
      note: [''],
      designOrderId: [''],
      updateDateDelivery: [new Date().toISOString().substring(0, 10)],
      updateTimeDelivery: [''],
      customerName: [''],
      rowVersion: [null]
    });
    this.mainForm.controls['id'].disable({ emitEvent: false });
    this.mainForm.controls['orderDate'].disable({ emitEvent: false });
    this.mainForm.controls['jobOwner'].disable({ emitEvent: false });
    this.mainForm.controls['responsiblePerson'].disable({ emitEvent: false });
    this.mainForm.controls['status'].disable({ emitEvent: false });
    this.mainForm.controls['designOrderId'].disable({ emitEvent: false });
    this.mainForm.controls['updateDateDelivery'].disable({ emitEvent: false });
    this.mainForm.controls['updateTimeDelivery'].disable({ emitEvent: false });
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
  }

  private getCurrentUserFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || payload.name || payload.sub;
    } catch (error) {
      return null;
    }
  }

  onSubmit() {
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      this.sweetAlert.warning('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }
    Swal.fire({
      title: 'ยืนยันการบันทึก',
      text: "ยื่นยันการบันทึก ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.checkBtn();
            this.sweetAlert.success('บันทึกข้อมูลสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm04']);
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    });


  }

  updateFileChecked() {
    Swal.fire({
      title: 'ตรวจสอบไฟล์',
      text: "ยื่นยันตรวจสอบไฟล์ ผ่าน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        if (this.mainForm.getRawValue().isCreateSample == true) {
          this.mainForm.get('status').setValue('ไฟล์ถูกต้อง รอขึ้นตัวอย่าง')
        }else{
          this.mainForm.get('status').setValue('ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง')
        }
        this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.sweetAlert.success('Success', 'เสร็จสิ้น!');
            this.router.navigate(['/Dcsm04']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  checkBtn() {
    const formValue = this.mainForm.getRawValue();
    const currentUser = this.getCurrentUserFromToken();
    if (
      !formValue.id || (currentUser === formValue.jobOwner && formValue.status === 'รอผู้รับผิดชอบอนุมัติ') || (currentUser === formValue.jobOwner && formValue.status === 'รอดำเนินการ')
    ) {
      this.isBtnSave = true;
      this.isBtnApprove = false;
      this.isBtnReject = false;
      this.isBtnApproveSample = false;
      this.isBtnRejectSample = false;
    } else if (currentUser === formValue.jobOwner && formValue.status === 'สำเร็จ รออนุมัติไปตารางรอผลิต') {
      this.isBtnSave = false;
      this.isBtnApprove = false;
      this.isBtnReject = false;
      this.isBtnApproveSample = true;
      this.isBtnRejectSample = true;
    } else if (currentUser === formValue.jobOwner && formValue.status === 'รอเจ้าของงานตรวจสอบ') {
      this.isBtnSave = false;
      this.isBtnApprove = true;
      this.isBtnReject = false;
      this.isBtnApproveSample = false;
      this.isBtnRejectSample = false;
    }
    else {
      this.isBtnSave = false;
      this.isBtnApprove = false;
      this.isBtnReject = false;
      this.isBtnApproveSample = false;
      this.isBtnRejectSample = false;
    }
  }

  updateDelivery() {
    Swal.fire({
      title: 'อนุมัติขอเลื่อนส่ง',
      text: "ยื่นยันอนุมัติขอเลื่อนส่ง  ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = this.mainForm.getRawValue();
        data.deliveryDate = this.mainForm.getRawValue().updateDateDelivery
        data.deliveryTime = this.mainForm.getRawValue().updateTimeDelivery
        data.status = 'อนุมัติขอเลื่อนส่ง';
        this.loadingService.show();
        this.dcsm04Service.save(data).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.isUpdateDelivery = false
            this.sweetAlert.success('Success', 'เสร็จสิ้น!');
            this.router.navigate(['/Dcsm04']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error|| 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  updateNotDelivery() {
    Swal.fire({
      title: 'ไม่อนุมัติขอเลื่อนส่ง',
      text: "ยื่นยันไม่อนุมัติขอเลื่อนส่ง ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = this.mainForm.getRawValue();
        data.status = 'ไม่อนุมัติเลื่อนส่ง';
        this.loadingService.show();
        this.dcsm04Service.save(data).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.isUpdateDelivery = false
            this.sweetAlert.success('Success', 'เสร็จสิ้น!');
            this.router.navigate(['/Dcsm04']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error|| 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  openApproveModal() {
    const now = new Date();
    this.deadlineDate.setValue(now.toISOString().substring(0, 10));
    this.deadlineTime.setValue(now.toTimeString().substring(0, 5));
    this.usedFile.setValue('');
    this.colorSample.setValue('');
    this.remarks.setValue('');
    this.showApproveModal = true;
  }

  closeApproveModal() {
    this.showApproveModal = false;
  }

  confirmApprove() {
    const data = {
      orderDate: new Date().toISOString().substring(0, 10),
      folderName: this.mainForm.getRawValue().folderName,
      usedFile: this.usedFile.value,
      colorSample: this.colorSample.value,
      jobOwner: null,
      deadlineDate: this.deadlineDate.value,
      deadlineTime: this.deadlineTime.value,
      deliveryDate: null,
      jobStatus: null,
      processStatus: null,
      operatorName: null,
      inspectionDate: null,
      remarks: this.remarks.value,
      moldStatus: null,
      jobType: null,
      createdAt: null,
      updatedAt: null,
      responsiblePerson: 'รอผู้รับผิดชอบอนุมัติ',
      status: 'รอผู้รับผิดชอบอนุมัติ',
      sampleOrderId: this.mainForm.getRawValue().id,
      customerName: this.mainForm.getRawValue().customerName,
      dataDalivery: false
    };
    Swal.fire({
      title: 'อนุมัติส่งไปตารางคอนเฟิร์มรอผลิต',
      text: "อนุมัติส่งไปตารางคอนเฟิร์มรอผลิต ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm04Service.saveProduction(data).subscribe({
          next: (response) => {
            if (response) {
              this.mainForm.get('status').setValue('ผ่าน');
              this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
                next: (response) => {
                  this.patchFormData(response);
                  this.loadingService.hide();
                  this.checkBtn();
                  this.sweetAlert.success('Success', 'เสร็จสิ้น!');
                  this.router.navigate(['/Dcsm04']);
                },
                error: (error) => {
                  this.loadingService.hide();
                  this.sweetAlert.error('Error', error.error|| 'เกิดข้อผิดพลาด');
                }
              })
            }
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error|| 'เกิดข้อผิดพลาด');
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
