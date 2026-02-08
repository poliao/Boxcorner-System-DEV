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
  checkProof = false

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
      searchId: [''],
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
      noteEdit: [''],
      fileName: [''],
      designOrderId: [''],
      updateDateDelivery: [new Date().toISOString().substring(0, 10)],
      updateTimeDelivery: [''],
      customerName: [''],
      jobType: [null],
      printType: [null],
      paperType: [null],
      diecuttingType: [null],
      coatType: [null],
      systemPrint: [null],
      colorPrint: [null],
      paperGram: [null],
      rowVersion: [null],
      jobId: [null],
      qtId: [null],
      typeJob: [null],
      machineName: [null],
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
    this.mainForm.controls['noteEdit'].disable({ emitEvent: false });
    this.mainForm.controls['customerName'].disable({ emitEvent: false });
    this.mainForm.controls['fileName'].disable({ emitEvent: false });
    this.mainForm.controls['designOrderId'].disable({ emitEvent: false });
    this.mainForm.controls['updateDateDelivery'].disable({ emitEvent: false });
    this.mainForm.controls['updateTimeDelivery'].disable({ emitEvent: false });
    this.mainForm.controls['jobType'].disable({ emitEvent: false });
    this.mainForm.controls['printType'].disable({ emitEvent: false });
    this.mainForm.controls['paperType'].disable({ emitEvent: false });
    this.mainForm.controls['diecuttingType'].disable({ emitEvent: false });
    this.mainForm.controls['coatType'].disable({ emitEvent: false });
    this.mainForm.controls['systemPrint'].disable({ emitEvent: false });
    this.mainForm.controls['colorPrint'].disable({ emitEvent: false });
    this.mainForm.controls['paperGram'].disable({ emitEvent: false });
    this.mainForm.controls['jobId'].disable({ emitEvent: false });
    this.mainForm.controls['qtId'].disable({ emitEvent: false });
    this.mainForm.controls['typeJob'].disable({ emitEvent: false });
    this.mainForm.controls['machineName'].disable({ emitEvent: false });
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
        if (this.mainForm.getRawValue().isCreateSample == true) {
          this.mainForm.get('status').setValue('ไฟล์ถูกต้อง รอขึ้นตัวอย่าง')
        } else {
          this.mainForm.get('status').setValue('ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง')
        }
        this.dcsm11Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.sweetAlert.success('Success', 'เสร็จสิ้น!');
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

    if (this.mainForm.getRawValue().status == 'ไฟล์Proofเสร็จ รอตรวจ') {
      this.checkProof = true
    }else{
      this.checkProof = false
    }
  }

  confirmEditFile() {
    Swal.fire({
      title: 'ส่งกลับไปยังเจ้าของงาน',
      text: "ส่งกลับไปยังเจ้าของงานตรวจสอบ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status').setValue('รอเจ้าของงานตรวจสอบ')
        this.dcsm11Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'บันทึกข้อมูลเรียบร้อย!');
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        });
      }
    });
  }

  confirmFileProof() {
    Swal.fire({
      title: 'ส่งกลับไปยังเจ้าของงาน',
      text: "ส่งกลับไปยังเจ้าของงานตรวจสอบ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status').setValue('ไฟล์Proofถูกต้อง รอส่งไปช่างพิมพ์')
        this.dcsm11Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'บันทึกข้อมูลเรียบร้อย!');
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        });
      }
    });
  }

}
