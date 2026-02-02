import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dcsm25Service } from './dcsm25.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm25-detail',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dcsm25-detail.component.html',
  styleUrls: ['./dcsm25-detail.component.scss']
})
export class Dcsm25DetailComponent implements OnInit {
  printingForm: FormGroup;
  printingStartForm: FormGroup;
  printingEndForm: FormGroup;
  id: string | null = null;
  isEditMode = false;
  isPrint = false;
  isInPrint = false;
  showPrintingModal = false;
  showPrintingEndModal = false;

  constructor(
    private fb: FormBuilder,
    private dcsm25Service: Dcsm25Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.createPrintingStartForm();
    this.createPrintingEndForm();
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    const resolvedData = this.route.snapshot.data['designDiecut'];
    if (resolvedData) {
      this.printingForm.patchValue(resolvedData);
    }
    this.checkbntPrint();
  }

  createForm() {
    this.printingForm = this.fb.group({
      id: [null],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      jobId: ['', Validators.required],
      customerJobName: ['', Validators.required],
      printQuantity: [0],
      productionQuantity: [0],
      printingDate: [null],
      printingResponsible: [''],
      coatingDate: [null],
      coatingResponsible: [''],
      stampingDate: [null],
      stampingResponsible: [''],
      gluingDate: [null],
      gluingResponsible: [''],
      qcDate: [null],
      dueDate: ['', Validators.required],
      printStatus: [''],
      shippingAddress: [''],
      remark: [''],
      deliveryStatus: [''],
      imageUrl: [null],
      dataDalivery: [false],
      machineSetupCount: [''],
      rowVersion: [null],
      printingRecordId: [null],
    });
    this.printingForm.get('date')?.disable();
    this.printingForm.get('jobId')?.disable();
    this.printingForm.get('customerJobName')?.disable();
    this.printingForm.get('printQuantity')?.disable();
    this.printingForm.get('productionQuantity')?.disable();
    this.printingForm.get('printingDate')?.disable();
    this.printingForm.get('printingResponsible')?.disable();
    this.printingForm.get('printStatus')?.disable();
  }

  createPrintingStartForm() {
    this.printingStartForm = this.fb.group({
      meter4colorStart: [0, Validators.required],
      meterBwStart: [0, Validators.required],
      workType: ['', Validators.required],
      printerName: ['', Validators.required]
    });
  }

  createPrintingEndForm() {
    this.printingEndForm = this.fb.group({
      meter4colorEnd: [0, Validators.required],
      meterBwEnd: [0, Validators.required]
    });
  }

  calculateTotalTime() {
    const start = this.printingForm.get('startTime')?.value;
    const end = this.printingForm.get('endTime')?.value;

    if (start && end) {
      const startTime = new Date(`2000-01-01 ${start}`);
      const endTime = new Date(`2000-01-01 ${end}`);
      const diff = endTime.getTime() - startTime.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        this.printingForm.patchValue({ totalTime: `${hours}:${minutes.toString().padStart(2, '0')}` });
      }
    }
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
    this.showPrintingModal = true;
  }

  closePrintingModal(): void {
    this.showPrintingModal = false;
    this.printingStartForm.reset();
  }

  openPrintingEndModal(): void {
    this.showPrintingEndModal = true;
  }

  closePrintingEndModal(): void {
    this.showPrintingEndModal = false;
    this.printingEndForm.reset();
  }

  onStartPrinting(): void {
    if (this.printingStartForm.valid) {
      const printingData = this.printingStartForm.value;
      this.startPrinting(printingData);
      this.closePrintingModal();
    } else {
      this.markPrintingFormTouched();
    }
  }

  onEndPrinting(): void {
    if (this.printingEndForm.valid) {
      const endData = this.printingEndForm.value;
      this.endPrinting(endData);
      this.closePrintingEndModal();
    } else {
      this.markPrintingEndFormTouched();
    }
  }

  private markPrintingFormTouched(): void {
    Object.keys(this.printingStartForm.controls).forEach(key => {
      const control = this.printingStartForm.get(key);
      control?.markAsTouched();
    });
  }

  private markPrintingEndFormTouched(): void {
    Object.keys(this.printingEndForm.controls).forEach(key => {
      const control = this.printingEndForm.get(key);
      control?.markAsTouched();
    });
  }

  private endPrinting(endData: any): void {
    this.loadingService.show();
    this.printingForm.get('printStatus')?.setValue('พิมพ์แล้ว');
    
    const printingRecord = {
      jobId: this.printingForm.get('jobId')?.value,
      meter4colorEnd: endData.meter4colorEnd,
      meterBwEnd: endData.meterBwEnd,
      endDatetime: new Date().toISOString()
    };
    
    this.dcsm25Service.saveRecord(printingRecord).subscribe({
      next: (printingResponse) => {
        const data = this.printingForm.getRawValue();
        this.dcsm25Service.save(data).subscribe({
          next: (response) => {
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
    this.printingForm.get('printStatus')?.setValue('กำลังพิมพ์');
    
    const printingRecord = {
      jobId: this.printingForm.get('jobId')?.value,
      meter4colorStart: printingData.meter4colorStart,
      meterBwStart: printingData.meterBwStart,
      workType: printingData.workType,
      printerName: printingData.printerName,
      startDatetime: new Date().toISOString()
    };
    
    this.dcsm25Service.saveRecord(printingRecord).subscribe({
      next: (response) => {
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

  checkbntPrint(){
    if ( this.printingForm.get('printStatus')?.value === '' || this.printingForm.get('printStatus')?.value === null) {
      this.isInPrint = true;
      this.isPrint =false;
    }else if(this.printingForm.get('printStatus')?.value === 'กำลังพิมพ์') {
       this.isPrint = true;
       this.isInPrint = false;
    }else{
      this.isPrint = false;
      this.isInPrint = false;
    }
  }
}
