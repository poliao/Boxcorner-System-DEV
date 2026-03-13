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
  selector: 'app-dcsm20-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './dcsm20-detail.component.html',
  styleUrl: './dcsm20-detail.component.scss'
})
export class Dcsm20DetailComponent implements OnInit {
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
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state || history.state;

    if (state?.referenceId) {
      this.referenceId = state.referenceId;
    }
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    this.initForm();
    const resolvedData = this.route.snapshot.data['productionOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
      this.jobImageUrl = this.productionForm.getRawValue().imageUrl
    }
    this.disableForm();
    this.checkButton();
  }

  checkButton() {
    if (this.productionForm.getRawValue().printingDate != null && this.productionForm.getRawValue().printStatus != 'กำลังพิมพ์' && this.productionForm.getRawValue().printStatus != 'กำลังเคลือบ' && this.productionForm.getRawValue().printStatus != 'กำลังปั้ม' && this.productionForm.getRawValue().printStatus != 'กำลังปะ' && this.productionForm.getRawValue().printStatus != 'ส่งQc' && this.productionForm.getRawValue().printStatus != 'กำลังQc' && this.productionForm.getRawValue().printStatus != 'เริ่มQc' && this.productionForm.getRawValue().printStatus != 'เสร็จสิ้น' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isPrint = true
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().coatingDate != null && this.productionForm.getRawValue().printStatus != 'กำลังปั้ม' && this.productionForm.getRawValue().printStatus != 'กำลังปะ' && this.productionForm.getRawValue().printStatus != 'ส่งQc' && this.productionForm.getRawValue().printStatus != 'กำลังQc' && this.productionForm.getRawValue().printStatus != 'เริ่มQc' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().printStatus != 'เสร็จสิ้น' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isCoating = true
      this.isPrint = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().stampingDate != null && this.productionForm.getRawValue().printStatus != 'กำลังปะ' && this.productionForm.getRawValue().printStatus != 'ส่งQc' && this.productionForm.getRawValue().printStatus != 'กำลังQc' && this.productionForm.getRawValue().printStatus != 'เริ่มQc' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().printStatus != 'เสร็จสิ้น' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isStamping = true
      this.isPrint = false
      this.isCoating = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().gluingDate != null && this.productionForm.getRawValue().printStatus != 'ส่งQc' && this.productionForm.getRawValue().printStatus != 'กำลังQc' && this.productionForm.getRawValue().printStatus != 'เริ่มQc' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().printStatus != 'เสร็จสิ้น' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isGluing = true
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().qcDate != null && this.productionForm.getRawValue().printStatus != 'กำลังQc' && this.productionForm.getRawValue().printStatus != 'เริ่มQc' && this.productionForm.getRawValue().printStatus != 'เสร็จสิ้น' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isQc = true
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
    } else if (this.productionForm.getRawValue().id != null  && this.productionForm.getRawValue().printStatus == 'เสร็จสิ้น' && this.productionForm.getRawValue().deliveryStatus != 'รอที่อยู่จัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = true
      this.isWaitDelivery = true
      this.isDelivery = false
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().id != null && this.productionForm.getRawValue().printStatus == 'เสร็จสิ้น' && this.productionForm.getRawValue().deliveryStatus != 'รอจัดส่ง' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
      this.isAddress = false
      this.isWaitDelivery = true
      this.isDelivery = false
      this.isDeliveryComplete = false
      this.isPrint = false
      this.isCoating = false
      this.isStamping = false
      this.isGluing = false
      this.isQc = false
    } else if (this.productionForm.getRawValue().id != null && this.productionForm.getRawValue().printStatus == 'เสร็จสิ้น' && this.productionForm.getRawValue().deliveryStatus != 'กำลังส่ง' && this.productionForm.getRawValue().deliveryStatus != 'จัดส่งเรียบร้อย') {
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
      printingLocation: [''],
      coatingDate: [null],
      coatingResponsible: [''],
      coatingLocation: [''],
      stampingDate: [null],
      stampingResponsible: [''],
      stampingLocation: [''],
      gluingDate: [null],
      gluingResponsible: [''],
      gluingLocation: [''],
      qcDate: [null],
      dueDate: ['', Validators.required],
      printStatus: [''],
      shippingAddress: [''],
      remark: [''],
      deliveryStatus: [''],
      machineSetupCount: [''],
      imageUrl: [null],
      papOrderId: [null],
      rowVersion: [null]
    });
    this.productionForm.get('printStatus')?.disable();
    this.productionForm.get('deliveryStatus')?.disable();
    this.productionForm.get('printingResponsible')?.disable();
    this.productionForm.get('printingLocation')?.disable();
    this.productionForm.get('coatingResponsible')?.disable();
    this.productionForm.get('stampingResponsible')?.disable();
    this.productionForm.get('gluingResponsible')?.disable();
    this.productionForm.get('machineSetupCount')?.disable();

    // เพิ่ม listener สำหรับ printingDate
    this.productionForm.get('printingDate')?.valueChanges.subscribe(value => {
      if (value) {
        this.productionForm.get('printingResponsible')?.setValidators([Validators.required]);
        this.productionForm.get('printingResponsible')?.enable();
        this.productionForm.get('printingLocation')?.enable();
      } else {
        this.productionForm.get('printingResponsible')?.clearValidators();
        this.productionForm.get('printingResponsible')?.setValue(null);
        this.productionForm.get('printingResponsible')?.disable();
        this.productionForm.get('printingLocation')?.setValue(null);
        this.productionForm.get('printingLocation')?.disable();
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
      // this.productionForm.get('printingResponsible')?.disable();
      // this.productionForm.get('coatingResponsible')?.disable();
      // this.productionForm.get('stampingResponsible')?.disable();
      // this.productionForm.get('gluingResponsible')?.disable();
      this.productionForm.get('printStatus')?.disable();
      if (this.productionForm.getRawValue().qcDate == null) {
        this.productionForm.get('qcDate')?.disable();
      }
      if (this.productionForm.getRawValue().printingDate == null) {
        this.productionForm.get('printingDate')?.disable();
        this.productionForm.get('printingResponsible')?.disable();
      }
      if (this.productionForm.getRawValue().coatingDate == null) {
        this.productionForm.get('coatingDate')?.disable();
        this.productionForm.get('coatingResponsible')?.disable();
      }
      if (this.productionForm.getRawValue().stampingDate == null) {
        this.productionForm.get('stampingDate')?.disable();
        this.productionForm.get('stampingResponsible')?.disable();
      }
      if (this.productionForm.getRawValue().gluingDate == null) {
        this.productionForm.get('gluingDate')?.disable();
        this.productionForm.get('gluingResponsible')?.disable();
      }
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
      Swal.fire({
        title: 'บันทึกข้อมูล',
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
          this.dcsm20Service.save(data).subscribe((response) => {
            this.patchFormData(response);
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
            this.router.navigate(['/Dcsm20']);
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
          if (status === 'Qc') {
            this.sweetAlert.input('ยอดก่อน QC', 'กรุณากรอกจำนวนยอดก่อน QC', 'number').then((res) => {
              if (res.isConfirmed && res.value) {
                const qty = parseInt(res.value, 10);
                this.productionForm.get('printStatus')?.setValue('กำลังQc');
                this.saveQcJob(qty);
                this.performStatusUpdate();
              }
            });
          } else {
            this.loadingService.show();
            if (status === 'Print') {
              if (this.productionForm.getRawValue().coatingDate != null) {
                this.productionForm.get('printStatus')?.setValue('กำลังเคลือบ');
              } else if (this.productionForm.getRawValue().stampingDate != null) {
                this.productionForm.get('printStatus')?.setValue('กำลังปั้ม');
              } else if (this.productionForm.getRawValue().gluingDate != null) {
                this.productionForm.get('printStatus')?.setValue('กำลังปะ');
              } else if (this.productionForm.getRawValue().qcDate != null) {
                this.productionForm.get('printStatus')?.setValue('ส่งQc');
              } else {
                this.productionForm.get('printStatus')?.setValue('เสร็จสิ้น');
              }
            } else if (status === 'Coating') {
              if (this.productionForm.getRawValue().stampingDate != null) {
                this.productionForm.get('printStatus')?.setValue('กำลังปั้ม');
              } else if (this.productionForm.getRawValue().gluingDate != null) {
                this.productionForm.get('printStatus')?.setValue('กำลังปะ');
              } else if (this.productionForm.getRawValue().qcDate != null) {
                this.productionForm.get('printStatus')?.setValue('ส่งQc');
              } else {
                this.productionForm.get('printStatus')?.setValue('เสร็จสิ้น');
              }
            } else if (status === 'Stamping') {
              if (this.productionForm.getRawValue().gluingDate != null) {
                this.productionForm.get('printStatus')?.setValue('กำลังปะ');
              } else if (this.productionForm.getRawValue().qcDate != null) {
                this.productionForm.get('printStatus')?.setValue('ส่งQc');
              } else {
                this.productionForm.get('printStatus')?.setValue('เสร็จสิ้น');
              }
            } else if (status === 'Gluing') {
              if (this.productionForm.getRawValue().qcDate != null) {
                this.productionForm.get('printStatus')?.setValue('ส่งQc');
              } else {
                this.productionForm.get('printStatus')?.setValue('เสร็จสิ้น');
              }
            } else if (status === 'Address') {
              this.productionForm.get('deliveryStatus')?.setValue('รอที่อยู่จัดส่ง');
            } else if (status === 'WaitDelivery') {
              this.productionForm.get('deliveryStatus')?.setValue('รอจัดส่ง');
            } else if (status === 'Delivery') {
              this.productionForm.get('deliveryStatus')?.setValue('กำลังส่ง');
            } else if (status === 'DeliveryComplete') {
              this.productionForm.get('deliveryStatus')?.setValue('จัดส่งเรียบร้อย');
            }
            this.performStatusUpdate();
          }
        }
      });
    } else {
      this.markFormGroupTouched();
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  performStatusUpdate(): void {
    const data = this.productionForm.getRawValue();
    this.loadingService.show();
    this.dcsm20Service.save(data).subscribe((response) => {
      this.patchFormData(response);
      this.disableForm();
      this.checkButton();
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'ยืนยันอัพเดตสถานะ!');
    });
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
      this.productionForm.get('printingResponsible')?.setValue(response.form_data.printer === '-' ? null : response.form_data.printer);
      this.productionForm.get('coatingDate')?.setValue(response.form_data.d_coat === '-' ? null : this.convertDateFormat(response.form_data.d_coat));
      this.productionForm.get('coatingResponsible')?.setValue(response.form_data.l_coat === '-' ? null : response.form_data.l_coat);
      this.productionForm.get('stampingDate')?.setValue(response.form_data.d_daicut === '-' ? null : this.convertDateFormat(response.form_data.d_daicut));
      this.productionForm.get('stampingResponsible')?.setValue(response.form_data.l_pcut === '-' ? null : response.form_data.l_pcut);
      this.productionForm.get('gluingDate')?.setValue(response.form_data.d_pa === '-' ? null : this.convertDateFormat(response.form_data.d_pa));
      this.productionForm.get('gluingResponsible')?.setValue(response.form_data.l_pa === '-' ? null : response.form_data.l_pa);
      this.productionForm.get('qcDate')?.setValue(response.form_data.d_qc === '-' ? null : this.convertDateFormat(response.form_data.d_qc));
      this.productionForm.get('imageUrl')?.setValue(response.form_data.image_url === '-' ? null : response.form_data.image_url);

      this.jobImageUrl = response.header.image_url || '';
      this.loadingService.hide();
    })

  }

  private convertDateFormat(dateStr: string): string {
    if (!dateStr || dateStr === '-') return '';

    // แปลงจาก "27/01/2026" หรือ "28/01/26" เป็น "2026-01-27"
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        let year = parts[2];

        // จัดการปีสั้น (YY)
        if (year.length === 2) {
          const yearNum = parseInt(year);
          // ถ้า <= 50 ถือว่าเป็น 20xx, ถ้า > 50 ถือว่าเป็น 19xx
          year = yearNum <= 50 ? `20${year}` : `25${year}`;
        }

        // ตรวจสอบว่าเป็นปีพุทธศักราชหรือคริสต์ศักราช
        const yearNum = parseInt(year);
        const convertedYear = yearNum > 2500 ? (yearNum - 543).toString() : year;

        return `${convertedYear}-${month}-${day}`;
      }
    }

    // แปลงจาก "29 ม.ค. 2569" เป็น "2026-01-29"
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

  saveQcJob(receivedQty: number) {
    this.loadingService.show();
    const data = {
      status: 'PENDING',
      joId: this.productionForm.getRawValue().jobId,
      jobName: this.productionForm.getRawValue().customerJobName,
      responsibleName: 'PENDING',
      deliveryDatetime: this.productionForm.getRawValue().qcDate,
      productJobId: this.productionForm.getRawValue().id,
      papOrderId: this.productionForm.getRawValue().papOrderId,
      receivedQty: receivedQty
    }
    this.dcsm20Service.saveQcJob(data).subscribe((response) => {
      this.loadingService.hide();
    })
  }


}
