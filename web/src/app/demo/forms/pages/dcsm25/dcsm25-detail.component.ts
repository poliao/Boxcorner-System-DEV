import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dcsm25Service } from './dcsm25.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


declare const bootstrap: any;

@Component({
  selector: 'app-dcsm25-detail',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, MatIconModule, MatButtonModule],
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
  extraPrints: any[] = [];
  selectedExtraPrint: any = null;

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

      // เงื่อนไข: ถ้าเป็นงานตัวอย่าง (issample=true) และใน DB ยังไม่มีค่า setupWaste (null/empty)
      // ให้เปิด field ให้ช่างพิมพ์กรอกได้
      const dbSetupWaste = resolvedData.setupWaste;
      if (this.isSampleJob && (dbSetupWaste === null || dbSetupWaste === undefined || dbSetupWaste === '')) {
        this.printingForm.get('setupWaste')?.enable();
      }
    }

    if (this.id) {
      this.loadExtraPrints();
    }
  }

  /** true เมื่องานนี้เป็นงานตัวอย่าง */
  get isSampleJob(): boolean {
    return this.printingForm?.getRawValue().issample === true;
  }

  /** true เมื่อ setupWaste ถูกบันทึก/ล็อกแล้ว (ค่าใน DB มีอยู่แล้ว หรือกด save สำเร็จจน field disable) */
  get setupWasteSaved(): boolean {
    const control = this.printingForm?.get('setupWaste');
    const val = control?.value;
    const hasValue = val !== null && val !== '' && val !== undefined;
    // ถ้า field ถูก disable แสดงว่าระบบล็อกไว้แล้ว (ถือว่า saved)
    return hasValue && (control?.disabled || false);
  }

  /**
   * true เมื่อ: เป็นงานตัวอย่าง AND สถานะ PENDING AND ยังไม่บันทึก setupWaste
   * → ต้องบล็อกปุ่มเริ่มพิมพ์
   */
  get setupWasteGateBlocked(): boolean {
    const status = this.printingForm?.getRawValue().jobStatus;
    return (this.isSampleJob && (status === 'PENDING' || status === 'รอพิมพ์') && !this.setupWasteSaved);
  }

  saveSetupWaste() {
    const v = this.printingForm.get('setupWaste')?.value;
    if (v !== null && v !== '' && v !== undefined) {
      const data = this.printingForm.getRawValue();
      this.dcsm25Service.save(data).subscribe({
        next: (response) => {
          this.printingForm.patchValue(response);
          this.printingForm.get('setupWaste')?.disable();
          this.sweetAlert.success('Success', 'บันทึกค่าตั้งเครื่องเรียบร้อย');
        },
        error: (error) => {
          this.sweetAlert.error('Error', error.error?.error || 'เกิดข้อผิดพลาดในการบันทึก');
        }
      });
    } else {
      this.sweetAlert.warning('Warning', 'กรุณากรอกยอดใบตั้งเครื่องก่อนบันทึก');
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
      printerName: [null, Validators.required]
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
      unitStockId: [null],
      paperUsed: [null],
      goodQty: [null, [Validators.min(0)]],
      wasteQty: [null, [Validators.min(0)]],
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
      unitStockId: [null],
    });
  }


  updateProductionJob() {
    this.dcsm25Service.getByIdProductionJob(this.printingForm.getRawValue().productionJobId).subscribe((response) => {
      if (response.coatingDate != null) {
        response.printStatus = 'กำลังเคลือบ';
        this.sendToProductJob(response);
        const payload = {
          joId: response.jobId,
          jobCustomerName: response.customerJobName,
          jobOwnerName: null,
          technicianName: response.coatingResponsible,
          deliveryDatetime: response.dueDate ? response.dueDate + 'T00:00:00' : null,
          receivedSheetsQty: this.printingForm.getRawValue().totalPrintSheets,
          requiredSheetsQty: response.productionQuantity,
          productJobId: response.id ? response.id.toString() : null
        };
        this.dcsm25Service.saveCoatingJob(payload).subscribe({
          next: () => console.log('Coating Job created successfully'),
          error: (err) => console.error('Failed to create Coating Job', err)
        });

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
      const formRaw = this.printingForm.getRawValue();

      this.chengePringterAuto(this.printingFormRecord.getRawValue().printerName);
      this.printingFormRecord.get('jobId')?.setValue(formRaw.id);
      this.printingFormRecord.get('logType')?.setValue('NORMAL');
      this.printingFormRecord.get('printSide')?.setValue('FRONT');
      const recordData = { ...this.printingFormRecord.value, paperSourceType: 'NO_PAPER' };
      this.dcsm25Service.startOdPrintLog(recordData).subscribe({
        next: (responseLog) => {
          this.dcsm25Service.getById(formRaw.id).subscribe((response) => {
            response.printingRecordId = responseLog.logId || responseLog.id;
            this.dcsm25Service.save(response).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
                this.sweetAlert.success('Success', 'เริ่มปริ้น');
              }
            });
          })
        }, error: (error) => {
          this.sweetAlert.error('Error', error?.error?.error || 'เกิดข้อผิดพลาดในการเริ่มพิมพ์');
        }
      });
    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }

  startPrintPage2Log() {
    if (this.printingFormRecord2.valid) {
      const formRaw = this.printingForm.getRawValue();

      this.chengePringterAuto2(this.printingFormRecord2.getRawValue().printerName);
      this.printingFormRecord2.get('jobId')?.setValue(formRaw.id);
      this.printingFormRecord2.get('logType')?.setValue('NORMAL');
      this.printingFormRecord2.get('printSide')?.setValue('BACK');
      const recordData = {
          ...this.printingFormRecord2.value,
          paperSourceType: 'NO_PAPER'
      };
      this.dcsm25Service.startOdPrintLog(recordData).subscribe({
        next: (responseLog) => {
          this.dcsm25Service.getById(formRaw.id).subscribe((response) => {
            response.printingRecordId = responseLog.logId || responseLog.id;
            this.dcsm25Service.save(response).subscribe({
              next: (response) => {
                this.printingForm.patchValue(response);
                this.sweetAlert.success('Success', 'เริ่มปริ้น');
              }
            });
          })
        }, error: (error) => {
          this.sweetAlert.error('Error', error?.error?.error || error?.error || 'Error starting print page 2');
        }
      });
    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }


  stopPrintLog(Status) {
    const isFinish = Status === 'FINISH' || (Status === 'FINISH' && this.printingForm.getRawValue().print2Page == true);
    const formData = this.printingEndLog.value;

    if (isFinish) {
      if (formData.goodQty === null || formData.goodQty === undefined || formData.goodQty === '') {
        this.sweetAlert.warning('เตือน', 'กรุณากรอกจำนวนงานดี');
        return;
      }
      if (formData.wasteQty === null || formData.wasteQty === undefined || formData.wasteQty === '') {
        this.sweetAlert.warning('เตือน', 'กรุณากรอกจำนวนงานเสีย');
        return;
      }
    }

    this.printingEndLog.get('logId')?.setValue(this.printingForm.getRawValue().printingRecordId);
    if (Status == 'FINISH' && this.printingForm.getRawValue().print2Page == true) {
      this.printingEndLog.get('action')?.setValue('WAITPAGE2');
    } else {
      this.printingEndLog.get('action')?.setValue(Status);
    }

    const actionValue = this.printingEndLog.get('action')?.value;
    if (actionValue === 'FINISH' || actionValue === 'WAITPAGE2') {
      let pQty = this.printingForm.getRawValue().totalPrintSheets || 0;
      let sWaste = this.printingForm.getRawValue().setupWaste || 0;
      this.printingEndLog.get('paperUsed')?.setValue(pQty + sWaste);
    }

    const recordData = this.printingEndLog.value;
    this.dcsm25Service.stopOdPrintLog(recordData).subscribe({
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
        this.sweetAlert.success('Success', isFinish ? 'พิมพ์เสร็จสิ้น' : 'หยุดพิมพ์ชั่วคราว');
        if (isFinish) this.closeModal('printingLogEnd');
        this.printingEndLog.reset();
      }, error: (error) => {
        this.sweetAlert.error('Error', error?.error?.error || 'เกิดข้อผิดพลาดในการหยุดพิมพ์');
      }
    });
  }

  stopPrintPage2Log(Status) {
    const isFinish = Status === 'FINISH_PAGE2';
    const formData = this.printingEndLog.value;

    if (isFinish) {
      if (formData.goodQty === null || formData.goodQty === undefined || formData.goodQty === '') {
        this.sweetAlert.warning('เตือน', 'กรุณากรอกจำนวนงานดี');
        return;
      }
      if (formData.wasteQty === null || formData.wasteQty === undefined || formData.wasteQty === '') {
        this.sweetAlert.warning('เตือน', 'กรุณากรอกจำนวนงานเสีย');
        return;
      }
    }

    this.printingEndLog.get('logId')?.setValue(this.printingForm.getRawValue().printingRecordId);
    if (Status == 'PAUSED_PAGE2' && this.printingForm.getRawValue().print2Page == true) {
      this.printingEndLog.get('action')?.setValue("PAUSED_PAGE2");
    } else {
      this.printingEndLog.get('action')?.setValue(Status);
    }

    const actionValue = this.printingEndLog.get('action')?.value;
    if (actionValue === 'FINISH_PAGE2') {
      let pQty = this.printingForm.getRawValue().totalPrintSheets || 0;
      let sWaste = this.printingForm.getRawValue().setupWaste || 0;
      this.printingEndLog.get('paperUsed')?.setValue(pQty + sWaste);
    }

    const recordData = this.printingEndLog.value;
    this.dcsm25Service.stopOdPrintLog(recordData).subscribe({
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
        this.sweetAlert.success('Success', isFinish ? 'พิมพ์หน้า 2 เสร็จสิ้น' : 'หยุดพิมพ์หน้า 2 ชั่วคราว');
      }, error: (error) => {
        this.sweetAlert.error('Error', error?.error?.error || 'เกิดข้อผิดพลาด');
      }
    });
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

  loadExtraPrints() {
    if (this.id) {
      this.dcsm25Service.getExtraPrintsByJobId(+this.id).subscribe({
        next: (data: any[]) => {
          this.extraPrints = data;
        },
        error: (err) => {
          console.error('Error loading extra prints:', err);
        }
      });
    }
  }

  selectExtraPrint(print: any) {
    this.checkPrinter();
    this.selectedExtraPrint = print;
  }

  startExtraPrint() {
    if (this.printingFormRecord.valid && this.selectedExtraPrint) {
      this.chengePringterAuto(this.printingFormRecord.getRawValue().printerName);
      this.printingFormRecord.get('jobId')?.setValue(this.printingForm.getRawValue().id);
      this.printingFormRecord.get('logType')?.setValue('EXTRA');
      this.printingFormRecord.get('printSide')?.setValue('FRONT');
      const recordData = { ...this.printingFormRecord.value, paperSourceType: 'NO_PAPER' };
      this.dcsm25Service.startOdPrintLog(recordData).subscribe({
        next: (responseLog) => {
          const updateData = {
            id: this.selectedExtraPrint.id,
            printJobId: this.selectedExtraPrint.printJobId,
            additionalQty: this.selectedExtraPrint.additionalQty,
            reason: this.selectedExtraPrint.reason,
            status: 'IN_PROGRESS',
            requestedBy: this.selectedExtraPrint.requestedBy,
            printingRecordId: responseLog.logId || responseLog.id
          };
          this.dcsm25Service.updateExtraPrint(updateData).subscribe({
            next: () => {
              this.dcsm25Service.getById(this.printingForm.getRawValue().id).subscribe((response) => {
                response.printingRecordId = responseLog.logId || responseLog.id;
                this.dcsm25Service.save(response).subscribe({
                  next: (response) => {
                    this.printingForm.patchValue(response);
                    this.loadExtraPrints();
                    this.sweetAlert.success('Success', 'เริ่มพิมพ์เพิ่ม');
                  }
                });
              });
            }
          });
        },
        error: (error) => {
          this.sweetAlert.error('Error', error?.error?.error || 'เกิดข้อผิดพลาดในการเริ่มพิมพ์เพิ่ม');
        }
      });
    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบเถ้วน');
    }
  }

  stopExtraPrint(action: string) {

    if (this.printingEndLog.valid && this.selectedExtraPrint) {
      const logId = this.printingForm.getRawValue().printingRecordId;

      if (!logId) {
        this.sweetAlert.error('Error', 'ไม่พบ log ID');
        return;
      }

      this.printingEndLog.get('logId')?.setValue(logId);

      // ตรวจสอบว่ามีการพิมพ์ 2 หน้าหรือไม่
      if (action === 'FINISH' && this.printingForm.getRawValue().print2Page === true) {
        this.printingEndLog.get('action')?.setValue('WAITPAGE2');
      } else {
        this.printingEndLog.get('action')?.setValue(action);
      }

      const actionValue = this.printingEndLog.get('action')?.value;
      if (actionValue === 'FINISH' || actionValue === 'WAITPAGE2') {
        let additionalQty = this.selectedExtraPrint?.additionalQty || 0;
        this.printingEndLog.get('paperUsed')?.setValue(additionalQty);
      }

      const recordData = this.printingEndLog.value;
      this.dcsm25Service.stopOdPrintLog(recordData).subscribe({
        next: () => {
          const newStatus = action === 'FINISH' && this.printingForm.getRawValue().print2Page === true
            ? 'WAITPAGE2'
            : action === 'FINISH' ? 'COMPLETED' : 'PAUSED';

          const updateData = {
            id: this.selectedExtraPrint.id,
            printJobId: this.selectedExtraPrint.printJobId,
            additionalQty: this.selectedExtraPrint.additionalQty,
            reason: this.selectedExtraPrint.reason,
            status: newStatus,
            requestedBy: this.selectedExtraPrint.requestedBy,
            printingRecordId: null
          };
          this.dcsm25Service.updateExtraPrint(updateData).subscribe({
            next: () => {
              this.dcsm25Service.getById(this.printingForm.getRawValue().id).subscribe((response) => {
                response.printingRecordId = null;
                this.dcsm25Service.save(response).subscribe({
                  next: (response) => {
                    this.printingForm.patchValue(response);
                    this.loadExtraPrints();
                    this.sweetAlert.success('Success', action === 'FINISH' ? 'พิมพ์เสร็จสิ้น' : 'หยุดชั่วคราว');
                  }
                });
              });
            }
          });
        },
        error: (error) => {
          this.sweetAlert.error('Error', error.error.error);
        }
      });
    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }

  startExtraPrintPage2() {
    if (this.printingFormRecord2.valid && this.selectedExtraPrint) {
      this.chengePringterAuto2(this.printingFormRecord2.getRawValue().printerName);
      this.printingFormRecord2.get('jobId')?.setValue(this.printingForm.getRawValue().id);
      this.printingFormRecord2.get('logType')?.setValue('EXTRA');
      this.printingFormRecord2.get('printSide')?.setValue('BACK');
      const recordData = {
          ...this.printingFormRecord2.value,
          paperSourceType: 'NO_PAPER'
      };
      this.dcsm25Service.startOdPrintLog(recordData).subscribe({
        next: (responseLog) => {
          const updateData = {
            id: this.selectedExtraPrint.id,
            printJobId: this.selectedExtraPrint.printJobId,
            additionalQty: this.selectedExtraPrint.additionalQty,
            reason: this.selectedExtraPrint.reason,
            status: 'IN_PROGRESS_PAGE2',
            requestedBy: this.selectedExtraPrint.requestedBy,
            printingRecordId: responseLog.logId || responseLog.id
          };
          this.dcsm25Service.updateExtraPrint(updateData).subscribe({
            next: () => {
              this.dcsm25Service.getById(this.printingForm.getRawValue().id).subscribe((response) => {
                response.printingRecordId = responseLog.logId || responseLog.id;
                this.dcsm25Service.save(response).subscribe({
                  next: (response) => {
                    this.printingForm.patchValue(response);
                    this.loadExtraPrints();
                    this.sweetAlert.success('Success', 'เริ่มพิมพ์หน้า 2');
                  }
                });
              });
            }
          });
        },
        error: (error) => {
          this.sweetAlert.error('Error', error?.error?.error || error?.error || 'Error starting print page 2');
        }
      });
    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }

  stopExtraPrintPage2(action: string) {
    if (this.printingEndLog.valid && this.selectedExtraPrint) {
      const logId = this.printingForm.getRawValue().printingRecordId;

      if (!logId) {
        this.sweetAlert.error('Error', 'ไม่พบ log ID');
        return;
      }

      this.printingEndLog.get('logId')?.setValue(logId);
      this.printingEndLog.get('action')?.setValue(action);

      if (action === 'FINISH') {
        let additionalQty = this.selectedExtraPrint?.additionalQty || 0;
        this.printingEndLog.get('paperUsed')?.setValue(additionalQty);
      }

      const recordData = this.printingEndLog.value;
      this.dcsm25Service.stopOdPrintLog(recordData).subscribe({
        next: () => {
          const newStatus = action === 'FINISH' ? 'COMPLETED' : 'PAUSED_PAGE2';

          const updateData = {
            id: this.selectedExtraPrint.id,
            printJobId: this.selectedExtraPrint.printJobId,
            additionalQty: this.selectedExtraPrint.additionalQty,
            reason: this.selectedExtraPrint.reason,
            status: newStatus,
            requestedBy: this.selectedExtraPrint.requestedBy,
            printingRecordId: null
          };
          this.dcsm25Service.updateExtraPrint(updateData).subscribe({
            next: () => {
              this.dcsm25Service.getById(this.printingForm.getRawValue().id).subscribe((response) => {
                response.printingRecordId = null;
                this.dcsm25Service.save(response).subscribe({
                  next: (response) => {
                    this.printingForm.patchValue(response);
                    this.loadExtraPrints();
                    this.sweetAlert.success('Success', action === 'FINISH' ? 'พิมพ์หน้า 2 เสร็จสิ้น' : 'หยุดพิมพ์หน้า 2 ชั่วคราว');
                  }
                });
              });
            }
          });
        },
        error: (error) => {
          this.sweetAlert.error('Error', error.error.error);
        }
      });
    } else {
      this.sweetAlert.warning('Error', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }


  closeModal(modalId: string) {
    const el = document.getElementById(modalId);
    if (el) {
      const modal = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
      modal.hide();
    }
  }
}
