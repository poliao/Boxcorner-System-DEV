import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dcsm25Service } from './dcsm25.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { V } from '@angular/cdk/scrolling-module.d-C_w4tIrZ';

@Component({
  selector: 'app-dcsm25-detail',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dcsm25-detail.component.html',
  styleUrls: ['./dcsm25-detail.component.scss']
})
export class Dcsm25DetailComponent implements OnInit {
  printingForm: FormGroup;
  printingFormRecord: FormGroup;
  printingFormRecord2: FormGroup;
  printingEndLog: FormGroup;
  id: string | null = null;
  isEditMode = false;
  isRicoh = false;


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
    this.createPrintingFormRecord2();

    this.fromPrintLogEnd();

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    const resolvedData = this.route.snapshot.data['designDiecut'];
    if (resolvedData) {
      this.printingForm.patchValue(resolvedData);
    }
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
      productionOrderId: [null]
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
      jobId: [null],
      printerId: [null],
      printSide: [null],
      logType: [null],
      meterColorStart: [null],
      meterBwStart: [null],
      meterSpecialStart: [null],
      paperReqStart: [null],
      printerName: [null, Validators.required],
    });
  }

  fromPrintLogEnd() {
    this.printingEndLog = this.fb.group({
      logId: [null],
      action: [null],
      meterColorEnd: [null],
      meterBwEnd: [null],
      meterSpecialEnd: [null],
      paperReqEnd: [null],
      note: [null],
    });
  }

  createPrintingFormRecord2() {
    this.printingFormRecord2 = this.fb.group({
      jobId: [null],
      printerId: [null],
      printSide: [null],
      logType: [null],
      meterColorStart: [null],
      meterBwStart: [null],
      meterSpecialStart: [null],
      paperReqStart: [null],
      printerName: [null, Validators.required],
    });
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

  chengePringterAuto(printer: any) {
    if (printer == 'Canon') {
      this.printingFormRecord.get('printerId')?.setValue(2);
    } else {
      this.printingFormRecord.get('printerId')?.setValue(1);
    }
  }

  chengePringterAuto2(printer: any) {
    if (printer == 'Canon') {
      this.printingFormRecord2.get('printerId')?.setValue(2);
    } else {
      this.printingFormRecord2.get('printerId')?.setValue(1);
    }
  }

  startPrintLog() {
    if (this.printingFormRecord.valid) {
      this.chengePringterAuto(this.printingFormRecord.getRawValue().printerName);
      this.printingFormRecord.get('jobId')?.setValue(this.printingForm.getRawValue().id);
      this.printingFormRecord.get('logType')?.setValue('NORMAL');
      this.printingFormRecord.get('printSide')?.setValue('FRONT');
      const recordData = this.printingFormRecord.value;
      this.dcsm25Service.startPrintLog(recordData).subscribe({
        next: (responseLog) => {
          console.log(responseLog);
          this.dcsm25Service.getById(this.printingForm.getRawValue().id).subscribe((response) => {
            response.printingRecordId = responseLog.logId;
            this.dcsm25Service.save(response).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
              }
            });
          })
          this.sweetAlert.success('Success', 'เริ่มปริ้น');
        }, error: (error) => {
          this.sweetAlert.error('Error', error.error.error);
        }
      })
    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }

  startPrintPage2Log() {
    if (this.printingFormRecord2.valid) {
      this.chengePringterAuto2(this.printingFormRecord2.getRawValue().printerName);
      this.printingFormRecord2.get('jobId')?.setValue(this.printingForm.getRawValue().id);
      this.printingFormRecord2.get('logType')?.setValue('NORMAL');
      this.printingFormRecord2.get('printSide')?.setValue('BACK');
      const recordData = this.printingFormRecord2.value;
      this.dcsm25Service.startPrintLog(recordData).subscribe({
        next: (responseLog) => {
          console.log(responseLog);
          this.dcsm25Service.getById(this.printingForm.getRawValue().id).subscribe((response) => {
            response.printingRecordId = responseLog.logId;
            this.dcsm25Service.save(response).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
              }
            });
          })
          this.sweetAlert.success('Success', 'เริ่มปริ้น');
        }, error: (error) => {
          this.sweetAlert.error('Error', error.error.error);
        }
      })
    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }


  stopPrintLog(Status) {
    if (this.printingEndLog.valid) {
      this.printingEndLog.get('logId')?.setValue(this.printingForm.getRawValue().printingRecordId);
      if (Status == 'FINISH' && this.printingForm.getRawValue().print2Page == true) {
        this.printingEndLog.get('action')?.setValue('WAITPAGE2');
      }else {
        this.printingEndLog.get('action')?.setValue(Status);
      }
      const recordData = this.printingEndLog.value;
      this.dcsm25Service.stopPrintLog(recordData).subscribe({
        next: (responseLog) => {
          this.dcsm25Service.getById(this.printingForm.getRawValue().id).subscribe((response) => {
            response.printingRecordId = null;
            this.dcsm25Service.save(response).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
                if (this.printingForm.getRawValue().issample != true && this.printingForm.getRawValue().jobStatus == 'COMPLETED') {
                  this.updateProductionJob();
                }
              }
            });
          })
          this.sweetAlert.success('Success', 'พิมพ์เสร็จสิ้น');
        }, error: (error) => {
          this.sweetAlert.error('Error', error.error.error);
        }
      })

    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }

  stopPrintPage2Log(Status) {
    if (this.printingEndLog.valid) {
      this.printingEndLog.get('logId')?.setValue(this.printingForm.getRawValue().printingRecordId);
      if (Status == 'PAUSED_PAGE2' && this.printingForm.getRawValue().print2Page == true) {
        this.printingEndLog.get('action')?.setValue("PAUSED_PAGE2");
      } else {
        this.printingEndLog.get('action')?.setValue(Status);
      }
      const recordData = this.printingEndLog.value;
      this.dcsm25Service.stopPrintLog(recordData).subscribe({
        next: (responseLog) => {
          this.dcsm25Service.getById(this.printingForm.getRawValue().id).subscribe((response) => {
            response.printingRecordId = null;
            this.dcsm25Service.save(response).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
                if (this.printingForm.getRawValue().issample != true && this.printingForm.getRawValue().jobStatus == 'COMPLETED') {
                  this.updateProductionJob();
                }
              }
            });
          })
          this.sweetAlert.success('Success', 'พิมพ์เสร็จสิ้น');
        }, error: (error) => {
          this.sweetAlert.error('Error', error.error.error);
        }
      })

    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }



  checkPrinter() {
    this.dcsm25Service.getLogById(this.printingForm.getRawValue().printingRecordId).subscribe({
      next: (responseLog) => {
        if (responseLog.printer.brand == 'CANON') {
          this.isRicoh = false;
        } else {
          this.isRicoh = true;
        }
      }
    })
  }
}
