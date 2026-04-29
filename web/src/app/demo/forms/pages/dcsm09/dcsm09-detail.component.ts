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
import { Dcsm20Service } from '../dcsm20/dcsm20.service';
import { Dcsm06Service } from '../dcsm06/dcsm06.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  isFinalReview = false;
  activeTab: string = 'authority';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm09Service: Dcsm09Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private authService: AuthService,
    private dcsm26Service: Dcsm26Service,
    private dcsm20Service: Dcsm20Service,
    private dcsm06Service: Dcsm06Service
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
      printingMachine: [null, Validators.required],
      printerName: [null, Validators.required],
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
      customerFeedback: [null],
      isProductionApproved: [false],
      productionOrderId: [null],
      reorderFromJoId: [null],
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
        qpId: this.mainForm.getRawValue().qpId,
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
        printRoundPage2: this.mainForm.get('printRoundPage2')?.value,
        reorderFromJoId: this.mainForm.getRawValue().reorderFromJoId
      }
    };
    console.log('DCSM09: Navigating to DCSM20 with state:', navigationState.state);
    this.router.navigate(['/Dcsm20DetailStatus', this.mainForm.getRawValue().id], navigationState);
  }

  checkBtn() {
    this.isCheckMold = false;
    this.isOrder = false;
    this.isSendOrder = false;
    this.isSendFile = false;
    this.isDelivery = false;
    this.isFinalReview = false;

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
      this.isDelivery = true;
    } else {
      this.isCheckMold = false;
      this.isOrder = false;
      this.isSendOrder = false;
      this.isSendFile = false;
      this.isDelivery = false;
    }

    // Hide normal delivery button if it's a proofing job (it will use onFinalApproveProduction instead)
    const decisionAuth = this.mainForm.getRawValue().decisionAuthority;
    if (['customerOnSite', 'sampleToCustomer'].includes(decisionAuth)) {
      this.isDelivery = false;

      // Check for Final Review
      this.dcsm26Service.findByProductionOrderId(this.mainForm.getRawValue().id).pipe(
        catchError(() => of(null))
      ).subscribe((printJob) => {
        if (printJob && (printJob.jobStatus === 'อนุมัติผลิตแล้ว' || printJob.jobStatus === 'รอการอนุมัติผลิต') &&
          (this.mainForm.getRawValue().processStatus == 'ส่งไฟล์แล้ว' || this.mainForm.getRawValue().processStatus == 'เสร็จสิ้น')) {
          this.isFinalReview = true;
        }
      });
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
    const rawData = this.mainForm.getRawValue();
    const currentPrinter = rawData.printingMachine;
    const isProductionApproved = rawData.isProductionApproved;

    const proceedSave = (selectedPrinter: string) => {
      this.loadingService.show();
      this.mainForm.get('jobStatus')?.setValue('เสร็จสิ้น');
      this.mainForm.get('processStatus')?.setValue('ส่งไฟล์แล้ว');
      this.mainForm.get('printingMachine')?.setValue(selectedPrinter);
      this.mainForm.get('printerName')?.setValue(selectedPrinter);

      this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe({
        next: (response) => {
          const orderId = response.id;
          const partsData = this.mainForm.getRawValue().parts;

          this.dcsm09Service.saveParts(orderId, partsData).subscribe({
            next: () => {
              this.syncWithPrintJob(response, selectedPrinter);
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
    };

    const qcType = rawData.decisionAuthority;
    const requiresPrinterSelection =
      (qcType === 'sampleToCustomer' || qcType === 'customerOnSite') &&
      isProductionApproved !== true;

    if (!requiresPrinterSelection) {
      // isProductionApproved = true, หรือ qcType อื่น → บันทึกทันทีโดยไม่เลือกเครื่อง
      proceedSave(currentPrinter || '');
      return;
    }

    // ขึ้นตัวอย่างส่งลูกค้าตรวจ / ลูกค้าเข้าดูงานหน้างาน และยังไม่ approved → ให้เลือกเครื่อง
    Swal.fire({
      title: 'ยืนยันส่งไฟล์แล้ว',
      html: `
        <div class="mb-3 text-start">
          <label class="form-label fw-bold small">เลือกเครื่องพิมพ์เพื่อบันทึกลงตารางงานพิมพ์</label>
          <select id="printer-select" class="form-select">
            <option value="">-- กรุณาเลือกเครื่องพิมพ์ --</option>
            <option value="CD" ${currentPrinter === 'CD' ? 'selected' : ''}>CD</option>
            <option value="SM" ${currentPrinter === 'SM' ? 'selected' : ''}>SM</option>
          </select>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยันและบันทึก',
      cancelButtonText: 'ยกเลิก',
      preConfirm: () => {
        const printer = (document.getElementById('printer-select') as HTMLSelectElement).value;
        if (!printer) {
          Swal.showValidationMessage('กรุณาเลือกเครื่องพิมพ์');
        }
        return printer;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        proceedSave(result.value);
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

  onFinalApproveProduction() {
    Swal.fire({
      title: 'ดำเนินการขั้นสุดท้าย',
      html: `
        <div class="mb-3 text-start">
          <label class="form-label fw-bold small">ระบุเลขที่ใบสั่งผลิต (PAP ID)</label>
          <input type="text" id="pap-id-input" class="form-control" value="${this.mainForm.get('qpId')?.value || ''}" placeholder="กรอก PAP ID">
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      preConfirm: () => {
        const papId = (document.getElementById('pap-id-input') as HTMLInputElement).value;
        if (!papId) {
          Swal.showValidationMessage('กรุณาระบุ PAP ID');
        }
        return papId;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const papIdInput = result.value;
        const selectedPrinter = this.mainForm.get('printingMachine')?.value;
        this.loadingService.show();

        // Update qpId and jobStatus in form
        this.mainForm.get('qpId')?.setValue(papIdInput);
        this.mainForm.get('jobStatus')?.setValue('อนุมัติผลิตแล้ว');
        this.mainForm.get('isProductionApproved')?.setValue(true);
        this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe();

        // 1. Fetch PAP Data
        this.dcsm20Service.getJobPAP(papIdInput).subscribe({
          next: (papResponses: any[]) => {
            if (papResponses && papResponses.length > 0) {
              const papData = papResponses[0]; // Take the first one if multiple

              // Override printer from user selection
              if (papData.printing) {
                papData.printing.machine = selectedPrinter;
              }

              // 2. Save PAP Order
              this.dcsm20Service.savePapOrder(papData).subscribe((savedPap) => {

                // 3. Update DCSM26 status and details
                const formData = this.mainForm.getRawValue();
                this.dcsm26Service.findByProductionOrderId(formData.id).subscribe((printJob) => {
                  if (printJob) {
                    const updatedJob = {
                      ...printJob,
                      jobStatus: 'อนุมัติผลิตแล้ว',
                      jobId: papData.header.jobCode || formData.jobId || formData.qpId,
                      customerJobName: papData.header.jobName + ' - ' + papData.header.customerName,
                      totalPrintSheets: papData.cutting.paper.printQty,
                      productionQty: papData.header.totalPrintQty,
                      deliveryDate: formData.sampleDeliveryTimestamp ? formData.sampleDeliveryTimestamp.split('T')[0] : this.convertPapDate(papData.header.deliveryDate),
                      deliveryTime: formData.sampleDeliveryTimestamp ? formData.sampleDeliveryTimestamp.split('T')[1]?.substring(0, 5) : null,
                      printerName: papData.printing.machine === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : papData.printing.machine,
                      decisionAuthority: formData.decisionAuthority,
                      decisionAuthorityRemarks: formData.decisionAuthorityRemarks,
                      sampleJobType: formData.sampleJobType,
                      samplePrintingSystem: formData.samplePrintingSystem,
                      samplePrintingStyle: formData.samplePrintingStyle,
                      samplePrintingColor: formData.samplePrintingColor,
                      samplePaperSize: formData.samplePaperSize,
                      samplePaperGrammage: formData.samplePaperGrammage,
                      sampleCoatingStyle: formData.sampleCoatingStyle,
                      sampleDiecutStyle: formData.sampleDiecutStyle,
                      sampleSpecialInstructions: formData.sampleSpecialInstructions,
                      sampleDeliveryTimestamp: formData.sampleDeliveryTimestamp,
                      print2Page: formData.print2Page,
                      reorderFromJoId: formData.reorderFromJoId,
                      machineSetupCount: papData.printing.setupWaste ? papData.printing.setupWaste.toString() : null,
                      setupWaste: papData.printing.setupWaste
                    };
                    this.dcsm26Service.save(updatedJob).subscribe();
                  }
                });

                // 4. Create ProductionJobs (Dcsm20 records) for each part
                const parts = this.parts.length > 0 ? this.mainForm.getRawValue().parts : [{ partName: null }];
                const savePromises = parts.map((part: any) => {
                  const prodJob = {
                    date: new Date().toISOString().substring(0, 10),
                    jobId: papData.header.jobCode,
                    customerJobName: papData.header.jobName + ' - ' + papData.header.customerName,
                    printQuantity: papData.cutting.paper.printQty,
                    productionQuantity: papData.header.totalPrintQty,
                    printingDate: this.convertPapDate(papData.printing.scheduledDate),
                    printingResponsible: papData.printing.machine === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : papData.printing.machine,
                    coatingDate: this.convertPapDate(papData.coating.scheduledDate),
                    coatingResponsible: papData.coating.location === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : papData.coating.location,
                    stampingDate: this.convertPapDate(papData.dieCutting.dieCutDeadline),
                    stampingResponsible: papData.dieCutting.location === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : papData.dieCutting.location,
                    gluingDate: this.convertPapDate(papData.gluing.scheduledDate),
                    gluingResponsible: papData.gluing.location === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : papData.gluing.location,
                    qcDate: this.convertPapDate(papData.qcAndDelivery.scheduledDate),
                    dueDate: this.convertPapDate(papData.header.deliveryDate),
                    imageUrl: papData.header.imageUrl,
                    papOrderId: savedPap.id,
                    productionOrderId: this.mainForm.getRawValue().id,
                    partName: part.partName,
                    qcType: this.mainForm.getRawValue().qcType,
                    qcLocation: this.mainForm.getRawValue().qcLocation,
                    machineSetupCount: papData.printing.setupWaste ? papData.printing.setupWaste.toString() : null
                  };
                  return this.dcsm20Service.save(prodJob).toPromise();
                });

                Promise.all(savePromises).then(() => {
                  // 5. Update dataDalivery status in Dcsm09
                  this.dcsm20Service.updateDataDalivery({ id: this.mainForm.getRawValue().id }).subscribe(() => {
                    this.loadingService.hide();
                    this.sweetAlert.success('ดำเนินการสำเร็จ', 'ดึงข้อมูล PAP และสร้างตารางจัดส่งเรียบร้อยแล้ว');
                    this.router.navigate(['/Dcsm20']);
                  });
                }).catch(err => {
                  this.loadingService.hide();
                  this.sweetAlert.error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลจัดส่งได้');
                });
              });
            } else {
              this.loadingService.hide();
              this.sweetAlert.error('ไม่พบข้อมูล', 'ไม่พบใบงานสำหรับ QPId นี้ในระบบ PAP');
            }
          },
          error: (err) => {
            this.loadingService.hide();
            this.sweetAlert.error('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อระบบ PAP ได้');
          }
        });
      }
    });
  }

  private convertPapDate(dateStr: string): string | null {
    if (!dateStr || dateStr === '-') return null;

    // Handle date ranges (e.g., "27/04/2026-28/04/2026") - Take the first date
    let cleanDate = dateStr.trim();
    if (cleanDate.includes('-') && !cleanDate.includes(' ')) {
      // Simple range like 27/04/2026-28/04/2026
      cleanDate = cleanDate.split('-')[0];
    } else if (cleanDate.includes(' - ')) {
      // Range with spaces like 27/04/2026 - 28/04/2026
      cleanDate = cleanDate.split(' - ')[0];
    }

    if (cleanDate.includes('/')) {
      const parts = cleanDate.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        const yearNum = parseInt(year);
        const convertedYear = yearNum > 2500 ? (yearNum - 543).toString() : year;
        return `${convertedYear}-${month}-${day}`;
      }
    }

    const thaiMonths: { [key: string]: string } = {
      'ม.ค.': '01', 'ก.พ.': '02', 'มี.ค.': '03', 'เม.ย.': '04',
      'พ.ค.': '05', 'มิ.ย.': '06', 'ก.ค.': '07', 'ส.ค.': '08',
      'ก.ย.': '09', 'ต.ค.': '10', 'พ.ย.': '11', 'ธ.ค.': '12'
    };

    const parts = cleanDate.split(' ');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = thaiMonths[parts[1]];
      let year = parts[2];
      const yearNum = parseInt(year);
      if (yearNum > 2500) {
        year = (yearNum - 543).toString();
      }
      if (month && year) {
        return `${year}-${month}-${day}`;
      }
    }

    // If it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
      return cleanDate;
    }

    return null; // Return null instead of invalid string to prevent backend 400/403 errors
  }

  private syncWithPrintJob(response: any, printerName?: string) {
    const formData = this.mainForm.getRawValue();

    // Helper to extract date and time from timestamp
    const extractDateTime = (job: any, timestamp: string) => {
      if (timestamp && timestamp.includes('T')) {
        const [date, time] = timestamp.split('T');
        job.deliveryDate = date;
        job.deliveryTime = time;
      }
    };
    console.log('formData', formData);

    if (formData.isNewProof && formData.printJobId) {
      console.log('new proof true', response);

      this.dcsm26Service.getById(formData.printJobId).subscribe((originalJob) => {
        console.log('originalJob', originalJob);
        if (originalJob) {
          const newJob = { ...originalJob };
          delete newJob.id;
          delete newJob.rowVersion;
          delete newJob.createdAt;
          delete newJob.updatedAt;
          newJob.jobStatus = 'รอพิมพ์';
          newJob.productionOrderId = response.id;
          if (printerName) newJob.printerName = printerName;
          extractDateTime(newJob, formData.sampleDeliveryTimestamp);

          this.dcsm26Service.save(newJob).subscribe({
            next: (res) => {
              this.mainForm.get('printJobId')?.setValue(res.id);
              this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe()
            },
          });
        }
      });
    } else if (['customerOnSite', 'sampleToCustomer'].includes(formData.decisionAuthority)) {
      // Automatic send to DCSM26 for proofing
      this.dcsm26Service.findByProductionOrderId(response.id).pipe(
        catchError(() => of(null))
      ).subscribe((existingJob) => {
        if (!existingJob) {
          const newJob: any = {
            jobId: formData.jobId || formData.qpId,
            customerJobName: formData.folderName,
            productionOrderId: response.id,
            jobStatus: 'รอพิมพ์',
            printerName: printerName,
            issample: true,
            decisionAuthority: formData.decisionAuthority,
            decisionAuthorityRemarks: formData.decisionAuthorityRemarks,
            sampleJobType: formData.sampleJobType,
            samplePrintingSystem: formData.samplePrintingSystem,
            samplePrintingStyle: formData.samplePrintingStyle,
            samplePrintingColor: formData.samplePrintingColor,
            samplePaperSize: formData.samplePaperSize,
            samplePaperGrammage: formData.samplePaperGrammage,
            sampleCoatingStyle: formData.sampleCoatingStyle,
            sampleDiecutStyle: formData.sampleDiecutStyle,
            sampleSpecialInstructions: formData.sampleSpecialInstructions,
            sampleDeliveryTimestamp: formData.sampleDeliveryTimestamp,
            print2Page: formData.print2Page,
            reorderFromJoId: formData.reorderFromJoId
          };
          extractDateTime(newJob, formData.sampleDeliveryTimestamp);
          this.dcsm26Service.save(newJob).subscribe({
            next: (res) => {
              this.mainForm.get('printJobId')?.setValue(res.id);
              this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe()
            },
          });
        } else {
          if (printerName) existingJob.printerName = printerName;
          extractDateTime(existingJob, formData.sampleDeliveryTimestamp);
          this.dcsm26Service.save(existingJob).subscribe({
            next: (res) => {
              this.mainForm.get('printJobId')?.setValue(res.id);
              this.dcsm09Service.save(this.mainForm.getRawValue()).subscribe()
            },
          });
        }
      });
    } else {
      // Normal Job: Update existing print job printer and date
      this.dcsm26Service.findByProductionOrderId(response.id).pipe(
        catchError(() => of(null))
      ).subscribe((existingJob) => {
        if (existingJob) {
          if (printerName) existingJob.printerName = printerName;
          extractDateTime(existingJob, formData.sampleDeliveryTimestamp);
          this.dcsm26Service.save(existingJob).subscribe();
        }
      });
    }
  }
}
