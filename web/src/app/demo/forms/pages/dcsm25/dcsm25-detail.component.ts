import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dcsm25Service } from './dcsm25.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm25-detail',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dcsm25-detail.component.html',
  styleUrls: ['./dcsm25-detail.component.scss']
})
export class Dcsm25DetailComponent implements OnInit {
  printingForm: FormGroup;
  printingFormRecord: FormGroup;
  id: string | null = null;
  isEditMode = false;
  isPrint = false;
  isInPrint = false;
  showPrintingModal = false;
  showPrintingEndModal = false;
  isSample = false;

  constructor(
    private fb: FormBuilder,
    private dcsm25Service: Dcsm25Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm();
    this.createPrintingFormRecord();
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    const resolvedData = this.route.snapshot.data['designDiecut'];
    if (resolvedData) {
      if (resolvedData.printingRecordId != null) {
        this.getRecord(resolvedData.printingRecordId);
      }
      this.printingForm.patchValue(resolvedData);
      if (this.printingForm.getRawValue().issample == true) {
        this.isSample = true
      }else {
        this.isSample = false
      }
    }
    this.checkbntPrint();
  }

  createForm() {
    this.printingForm = this.fb.group({
      id: [null],
      jobId: [null, Validators.required],
      customerJobName: ['', Validators.required],
      totalPrintSheets: [0],
      productionQty: [0],
      printerName: [null],
      setupWaste: [null],
      sampleId: [null],
      deliveryDate: [null],
      deliveryTime: [null],
      printingResponsible: ['', Validators.required],
      stampingDate: [null],
      stampingResponsible: [''],
      gluingDate: [null],
      gluingResponsible: [''],
      qcDate: [null],
      dueDate: ['', Validators.required],
      jobStatus: [''],
      shippingAddress: [''],
      remark: [''],
      deliveryStatus: [''],
      imageUrl: [null],
      dataDalivery: [false],
      machineSetupCount: [''],
      rowVersion: [null],
      printingRecordId: [null],
      issample: [false],
      jobType: [null],
      printType: [null],
      paperType: [null],
      diecuttingType: [null],
      coatType: [null],
      systemPrint: [null],
      colorPrint: [null],
      paperGram: [null],
      productionJobId: [null],
    });
    this.printingForm.get('createdAt')?.disable();
    this.printingForm.get('jobId')?.disable();
    this.printingForm.get('customerJobName')?.disable();
    this.printingForm.get('totalPrintSheets')?.disable();
    this.printingForm.get('productionQty')?.disable();
    this.printingForm.get('printerName')?.disable();
    this.printingForm.get('setupWaste')?.disable();
    this.printingForm.get('sampleId')?.disable();
    this.printingForm.get('deliveryDate')?.disable();
    this.printingForm.get('deliveryTime')?.disable();
    this.printingForm.get('printingResponsible')?.disable();
    this.printingForm.get('stampingDate')?.disable();
    this.printingForm.get('stampingResponsible')?.disable();
    this.printingForm.get('gluingDate')?.disable();
    this.printingForm.get('gluingResponsible')?.disable();
    this.printingForm.get('qcDate')?.disable();
    this.printingForm.get('dueDate')?.disable();
    this.printingForm.get('jobStatus')?.disable();
    this.printingForm.get('shippingAddress')?.disable();
    this.printingForm.get('remark')?.disable();
    this.printingForm.get('deliveryStatus')?.disable();
    this.printingForm.get('imageUrl')?.disable();
    this.printingForm.get('dataDalivery')?.disable();
    this.printingForm.get('machineSetupCount')?.disable();
    this.printingForm.get('rowVersion')?.disable();
    this.printingForm.get('printingRecordId')?.disable();
    this.printingForm.get('issample')?.disable();
    this.printingForm.get('jobType')?.disable();
    this.printingForm.get('printType')?.disable();
    this.printingForm.get('paperType')?.disable();
    this.printingForm.get('diecuttingType')?.disable();
    this.printingForm.get('coatType')?.disable();
    this.printingForm.get('systemPrint')?.disable();
    this.printingForm.get('colorPrint')?.disable();
    this.printingForm.get('paperGram')?.disable();
  }

  createPrintingFormRecord() {
    this.printingFormRecord = this.fb.group({
      id: [null],
      referenceId: [null],
      deliveryTableId: [null],
      jobId: [null],
      meter4colorStart: [null],
      meter4colorEnd: [null],
      meterBwStart: [null],
      meterBwEnd: [null],
      issueFound: [null],
      issueCause: [null],
      workType: [null],
      printerName: [null],
      jobCategory: [null],
      printQty4color: [null],
      printQtyBw: [null],
      printQtyTotal: [null],
      orderPrintQty: [null],
      orderProduceQty: [null],
      startDatetime: [null],
      endDatetime: [null],
      responsiblePerson: [null],
      rowVersion: [null],
      createdAt: [null],
    });
  }

  onUpdatePrint(status: string): void {
    if (status === 'inPrint') {
      this.openPrintingModal();
    } else if (status === 'Print') {
      this.openPrintingEndModal();
    } else {
      this.updatePrintStatus(status);
    }
  }

  openPrintingModal(): void {
    this.setStartPrintingValidators();
    this.showPrintingModal = true;
  }

  closePrintingModal(): void {
    this.showPrintingModal = false;
    this.printingFormRecord.reset();
  }

  openPrintingEndModal(): void {
    this.setEndPrintingValidators();
    this.showPrintingEndModal = true;
  }

  closePrintingEndModal(): void {
    this.showPrintingEndModal = false;
    this.printingFormRecord.reset();
  }

  onStartPrinting(): void {
    if (this.printingFormRecord.valid) {
      this.printingFormRecord.get('workType')?.setValue('OD');
      this.printingFormRecord.get('responsiblePerson')?.setValue(this.authService.getUserFromToken().sub);
      this.printingFormRecord.get('startDatetime')?.setValue(new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().substring(0, 16));
      this.startPrinting(this.printingFormRecord.getRawValue());
      this.closePrintingModal();
    } else {
      this.markPrintingFormTouched();
    }
  }

  onEndPrinting(): void {
    if (this.printingFormRecord.valid) {
      this.endPrinting();
      this.closePrintingEndModal();
    } else {
      this.markPrintingEndFormTouched();
    }
  }

  private markPrintingFormTouched(): void {
    Object.keys(this.printingFormRecord.controls).forEach(key => {
      const control = this.printingFormRecord.get(key);
      control?.markAsTouched();
    });
  }

  private markPrintingEndFormTouched(): void {
    Object.keys(this.printingFormRecord.controls).forEach(key => {
      const control = this.printingFormRecord.get(key);
      control?.markAsTouched();
    });
  }

  private endPrinting(): void {
    this.loadingService.show();
    this.printingForm.get('jobStatus')?.setValue('พิมพ์แล้ว');
    this.printingFormRecord.get('printQty4color')?.setValue(this.printingFormRecord.getRawValue().meter4colorEnd - this.printingFormRecord.getRawValue().meter4colorStart);
    this.printingFormRecord.get('printQtyBw')?.setValue(this.printingFormRecord.getRawValue().meterBwEnd - this.printingFormRecord.getRawValue().meterBwStart);
    this.printingFormRecord.get('printQtyTotal')?.setValue(this.printingFormRecord.getRawValue().printQty4color + this.printingFormRecord.getRawValue().printQtyBw);
    this.printingFormRecord.get('endDatetime')?.setValue(new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().substring(0, 16));
    this.dcsm25Service.saveRecord(this.printingFormRecord.getRawValue()).subscribe({
      next: (response) => {
        this.printingFormRecord.patchValue(response);
        this.dcsm25Service.save(this.printingForm.getRawValue()).subscribe({
          next: (response) => {
            this.updateSampleStatus();
            this.checkbntPrint();
            this.printingForm.patchValue(response);
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'พิมพ์เสร็จสิ้นเรียบร้อย!');
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
          }
        });
      },
      error: (error) => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการพิมพ์');
      }
    });
  }

  private startPrinting(printingData: any): void {
    this.loadingService.show();
    this.printingForm.get('jobStatus')?.setValue('กำลังพิมพ์');
    this.printingFormRecord.get('jobId')?.setValue(this.printingForm.getRawValue().jobId);
    this.dcsm25Service.saveRecord(this.printingFormRecord.getRawValue()).subscribe({
      next: (response) => {
        this.printingFormRecord.patchValue(response);
        this.printingForm.get('printerName')?.setValue(this.printingFormRecord.getRawValue().printerName);
        this.printingForm.get('printingRecordId')?.setValue(response.id);
        this.dcsm25Service.save(this.printingForm.getRawValue()).subscribe({
          next: (response) => {
            this.checkbntPrint();
            this.printingForm.patchValue(response);
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'เริ่มการพิมพ์เรียบร้อย!');
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error);
          }
        });
      },
      error: (error) => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', error.error);
      }
    });
  }

  private updatePrintStatus(status: string): void {
    if (this.printingForm.valid) {
      Swal.fire({
        title: 'ยืนยันอัพเดตสถานะ',
        text: "ยืนยันอัพเดตสถานะ ใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e1b4b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          if (status === 'Print') {
            this.printingForm.get('printStatus')?.setValue('พิมพ์แล้ว');
          }
          const data = this.printingForm.getRawValue();

          this.dcsm25Service.save(data).subscribe((response) => {
            this.checkbntPrint();
            this.printingForm.patchValue(response);
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'ยืนยันอัพเดตสถานะ!');
          })
        }
      });
    } else {
      this.markFormGroupTouched();
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.printingForm.controls).forEach(key => {
      const control = this.printingForm.get(key);
      control?.markAsTouched();
    });
  }

  checkbntPrint() {
    if (this.printingForm.get('jobStatus')?.value === '' || this.printingForm.get('jobStatus')?.value === null) {
      this.isInPrint = true;
      this.isPrint = false;
    } else if (this.printingForm.get('jobStatus')?.value === 'กำลังพิมพ์') {
      this.isPrint = true;
      this.isInPrint = false;
    } else {
      this.isPrint = false;
      this.isInPrint = false;
    }
  }

  private setStartPrintingValidators(): void {
    this.printingFormRecord.get('meter4colorStart')?.setValidators([Validators.required]);
    this.printingFormRecord.get('meter4colorEnd')?.clearValidators();
    this.printingFormRecord.get('meter4colorStart')?.updateValueAndValidity();
    this.printingFormRecord.get('meter4colorEnd')?.updateValueAndValidity();
  }

  private setEndPrintingValidators(): void {
    this.printingFormRecord.get('meter4colorEnd')?.setValidators([Validators.required]);
    this.printingFormRecord.get('meter4colorStart')?.clearValidators();
    this.printingFormRecord.get('meter4colorStart')?.updateValueAndValidity();
    this.printingFormRecord.get('meter4colorEnd')?.updateValueAndValidity();
  }

  getRecord(id): void {
    this.loadingService.show();
    this.dcsm25Service.getRecordById(id).subscribe((response) => {
      this.printingFormRecord.patchValue(response);
      this.loadingService.hide();
    },
      error => {
        this.loadingService.hide();
      }
    )
  }

  updateSampleStatus() {
    this.dcsm25Service.getByIdSample(this.printingForm.getRawValue().sampleId).subscribe((response) => {
      response.status = 'สำเร็จ รออนุมัติไปตารางรอผลิต';
      this.dcsm25Service.saveSample(response).subscribe((response) => {
        this.loadingService.hide();
        this.sweetAlert.success('Success', 'ยืนยันอัพเดตสถานะ!');
      })
    })
  }

  updateProductionJob(status){
    this.dcsm25Service.getByIdProductionJob(this.printingForm.getRawValue().productionJobId).subscribe((response) => {
      if(status === 'inPrint'){
        response.printStatus = 'กำลังพิมพ์';
      }else{
        
      }
      
    })
  }
}
