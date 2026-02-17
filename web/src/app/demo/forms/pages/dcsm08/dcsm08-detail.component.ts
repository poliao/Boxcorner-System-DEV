import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm08Service } from './dcsm08.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { TokenService } from 'src/app/shared/token.service';
@Component({
  selector: 'app-dcsm08-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm08-detail.component.html',
  styleUrl: './dcsm08-detail.component.scss'
})
export class Dcsm08DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isProsess = false;
  isSuccess = false;
  isEditMold = false;
  isSupplier = false;
  isKeepSupplier = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm08Service: Dcsm08Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private tokenService: TokenService,
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
      createdAt: [''],
      updatedAt: [''],
      customerName: [''],
      dataDalivery: [false],
      postpone: [null],
      rowVersion: [null],
      decisionAuthority: [null],
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
    this.mainForm.get('customerName')?.disable();
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
  }

  checkBtn() {
    if ((this.tokenService.getCurrentUserFromToken() === this.mainForm.getRawValue().operatorName && this.mainForm.getRawValue().processStatus == 'รอดำเนินการ')) {
      this.isProsess = true;
    } else if ((this.tokenService.getCurrentUserFromToken() === this.mainForm.getRawValue().operatorName && this.mainForm.getRawValue().processStatus == 'กำลังดำเนินการ' && this.mainForm.getRawValue().jobType != 'Supplier') || (this.tokenService.getCurrentUserFromToken() === this.mainForm.getRawValue().operatorName && this.mainForm.getRawValue().processStatus == 'กำลังแก้ไขแม่พิมพ์' && this.mainForm.getRawValue().jobType != 'Supplier')) {
      this.isSuccess = true
    } else if (this.tokenService.getCurrentUserFromToken() === this.mainForm.getRawValue().operatorName && this.mainForm.getRawValue().jobType == 'Supplier' && this.mainForm.getRawValue().processStatus == 'กำลังดำเนินการ') {
      this.isSupplier = true
    } else if (this.tokenService.getCurrentUserFromToken() === this.mainForm.getRawValue().operatorName && this.mainForm.getRawValue().jobType == 'Supplier' && this.mainForm.getRawValue().processStatus == 'ส่ง Supplier') {
      this.isKeepSupplier = true
    } else {
      this.isSuccess = false
      this.isProsess = false;
    }

  }

  updateProcessStatus() {

    Swal.fire({
      title: 'ยืนยันกำลังดำเนินการ',
      text: "ยืนยันกำลังดำเนินการ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('jobStatus')?.setValue('กำลังดำเนินการ');
        this.mainForm.get('processStatus')?.setValue('กำลังดำเนินการ');
        this.dcsm08Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('กำลังดำเนินการ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm08']);
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

  updateSuccessStatus() {
    const apiFilters = {
      id: this.mainForm.getRawValue().id,
      processStatus: 'เสร็จสิ้น รอตรวจสอบ',
    };

    Swal.fire({
      title: 'ยืนยันเสร็จสิ้น',
      text: "ยืนยันเสร็จสิ้น ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('processStatus')?.setValue('เสร็จสิ้น รอตรวจสอบ');

        this.dcsm08Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('ยืนยันเสร็จสิ้นสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm08']);
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

  updateSupplierStatus() {
    Swal.fire({
      title: 'ยืนยันกำลังดำเนินการ',
      text: "ยืนยันกำลังดำเนินการ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('processStatus')?.setValue('ส่ง Supplier');
        this.mainForm.get('jobStatus')?.setValue('กำลังดำเนินการ');
        this.mainForm.get('moldStatus')?.setValue('ส่ง Supplier');

        this.dcsm08Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('กำลังดำเนินการ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm08']);
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        })
      };
    });
  }

  updateKeepSupplierStatus() {
    Swal.fire({
      title: 'ยืนยันกำลังดำเนินการ',
      text: "ยืนยันกำลังดำเนินการ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('processStatus')?.setValue('รับของจากซัพพลายเออร์แล้ว');
        this.mainForm.get('jobStatus')?.setValue('เสร็จสิ้น');
        this.mainForm.get('moldStatus')?.setValue('รับของจากซัพพลายเออร์แล้ว');

        this.dcsm08Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('กำลังดำเนินการ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm08']);
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        })
      }
    });
  }


}
