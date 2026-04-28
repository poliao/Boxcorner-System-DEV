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
import { PapService } from 'src/app/services/pap.service';


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
  activeTab = 'general';
  proofForm!: FormGroup;
  productionOrderId: number | null = null;
  showJobModal = false;
  availableJobs: any[] = [];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm08Service: Dcsm08Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private tokenService: TokenService,
    private papService: PapService
  ) { }

  ngOnInit(): void {
    this.initForm();
    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.productionOrderId = resolvedData.id;
      this.patchFormData(resolvedData);
      this.checkBtn();
      this.initProofForm();
      this.loadProofData();


      this.mainForm.get('qpId')?.valueChanges.subscribe(val => {
        if (val) {
          this.mainForm.get('jobId')?.setValidators(null);
        } else {
          this.mainForm.get('jobId')?.setValidators([Validators.required]);
        }
        this.mainForm.get('jobId')?.updateValueAndValidity();
      });

      this.mainForm.get('decisionAuthority')?.valueChanges.subscribe(val => {
        if (!['customerOnSite', 'sampleToCustomer'].includes(val) && this.activeTab === 'proof') {
          this.activeTab = 'general';
        }
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
      printJobId: [null],
      isNewProof: [false],
      customerFeedback: [null],
      productionOrderId: [null],
      reorderFromJoId: [null],
      isProductionApproved: [false]
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

  initProofForm(): void {
    this.proofForm = this.fb.group({
      id: [null],
      productionOrderId: [this.productionOrderId],
      receivedDate: [{ value: new Date().toISOString().substring(0, 10), disabled: true }],
      deliveryDate: [{ value: this.mainForm.get('sampleDeliveryTimestamp')?.value?.substring(0, 10) || null, disabled: true }],
      jobCode: [null],
      customerName: [null],
      jobName: [null],
      orderedBy: [null],
      plateLocation: [null],
      plateColorCount: [null],
      plateScreenMesh: [null],
      plateOtherDetails: [null],
      paperType: [null],
      paperCut: [null],
      paperPrintSize: [null],
      paperPrintQty: [null],
      paperCutterName: [null],
      paperSpecialInstructions: [null],
      printScheduleDate: [null],
      printDeliveryDate: [null],
      printLocation: [null],
      printCharacteristics: [null],
      printColorCount: [null],
      printOperatorName: [null],
      printQtyObtained: [null],
      printSpecialInstructions: [null],
      coatScheduleDate: [null],
      coatLocation: [null],
      coatType: [null],
      coatOperatorName: [null],
      coatQtyObtained: [null],
      coatSpecialInstructions: [null],
      diecutScheduleDate: [null],
      diecutLocation: [null],
      diecutType: [null],
      diecutOperatorName: [null],
      diecutQtyObtained: [null],
      diecutSpecialInstructions: [null],
      imageUrl: [null],

    });
  }

  loadProofData(): void {
    if (this.productionOrderId) {
      this.dcsm08Service.getByProductionOrderId(this.productionOrderId).subscribe({
        next: (res) => {
          if (res) {
            this.proofForm.patchValue(res);
            if (!this.proofForm.get('deliveryDate')?.value) {
              this.proofForm.get('deliveryDate')?.setValue(this.mainForm.get('sampleDeliveryTimestamp')?.value?.substring(0, 10));
            }
          }
        },
        error: (err) => console.error('Error loading proof data', err)
      });
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  pullFromPap(): void {
    Swal.fire({
      title: 'กรอก OID PAP',
      input: 'text',
      inputLabel: 'OID จากระบบ PAP',
      inputPlaceholder: 'ระบุ OID...',
      showCancelButton: true,
      confirmButtonText: 'ดึงข้อมูล',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#1e1b4b',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.fetchPapData(result.value);
      }
    });
  }

  fetchPapData(oid: string): void {
    this.loadingService.show();
    this.papService.getJob(oid).subscribe({
      next: (response: any[]) => {
        this.loadingService.hide();
        if (response && response.length > 0) {
          if (response.length === 1) {
            this.selectJob(response[0]);
          } else {
            this.availableJobs = response;
            this.showJobModal = true;
          }
        } else {
          this.sweetAlert.warning('ไม่พบข้อมูลใน Pap สำหรับ OID นี้');
        }
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('เกิดข้อผิดพลาดในการดึงข้อมูลจาก Pap');
      }
    });
  }

  closeJobModal(): void {
    this.showJobModal = false;
    this.availableJobs = [];
  }

  selectJob(job: any): void {
    this.patchProofFormFromPap(job);
    this.closeJobModal();
  }

  private patchProofFormFromPap(res: any): void {
    if (!res) return;

    const header = res.header || {};
    const plate = res.platemaking || {};
    const cut = res.cutting || {};
    const paper = cut.paper || {};
    const print = res.printing || {};
    const coat = res.coating || {};
    const die = res.dieCutting || {};

    this.proofForm.patchValue({
      jobCode: header.jobCode,
      customerName: header.customerName,
      jobName: header.jobName,
      orderedBy: header.orderedBy,
      plateColorCount: plate.colors,
      plateScreenMesh: plate.screenDot,
      plateOtherDetails: plate.note,
      paperType: paper.type,
      paperCut: paper.cut,
      paperPrintSize: paper.printSize,
      paperPrintQty: paper.printQty,
      paperCutterName: cut.responsiblePerson,
      paperSpecialInstructions: cut.note,
      printScheduleDate: this.convertPapDate(print.scheduledDate),
      printLocation: print.machine,
      printCharacteristics: print.jobType,
      printSpecialInstructions: print.note,
      coatLocation: coat.location,
      coatType: coat.coatingPattern,
      coatScheduleDate: this.convertPapDate(coat.scheduledDate),
      coatSpecialInstructions: coat.note,
      diecutLocation: die.location,
      diecutType: die.dieCutType,
      diecutScheduleDate: this.convertPapDate(die.dieCutDeadline),
      diecutSpecialInstructions: die.note,
      imageUrl: header.imageUrl
    });
    this.sweetAlert.success('ดึงข้อมูลจาก Pap สำเร็จ');
  }

  private convertPapDate(dateStr: string): string | null {
    if (!dateStr || dateStr === '-' || dateStr.includes('แจ้งอีกที')) return null;

    // Handle dd/MM/yyyy
    if (dateStr.match(/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/) || dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        let year = parseInt(parts[2]);
        if (year > 2500) year -= 543; // BE to AD
        return `${year}-${month}-${day}`;
      }
    }
    return dateStr;
  }

  saveProofData(): void {
    if (this.proofForm.invalid) {
      this.sweetAlert.warning('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    const data = { ...this.proofForm.getRawValue(), productionOrderId: this.productionOrderId };
    this.dcsm08Service.saveProofOrder(data).subscribe({
      next: (res) => {
        this.loadingService.hide();
        this.proofForm.patchValue(res);
        this.sweetAlert.success('บันทึกข้อมูลปรู๊ฟสำเร็จ');
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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

  printReportProof() {
    this.loadingService.show();
    const data = {
      "reportName": "ProofReport",
      "proofId": this.proofForm.getRawValue().id,
    }

    this.dcsm08Service.printReport(data).subscribe({
      next: (response) => {
        this.loadingService.hide();
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        iframe.onload = () => {
          setTimeout(() => {
            iframe.contentWindow?.print();
          }, 100);
        };
        document.body.appendChild(iframe);
      },
      error: (err) => {
        console.error('Error printing report:', err);
        this.loadingService.hide
      }
    });
  }

  dowloadReportProof() {
    this.loadingService.show();
    const data = {
      "reportName": "ProofReport",
      "proofId": this.proofForm.getRawValue().id,
    }

    this.dcsm08Service.printReport(data).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ProofReport.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error printing report:', err);
        this.loadingService.hide();
      }
    });
  }

  jobHistory() {
    this.router.navigate(['/Dcsm37Detail', this.mainForm.getRawValue().reorderFromJoId]);
  }

  onSendForFinalInspection() {
    Swal.fire({
      title: 'ยืนยันส่งตรวจ',
      text: "ยืนยันส่งตรวจเพื่ออัปเดตข้อมูล ใช่หรือไม่?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('processStatus')?.setValue('เสร็จสิ้น รอตรวจสอบ');
        this.dcsm08Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.sweetAlert.success('ส่งตรวจสำเร็จ', 'ส่งข้อมูลไปให้ DCSM09 เรียบร้อยแล้ว');
            this.router.navigate(['/Dcsm08']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
          }
        });
      }
    });
  }
}
