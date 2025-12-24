import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm03Service } from './dcsm03.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
@Component({
  selector: 'app-dcsm03-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm03-detail.component.html',
  styleUrl: './dcsm03-detail.component.scss'
})
export class Dcsm03DetailComponent implements OnInit {
  designForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isBtnAccept = false
  isBtnWorking = false
  isBtnComplete = false

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm03Service: Dcsm03Service,
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
    }
    this.checkButtonVisibility();
  }

  initForm(): void {
    this.designForm = this.fb.group({
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      jobDetails: [''],
      remarks: [''],
      jobOwner: ['', Validators.required],
      deadlineDate: [''],
      deadlineTime: [''],
      assignee: [''],
      processStatus: ['', Validators.required],
      confirmStatus: ['', Validators.required]
    });
    this.designForm.controls['id'].disable({ emitEvent: false });
    this.designForm.controls['orderDate'].disable({ emitEvent: false });
    this.designForm.controls['folderName'].disable({ emitEvent: false });
    this.designForm.controls['jobDetails'].disable({ emitEvent: false });
    this.designForm.controls['remarks'].disable({ emitEvent: false });
    this.designForm.controls['jobOwner'].disable({ emitEvent: false });
    this.designForm.controls['deadlineDate'].disable({ emitEvent: false });
    this.designForm.controls['deadlineTime'].disable({ emitEvent: false });
    this.designForm.controls['assignee'].disable({ emitEvent: false });
    this.designForm.controls['processStatus'].disable({ emitEvent: false });
    this.designForm.controls['confirmStatus'].disable({ emitEvent: false });
  }
  patchFormData(data: any): void {
    const apiData = data as any;
    this.designForm.patchValue(apiData);
  }

  getJobDetailsColor() {
    const value = this.designForm.get('jobDetails')?.value;
    switch (value) {
      case 'ปรับไดคัท': return 'bg-primary text-white';
      case 'แก้ไขอาร์ต': return 'bg-warning text-dark';
      case 'รอลูกค้าแจ้งกลับ': return 'bg-danger text-white';
      case 'ออกแบบรายละเอียดใน Line': return 'bg-info text-dark';
      case 'เคลียร์ไฟล์ ส่งคอนเฟิร์ม': return 'bg-success text-white';
      default: return 'bg-light text-dark';
    }
  }

  checkButtonVisibility() {

    if (this.designForm.getRawValue().assignee === 'รอผู้รับผิดชอบยืนยัน') {
      this.isBtnAccept = true;
      this.isBtnWorking = false;
      this.isBtnComplete = false;
    }else if ((this.getCurrentUserFromToken() === this.designForm.get('assignee')?.value && this.designForm.get('processStatus')?.value === 'รอดำเนินการ') || (this.getCurrentUserFromToken() === this.designForm.get('assignee')?.value && this.designForm.get('processStatus')?.value === 'รอดำเนินการแก้ไข')) {
      this.isBtnWorking = true;
      this.isBtnAccept = false;
      this.isBtnComplete = false;
    }else if (this.designForm.get('processStatus')?.value === 'กำลังดำเนินการ' && this.getCurrentUserFromToken() === this.designForm.get('assignee')?.value) {
      this.isBtnComplete = true;
      this.isBtnWorking = false;
      this.isBtnAccept = false;
    }else if (this.designForm.get('confirmStatus')?.value === 'รอตรวจสอบ') {
      this.isBtnComplete = false;
      this.isBtnWorking = false;
      this.isBtnAccept = false;
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

  updateStatus(){
    this.loadingService.show();
    this.dcsm03Service.updateStatus(this.designForm.getRawValue().id).subscribe((response) => {
       this.designForm.patchValue(response);
       this.checkButtonVisibility();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'ยอมรับงานสำเร็จ!');
      this.router.navigate(['/Dcsm03']);
    })
  }

  updateStatusWorking(){
    this.loadingService.show();
    this.dcsm03Service.updateStatusWork(this.designForm.getRawValue().id).subscribe((response) => {
       this.designForm.patchValue(response);
       this.checkButtonVisibility();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'กำลังดำเนินการ!');
      this.router.navigate(['/Dcsm03']);
    })
  }

  updateStatusComplete(){
    this.loadingService.show();
    this.dcsm03Service.updateStatusComplete(this.designForm.getRawValue().id).subscribe((response) => {
       this.designForm.patchValue(response);
       this.checkButtonVisibility();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'เสร็จสิ้น!');
      this.router.navigate(['/Dcsm03']);
    })
  }

}
