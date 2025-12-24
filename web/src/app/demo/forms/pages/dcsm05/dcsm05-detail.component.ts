import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm05Service } from './dcsm05.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
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
    }else if(this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'รอดำเนินการ') {
      this.confirm = false;
      this.confirmDeliver = true;
      this.notDeliver = true;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    }else if(this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'จัดส่งได้ รอเคลียร์ไฟล์') {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = true;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    }else if(this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'เคลียร์ไฟล์แล้ว') {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = true;
      this.samples = false;
      this.deadline = false;
    }else if(this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'ตรวจสอบแล้ว' && this.mainForm.getRawValue().isCreateSample === true) {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = true;
      this.deadline = false;
    }else if((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson) && (this.mainForm.getRawValue().status === 'ขึ้นตัวอย่างแล้ว' || (this.mainForm.getRawValue().status === 'ตรวจสอบแล้ว' && this.mainForm.getRawValue().isCreateSample === false))) {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = true;
    }else if(this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'สำเร็จ ส่งตรวจสอบ' ) {
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

   updateStatusComplete(){
    this.loadingService.show();
    this.dcsm05Service.updateStatusConfirm(this.mainForm.getRawValue().id).subscribe((response) => {
       this.patchFormData(response);
       this.checkBtn();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'รับงานสำเร็จ!');
    })
  }

  updateStatusDeliver(){
    this.loadingService.show();
    this.dcsm05Service.updateStatusDeliver(this.mainForm.getRawValue().id).subscribe((response) => {
       this.patchFormData(response);
       this.checkBtn();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'ยืนยันจัดส่งได้!');
    })
  }

  updateStatusClearFile(){
    this.loadingService.show();
    this.dcsm05Service.updateStatusClearFile(this.mainForm.getRawValue().id).subscribe((response) => {
       this.patchFormData(response);
       this.checkBtn();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'เคลียร์ไฟล์แล้ว!');
    })
  }
 updateStatusInspection(){
    this.loadingService.show();
    this.dcsm05Service.updateStatusInspection(this.mainForm.getRawValue().id).subscribe((response) => {
       this.patchFormData(response);
       this.checkBtn();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'ตรวจสอบไฟล์แล้ว!');
    })
  }

  updateStatusSamples(){
    this.loadingService.show();
    this.dcsm05Service.updateStatusSamples(this.mainForm.getRawValue().id).subscribe((response) => {
       this.patchFormData(response);
       this.checkBtn();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'ขึ้นตัวอย่างแล้ว!');
    })
  }

  updateStatusSucsess(){
    this.loadingService.show();
    this.dcsm05Service.updateStatusSucsess(this.mainForm.getRawValue().id).subscribe((response) => {
       this.patchFormData(response);
       this.checkBtn();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'เสร็จสิ้น รอตรวจสอบ!');
    })
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
     console.log('ยืนยันจัดส่งไม่ได้ เวลาที่ระบุ:', dateValue);
     console.log('ยืนยันจัดส่งไม่ได้ เวลาที่ระบุ:', timeValue);
    
    this.closeNotDeliverModal();
  }
}
