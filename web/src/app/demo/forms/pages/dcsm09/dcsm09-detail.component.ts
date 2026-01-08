import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm09Service } from './dcsm09.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-dcsm09-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm09-detail.component.html',
  styleUrl: './dcsm09-detail.component.scss'
})
export class Dcsm09DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isCheckMold = false;
  isOrder = false;
  isSendOrder = false;
  isSendFile = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm09Service: Dcsm09Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
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
      usedFile: [''],
      colorSample: [''],
      jobOwner: [''],
      deadlineDate: [''],
      deadlineTime: [''],
      deliveryDate: [''],
      jobStatus: [''],
      processStatus: [''],
      operatorName: [''],
      inspectionDate: [''],
      remarks: [''],
      moldStatus: [''],
      jobType: [''],
      inspector: [''],
      createdAt: [''],
      updatedAt: [''],

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
    this.mainForm.get('jobType')?.disable();
    this.mainForm.get('createdAt')?.disable();
    this.mainForm.get('updatedAt')?.disable();
    this.mainForm.get('deliveryDate')?.disable();
    this.mainForm.get('operatorName')?.disable();
    this.mainForm.get('remarks')?.disable();
    this.mainForm.get('inspector')?.disable();
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
  }

  checkBtn() {
    if (this.mainForm.getRawValue().processStatus == 'เสร็จสิ้น รอตรวจสอบ' ) {
      this.isCheckMold = true;
      this.isOrder = false;
      this.isSendOrder = false;
      this.isSendFile = false;
    } else if (this.mainForm.getRawValue().processStatus == 'ตรวจไฟล์แม่พิมพ์แล้ว' && this.authService.getUserFromToken().sub == this.mainForm.getRawValue().inspector) {
      this.isOrder = true;
      this.isCheckMold = false;
      this.isSendOrder = false;
      this.isSendFile = false;
    } else if (this.mainForm.getRawValue().processStatus == 'ตรวจใบสั่งผลิตแล้ว' && this.authService.getUserFromToken().sub == this.mainForm.getRawValue().inspector) {
      this.isSendOrder = true;
      this.isSendFile = false;
      this.isOrder = false;
      this.isCheckMold = false;
    } else if (this.mainForm.getRawValue().processStatus == 'ส่งใบสั่งผลิตแล้ว' && this.authService.getUserFromToken().sub == this.mainForm.getRawValue().inspector) {
      this.isSendFile = true;
      this.isSendOrder = false;
      this.isOrder = false;
      this.isCheckMold = false;
    }else{
      this.isCheckMold = false;
      this.isOrder = false;
      this.isSendOrder = false;
      this.isSendFile = false;
    }
  }

  updateMoldStatus() {
    const apiFilters = {
      id: this.mainForm.getRawValue().id,
      processStatus: 'ตรวจไฟล์แม่พิมพ์แล้ว',
    };

    const formData = {
      id: this.mainForm.getRawValue().id,
      inspector: this.authService.getUserFromToken().sub,
    }

    Swal.fire({
      title: 'ยืนยันตรวจไฟล์แม่พิมพ์แล้ว',
      text: "ยืนยันตรวจไฟล์แม่พิมพ์แล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm09Service.updateProcessStatus(apiFilters).subscribe({
          next: (response) => {
            this.dcsm09Service.updateInspector(formData).subscribe({
              next: (response) => {
                this.patchFormData(response);
                this.checkBtn();
                this.loadingService.hide();
                this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
                this.router.navigate(['/Dcsm09']);
              },
              error: (error) => {
                this.loadingService.hide();
                const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
                this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
              }
            });
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    });
  }

  updateOrder() {
    const apiFilters = {
      id: this.mainForm.getRawValue().id,
      processStatus: 'ตรวจใบสั่งผลิตแล้ว',
    };

    Swal.fire({
      title: 'ยืนยันตรวจใบสั่งผลิตแล้ว',
      text: "ยืนยันตรวจใบสั่งผลิตแล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm09Service.updateProcessStatus(apiFilters).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm09']);
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    });
  }

  updateSendOrder() {
    const apiFilters = {
      id: this.mainForm.getRawValue().id,
      processStatus: 'ส่งใบสั่งผลิตแล้ว',
    };

    Swal.fire({
      title: 'ยืนยันส่งใบสั่งผลิตแล้ว',
      text: "ยืนยันส่งใบสั่งผลิตแล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm09Service.updateProcessStatus(apiFilters).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm09']);
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    });
  }

  updateSendFile() {
    const apiFilters = {
      id: this.mainForm.getRawValue().id,
      processStatus: 'ส่งไฟล์แล้ว',
    };

    const data = {
      id: this.mainForm.getRawValue().id,
      jobStatus: 'เสร็จสิ้น',
    };

    Swal.fire({
      title: 'ยืนยันส่งไฟล์แล้ว',
      text: "ยืนยันส่งไฟล์แล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm09Service.updateProcessStatus(apiFilters).subscribe({
          next: () => {
            this.dcsm09Service.updateJobStatus(data).subscribe({
              next: (response) => {
                this.patchFormData(response);
                this.checkBtn();
                this.loadingService.hide();
                this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
                this.router.navigate(['/Dcsm09']);
              },
              error: (error) => {
                this.loadingService.hide();
                const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
                this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
              }
            });
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    });
  }

}
