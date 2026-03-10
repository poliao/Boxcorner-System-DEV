import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm20Service } from './dcsm20.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { Dcsm09Service } from '../dcsm09/dcsm09.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dcsm20-detail-status.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './dcsm20-detail-status.component.html',
  styleUrl: './dcsm20-detail-status.component.scss'
})
export class Dcsm20DetailStatusComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  papOrder: any;
  productionForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  pid: string | null = null;
  isPrint = false;
  isCoating = false;
  isStamping = false;
  isGluing = false;
  isQc = false;
  isAddress = false;
  isWaitDelivery = false;
  isDelivery = false;
  isDeliveryComplete = false;
  jobImageUrl: string = '';
  isCreate = false;
  referenceId: any
  decisionAuthority: string = null;
  decisionAuthorityRemarks: string = null;
  print2Page = false

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm20Service: Dcsm20Service,
    private dcsm09Service: Dcsm09Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  formatDateThai(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state || history.state;

    if (state?.referenceId) {
      this.referenceId = state.referenceId;
      this.decisionAuthority = state.decisionAuthority;
      this.decisionAuthorityRemarks = state.decisionAuthorityRemarks;
      this.print2Page = state.print2Page;
    }
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    this.initForm();
    this.disableForm();
    this.checkButton();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkButton(): void {
    const rawValue = this.productionForm.getRawValue();
    const printStatus = rawValue.printStatus;
    const deliveryStatus = rawValue.deliveryStatus;

    // Condition helpers
    const notPrinted = !['พิมพ์แล้ว', 'เคลือบแล้ว', 'ปั้มแล้ว', 'ปะแล้ว', 'Qcแล้ว'].includes(printStatus);
    const notCoated = !['เคลือบแล้ว', 'ปั้มแล้ว', 'ปะแล้ว', 'Qcแล้ว'].includes(printStatus);
    const notStamped = !['ปั้มแล้ว', 'ปะแล้ว', 'Qcแล้ว'].includes(printStatus);
    const notGlued = !['ปะแล้ว', 'Qcแล้ว'].includes(printStatus);
    const notQc = printStatus !== 'Qcแล้ว';

    const notAddress = !['รอที่อยู่จัดส่ง', 'รอจัดส่ง', 'กำลังส่ง', 'จัดส่งเรียบร้อย'].includes(deliveryStatus);
    const notWaitDelivery = !['รอจัดส่ง', 'กำลังส่ง', 'จัดส่งเรียบร้อย'].includes(deliveryStatus);
    const notDelivery = !['กำลังส่ง', 'จัดส่งเรียบร้อย'].includes(deliveryStatus);
    const notDeliveryComplete = deliveryStatus !== 'จัดส่งเรียบร้อย';

    // Reset flags
    this.isPrint = false;
    this.isCoating = false;
    this.isStamping = false;
    this.isGluing = false;
    this.isQc = false;
    this.isAddress = false;
    this.isWaitDelivery = false;
    this.isDelivery = false;
    this.isDeliveryComplete = false;

    if (rawValue.printingDate != null && notPrinted && notAddress) {
      this.isPrint = true;
    } else if (rawValue.coatingDate != null && notCoated && notAddress) {
      this.isCoating = true;
    } else if (rawValue.stampingDate != null && notStamped && notAddress) {
      this.isStamping = true;
    } else if (rawValue.gluingDate != null && notGlued && notAddress) {
      this.isGluing = true;
    } else if (rawValue.qcDate != null && notQc && notAddress) {
      this.isQc = true;
    } else if (rawValue.id != null && notAddress) {
      this.isAddress = true;
      this.isWaitDelivery = true;
    } else if (rawValue.id != null && notWaitDelivery) {
      this.isWaitDelivery = true;
    } else if (rawValue.id != null && notDelivery) {
      this.isDelivery = true;
    } else if (rawValue.id != null && notDeliveryComplete) {
      this.isDeliveryComplete = true;
    }
  }

  initForm(): void {
    this.productionForm = this.fb.group({
      id: [null],
      oidPap: [null],
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
      papOrderId: [null]
    });
    this.productionForm.get('printStatus')?.disable();
    this.productionForm.get('deliveryStatus')?.disable();
    this.productionForm.get('printingResponsible')?.disable();
    this.productionForm.get('coatingResponsible')?.disable();
    this.productionForm.get('stampingResponsible')?.disable();
    this.productionForm.get('gluingResponsible')?.disable();

    const dependencies = [
      { dateCtrl: 'printingDate', respCtrl: 'printingResponsible' },
      { dateCtrl: 'coatingDate', respCtrl: 'coatingResponsible' },
      { dateCtrl: 'stampingDate', respCtrl: 'stampingResponsible' },
      { dateCtrl: 'gluingDate', respCtrl: 'gluingResponsible' },
    ];

    dependencies.forEach(dep => {
      this.productionForm.get(dep.dateCtrl)?.valueChanges.pipe(
        takeUntil(this.destroy$)
      ).subscribe(value => {
        const respControl = this.productionForm.get(dep.respCtrl);
        if (value) {
          respControl?.setValidators([Validators.required]);
          respControl?.enable();
        } else {
          respControl?.clearValidators();
          respControl?.setValue(null);
          respControl?.disable();
        }
        respControl?.updateValueAndValidity();
      });
    });
  }

  disableForm(): void {
    if (this.productionForm.getRawValue().id != null) {
      const controlsToDisable = [
        'date', 'jobId', 'customerJobName', 'printQuantity', 'productionQuantity',
        'printingDate', 'printingResponsible', 'coatingDate', 'coatingResponsible',
        'stampingDate', 'stampingResponsible', 'gluingDate', 'gluingResponsible',
        'qcDate', 'dueDate', 'printStatus'
      ];
      controlsToDisable.forEach(ctrl => this.productionForm.get(ctrl)?.disable());
    } else {
      this.isCreate = true;
    }
  }

  patchFormData(data: any): void {
    this.productionForm.patchValue(data);
  }

  onSubmit(): void {
    if (this.productionForm.valid) {
      const apiFilters = {
        id: this.referenceId,
        dataDalivery: true
      };

      Swal.fire({
        title: 'บันทึกข้อมูล',
        text: "ยืนยันบันทึกข้อมูล ใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e1b4b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.dcsm20Service.savePapOrder(this.papOrder).subscribe((responsePap) => {
            this.dcsm20Service.save(this.productionForm.getRawValue()).subscribe((response) => {
              this.checkJob(response.id, responsePap)
              this.dcsm20Service.updateDataDalivery(apiFilters).subscribe(() => {
                this.patchFormData(response);
                this.loadingService.hide();
                this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
                this.router.navigate(['/Dcsm09Detail', this.referenceId]);
              });
            })
          })
        }
      });
    } else {
      this.markFormGroupTouched();
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  onCancel(): void {
    this.router.navigate(['/Dcsm20']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productionForm.controls).forEach(key => {
      const control = this.productionForm.get(key);
      control?.markAsTouched();
    });
  }

  onUpdatePrint(status: string): void {
    if (this.productionForm.valid) {
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
            this.productionForm.get('printStatus')?.setValue('พิมพ์แล้ว');
          } else if (status === 'Coating') {
            this.productionForm.get('printStatus')?.setValue('เคลือบแล้ว');
          } else if (status === 'Stamping') {
            this.productionForm.get('printStatus')?.setValue('ปั้มแล้ว');
          } else if (status === 'Gluing') {
            this.productionForm.get('printStatus')?.setValue('ปะแล้ว');
          } else if (status === 'Qc') {
            this.productionForm.get('printStatus')?.setValue('Qcแล้ว');
          } else if (status === 'Address') {
            this.productionForm.get('deliveryStatus')?.setValue('รอที่อยู่จัดส่ง');
          } else if (status === 'WaitDelivery') {
            this.productionForm.get('deliveryStatus')?.setValue('รอจัดส่ง');
          } else if (status === 'Delivery') {
            this.productionForm.get('deliveryStatus')?.setValue('กำลังส่ง');
          } else if (status === 'DeliveryComplete') {
            this.productionForm.get('deliveryStatus')?.setValue('จัดส่งเรียบร้อย');
          }
          const data = this.productionForm.getRawValue();

          this.dcsm20Service.save(data).subscribe((response) => {
            this.patchFormData(response);
            this.disableForm();
            this.checkButton();
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

  onFetchData(): void {
    this.loadingService.show();
    const oidPapValue = this.productionForm.get('oidPap')?.value;
    this.dcsm20Service.getJobPAP(oidPapValue).subscribe((response) => {
      this.setFrom(response)
      this.papOrder = response
    })

    this.loadingService.hide();
  }

  private convertDateFormat(dateStr: string): string {
    if (!dateStr || dateStr === '-') return '';

    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
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

    const parts = dateStr.trim().split(' ');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = thaiMonths[parts[1]];
      const year = (parseInt(parts[2]) - 543).toString();

      if (month && year) {
        return `${year}-${month}-${day}`;
      }
    }

    return dateStr;
  }

  checkJob(id, response) {
    const printingDate = this.productionForm.getRawValue().printingDate;
    const coatingDate = this.productionForm.getRawValue().coatingDate;
    const stampingDate = this.productionForm.getRawValue().stampingDate;
    const gluingDate = this.productionForm.getRawValue().gluingDate;
    const qcDate = this.productionForm.getRawValue().qcDate;

    if (printingDate && printingDate !== '' && printingDate !== null) {
      this.setPrintJob(id, response);
    } else if (coatingDate && coatingDate !== '' && coatingDate !== null) {
      this.setCoatJob(id);
    } else if (stampingDate && stampingDate !== '' && stampingDate !== null) {
      this.setStampingJob(id);
    } else if (gluingDate && gluingDate !== '' && gluingDate !== null) {
      this.setGluingJob(id);
    } else if (qcDate && qcDate !== '' && qcDate !== null) {
      this.setQcJob(id);
    }
  }

  setFrom(response) {
    this.productionForm.get('jobId')?.setValue(response.header.jobCode);
    this.productionForm.get('customerJobName')?.setValue(response.header.jobName + ' - ' + response.header.customerName);
    this.productionForm.get('dueDate')?.setValue(this.convertDateFormat(response.header.deliveryDate));
    this.productionForm.get('printQuantity')?.setValue(response.cutting.paper.printQty);
    this.productionForm.get('productionQuantity')?.setValue(response.header.totalPrintQty);
    this.productionForm.get('printingDate')?.setValue(response.printing.scheduledDate === '-' ? null : this.convertDateFormat(response.printing.scheduledDate));
    this.productionForm.get('printingResponsible')?.setValue(response.printing.machine === '-' ? null : (response.printing.machine === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : response.printing.machine));
    this.productionForm.get('coatingDate')?.setValue(response.coating.scheduledDate === '-' ? null : this.convertDateFormat(response.coating.scheduledDate));
    this.productionForm.get('coatingResponsible')?.setValue(response.coating.location === '-' ? null : (response.coating.location === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : response.coating.location));
    this.productionForm.get('stampingDate')?.setValue(response.dieCutting.dieCutDeadline === '-' ? null : this.convertDateFormat(response.dieCutting.dieCutDeadline));
    this.productionForm.get('stampingResponsible')?.setValue(response.dieCutting.location === '-' ? null : (response.dieCutting.location === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : response.dieCutting.location));
    this.productionForm.get('gluingDate')?.setValue(response.gluing.scheduledDate === '-' ? null : this.convertDateFormat(response.gluing.scheduledDate));
    this.productionForm.get('gluingResponsible')?.setValue(response.gluing.location === '-' ? null : (response.gluing.location === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : response.gluing.location));
    this.productionForm.get('qcDate')?.setValue(response.qcAndDelivery.scheduledDate === '-' ? null : this.convertDateFormat(response.qcAndDelivery.scheduledDate));
    this.productionForm.get('imageUrl')?.setValue(response.header.imageUrl === '-' ? null : response.header.imageUrl);
    this.productionForm.get('machineSetupCount')?.setValue(response.cutting.paper.machineSetup === '-' ? null : response.cutting.paper.machineSetup);
    this.jobImageUrl = response.header.imageUrl || '';
    this.loadingService.hide();
  }

  setPrintJob(id: any, response: any) {
    const DataJob = {
      id: null,
      createdAt: new Date(),
      jobId: response.jobCode,
      deliveryDate: this.productionForm.getRawValue().printingDate,
      customerJobName: response.jobName + ':' + response.customerName,
      jobStatus: null,
      totalPrintSheets: response.cutPaperPrintQty,
      productionQty: response.totalPrintQty,
      printerName: response.printMachine,
      setupWaste: response.cutPaperMachineSetup,
      issample: false,
      jobType: null,
      printType: null,
      paperType: null,
      diecuttingType: null,
      coatType: null,
      systemPrint: null,
      colorPrint: null,
      paperGram: null,
      sampleId: null,
      productionJobId: id,
      productionOrderId: this.referenceId,
      decisionAuthority: this.decisionAuthority,
      decisionAuthorityRemarks: this.decisionAuthorityRemarks,
      print2Page: this.print2Page,
      papOrderId: response.id,
    }
    this.dcsm20Service.savePrintJob(DataJob).subscribe({
      next: (response) => {
      }
    })
  }


  setCoatJob(id) {
  }

  setStampingJob(id) {
  }

  setGluingJob(id) {
  }

  setQcJob(id) {
  }
}
