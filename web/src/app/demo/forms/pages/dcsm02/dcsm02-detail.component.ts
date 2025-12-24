import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm02Service } from './dcsm02.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
@Component({
  selector: 'app-dcsm02-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm02-detail.component.html',
  styleUrl: './dcsm02-detail.component.scss'
})
export class Dcsm02DetailComponent implements OnInit {
  designForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isBtnApprove = false;
  isBtnEdit = false;

  showApproveModal = false;
  approveDate = new FormControl('');      // วันที่
  approveTime = new FormControl('');      // เวลา
  approveQty = new FormControl('');       // จำนวน
  approveUnit = new FormControl('');      // หน่วยนับ
  isCreateSample = new FormControl(false); // Checkbox ขึ้นตัวอย่าง (ค่าเริ่มต้น false)

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm02Service: Dcsm02Service,
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
    this.checkBtn();
  }

  initForm(): void {
    this.designForm = this.fb.group({
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      jobDetails: ['', Validators.required],
      remarks: [''],
      jobOwner: ['', Validators.required],
      deadlineDate: ['', Validators.required],
      deadlineTime: ['', Validators.required],
      assignee: [''],
      processStatus: ['รอดำเนินการ', Validators.required],
      confirmStatus: ['รอผู้รับผิดชอบยืนยัน', Validators.required]
    });
    this.designForm.controls['id'].disable({ emitEvent: false });
    this.designForm.controls['orderDate'].disable({ emitEvent: false });
    this.designForm.controls['jobOwner'].disable({ emitEvent: false });
    this.designForm.controls['assignee'].disable({ emitEvent: false });
    this.designForm.controls['processStatus'].disable({ emitEvent: false });
    this.designForm.controls['confirmStatus'].disable({ emitEvent: false });

    console.log(this.designForm.getRawValue().processStatus);
    

    if (this.designForm.getRawValue().processStatus == 'รอดำเนินการ' || this.designForm.getRawValue().processStatus == 'เสร็จสิ้น') {
      this.designForm.controls['folderName'].disable({ emitEvent: false });
      this.designForm.controls['jobDetails'].disable({ emitEvent: false });
      this.designForm.controls['remarks'].disable({ emitEvent: false });
      this.designForm.controls['deadlineDate'].disable({ emitEvent: false });
      this.designForm.controls['deadlineTime'].disable({ emitEvent: false });
    }
  }
  patchFormData(data: any): void {
    const apiData = data as any;
    this.designForm.patchValue(apiData);
  }

  onSubmit(): void {
    if (this.designForm.valid) {
      this.loadingService.show();
      const data = this.designForm.getRawValue();
      this.dcsm02Service.save(data).subscribe((response) => {
        try {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
        } catch (error) {
          this.loadingService.hide();
          this.sweetAlert.error('Save', error);
        }
      });
    }
  }

  getJobDetailsColor() {
    const value = this.designForm.get('jobDetails')?.value;
    switch (value) {
      case 'ปรับไดคัท': return 'bg-warning text-white';
      case 'แก้ไขอาร์ต': return 'bg-danger text-white';
      case 'รอลูกค้าแจ้งกลับ': return 'bg-success text-white';
      case 'ออกแบบรายละเอียดใน Line': return 'bg-info text-white';
      case 'เคลียร์ไฟล์ ส่งคอนเฟิร์ม': return 'bg-danger text-white';
      default: return 'bg-light text-dark';
    }
  }

  checkBtn() {
    if (this.designForm.getRawValue().jobOwner === this.getCurrentUserFromToken() && this.designForm.getRawValue().confirmStatus === 'รอตรวจสอบ') {
      this.isBtnApprove = true;
      this.isBtnEdit = true;
    } else {
      this.isBtnApprove = false;
      this.isBtnEdit = false;
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

  updateStatusApprove() {
    this.loadingService.show();
    this.dcsm02Service.updateStatusApprove(this.designForm.getRawValue().id).subscribe((response) => {
      this.designForm.patchValue(response);
      this.loadingService.hide();
      this.checkBtn();
      this.sweetAlert.success('Success', 'อนุมัติสำเร็จ!');
    })
  }

  updateStatusEdit() {
    this.loadingService.show();
    this.dcsm02Service.updateStatusEdit(this.designForm.getRawValue().id).subscribe((response) => {
      this.designForm.patchValue(response);
      this.loadingService.hide();
      this.checkBtn();
      this.sweetAlert.success('Success', 'ส่งแก้ไขสำเร็จ!');
    })
  }

  openApproveModal() {
    // กำหนดค่าเริ่มต้นตอนเปิด Modal
    const now = new Date();
    this.approveDate.setValue(now.toISOString().substring(0, 10)); // วันปัจจุบัน
    this.approveTime.setValue(now.toTimeString().substring(0, 5)); // เวลาปัจจุบัน
    this.approveQty.setValue('');
    this.approveUnit.setValue('');
    this.isCreateSample.setValue(false);

    this.showApproveModal = true;
  }

  closeApproveModal() {
    this.showApproveModal = false;
  }

  confirmApprove() {

    const data = {
      id: '', // ปล่อยว่าง หรือใส่ค่าตามต้องการ
      orderDate: new Date().toISOString().substring(0, 10), // วันที่ปัจจุบัน
      folderName: this.designForm.getRawValue().folderName,     // ดึงจากฟอร์มหลัก
      jobOwner: this.designForm.getRawValue().jobOwner,         // ดึงจากฟอร์มหลัก
      deliveryDate: this.approveDate.value,
      deliveryTime: this.approveTime.value,
      quantity: this.approveQty.value,
      unit: this.approveUnit.value,
      isCreateSample: this.isCreateSample.value,
      responsiblePerson: 'รอผู้รับผิดชอบอนุมัติ',
      status: 'รอผู้รับผิดชอบอนุมัติ',
      designOrderId: this.designForm.getRawValue().id // true/false
    };
    this.dcsm02Service.savesampleOrders(data).subscribe((response) => {
      if (response) {
        this.updateStatusApprove();
        this.closeApproveModal();
      }
    });
  }

  

}
