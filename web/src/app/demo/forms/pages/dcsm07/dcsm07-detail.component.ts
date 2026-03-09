import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm07Service, DropdownOption } from './dcsm07.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm07-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, FormsModule],
  templateUrl: './dcsm07-detail.component.html',
  styleUrl: './dcsm07-detail.component.scss'
})
export class Dcsm07DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  operatorOptions: DropdownOption[] = [];
  isSampleOrderId = true;
  isCancel = true;
  isBtnSave = false;
  isCancelRemarks = false;

  // ตัวแปรสำหรับ modal เปลี่ยนวันที่และเวลา
  showDeadlineModal: boolean = false;
  tempDeadlineDate: string = '';
  tempDeadlineTime: string = '';

  // ตัวแปรสำหรับ modal ยกเลิกงาน
  showCancelModal: boolean = false;
  cancelReason: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm07Service: Dcsm07Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.initForm();
    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
      this.checkBtn();
      this.getDropdown();

      if (this.mainForm.getRawValue().processStatus == 'รอผู้รับผิดชอบยืนยัน' || this.mainForm.getRawValue().processStatus == 'รอดำเนินการ') {
        this.mainForm.get('jobType')?.enable({ emitEvent: false });
        this.mainForm.get('operatorName')?.enable({ emitEvent: false });
        this.mainForm.get('deliveryDate')?.enable({ emitEvent: false });
        this.mainForm.get('remarks')?.enable({ emitEvent: false });
      }
      if (this.mainForm.getRawValue().sampleOrderId == '' || this.mainForm.getRawValue().sampleOrderId == null) {
        this.isSampleOrderId = false
      }
      if (this.mainForm.getRawValue().cancelRemarks) {
        this.isCancelRemarks = true
      }
      this.mainForm.get('qpId')?.valueChanges.subscribe(val => {
        if (val) {
          this.mainForm.get('jobId')?.setValidators(null);
        } else {
          this.mainForm.get('jobId')?.setValidators([Validators.required]);
        }
        this.mainForm.get('jobId')?.updateValueAndValidity();
      });
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
      deliveryDate: ['', Validators.required],
      jobStatus: [''],
      processStatus: [''],
      operatorName: ['', Validators.required],
      inspectionDate: [''],
      remarks: [''],
      moldStatus: [''],
      jobType: ['', Validators.required],
      createdAt: [''],
      updatedAt: [''],
      sampleOrderId: [''],
      customerName: [''],
      cancelRemarks: [''],
      dataDalivery: [false],
      postpone: [null],
      rowVersion: [null],
      decisionAuthority: [null],
      decisionAuthorityRemarks: [null],
      print2Page: [false],
      createdTime: [null],
      jobId: [null],
      qtId: [null],
      qpId: [null],
    });
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
    this.mainForm.get('sampleOrderId')?.disable();
    this.mainForm.get('customerName')?.disable();
    this.mainForm.get('cancelRemarks')?.disable();
    this.mainForm.get('decisionAuthority')?.disable();
    this.mainForm.get('decisionAuthorityRemarks')?.disable();
    this.mainForm.get('createdTime')?.disable({ emitEvent: false });
    this.mainForm.get('jobId')?.disable();
    this.mainForm.get('qtId')?.disable();
    this.mainForm.get('qpId')?.disable();
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
  }

  checkBtn() {
    if (this.mainForm.getRawValue().jobStatus == 'รอผู้รับผิดชอบยืนยัน' || this.mainForm.getRawValue().jobStatus == 'รอดำเนินการ') {
      this.isCancel = false;
    }
    if (this.mainForm.getRawValue().processStatus == 'รอผู้รับผิดชอบยืนยัน' || this.mainForm.getRawValue().processStatus == 'รอดำเนินการ') {
      this.isBtnSave = true;
    }
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
        const data = this.mainForm.getRawValue();
        this.mainForm.get('jobStatus')?.setValue('รอดำเนินการ');
        this.mainForm.get('processStatus')?.setValue('รอดำเนินการ');
        if (this.mainForm.getRawValue().jobType == 'OD') {
          this.mainForm.get('moldStatus')?.setValue('งานดิจิทัล');
        } else {
          this.mainForm.get('moldStatus')?.setValue('รอดำเนินการ');
        }

        this.dcsm07Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.checkBtn();
            this.sweetAlert.success('บันทึกข้อมูลสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm07']);
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

  getDropdown() {
    this.dcsm07Service.getPlanningOperators().subscribe({
      next: (data) => {
        this.operatorOptions = data;
      },
      error: (err) => {
        console.error('Error loading operators', err);
      }
    });
  }

  // ฟังก์ชันเปิด modal เปลี่ยนวันที่และเวลา
  openDeadlineModal() {
    this.tempDeadlineDate = this.mainForm.get('deadlineDate')?.value || '';
    this.tempDeadlineTime = this.mainForm.get('deadlineTime')?.value || '';
    this.showDeadlineModal = true;
  }

  // ฟังก์ชันปิด modal
  closeDeadlineModal() {
    this.showDeadlineModal = false;
    this.tempDeadlineDate = '';
    this.tempDeadlineTime = '';
  }

  updateDeadline() {
    if (this.tempDeadlineDate || this.tempDeadlineTime) {
      this.mainForm.patchValue({
        deadlineDate: this.tempDeadlineDate,
        deadlineTime: this.tempDeadlineTime
      });
      this.closeDeadlineModal();
    }

    Swal.fire({
      title: 'แก้ไขเวลาส่งงาน',
      text: "ยืนยันแก้ไขเวลาส่งงาน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('postpone')?.setValue('มีการเลื่อนเวลาส่ง');
        this.dcsm07Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.checkBtn();
            this.sweetAlert.success('แก้ไขเวลาส่งงานสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm07']);
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

  // ฟังก์ชันเปิด modal ยกเลิกงาน
  openCancelModal() {
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  // ฟังก์ชันปิด modal ยกเลิกงาน
  closeCancelModal() {
    this.showCancelModal = false;
    this.cancelReason = '';
  }

  // ฟังก์ชันยืนยันการยกเลิก
  confirmCancel() {
    if (!this.cancelReason?.trim()) {
      this.sweetAlert.warning('กรุณาระบุเหตุผลในการยกเลิก');
      return;
    }
    this.loadingService.show();
    const formData = { ...this.mainForm.getRawValue() };
    formData.cancelRemarks = this.cancelReason;
    formData.jobStatus = 'ยกเลิก';
    formData.processStatus = 'ยกเลิก';
    formData.moldStatus = 'ยกเลิก';

    this.dcsm07Service.save(formData).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.patchFormData(response);
        this.checkBtn();
        this.sweetAlert.success('ยกเลิกข้อมูลสำเร็จ', 'เรียบร้อย')
        this.router.navigate(['/Dcsm07']);
      }, error: (error) => {
        this.loadingService.hide();
        const msg = error.error || 'ไม่สามารถบันทึกข้อมูลได้';
        this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
      }
    })
  }

}
