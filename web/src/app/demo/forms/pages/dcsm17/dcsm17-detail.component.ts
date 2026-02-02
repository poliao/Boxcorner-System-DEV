import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm17Service } from './dcsm17.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dcsm17-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './dcsm17-detail.component.html',
  styleUrl: './dcsm17-detail.component.scss'
})
export class Dcsm17DetailComponent implements OnInit {
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
  deadlineDate = new FormControl('', Validators.required);
  deadlineTime = new FormControl('', Validators.required);
  remarks = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm17Service: Dcsm17Service,
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

    if (this.mainForm.getRawValue().status === 'จัดส่งได้ รอเคลียร์ไฟล์' || this.mainForm.getRawValue().status === 'กำลังเคลียร์ไฟล์' || this.mainForm.getRawValue().status === 'ไฟล์เสร็จ รอตรวจสอบไฟล์' || this.mainForm.getRawValue().status === 'ขึ้นตัวอย่างแล้ว' || this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง'|| this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง รอขึ้นตัวอย่าง' || this.mainForm.getRawValue().status === 'สำเร็จ ส่งตรวจสอบ' || this.mainForm.getRawValue().status === 'ผ่าน' || this.mainForm.getRawValue().status === 'สำเร็จ รออนุมัติไปตารางรอผลิต' || this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง') {
      this.mainForm.controls['folderName'].disable({ emitEvent: false });
      this.mainForm.controls['deliveryDate'].disable({ emitEvent: false });
      this.mainForm.controls['deliveryTime'].disable({ emitEvent: false });
      this.mainForm.controls['quantity'].disable({ emitEvent: false });
      this.mainForm.controls['unit'].disable({ emitEvent: false });
      this.mainForm.controls['isCreateSample'].disable({ emitEvent: false });
      this.mainForm.controls['note'].disable({ emitEvent: false });
    }
    this.checkBtn();
    if (this.mainForm.getRawValue().status == 'ขอเลื่อนวันส่ง' && this.getCurrentUserFromToken() == this.mainForm.getRawValue().jobOwner) {
      this.isUpdateDelivery = true
    }
  }

  private formatDateToDDMMYYYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  initForm(): void {
    const today = this.formatDateToDDMMYYYY(new Date());
    this.mainForm = this.fb.group({
      id: [''],
      orderDate: [today],
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
      updateDateDelivery: [today],
      updateTimeDelivery: [],
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

  private convertDateFormat(dateStr: string): string {
    if (!dateStr) return '';
    // ถ้าเป็นรูปแบบ yyyy-mm-dd แปลงเป็น dd/mm/yyyy
    if (dateStr.includes('-') && dateStr.length === 10) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  }

  private convertTimeFormat(timeStr: string): string {
    if (!timeStr) return '';
    // ถ้าเป็นรูปแบบ HH:MM:SS แปลงเป็น HH:MM
    if (timeStr.includes(':') && timeStr.length >= 5) {
      return timeStr.substring(0, 5); // เอาแค่ HH:MM
    }
    return timeStr;
  }

  patchFormData(data: any): void {
    const apiData = { ...data };
    
    // แปลงรูปแบบวันที่และเวลา
    if (apiData.orderDate) apiData.orderDate = this.convertDateFormat(apiData.orderDate);
    // if (apiData.deliveryDate) apiData.deliveryDate = this.convertDateFormat(apiData.deliveryDate);
    if (apiData.updateDateDelivery) apiData.updateDateDelivery = this.convertDateFormat(apiData.updateDateDelivery);
    if (apiData.deliveryTime) apiData.deliveryTime = this.convertTimeFormat(apiData.deliveryTime);
    if (apiData.updateTimeDelivery) apiData.updateTimeDelivery = this.convertTimeFormat(apiData.updateTimeDelivery);
    
    // ตั้งค่าแต่ละฟิลด์ทีละตัว
    Object.keys(apiData).forEach(key => {
      if (apiData[key] !== null && apiData[key] !== undefined && this.mainForm.get(key)) {
        this.mainForm.get(key)!.setValue(apiData[key]);
      }
    });
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

  private convertDateToAPI(dateStr: string): string {
    if (!dateStr) return '';
    // ถ้าเป็นรูปแบบ dd/mm/yyyy แปลงเป็น yyyy-mm-dd สำหรับ API
    if (dateStr.includes('/') && dateStr.length === 10) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  }

  onSubmit() {
    const requiredFields = ['folderName', 'deliveryDate', 'deliveryTime', 'quantity', 'unit'];
    const missingFields = requiredFields.filter(field => !this.mainForm.getRawValue()[field] || this.mainForm.getRawValue()[field] === '');
    
    if (missingFields.length > 0) {
      this.mainForm.markAllAsTouched();
      this.sweetAlert.warning('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    // แปลงวันที่กลับเป็นรูปแบบ API ก่อนส่ง
    const formData = { ...this.mainForm.getRawValue() };
    if (formData.orderDate) formData.orderDate = this.convertDateToAPI(formData.orderDate);
    if (formData.deliveryDate) formData.deliveryDate = this.convertDateToAPI(formData.deliveryDate);
    if (formData.updateDateDelivery) formData.updateDateDelivery = this.convertDateToAPI(formData.updateDateDelivery);

    this.loadingService.show();
    this.dcsm17Service.save(formData).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.patchFormData(response);
        this.checkBtn();
        this.sweetAlert.success('บันทึกข้อมูลสำเร็จ', 'เรียบร้อย')
      },
      error: (error) => {
        this.loadingService.hide();
        const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
        this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
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
        this.dcsm17Service.updateFileChecked(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
          this.router.navigate(['/Dcsm17']);
        })
      }
    });
  }

  updateEditFile() {
    Swal.fire({
      title: 'ตรวจสอบไฟล์',
      text: "ยื่นยันตรวจสอบไฟล์ ไม่ผ่าน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm17Service.updateEditFile(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
          this.router.navigate(['/Dcsm17']);
        })
      }
    });
  }

  updateConfirmSample() {
    Swal.fire({
      title: 'อนุมัติการขึ้นตัวอย่าง',
      text: "ยื่นยันการขึ้นตัวอย่าง ผ่าน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm17Service.updateConfirmSample(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
          this.router.navigate(['/dcsm17']);
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
    }  else {
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
        this.dcsm17Service.save(data).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          if (this.mainForm.getRawValue().status == 'ขอเลื่อนวันส่ง') {
            this.isUpdateDelivery = true
          } else {
            this.isUpdateDelivery = false
          }
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
          this.router.navigate(['/Dcsm17']);
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
        this.dcsm17Service.save(data).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          if (this.mainForm.getRawValue().status == 'ขอเลื่อนวันส่ง') {
            this.isUpdateDelivery = true
          } else {
            this.isUpdateDelivery = false
          }
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
          this.router.navigate(['/Dcsm17']);
        })
      }
    });
  }

  openApproveModal() {
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
      orderDate: this.formatDateToDDMMYYYY(new Date()),
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
    };
    console.log(data);
    
    Swal.fire({
      title: 'อนุมัติส่งไปตารางขึ้นตัวอย่าง',
      text: "คุณต้องอนุมัติส่งไปตารางขึ้นตัวอย่าง ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm17Service.saveProduction(data).subscribe((response) => {
          if (response) {
            this.dcsm17Service.updateConfirmSample(this.mainForm.getRawValue().id).subscribe((response) => {
              this.patchFormData(response);
              this.loadingService.hide();
              this.checkBtn();
              this.sweetAlert.success('Success', 'เสร็จสิ้น!');
              this.router.navigate(['/Dcsm17']);
            })
          }
        });
      }
    });
  }

}
