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
  showResumePrintingModal = false;
  showFinishPrintingModal = false;
  showStartPage2Modal = false;
  showFinishPage2Modal = false;
  isSample = false;
  printerName: string = '';
  isStop = false;
  isPrint2 = false;
  isInPrint2 = false;
  isPrintPage2 = false;
  isPrint2Page = false;

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
      this.printerName = resolvedData.printerName || '';
      if (this.printingForm.getRawValue().issample == true) {
        this.isSample = true
      } else {
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
      print2Page: [false],
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
    this.printingForm.get('print2Page')?.disable();
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
      meterWStart: [null],
      meterWEnd: [null],
      nextMeter4colorStart: [null],
      nextMeter4colorEnd: [null],
      nextMeterBwStart: [null],
      nextMeterBwEnd: [null],
      nextMeterWStart: [null],
      nextMeterWEnd: [null],
      page2Meter4colorStart: [null],
      page2Meter4colorEnd: [null],
      page2MeterBwStart: [null],
      page2MeterBwEnd: [null],
      page2MeterWStart: [null],
      page2MeterWEnd: [null],
    });
  }

  onUpdatePrint(status: string): void {
    if (status === 'inPrint') {
      this.openPrintingModal();
    } else if (status === 'Print') {
      this.openPrintingEndModal(null);
    } else if (status === 'Stop') {
      this.openPrintingEndModal('Stop');
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

  openPrintingEndModal(status: string): void {
    this.setEndPrintingValidators();
    this.showPrintingEndModal = true;
    if (status === 'Stop') {
      this.isStop = true;
    } else {
      this.isStop = false;
    }
  }

  closePrintingEndModal(): void {
    this.showPrintingEndModal = false;
    this.printingFormRecord.reset();
  }

  openResumePrintingModal(): void {
    this.setResumePrintingValidators();
    this.showResumePrintingModal = true;
  }

  closeResumePrintingModal(): void {
    this.showResumePrintingModal = false;
    this.printingFormRecord.reset();
  }

  openFinishPrintingModal(): void {
    this.setFinishPrintingValidators();
    this.showFinishPrintingModal = true;
  }

  closeFinishPrintingModal(): void {
    this.showFinishPrintingModal = false;
    this.printingFormRecord.reset();
  }

  openStartPage2Modal(): void {
    this.setStartPrintingValidators();
    this.showStartPage2Modal = true;
  }

  closeStartPage2Modal(): void {
    this.showStartPage2Modal = false;
    this.printingFormRecord.reset();
  }

  openFinishPage2Modal(): void {
    this.setEndPrintingValidators();
    this.showFinishPage2Modal = true;
  }

  closeFinishPage2Modal(): void {
    this.showFinishPage2Modal = false;
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

  onResumePrinting(): void {
    if (this.printingFormRecord.valid) {
      this.resumePrinting();
      this.closeResumePrintingModal();
    } else {
      this.markPrintingFormTouched();
    }
  }

  onFinishPrinting(): void {
    if (this.printingFormRecord.valid) {
      this.finishPrinting();
      this.closeFinishPrintingModal();
    } else {
      this.markPrintingEndFormTouched();
    }
  }

  onStartPage2(): void {
    if (this.printingFormRecord.valid) {
      this.startPage2Printing();
      this.closeStartPage2Modal();
    } else {
      this.markPrintingFormTouched();
    }
  }

  onFinishPage2(): void {
    if (this.printingFormRecord.valid) {
      this.finishPage2Printing();
      this.closeFinishPage2Modal();
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
    if (this.isStop == true) {
      this.printingForm.get('jobStatus')?.setValue('หยุดพิมพ์ชั่วคราว');
    } else {
      this.printingForm.get('jobStatus')?.setValue('พิมพ์แล้ว');
    }
    const printingFormRecord = this.printingFormRecord.getRawValue();

    this.dcsm25Service.getRecordById(this.printingForm.getRawValue().printingRecordId).subscribe({
      next: (response) => {
        response.printQty4color = printingFormRecord.meter4colorEnd - response.meter4colorStart;
        response.printQtyBw = printingFormRecord.meterBwEnd - response.meterBwStart;
        response.printQtyTotal = response.printQty4color + response.printQtyBw;
        response.endDatetime = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().substring(0, 16);
        response.meter4colorEnd = printingFormRecord.meter4colorEnd;
        response.meterBwEnd = printingFormRecord.meterBwEnd;
        response.meterWEnd = printingFormRecord.meterWEnd;

        this.dcsm25Service.saveRecord(response).subscribe({
          next: (response) => {
            this.printingFormRecord.patchValue(response);
            this.dcsm25Service.save(this.printingForm.getRawValue()).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
                this.checkbntPrint();
                if (this.printingForm.getRawValue().print2Page != true) {
                  if (this.printingForm.getRawValue().issample == true) {
                    if (this.isStop != true && this.printingForm.getRawValue().print2Page != true) {
                      this.updateSampleStatus();
                    }
                  } else {
                    this.updateProductionJob();
                  }
                }
                this.loadingService.hide();
                this.sweetAlert.success('Success', 'พิมพ์เสร็จสิ้นเรียบร้อย!');
              },
              error: (error) => {
                this.loadingService.hide();
                this.sweetAlert.error('Error', error.error);
              }
            });
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการพิมพ์');
          }
        });
      }
    });
  }

  private startPrinting(printingData: any): void {
    this.loadingService.show();
    this.printingForm.get('jobStatus')?.setValue('กำลังพิมพ์');
    this.printingFormRecord.get('jobId')?.setValue(this.printingForm.getRawValue().jobId);
    if (this.printingForm.getRawValue().issample == true) {
      this.printingFormRecord.get('jobCategory')?.setValue('งานตัวอย่าง');
    } else {
      this.printingFormRecord.get('jobCategory')?.setValue('งานผลิตจริง');
    }
    this.printingFormRecord.get('printerName')?.setValue(this.printingForm.getRawValue().printerName);
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

  checkbntPrint() {
    if (this.printingForm.get('jobStatus')?.value === '' || this.printingForm.get('jobStatus')?.value === null) {
      this.isInPrint = true;
      this.isPrint = false;
      this.isPrint2 = false;
      this.isInPrint2 = false;
      this.isPrintPage2 = false;
      this.isPrint2Page = false;
    } else if (this.printingForm.get('jobStatus')?.value === 'กำลังพิมพ์') {
      this.isPrint = true;
      this.isInPrint = false;
      this.isPrint2 = false;
      this.isInPrint2 = false;
      this.isPrintPage2 = false;
      this.isPrint2Page = false;
    } else if (this.printingForm.get('jobStatus')?.value === 'หยุดพิมพ์ชั่วคราว') {
      this.isPrint2 = false;
      this.isInPrint2 = true;
      this.isPrint = false;
      this.isInPrint = false;
      this.isPrintPage2 = false;
      this.isPrint2Page = false;
    } else if (this.printingForm.get('jobStatus')?.value === 'เริ่มพิมพ์ต่อ') {
      this.isPrint2 = true;
      this.isInPrint2 = false;
      this.isPrint = false;
      this.isInPrint = false;
      this.isPrintPage2 = false;
      this.isPrint2Page = false;
    } else if (this.printingForm.get('jobStatus')?.value === 'พิมพ์แล้ว' && this.printingForm.get('print2Page')?.value == true) {
      this.isPrint2 = false;
      this.isInPrint2 = false;
      this.isPrint = false;
      this.isInPrint = false;
      this.isPrintPage2 = true;
      this.isPrint2Page = false;
    } else if (this.printingForm.get('jobStatus')?.value === 'กำลังพิมพ์หน้า2' && this.printingForm.get('print2Page')?.value == true) {
      this.isPrint2 = false;
      this.isInPrint2 = false;
      this.isPrint = false;
      this.isInPrint = false;
      this.isPrintPage2 = false;
      this.isPrint2Page = true;
    } else {
      this.isPrint = false;
      this.isInPrint = false;
      this.isPrint2 = false;
      this.isInPrint2 = false;
      this.isPrintPage2 = false;
      this.isPrint2Page = false;
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

  private setResumePrintingValidators(): void {
    this.printingFormRecord.get('nextMeter4colorStart')?.setValidators([Validators.required]);
    this.printingFormRecord.get('nextMeter4colorStart')?.updateValueAndValidity();
  }

  private setFinishPrintingValidators(): void {
    this.printingFormRecord.get('nextMeter4colorEnd')?.setValidators([Validators.required]);
    this.printingFormRecord.get('nextMeter4colorEnd')?.updateValueAndValidity();
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

  updateProductionJob() {
    this.dcsm25Service.getByIdProductionJob(this.printingForm.getRawValue().productionJobId).subscribe((response) => {
      if (response.coatingDate != null) {
        response.printStatus = 'กำลังเคลือบ';
        this.sendToProductJob(response);
      } else if (response.stampingDate != null) {
        response.printStatus = 'กำลังปั้ม';
        this.sendToProductJob(response);
      } else if (response.gluingDate != null) {
        response.printStatus = 'กำลังปะ';
        this.sendToProductJob(response);
      } else if (response.qcDate != null) {
        response.printStatus = 'กำลังQc';
        this.sendToProductJob(response);
      }
    })
  }

  sendToProductJob(data: any) {
    this.dcsm25Service.saveProductionJob(data).subscribe({
      next: (response) => {
      },
      error: (error) => {
        this.sweetAlert.error('Error', error.error);
      }
    });
  }

  private resumePrinting(): void {
    this.loadingService.show();
    this.printingForm.get('jobStatus')?.setValue('เริ่มพิมพ์ต่อ');
    const data = this.printingFormRecord.getRawValue();

    this.dcsm25Service.getRecordById(this.printingForm.getRawValue().printingRecordId).subscribe({
      next: (response) => {
        response.nextMeter4colorStart = data.nextMeter4colorStart;
        response.nextMeterBwStart = data.nextMeterBwStart;
        response.nextMeterWStart = data.nextMeterWStart;

        this.dcsm25Service.saveRecord(response).subscribe({
          next: (response) => {
            this.printingFormRecord.patchValue(response);
            this.dcsm25Service.save(this.printingForm.getRawValue()).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
                this.checkbntPrint();
                this.loadingService.hide();
                this.sweetAlert.success('Success', 'เริ่มพิมพ์ต่อเรียบร้อย!');
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
    });
  }

  private finishPrinting(): void {
    this.loadingService.show();
    this.printingForm.get('jobStatus')?.setValue('พิมพ์แล้ว');
    const data = this.printingFormRecord.getRawValue();
    this.dcsm25Service.getRecordById(this.printingForm.getRawValue().printingRecordId).subscribe({
      next: (response) => {
        response.nextMeter4colorEnd = data.nextMeter4colorEnd;
        response.nextMeterBwEnd = data.nextMeterBwEnd;
        response.nextMeterWEnd = data.nextMeterWEnd;
        this.dcsm25Service.saveRecord(response).subscribe({
          next: (response) => {
            this.printingFormRecord.patchValue(response);
            this.dcsm25Service.save(this.printingForm.getRawValue()).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
                this.checkbntPrint();
                if (this.printingForm.getRawValue().print2Page != true) {
                  if (this.printingForm.getRawValue().issample == true) {
                    this.updateSampleStatus();
                  } else {
                    this.updateProductionJob();
                  }
                }
                this.loadingService.hide();
                this.sweetAlert.success('Success', 'พิมพ์เสร็จสิ้นเรียบร้อย!');
              },
              error: (error) => {
                this.loadingService.hide();
                this.sweetAlert.error('Error', error.error);
              }
            });
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการพิมพ์');
          }
        });
      }
    });
  }

  private startPage2Printing(): void {
    this.loadingService.show();
    this.printingForm.get('jobStatus')?.setValue('กำลังพิมพ์หน้า2');

    const data = this.printingFormRecord.getRawValue();
    this.dcsm25Service.getRecordById(this.printingForm.getRawValue().printingRecordId).subscribe({
      next: (response) => {
        response.page2Meter4colorStart = data.page2Meter4colorStart;
        response.page2MeterBwStart = data.page2MeterBwStart;
        response.page2MeterWStart = data.page2MeterWStart;

        this.dcsm25Service.saveRecord(response).subscribe({
          next: (response) => {
            this.printingFormRecord.patchValue(response);
            this.dcsm25Service.save(this.printingForm.getRawValue()).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
                this.checkbntPrint();
                this.loadingService.hide();
                this.sweetAlert.success('Success', 'เริ่มพิมพ์หน้า2เรียบร้อย!');
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
    });
  }

  private finishPage2Printing(): void {
    this.loadingService.show();
    this.printingForm.get('jobStatus')?.setValue('พิมพ์หน้า2แล้ว');

    const data = this.printingFormRecord.getRawValue();
    this.dcsm25Service.getRecordById(this.printingForm.getRawValue().printingRecordId).subscribe({
      next: (response) => {
        response.page2Meter4colorEnd = data.meter4colorEnd;
        response.page2MeterBwEnd = data.meterBwEnd;
        response.page2MeterWEnd = data.meterWEnd;
        response.endDatetime = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().substring(0, 16);

        this.dcsm25Service.saveRecord(response).subscribe({
          next: (response) => {
            this.printingFormRecord.patchValue(response);
            this.dcsm25Service.save(this.printingForm.getRawValue()).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
                this.checkbntPrint();
                if (this.printingForm.getRawValue().issample == true) {
                  this.updateSampleStatus();
                } else {
                  this.updateProductionJob();
                }
                this.loadingService.hide();
                this.sweetAlert.success('Success', 'พิมพ์หน้า2เสร็จสิ้นเรียบร้อย!');
              },
              error: (error) => {
                this.loadingService.hide();
                this.sweetAlert.error('Error', error.error);
              }
            });
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการพิมพ์');
          }
        });
      }
    });
  }
}
