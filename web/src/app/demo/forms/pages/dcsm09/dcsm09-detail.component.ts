import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm09Service } from './dcsm09.service';
import { Dcsm26Service } from '../dcsm26/dcsm26.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-dcsm09-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, FormsModule],
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
  isDelivery = false;
  activeTab: string = 'authority';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm09Service: Dcsm09Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private authService: AuthService,
    private dcsm26Service: Dcsm26Service
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

      // Load parts
      if (resolvedData.id) {
        this.loadParts(resolvedData.id);
      }
    }
  }

  get parts(): FormArray {
    return this.mainForm.get('parts') as FormArray;
  }

  initPartRow(data?: any): FormGroup {
    return this.fb.group({
      id: [data?.id || null],
      partName: [data?.partName || '', Validators.required]
    });
  }

  addPart(): void {
    this.parts.push(this.initPartRow());
  }

  removePart(index: number): void {
    this.parts.removeAt(index);
  }

  loadParts(orderId: number): void {
    this.dcsm09Service.getPartsByOrderId(orderId).subscribe({
      next: (parts) => {
        const partsFormArray = this.mainForm.get('parts') as FormArray;
        partsFormArray.clear();
        parts.forEach(part => {
          partsFormArray.push(this.initPartRow(part));
        });
      },
      error: (err) => {
        console.error('Error loading parts', err);
      }
    });
  }

  initForm(): void {
    this.mainForm = this.fb.group({
      id: [null],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: [null, Validators.required],
      usedFile: [null],
      colorSample: [null],
      jobOwner: [null],
      deadlineDate: [null],
      deadlineTime: [null],
      deliveryDate: [null],
      jobStatus: [null],
      processStatus: [null],
      operatorName: [null],
      inspectionDate: [null],
      remarks: [null],
      moldStatus: [null],
      jobType: [null],
      inspector: [null],
      createdAt: [null],
      updatedAt: [null],
      customerName: [null],
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
      qcType: [null],
      qcLocation: [null],
      parts: this.fb.array([]),
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
      printJobId: [null],
      isNewProof: [false],
      customerFeedback: [null]
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
    this.mainForm.get('customerName')?.disable();
    this.mainForm.get('decisionAuthority')?.disable();
    this.mainForm.get('decisionAuthorityRemarks')?.disable();
    this.mainForm.get('createdTime')?.disable({ emitEvent: false });
    this.mainForm.get('jobId')?.disable();
    this.mainForm.get('qtId')?.disable();
    this.mainForm.get('qpId')?.disable();
    this.mainForm.get('qcType')?.disable();
    this.mainForm.get('qcLocation')?.disable();

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

  add() {
    const navigationState = {
      state: {
        referenceId: this.mainForm.getRawValue().id,
        decisionAuthority: this.mainForm.getRawValue().decisionAuthority,
        decisionAuthorityRemarks: this.mainForm.getRawValue().decisionAuthorityRemarks,
        print2Page: this.mainForm.getRawValue().print2Page,
        qcType: this.mainForm.getRawValue().qcType,
        qcLocation: this.mainForm.getRawValue().qcLocation,
        sampleJobType: this.mainForm.getRawValue().sampleJobType,
        samplePrintingSystem: this.mainForm.getRawValue().samplePrintingSystem,
        samplePrintingStyle: this.mainForm.getRawValue().samplePrintingStyle,
        samplePrintingColor: this.mainForm.getRawValue().samplePrintingColor,
        samplePaperSize: this.mainForm.getRawValue().samplePaperSize,
        samplePaperGrammage: this.mainForm.getRawValue().samplePaperGrammage,
        sampleCoatingStyle: this.mainForm.getRawValue().sampleCoatingStyle,
        sampleDiecutStyle: this.mainForm.get('sampleDiecutStyle')?.value,
        sampleSpecialInstructions: this.mainForm.get('sampleSpecialInstructions')?.value,
        sampleDeliveryTimestamp: this.mainForm.get('sampleDeliveryTimestamp')?.value,
        printRound: this.mainForm.get('printRound')?.value,
        printRoundPage2: this.mainForm.get('printRoundPage2')?.value
      }
    };
    console.log('DCSM09: Navigating to DCSM20 with state:', navigationState.state);
    this.router.navigate(['/Dcsm20DetailStatus', this.mainForm.getRawValue().id], navigationState);
  }

  checkBtn() {
    if (this.mainForm.getRawValue().processStatus == 'เสร็จสิ้น รอตรวจสอบ') {
      this.isCheckMold = true;
      this.isOrder = false;
      this.isSendOrder = false;
      this.isSendFile = false;
      this.isDelivery = false;
    } else if (this.mainForm.getRawValue().processStatus == 'ตรวจไฟล์แม่พิมพ์แล้ว' && this.authService.getUserFromToken().sub == this.mainForm.getRawValue().inspector) {
      this.isOrder = true;
      this.isCheckMold = false;
      this.isSendOrder = false;
      this.isSendFile = false;
      this.isDelivery = false;
    } else if (this.mainForm.getRawValue().processStatus == 'ตรวจใบสั่งผลิตแล้ว' && this.authService.getUserFromToken().sub == this.mainForm.getRawValue().inspector) {
      this.isSendOrder = true;
      this.isSendFile = false;
      this.isOrder = false;
      this.isCheckMold = false;
      this.isDelivery = false;
    } else if (this.mainForm.getRawValue().processStatus == 'ส่งใบสั่งผลิตแล้ว' && this.authService.getUserFromToken().sub == this.mainForm.getRawValue().inspector) {
      this.isSendFile = true;
      this.isSendOrder = false;
      this.isOrder = false;
      this.isCheckMold = false;
      this.isDelivery = false;
    } else if ((this.mainForm.getRawValue().processStatus == 'ส่งไฟล์แล้ว' || this.mainForm.getRawValue().processStatus == 'เสร็จสิ้น') && (this.mainForm.getRawValue().dataDalivery == false || this.mainForm.getRawValue().dataDalivery == null) && this.authService.getUserFromToken().sub == this.mainForm.getRawValue().inspector) {
      this.isSendFile = false;
      this.isSendOrder = false;
      this.isOrder = false;
      this.isCheckMold = false;
      this.isDelivery = true;
    } else {
      this.isCheckMold = false;
      this.isOrder = false;
      this.isSendOrder = false;
      this.isSendFile = false;
      this.isDelivery = false;
    }
  }

  updateMoldStatus() {
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
        this.mainForm.get('processStatus')?.setValue('ตรวจไฟล์แม่พิมพ์แล้ว');
        this.mainForm.get('inspector')?.setValue(this.authService.getUserFromToken().sub);

        this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            const orderId = response.id;
            const partsData = this.mainForm.getRawValue().parts;

            this.dcsm09Service.saveParts(orderId, partsData).subscribe({
              next: () => {
                this.patchFormData(response);
                this.checkBtn();
                this.loadingService.hide();
                this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
              },
              error: (err) => {
                this.loadingService.hide();
                console.error('Error saving parts', err);
                this.sweetAlert.warning('ยืนยันสำเร็จ แต่ไม่สามารถบันทึกข้อมูลชิ้นส่วนได้');
              }
            });
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    })
  }


  updateOrder() {
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
        this.mainForm.get('processStatus')?.setValue('ตรวจใบสั่งผลิตแล้ว');
        this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            const orderId = response.id;
            const partsData = this.mainForm.getRawValue().parts;

            this.dcsm09Service.saveParts(orderId, partsData).subscribe({
              next: () => {
                this.patchFormData(response);
                this.checkBtn();
                this.loadingService.hide();
                this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
              },
              error: (err) => {
                this.loadingService.hide();
                console.error('Error saving parts', err);
                this.sweetAlert.warning('ยืนยันสำเร็จ แต่ไม่สามารถบันทึกข้อมูลชิ้นส่วนได้');
              }
            });
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

  updateSendOrder() {
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
        this.mainForm.get('processStatus')?.setValue('ส่งใบสั่งผลิตแล้ว');
        this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            const orderId = response.id;
            const partsData = this.mainForm.getRawValue().parts;

            this.dcsm09Service.saveParts(orderId, partsData).subscribe({
              next: () => {
                this.patchFormData(response);
                this.checkBtn();
                this.loadingService.hide();
                this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
              },
              error: (err) => {
                this.loadingService.hide();
                console.error('Error saving parts', err);
                this.sweetAlert.warning('ยืนยันสำเร็จ แต่ไม่สามารถบันทึกข้อมูลชิ้นส่วนได้');
              }
            });
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
        this.mainForm.get('jobStatus')?.setValue('เสร็จสิ้น');
        this.mainForm.get('processStatus')?.setValue('ส่งไฟล์แล้ว');

        this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            const orderId = response.id;
            const partsData = this.mainForm.getRawValue().parts;

            this.dcsm09Service.saveParts(orderId, partsData).subscribe({
              next: () => {
                const formData = this.mainForm.getRawValue();
                if (formData.isNewProof && formData.printJobId) {
                  this.dcsm26Service.getById(formData.printJobId).subscribe((originalJob) => {
                    if (originalJob) {
                      const newJob = { ...originalJob };
                      delete newJob.id;
                      delete newJob.rowVersion;
                      delete newJob.createdAt;
                      delete newJob.updatedAt;
                      newJob.jobStatus = 'รอพิมพ์';
                      newJob.productionOrderId = response.id;
                      this.dcsm26Service.save(newJob).subscribe({
                        next: (res) => {
                          this.mainForm.get('printJobId')?.setValue(res.id);
                          this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe()
                        },
                      });
                    }
                  });
                }
                this.patchFormData(response);
                this.checkBtn();
                this.loadingService.hide();
                this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
              },
              error: (err) => {
                this.loadingService.hide();
                console.error('Error saving parts', err);
                this.sweetAlert.warning('ยืนยันสำเร็จ แต่ไม่สามารถบันทึกข้อมูลชิ้นส่วนได้');
              }
            });
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
