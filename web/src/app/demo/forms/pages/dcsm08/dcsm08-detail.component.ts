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
      decisionAuthorityRemarks: [null],
      print2Page: [false],
      inspector: [null],
      jobId: [null],
      qtId: [null],
      createdTime: [null],
      qpId: [null],
      qcType: [null],
      qcLocation: [null],
      sampleJobType: [null],
      samplePrintingSystem: [null],
      samplePrintingStyle: [null],
      samplePrintingColor: [null],
      samplePaperSize: [null],
      samplePaperGrammage: [null],
      sampleCoatingStyle: [null],
      sampleDiecutStyle: [null],
      sampleSpecialInstructions: [null],
      sampleDeliveryTimestamp: [null],
      printRound: [null],
      printRoundPage2: [null],
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
    this.mainForm.get('decisionAuthority')?.disable();
    this.mainForm.get('decisionAuthorityRemarks')?.disable();
    this.mainForm.get('print2Page')?.disable();
    this.mainForm.get('jobId')?.disable();
    this.mainForm.get('qtId')?.disable();
    this.mainForm.get('inspector')?.disable();
    this.mainForm.get('createdTime')?.disable({ emitEvent: false });
    this.mainForm.get('qpId')?.disable();
    this.mainForm.get('qcType')?.disable();

    this.mainForm.get('sampleJobType')?.disable({ emitEvent: false });
    this.mainForm.get('samplePrintingSystem')?.disable({ emitEvent: false });
    this.mainForm.get('samplePrintingStyle')?.disable({ emitEvent: false });
    this.mainForm.get('samplePrintingColor')?.disable({ emitEvent: false });
    this.mainForm.get('samplePaperSize')?.disable({ emitEvent: false });
    this.mainForm.get('samplePaperGrammage')?.disable({ emitEvent: false });
    this.mainForm.get('sampleCoatingStyle')?.disable({ emitEvent: false });
    this.mainForm.get('sampleDiecutStyle')?.disable({ emitEvent: false });
    this.mainForm.get('sampleSpecialInstructions')?.disable({ emitEvent: false });
    this.mainForm.get('sampleDeliveryTimestamp')?.disable({ emitEvent: false });
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    if (apiData.sampleDeliveryTimestamp) {
      apiData.sampleDeliveryTimestamp = apiData.sampleDeliveryTimestamp.substring(0, 16);
    }
    this.mainForm.patchValue(apiData);
  }

  prepareDataForSave(data: any): any {
    return { ...data };
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

        const formData = this.prepareDataForSave(this.mainForm.getRawValue());
        this.dcsm08Service.save(formData).subscribe({
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

        const formData = this.prepareDataForSave(this.mainForm.getRawValue());
        this.dcsm08Service.save(formData).subscribe({
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

        const formData = this.prepareDataForSave(this.mainForm.getRawValue());
        this.dcsm08Service.save(formData).subscribe({
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

  formatDateThai(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  getCombinedDateTime(timestampField: string): string {
    const timestamp = this.mainForm.get(timestampField)?.value;
    if (!timestamp) return '';
    const datePart = timestamp.split('T')[0];
    const timePart = timestamp.split('T')[1]?.substring(0, 5);
    const dateStr = this.formatDateThai(datePart);
    return timePart ? `${dateStr} ${timePart}` : dateStr;
  }
}
