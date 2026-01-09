import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm11Service } from './dcsm11.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dcsm11-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  providers: [Dcsm11Service],
  templateUrl: './dcsm11-detail.component.html',
  styleUrl: './dcsm11-detail.component.scss'
})
export class Dcsm11DetailComponent implements OnInit {
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
  isNoteEdit = false

  showEditFileModal = false;
  editFileNote = new FormControl('', Validators.required);

  showApproveModal = false;
  usedFile = new FormControl('', Validators.required);
  colorSample = new FormControl('', Validators.required);
  deadlineDate = new FormControl('', Validators.required);
  deadlineTime = new FormControl('', Validators.required);
  remarks = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm11Service: Dcsm11Service,
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
    this.checkBtn()
    if (this.mainForm.getRawValue().noteEdit) {
      this.isNoteEdit = true
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
      isCreateSample: [false],
      status: ['รอผู้รับผิดชอบอนุมัติ'],
      note: [''],
      designOrderId: [''],
      updateDateDelivery: [new Date().toISOString().substring(0, 10)],
      updateTimeDelivery: [''],
      noteEdit: [''],
    });
    this.mainForm.controls['id'].disable({ emitEvent: false });
    this.mainForm.controls['orderDate'].disable({ emitEvent: false });
    this.mainForm.controls['jobOwner'].disable({ emitEvent: false });
    this.mainForm.controls['responsiblePerson'].disable({ emitEvent: false });
    this.mainForm.controls['status'].disable({ emitEvent: false });
    this.mainForm.controls['designOrderId'].disable({ emitEvent: false });
    this.mainForm.controls['updateDateDelivery'].disable({ emitEvent: false });
    this.mainForm.controls['updateTimeDelivery'].disable({ emitEvent: false });
    this.mainForm.controls['folderName'].disable({ emitEvent: false });
    this.mainForm.controls['deliveryDate'].disable({ emitEvent: false });
    this.mainForm.controls['deliveryTime'].disable({ emitEvent: false });
    this.mainForm.controls['quantity'].disable({ emitEvent: false });
    this.mainForm.controls['unit'].disable({ emitEvent: false });
    this.mainForm.controls['isCreateSample'].disable({ emitEvent: false });
    this.mainForm.controls['note'].disable({ emitEvent: false });
    this.mainForm.controls['noteEdit'].disable({ emitEvent: false });
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

    this.loadingService.show();
    this.dcsm11Service.save(this.mainForm.getRawValue()).subscribe({
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
        this.dcsm11Service.updateFileChecked(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
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
        this.dcsm11Service.updateConfirmSample(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
          this.router.navigate(['/dcsm11']);
        })
      }
    });
  }

  updateEditConfirmSample() {
    Swal.fire({
      title: 'อนุมัติการขึ้นตัวอย่าง',
      text: "ยื่นยันการขึ้นตัวอย่าง ไม่ผ่าน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm11Service.updateEditConfirmSample(this.mainForm.getRawValue().id).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
          this.router.navigate(['/dcsm11']);
        })
      }
    })
  }

  checkBtn() {
    const formValue = this.mainForm.getRawValue();
    const currentUser = this.getCurrentUserFromToken();
    if (formValue.status === 'ไฟล์เสร็จ รอตรวจสอบไฟล์') {
      this.isBtnApprove = true;
      this.isBtnReject = true;
    } else if (currentUser === formValue.jobOwner && formValue.status === 'สำเร็จ ส่งตรวจสอบ') {
      this.isBtnSave = false;
      this.isBtnApprove = false;
      this.isBtnReject = false;
      this.isBtnApproveSample = true;
      this.isBtnRejectSample = true;
    } else {
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
        this.dcsm11Service.save(data).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          if (this.mainForm.getRawValue().status == 'ขอเลื่อนวันส่ง') {
            this.isUpdateDelivery = true
          } else {
            this.isUpdateDelivery = false
          }
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
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
        this.dcsm11Service.save(data).subscribe((response) => {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          if (this.mainForm.getRawValue().status == 'ขอเลื่อนวันส่ง') {
            this.isUpdateDelivery = true
          } else {
            this.isUpdateDelivery = false
          }
          this.sweetAlert.success('Success', 'เสร็จสิ้น!');
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
    };
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
        this.dcsm11Service.saveProduction(data).subscribe((response) => {
          if (response) {
            this.dcsm11Service.updateConfirmSample(this.mainForm.getRawValue().id).subscribe((response) => {
              this.patchFormData(response);
              this.loadingService.hide();
              this.checkBtn();
              this.sweetAlert.success('Success', 'เสร็จสิ้น!');
              this.router.navigate(['/dcsm11']);
            })
          }
        });
      }
    });
  }

  openEditFileModal() {
    this.editFileNote.setValue(''); // เคลียร์ค่าเก่า
    this.showEditFileModal = true;  // เปิด Modal
  }

  // 3. ฟังก์ชันปิด Modal
  closeEditFileModal() {
    this.showEditFileModal = false;
  }

  confirmEditFile() {
    if (this.editFileNote.invalid) {
      this.editFileNote.markAsTouched();
      return;
    }
    Swal.fire({
      title: 'ยืนยันการแก้ไขไฟล์',
      text: "คุณต้องการส่งคำขอแก้ไขไฟล์ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        const data ={
          id: this.mainForm.getRawValue().id,
          noteEdit: this.editFileNote.value
        }
        this.dcsm11Service.updateEditFile(data).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.closeEditFileModal();
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'บันทึกข้อมูลเรียบร้อย!');
          },
          error: (err) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', 'เกิดข้อผิดพลาด');
          }
        });
      }
    });
  }

}
