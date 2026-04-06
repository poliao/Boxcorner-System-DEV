import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm07Service, DropdownOption } from './dcsm07.service';
import { Dcsm04Service } from '../dcsm04/dcsm04.service';
import { Dcsm26Service } from '../dcsm26/dcsm26.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm07-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, FormsModule],
  templateUrl: './dcsm07-detail.component.html',
  styleUrl: './dcsm07-detail.component.scss'
})
export class Dcsm07DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  operatorOptions: DropdownOption[] = [];
  isSampleOrderId = true;
  isCancel = true;
  isBtnSave = false;
  isCancelRemarks = false;

  // ตัวแปรสำหรับ modal เปลี่ยนวันที่และเวลา
  showDeadlineModal: boolean = false;
  tempDeadlineDate: string = '';
  tempDeadlineTime: string = '';

  // ตัวแปรสำหรับ modal ยกเลิกงาน
  showCancelModal: boolean = false;
  cancelReason: string = '';

  // ตัวแปรสำหรับ modal เปลี่ยนเครื่องพิมพ์
  showPrinterModal: boolean = false;
  printerForm!: FormGroup;
  printerOptions: string[] = ['SM', 'CD'];

  activeTab: string = 'authority';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm07Service: Dcsm07Service,
    private dcsm04Service: Dcsm04Service,
    private dcsm26Service: Dcsm26Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.initForm();
    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
      this.checkBtn();
      this.getDropdown();

      if (this.mainForm.getRawValue().processStatus == 'รอผู้รับผิดชอบยืนยัน' || this.mainForm.getRawValue().processStatus == 'รอดำเนินการ') {
        this.mainForm.get('jobType')?.enable({ emitEvent: false });
        this.mainForm.get('operatorName')?.enable({ emitEvent: false });
        this.mainForm.get('deliveryDate')?.enable({ emitEvent: false });
        this.mainForm.get('remarks')?.enable({ emitEvent: false });
        this.mainForm.get('qcLocation')?.enable({ emitEvent: false });
        this.mainForm.get('qcType')?.enable({ emitEvent: false });
        this.mainForm.get('printRound')?.enable({ emitEvent: false });
        this.mainForm.get('printRoundPage2')?.enable({ emitEvent: false });
      }
      if (this.mainForm.getRawValue().sampleOrderId == '' || this.mainForm.getRawValue().sampleOrderId == null) {
        this.isSampleOrderId = false
      }
      if (this.mainForm.getRawValue().cancelRemarks) {
        this.isCancelRemarks = true
      }
      this.mainForm.get('qpId')?.valueChanges.subscribe(val => {
        if (val) {
          this.mainForm.get('jobId')?.setValidators(null);
        } else {
          this.mainForm.get('jobId')?.setValidators([Validators.required]);
        }
        this.mainForm.get('jobId')?.updateValueAndValidity();
      });

      this.mainForm.get('decisionAuthority')?.valueChanges.subscribe(value => {
        const sampleJobTypeControl = this.mainForm.get('sampleJobType');
        const samplePrintingSystemControl = this.mainForm.get('samplePrintingSystem');
        const samplePrintingStyleControl = this.mainForm.get('samplePrintingStyle');

        if (value === 'sampleToCustomer' || value === 'customerOnSite') {
          sampleJobTypeControl?.setValidators([Validators.required]);
          samplePrintingSystemControl?.setValidators([Validators.required]);
          samplePrintingStyleControl?.setValidators([Validators.required]);
        } else {
          sampleJobTypeControl?.clearValidators();
          samplePrintingSystemControl?.clearValidators();
          samplePrintingStyleControl?.clearValidators();
        }

        sampleJobTypeControl?.updateValueAndValidity({ emitEvent: false });
        samplePrintingSystemControl?.updateValueAndValidity({ emitEvent: false });
        samplePrintingStyleControl?.updateValueAndValidity({ emitEvent: false });
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
    this.dcsm07Service.getPartsByOrderId(orderId).subscribe({
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
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      usedFile: [''],
      colorSample: [''],
      jobOwner: [''],
      deadlineDate: [''],
      deadlineTime: [''],
      deliveryDate: ['', Validators.required],
      jobStatus: [''],
      processStatus: [''],
      operatorName: ['', Validators.required],
      inspectionDate: [''],
      remarks: [''],
      moldStatus: [''],
      jobType: ['', Validators.required],
      createdAt: [''],
      updatedAt: [''],
      sampleOrderId: [''],
      customerName: [''],
      cancelRemarks: [''],
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
      qcLocation: [null, Validators.required],
      searchId: [null],
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
      printerName: [null],
      printJobId: [null],
      isNewProof: [false],
      customerFeedback: [null],
      productionOrderId: [null],
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
    this.mainForm.get('jobType')?.disable({ emitEvent: false });
    this.mainForm.get('operatorName')?.disable({ emitEvent: false });
    this.mainForm.get('deliveryDate')?.disable({ emitEvent: false });
    this.mainForm.get('remarks')?.disable({ emitEvent: false });
    this.mainForm.get('sampleOrderId')?.disable();
    this.mainForm.get('customerName')?.disable();
    this.mainForm.get('cancelRemarks')?.disable();
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
    this.mainForm.get('printRound')?.disable({ emitEvent: false });
    this.mainForm.get('print2Page')?.disable({ emitEvent: false });
    this.mainForm.get('printRoundPage2')?.disable({ emitEvent: false });
    this.mainForm.get('print2Page')?.disable({ emitEvent: false });
    this.initPrinterForm();
  }

  initPrinterForm(): void {
    this.printerForm = this.fb.group({
      printerName: [null, Validators.required],
      printRound: [1, [Validators.required, Validators.min(1)]],
      printRoundPage2: [1, [Validators.required, Validators.min(1)]]
    });
  }

  openPrinterModal(): void {
    const raw = this.mainForm.getRawValue();
    this.printerForm.patchValue({
      printerName: raw.printerName,
      printRound: raw.printRound || 1,
      printRoundPage2: raw.printRoundPage2 || 1
    });
    this.showPrinterModal = true;
  }

  closePrinterModal(): void {
    this.showPrinterModal = false;
  }

  updatePrinter(): void {
    if (this.printerForm.invalid) {
      this.printerForm.markAllAsTouched();
      return;
    }

    const { printerName, printRound, printRoundPage2 } = this.printerForm.getRawValue();

    Swal.fire({
      title: 'ยืนยันการเปลี่ยนเครื่องพิมพ์',
      text: `คุณต้องการเปลี่ยนเครื่องพิมพ์เป็น ${printerName} และรอบพิมพ์เป็น ${printRound}${this.mainForm.get('print2Page')?.value ? '/' + printRoundPage2 : ''} ใช่หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();

        // 1. Update Production Order (DCSM07)
        this.mainForm.patchValue({
          printerName: printerName,
          printRound: printRound,
          printRoundPage2: printRoundPage2
        });

        const prodOrderData = this.mainForm.getRawValue();

        this.dcsm07Service.save(prodOrderData).subscribe({
          next: (response) => {
            this.patchFormData(response);

            // 2. Update Print Job (DCSM26) if exists
            if (response.id) {
              this.dcsm26Service.findByProductionOrderId(response.id).subscribe({
                next: (printJob) => {
                  if (printJob) {
                    printJob.printerName = printerName;
                    printJob.printRound = printRound;
                    printJob.printRoundPage2 = printRoundPage2;

                    this.dcsm26Service.save(printJob).subscribe({
                      next: () => {
                        this.loadingService.hide();
                        this.closePrinterModal();
                        this.sweetAlert.success('สำเร็จ', 'อัปเดตเครื่องพิมพ์และรอบพิมพ์เรียบร้อยแล้ว');
                      },
                      error: (err) => {
                        console.error('Error updating print job', err);
                        this.loadingService.hide();
                        this.sweetAlert.error('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตในตารางพิมพ์ได้');
                      }
                    });
                  } else {
                    this.loadingService.hide();
                    this.closePrinterModal();
                    this.sweetAlert.success('สำเร็จ', 'อัปเดตเครื่องพิมพ์และรอบพิมพ์เรียบร้อยแล้ว (ไม่พบรายการในตารางพิมพ์)');
                  }
                },
                error: (err) => {
                  console.error('Error finding print job', err);
                  this.loadingService.hide();
                  this.closePrinterModal();
                  this.sweetAlert.success('สำเร็จ', 'อัปเดตเครื่องพิมพ์และรอบพิมพ์เรียบร้อยแล้ว (ไม่พบรายการในตารางพิมพ์)');
                }
              });
            } else {
              this.loadingService.hide();
              this.closePrinterModal();
              this.sweetAlert.success('สำเร็จ', 'อัปเดตเครื่องพิมพ์และรอบพิมพ์เรียบร้อยแล้ว');
            }
          },
          error: (err) => {
            console.error('Error saving production order', err);
            this.loadingService.hide();
            this.sweetAlert.error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
          }
        });
      }
    });
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
    if (this.mainForm.getRawValue().jobStatus == 'รอผู้รับผิดชอบยืนยัน' || this.mainForm.getRawValue().jobStatus == 'รอดำเนินการ') {
      this.isCancel = false;
    }
    if (this.mainForm.getRawValue().processStatus == 'รอผู้รับผิดชอบยืนยัน' || this.mainForm.getRawValue().processStatus == 'รอดำเนินการ') {
      this.isBtnSave = true;
    }
  }

  fetchData(): void {
    const searchId = this.mainForm.get('searchId')?.value;
    if (!searchId) {
      this.sweetAlert.warning('กรุณากรอก ID');
      return;
    }

    this.loadingService.show();
    this.dcsm04Service.getSobPAP(searchId).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.mainForm.get('sampleJobType')?.setValue(response.job_specifications.work_type);
        this.mainForm.get('samplePrintingSystem')?.setValue(response.job_specifications.print_system);
        this.mainForm.get('samplePrintingStyle')?.setValue(response.job_specifications.print_style);
        this.mainForm.get('samplePrintingColor')?.setValue(response.job_specifications.print_colors);
        this.mainForm.get('samplePaperSize')?.setValue(response.job_specifications.paper_size);
        this.mainForm.get('samplePaperGrammage')?.setValue(response.job_specifications.paper_weight);
        this.mainForm.get('sampleCoatingStyle')?.setValue(response.job_specifications.coating_style);
        this.mainForm.get('sampleDiecutStyle')?.setValue(response.job_specifications.diecut_style);
        this.sweetAlert.success('ดึงข้อมูลสำเร็จ');
      },
      error: (error) => {
        this.loadingService.hide();
        const msg = error.error || 'ไม่พบข้อมูล';
        this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
      }
    });
  }

  onSubmit() {
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      this.sweetAlert.warning('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    Swal.fire({
      title: 'ยืนยันบันทึกข้อมูล',
      text: "ยืนยันบันทึกข้อมูล ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        const data = this.mainForm.getRawValue();
        this.mainForm.get('jobStatus')?.setValue('รอดำเนินการ');
        this.mainForm.get('processStatus')?.setValue('รอดำเนินการ');
        if (this.mainForm.getRawValue().jobType == 'OD') {
          this.mainForm.get('moldStatus')?.setValue('งานดิจิทัล');
        } else {
          this.mainForm.get('moldStatus')?.setValue('รอดำเนินการ');
        }

        this.dcsm07Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            const orderId = response.id;
            const partsData = this.mainForm.getRawValue().parts;

            this.dcsm07Service.saveParts(orderId, partsData).subscribe({
              next: () => {
                this.loadingService.hide();
                this.patchFormData(response);
                this.checkBtn();
                this.sweetAlert.success('บันทึกข้อมูลสำเร็จ', 'เรียบร้อย')
                this.router.navigate(['/Dcsm07']);
              },
              error: (err) => {
                this.loadingService.hide();
                console.error('Error saving parts', err);
                this.sweetAlert.warning('บันทึกข้อมูลหลักสำเร็จ แต่ไม่สามารถบันทึกข้อมูลชิ้นส่วนได้');
                this.router.navigate(['/Dcsm07']);
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

  getDropdown() {
    this.dcsm07Service.getPlanningOperators().subscribe({
      next: (data) => {
        this.operatorOptions = data;
      },
      error: (err) => {
        console.error('Error loading operators', err);
      }
    });
  }

  // ฟังก์ชันเปิด modal เปลี่ยนวันที่และเวลา
  openDeadlineModal() {
    this.tempDeadlineDate = this.mainForm.get('deadlineDate')?.value || '';
    this.tempDeadlineTime = this.mainForm.get('deadlineTime')?.value || '';
    this.showDeadlineModal = true;
  }

  // ฟังก์ชันปิด modal
  closeDeadlineModal() {
    this.showDeadlineModal = false;
    this.tempDeadlineDate = '';
    this.tempDeadlineTime = '';
  }

  updateDeadline() {
    if (this.tempDeadlineDate || this.tempDeadlineTime) {
      this.mainForm.patchValue({
        deadlineDate: this.tempDeadlineDate,
        deadlineTime: this.tempDeadlineTime
      });
      this.closeDeadlineModal();
    }

    Swal.fire({
      title: 'แก้ไขเวลาส่งงาน',
      text: "ยืนยันแก้ไขเวลาส่งงาน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('postpone')?.setValue('มีการเลื่อนเวลาส่ง');
        const formData = this.prepareDataForSave(this.mainForm.getRawValue());
        this.dcsm07Service.save(formData).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.checkBtn();
            this.sweetAlert.success('แก้ไขเวลาส่งงานสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm07']);
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

  // ฟังก์ชันเปิด modal ยกเลิกงาน
  openCancelModal() {
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  // ฟังก์ชันปิด modal ยกเลิกงาน
  closeCancelModal() {
    this.showCancelModal = false;
    this.cancelReason = '';
  }

  // ฟังก์ชันยืนยันการยกเลิก
  confirmCancel() {
    if (!this.cancelReason?.trim()) {
      this.sweetAlert.warning('กรุณาระบุเหตุผลในการยกเลิก');
      return;
    }
    this.loadingService.show();
    const formData = { ...this.mainForm.getRawValue() };
    formData.cancelRemarks = this.cancelReason;
    formData.jobStatus = 'ยกเลิก';
    formData.processStatus = 'ยกเลิก';
    formData.moldStatus = 'ยกเลิก';

    const finalData = this.prepareDataForSave(formData);
    this.dcsm07Service.save(finalData).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.patchFormData(response);
        this.checkBtn();
        this.sweetAlert.success('ยกเลิกข้อมูลสำเร็จ', 'เรียบร้อย')
        this.router.navigate(['/Dcsm07']);
      }, error: (error) => {
        this.loadingService.hide();
        const msg = error.error || 'ไม่สามารถบันทึกข้อมูลได้';
        this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
      }
    })
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
