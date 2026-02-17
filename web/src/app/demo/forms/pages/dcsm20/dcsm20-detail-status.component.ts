import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-dcsm20-detail-status.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './dcsm20-detail-status.component.html',
  styleUrl: './dcsm20-detail-status.component.scss'
})

export class Dcsm20DetailStatusComponent implements OnInit {
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
    }
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    this.initForm();
    this.disableForm();
    this.checkButton();
  }

  checkButton() {
    if (this.productionForm.getRawValue().printingDate != null && this.productionForm.getRawValue().printStatus != 'พิมพ์แล้ว' && this.productionForm.getRawValue().printStatus != 'เคลือบแล้ว' && this.productionForm.getRawValue().printStatus != 'ปั้มแล้ว' && this.productionForm.getRawValue().printStatus != 'ปะแล้ว' && this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isPrint = true
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().coatingDate != null && this.productionForm.getRawValue().printStatus != 'เคลือบแล้ว' && this.productionForm.getRawValue().printStatus != 'ปั้มแล้ว' && this.productionForm.getRawValue().printStatus != 'ปะแล้ว' && this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isCoating = true
      this.isPrint = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().stampingDate != null && this.productionForm.getRawValue().printStatus != 'ปั้มแล้ว' && this.productionForm.getRawValue().printStatus != 'ปะแล้ว' && this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isStamping = true
      this.isPrint = false
      this.isCoating = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().gluingDate != null && this.productionForm.getRawValue().printStatus != 'ปะแล้ว' && this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isGluing = true
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().qcDate != null && this.productionForm.getRawValue().printStatus != 'Qcแล้ว' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isQc = true
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
    } else if (this.productionForm.getRawValue().id != null && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = true
      this.isWaitDelivery = true
      this.isDelivery = false
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().id != null && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = false
      this.isWaitDelivery = true
      this.isDelivery = false
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().id != null && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = false
      this.isWaitDelivery = false
      this.isDelivery = true
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().id != null && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = false
      this.isWaitDelivery = false
      this.isDelivery = false
      this.isDeliveryComplete = true
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else {
      this.isAddress = false
      this.isWaitDelivery = false
      this.isDelivery = false
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
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
      rowVersion: [null]
    });
    this.productionForm.get('printStatus')?.disable();
    this.productionForm.get('deliveryStatus')?.disable();
    this.productionForm.get('printingResponsible')?.disable();
    this.productionForm.get('coatingResponsible')?.disable();
    this.productionForm.get('stampingResponsible')?.disable();
    this.productionForm.get('gluingResponsible')?.disable();

    this.productionForm.get('printingDate')?.valueChanges.subscribe(value => {
      if (value) {
        this.productionForm.get('printingResponsible')?.setValidators([Validators.required]);
        this.productionForm.get('printingResponsible')?.enable();
      } else {
        this.productionForm.get('printingResponsible')?.clearValidators();
        this.productionForm.get('printingResponsible')?.setValue(null);
        this.productionForm.get('printingResponsible')?.disable();
      }
      this.productionForm.get('printingResponsible')?.updateValueAndValidity();
    });
    this.productionForm.get('coatingDate')?.valueChanges.subscribe(value => {
      if (value) {
        this.productionForm.get('coatingResponsible')?.setValidators([Validators.required]);
        this.productionForm.get('coatingResponsible')?.enable();
      } else {
        this.productionForm.get('coatingResponsible')?.clearValidators();
        this.productionForm.get('coatingResponsible')?.setValue(null);
        this.productionForm.get('coatingResponsible')?.disable();
      }
      this.productionForm.get('coatingResponsible')?.updateValueAndValidity();
    });
    this.productionForm.get('stampingDate')?.valueChanges.subscribe(value => {
      if (value) {
        this.productionForm.get('stampingResponsible')?.setValidators([Validators.required]);
        this.productionForm.get('stampingResponsible')?.enable();
      } else {
        this.productionForm.get('stampingResponsible')?.clearValidators();
        this.productionForm.get('stampingResponsible')?.setValue(null);
        this.productionForm.get('stampingResponsible')?.disable();
      }
      this.productionForm.get('stampingResponsible')?.updateValueAndValidity();
    });
    this.productionForm.get('gluingDate')?.valueChanges.subscribe(value => {
      if (value) {
        this.productionForm.get('gluingResponsible')?.setValidators([Validators.required]);
        this.productionForm.get('gluingResponsible')?.enable();
      } else {
        this.productionForm.get('gluingResponsible')?.clearValidators();
        this.productionForm.get('gluingResponsible')?.setValue(null);
        this.productionForm.get('gluingResponsible')?.disable();
      }
      this.productionForm.get('gluingResponsible')?.updateValueAndValidity();
    });
  }

  disableForm(): void {
    if (this.productionForm.getRawValue().id != null) {
      this.productionForm.get('date')?.disable();
      this.productionForm.get('jobId')?.disable();
      this.productionForm.get('customerJobName')?.disable();
      this.productionForm.get('printQuantity')?.disable();
      this.productionForm.get('productionQuantity')?.disable();
      this.productionForm.get('printingDate')?.disable();
      this.productionForm.get('printingResponsible')?.disable();
      this.productionForm.get('coatingDate')?.disable();
      this.productionForm.get('coatingResponsible')?.disable();
      this.productionForm.get('stampingDate')?.disable();
      this.productionForm.get('stampingResponsible')?.disable();
      this.productionForm.get('gluingDate')?.disable();
      this.productionForm.get('gluingResponsible')?.disable();
      this.productionForm.get('qcDate')?.disable();
      this.productionForm.get('dueDate')?.disable();
      this.productionForm.get('printStatus')?.disable();
    } else {
      this.isCreate = true
    }
  }

  patchFormData(data: any): void {
    this.productionForm.patchValue(data);
  }

  onSubmit(): void {
    if (this.productionForm.valid) {
      const data = this.productionForm.getRawValue();
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
          this.dcsm20Service.save(data).subscribe((response) => {
            this.checkJob(response.id)
            this.dcsm20Service.updateDataDalivery(apiFilters).subscribe(() => {
              this.patchFormData(response);
              this.loadingService.hide();
              this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
              this.router.navigate(['/Dcsm09Detail', this.referenceId]);
            });
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
      this.loadingService.show();
      this.productionForm.get('jobId')?.setValue(response.header.job_code);
      this.productionForm.get('customerJobName')?.setValue(response.header.job_name + ' - ' + response.header.customer_name);
      this.productionForm.get('dueDate')?.setValue(this.convertDateFormat(response.header.delivery_date));
      this.productionForm.get('printQuantity')?.setValue(response.header.print_sheets);
      this.productionForm.get('productionQuantity')?.setValue(response.header.quantity);
      this.productionForm.get('printingDate')?.setValue(response.form_data.d_print === '-' ? null : this.convertDateFormat(response.form_data.d_print));
      this.productionForm.get('printingResponsible')?.setValue(response.form_data.printer === '-' ? null : (response.form_data.printer === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : response.form_data.printer));
      this.productionForm.get('coatingDate')?.setValue(response.form_data.d_coat === '-' ? null : this.convertDateFormat(response.form_data.d_coat));
      this.productionForm.get('coatingResponsible')?.setValue(response.form_data.l_coat === '-' ? null : (response.form_data.l_coat === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : response.form_data.l_coat));
      this.productionForm.get('stampingDate')?.setValue(response.form_data.d_daicut === '-' ? null : this.convertDateFormat(response.form_data.d_daicut));
      this.productionForm.get('stampingResponsible')?.setValue(response.form_data.l_pcut === '-' ? null : (response.form_data.l_pcut === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : response.form_data.l_pcut));
      this.productionForm.get('gluingDate')?.setValue(response.form_data.d_pa === '-' ? null : this.convertDateFormat(response.form_data.d_pa));
      this.productionForm.get('gluingResponsible')?.setValue(response.form_data.l_pa === '-' ? null : (response.form_data.l_pa === 'บ็อกซ์คอร์เนอร์อาร์ต' ? 'BCA' : response.form_data.l_pa));
      this.productionForm.get('qcDate')?.setValue(response.form_data.d_qc === '-' ? null : this.convertDateFormat(response.form_data.d_qc));
      this.productionForm.get('imageUrl')?.setValue(response.header.image_url === '-' ? null : response.header.image_url);
      this.productionForm.get('machineSetupCount')?.setValue(response.header.machine_setup_count === '-' ? null : response.header.machine_setup_count);
      this.jobImageUrl = response.header.image_url || '';
      this.loadingService.hide();
    })
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

  checkJob(id) {
    const printingDate = this.productionForm.getRawValue().printingDate;
    const coatingDate = this.productionForm.getRawValue().coatingDate;
    const stampingDate = this.productionForm.getRawValue().stampingDate;
    const gluingDate = this.productionForm.getRawValue().gluingDate;
    const qcDate = this.productionForm.getRawValue().qcDate;

    if(printingDate && printingDate !== '' && printingDate !== null){
      this.setPrintJob(id);
    }else if(coatingDate && coatingDate !== '' && coatingDate !== null){
      this.setCoatJob(id);
    }else if(stampingDate && stampingDate !== '' && stampingDate !== null){
      this.setStampingJob(id);
    }else if(gluingDate && gluingDate !== '' && gluingDate !== null){
      this.setGluingJob(id);
    }else if(qcDate && qcDate !== '' && qcDate !== null){
      this.setQcJob(id);
    }
  }

  setPrintJob(id) {
    const DataJob = {
      id: null,
      createdAt: new Date(),
      jobId: this.productionForm.getRawValue().jobId,
      deliveryDate: this.productionForm.getRawValue().printingDate,
      customerJobName: this.productionForm.getRawValue().customerJobName,
      jobStatus: null,
      totalPrintSheets: this.productionForm.getRawValue().printQuantity,
      productionQty: this.productionForm.getRawValue().productionQuantity,
      printerName: this.productionForm.getRawValue().printingResponsible,
      setupWaste: this.productionForm.getRawValue().machineSetupCount,
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
      productionOrderId: this.referenceId
    }
    this.dcsm20Service.savePrintJob(DataJob).subscribe({
      next: (response) => {
      }
    })
  }

  setCoatJob(id){

  }

  setStampingJob(id){
    
  }

  setGluingJob(id){
    
  }

  setQcJob(id){
    
  }
}
