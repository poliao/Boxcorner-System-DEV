import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm05Service } from './dcsm05.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dcsm05-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm05-detail.component.html',
  styleUrl: './dcsm05-detail.component.scss'
})
export class Dcsm05DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;

  confirm = false;
  confirmDeliver = false;
  notDeliver = false;
  clearFile = false;
  inspection = false;
  samples = false;
  deadline = false;

  showNotDeliverModal = false;
  notDeliverTime = new FormControl('');
  notDeliverDate = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm05Service: Dcsm05Service,
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
      this.checkBtn();
    }
  }

  initForm(): void {
    this.mainForm = this.fb.group({
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      jobOwner: [''],
      deliveryDate: [''],
      deliveryTime: [''],
      responsiblePerson: ['รอผู้รับผิดชอบอนุมัติ'],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
      isCreateSample: [false],
      status: ['รอผู้รับผิดชอบอนุมัติ'],
      note: [''],
    });
    this.mainForm.controls['id'].disable({ emitEvent: false });
    this.mainForm.controls['orderDate'].disable({ emitEvent: false });
    this.mainForm.controls['folderName'].disable({ emitEvent: false });
    this.mainForm.controls['jobOwner'].disable({ emitEvent: false });
    this.mainForm.controls['deliveryDate'].disable({ emitEvent: false });
    this.mainForm.controls['deliveryTime'].disable({ emitEvent: false });
    this.mainForm.controls['responsiblePerson'].disable({ emitEvent: false });
    this.mainForm.controls['quantity'].disable({ emitEvent: false });
    this.mainForm.controls['unit'].disable({ emitEvent: false });
    this.mainForm.controls['isCreateSample'].disable({ emitEvent: false });
    this.mainForm.controls['status'].disable({ emitEvent: false });
    this.mainForm.controls['note'].disable({ emitEvent: false });
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
  }

  checkBtn() {
    if (this.mainForm.getRawValue().status === 'รอผู้รับผิดชอบอนุมัติ') {
      this.confirm = true;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    } else if ((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'รอดำเนินการ') || this.mainForm.getRawValue().status === 'ไม่อนุมัติเลื่อนส่ง') {
      this.confirm = false;
      this.confirmDeliver = true;
      this.notDeliver = true;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    } else if ((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'จัดส่งได้ รอเคลียร์ไฟล์') || this.mainForm.getRawValue().status === 'แก้ไขไฟล์') {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = true;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    } else if (this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'กำลังเคลียร์ไฟล์') {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = true;
      this.samples = false;
      this.deadline = false;
    } else if (this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง' && this.mainForm.getRawValue().isCreateSample === true) {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = true;
      this.deadline = false;
    } else if (this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'ไฟล์เสร็จ รอตรวจสอบไฟล์') {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    } else if ((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson) && (this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง' || this.mainForm.getRawValue().status === 'ขึ้นตัวอย่างแล้ว') || (this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'แก้ไข')) {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = true;
    } else if ((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'สำเร็จ ส่งตรวจสอบ') ) {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    }
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

  updateStatusComplete() {
    Swal.fire({
      title: 'ยืนยันรับงาน',
      text: "ยืนยันรับงาน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm05Service.updateStatusConfirm(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.checkBtn();
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'รับงานสำเร็จ!');
          this.router.navigate(['/Dcsm05']);
        })
      }
    });
  }

  updateStatusDeliver() {
    Swal.fire({
      title: 'ยืนยันจัดส่งได้',
      text: "ยืนยันจัดส่งได้ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.loadingService.show();
        this.dcsm05Service.updateStatusDeliver(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.checkBtn();
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'ยืนยันจัดส่งได้!');
          this.router.navigate(['/Dcsm05']);
        })
      }
    });
  }

  updateStatusClearFile() {
    Swal.fire({
      title: 'ยืนยันเคลียร์ไฟล์แล้ว',
      text: "ยืนยันเคลียร์ไฟล์แล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm05Service.updateStatusClearFile(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.checkBtn();
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'เคลียร์ไฟล์แล้ว!');
          this.router.navigate(['/Dcsm05']);
        })
      }
    });
  }

  updateStatusInspection() {
    Swal.fire({
      title: 'ยืนยันเคลียร์ไฟล์แล้ว',
      text: "ยืนยันเคลียร์ไฟล์แล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm05Service.updateStatusInspection(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.checkBtn();
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'ส่งตรวจสอบไฟล์!');
          this.router.navigate(['/Dcsm05']);
        })
      }
    });
  }

  updateStatusSamples() {
    Swal.fire({
      title: 'ยืนยันขึ้นตัวอย่างแล้ว',
      text: "ยืนยันขึ้นตัวอย่างแล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm05Service.updateStatusSamples(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.checkBtn();
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'ขึ้นตัวอย่างแล้ว!');
          this.router.navigate(['/Dcsm05']);
        })
      }
    });
  }

  updateStatusSucsess() {
    Swal.fire({
      title: 'ยืนยันเสร็จสิ้น รอตรวจสอบ',
      text: "ยืนยันเคลียร์ไฟล์แล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm05Service.updateStatusSucsess(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.checkBtn();
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'เสร็จสิ้น รอตรวจสอบ!');
          this.router.navigate(['/Dcsm05']);
        })
      }
    });
  }

  openNotDeliverModal() {
    this.notDeliverTime.setValue('');
    this.notDeliverDate.setValue(new Date().toISOString().substring(0, 10));
    this.showNotDeliverModal = true;
  }

  closeNotDeliverModal() {
    this.showNotDeliverModal = false;
  }

  confirmNotDeliver() {
    const dateValue = this.notDeliverDate.value;
    const timeValue = this.notDeliverTime.value;

    Swal.fire({
      title: 'ขอเลื่อนวันส่ง',
      text: "คุณต้องการขอเลื่อนวันส่ง ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b61a1a',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = this.mainForm.getRawValue();
        data.updateDateDelivery = dateValue;
        data.updateTimeDelivery = timeValue
        data.status = 'ขอเลื่อนวันส่ง';
        this.loadingService.show();
        this.dcsm05Service.save(data).subscribe((response) => {
          try {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
            this.router.navigate(['/Dcsm05']);
          } catch (error) {
            this.loadingService.hide();
            this.sweetAlert.error('Save', error);
          }
        });
      }
    });
    this.closeNotDeliverModal();
  }
}
