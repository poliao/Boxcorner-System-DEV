import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm06Service } from './dcsm06.service';
import { Dcsm04Service } from '../dcsm04/dcsm04.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-dcsm06-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm06-detail.component.html',
  styleUrl: './dcsm06-detail.component.scss'
})
export class Dcsm06DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isSampleOrderId = false
  isSave = false
  isPostPone = false
  isCancelRemarks = false

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm06Service: Dcsm06Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private authService: AuthService,
    private dcsm04Service: Dcsm04Service,
  ) { }

  ngOnInit(): void {
    this.initForm();
    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.isEditMode = true;
      this.patchFormData(resolvedData);
    }

    if (resolvedData) {
      if (resolvedData.postpone == 'มีการเลื่อนเวลาส่ง') {
        this.isPostPone = true
      }
    }

    if (this.mainForm.getRawValue().sampleOrderId != null && this.mainForm.getRawValue().sampleOrderId != '') {
      this.isSampleOrderId = true
    } else {
      this.isSampleOrderId = false
    }

    if (this.mainForm.getRawValue().cancelRemarks != null && this.mainForm.getRawValue().cancelRemarks != '') {
      this.isCancelRemarks = true
    }

    if (this.mainForm.getRawValue().id == null || this.mainForm.getRawValue().id == '' || (this.mainForm.getRawValue().jobStatus == 'รอผู้รับผิดชอบยืนยัน' && this.authService.getUserFromToken().sub == this.mainForm.getRawValue().jobOwner)) {
      this.mainForm.get('usedFile')?.enable();
      this.mainForm.get('colorSample')?.enable();
      this.mainForm.get('deadlineDate')?.enable();
      this.mainForm.get('deadlineTime')?.enable();
      this.mainForm.get('folderName')?.enable();
      this.mainForm.get('remarks')?.enable();
      this.mainForm.get('customerName')?.enable();
      this.mainForm.get('decisionAuthority')?.enable();
      this.mainForm.get('decisionAuthorityRemarks')?.enable();
      this.mainForm.get('print2Page')?.enable();
      this.mainForm.get('jobId')?.enable();
      this.mainForm.get('qtId')?.enable();
      this.mainForm.get('qpId')?.enable();
      this.mainForm.get('sampleJobType')?.enable();
      this.mainForm.get('samplePrintingSystem')?.enable();
      this.mainForm.get('samplePrintingStyle')?.enable();
      this.mainForm.get('samplePrintingColor')?.enable();
      this.mainForm.get('samplePaperSize')?.enable();
      this.mainForm.get('samplePaperGrammage')?.enable();
      this.mainForm.get('sampleCoatingStyle')?.enable();
      this.mainForm.get('sampleDiecutStyle')?.enable();
      this.mainForm.get('sampleSpecialInstructions')?.enable();
      this.mainForm.get('sampleDeliveryTimestamp')?.enable();
      this.isSave = true
    }
  }

  initForm(): void {
    this.mainForm = this.fb.group({
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      usedFile: ['', Validators.required],
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
      sampleOrderId: [''],
      moldMakerName: [''],
      printingMachine: [''],
      inspector: [''],
      customerName: [''],
      cancelRemarks: [''],
      dataDalivery: [false],
      postpone: [null],
      rowVersion: [null],
      decisionAuthority: [null, Validators.required],
      decisionAuthorityRemarks: [null],
      print2Page: [false],
      jobId: [null, Validators.required],
      qtId: [null],
      qpId: [null],
      createdTime: [null],
      qcType: [null],
      qcLocation: [null],
      searchId: [null],
      sampleJobType: [''],
      samplePrintingSystem: [''],
      samplePrintingStyle: [''],
      samplePrintingColor: [''],
      samplePaperSize: [''],
      samplePaperGrammage: [''],
      sampleCoatingStyle: [''],
      sampleDiecutStyle: [''],
      sampleSpecialInstructions: [''],
      sampleDeliveryTimestamp: [''],
      printRound: [null],
      printRoundPage2: [null],
    });
    this.mainForm.get('sampleOrderId')?.disable();
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
    this.mainForm.get('moldMakerName')?.disable({ emitEvent: false });
    this.mainForm.get('printingMachine')?.disable({ emitEvent: false });
    this.mainForm.get('inspector')?.disable({ emitEvent: false });
    this.mainForm.get('customerName')?.disable({ emitEvent: false });
    this.mainForm.get('cancelRemarks')?.disable({ emitEvent: false });
    this.mainForm.get('decisionAuthority')?.disable({ emitEvent: false });
    this.mainForm.get('decisionAuthorityRemarks')?.disable({ emitEvent: false });
    this.mainForm.get('print2Page')?.disable({ emitEvent: false });
    this.mainForm.get('jobId')?.disable({ emitEvent: false });
    this.mainForm.get('qtId')?.disable({ emitEvent: false });
    this.mainForm.get('createdTime')?.disable({ emitEvent: false });
    this.mainForm.get('qpId')?.disable({ emitEvent: false });
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

    // Conditional Validation: If QP is filled, JO is not required. If no QP, JO is required.
    this.mainForm.get('qpId')?.valueChanges.subscribe(value => {
      const jobIdControl = this.mainForm.get('jobId');
      if (value && value.trim() !== '') {
        jobIdControl?.clearValidators();
      } else {
        jobIdControl?.setValidators([Validators.required]);
      }
      jobIdControl?.updateValueAndValidity();
    });

    this.mainForm.get('decisionAuthority')?.valueChanges.subscribe(value => {
      const sampleJobTypeControl = this.mainForm.get('sampleJobType');
      const samplePrintingSystemControl = this.mainForm.get('samplePrintingSystem');
      const samplePrintingStyleControl = this.mainForm.get('samplePrintingStyle');
      const sampleDeliveryDateControl = this.mainForm.get('sampleDeliveryDate');
      const sampleDeliveryTimeControl = this.mainForm.get('sampleDeliveryTime');

      if (value === 'sampleToCustomer') {
        sampleJobTypeControl?.setValidators([Validators.required]);
        samplePrintingSystemControl?.setValidators([Validators.required]);
        samplePrintingStyleControl?.setValidators([Validators.required]);
        sampleDeliveryDateControl?.setValidators([Validators.required]);
        sampleDeliveryTimeControl?.setValidators([Validators.required]);
      } else {
        sampleJobTypeControl?.clearValidators();
        samplePrintingSystemControl?.clearValidators();
        samplePrintingStyleControl?.clearValidators();
        sampleDeliveryDateControl?.clearValidators();
        sampleDeliveryTimeControl?.clearValidators();
      }
      sampleJobTypeControl?.updateValueAndValidity();
      samplePrintingSystemControl?.updateValueAndValidity();
      samplePrintingStyleControl?.updateValueAndValidity();
      sampleDeliveryDateControl?.updateValueAndValidity();
      sampleDeliveryTimeControl?.updateValueAndValidity();
    });
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

  patchFormData(data: any): void {
    const apiData = data as any;
    if (apiData.sampleDeliveryTimestamp) {
      // Ensure format is YYYY-MM-DDTHH:mm for datetime-local input
      apiData.sampleDeliveryTimestamp = apiData.sampleDeliveryTimestamp.substring(0, 16);
    }
    this.mainForm.patchValue(apiData);
  }

  onSubmit() {
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      this.sweetAlert.warning('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }
    this.mainForm.get('jobId')?.setValue(this.ensureJobIdSuffix(this.mainForm.getRawValue().jobId));
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
        const formData = this.mainForm.getRawValue();

        this.dcsm06Service.save(formData).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.sweetAlert.success('บันทึกข้อมูลสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm06']);
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

  copyToNew() {
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
        this.mainForm.get('id')?.setValue(null);
        this.mainForm.get('jobId')?.setValue(this.incrementJobId(this.mainForm.getRawValue().jobId));
        this.dcsm06Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.sweetAlert.success('บันทึกข้อมูลสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm06']);
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

  getCombinedDateTime(dateField: string, timeField: string): string {
    const dateValue = this.mainForm.get(dateField)?.value;
    const timeValue = this.mainForm.get(timeField)?.value;
    if (!dateValue) return '';
    const dateStr = this.formatDateThai(dateValue);
    return timeValue ? `${dateStr} ${timeValue}` : dateStr;
  }

  getThaiDateInput(controlName: string): string {
    const value = this.mainForm.get(controlName)?.value;
    return this.formatDateThai(value);
  }

  onThaiDateInput(event: any, controlName: string): void {
    let value = event.target.value.replace(/[^0-9]/g, '');

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 7);
    }

    event.target.value = value;

    if (value.length === 8) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        let year = parseInt(parts[2]);

        if (year <= 50) {
          year += 2000;
        } else {
          year += 1900;
        }

        if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
          const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          if (this.mainForm.get(controlName)) {
            this.mainForm.get(controlName)?.setValue(isoDate);
          }
        }
      }
    } else {
      if (this.mainForm.get(controlName)) {
        this.mainForm.get(controlName)?.setValue('');
      }
    }
  }

  onKeepPostPoneDeadline() {
    Swal.fire({
      title: 'รับทราบการเลื่อนเวลา',
      text: "ยืนยันรับทราบการเลื่อนเวลา ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('postpone').setValue('รับทราบการเลื่อนเวลา')
        this.dcsm06Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.sweetAlert.success('บันทึกข้อมูลสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm06']);
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

  clearDecisionAuthority() {
    this.mainForm.patchValue({
      decisionAuthority: null,
      decisionAuthorityRemarks: null
    });
  }

  getCreatedTime(): string {
    const createdAt = this.mainForm.get('createdAt')?.value;
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  }

  incrementJobId(jobId: string | null | undefined): string {
    if (!jobId) return '';
    const lastUnderscoreIndex = jobId.lastIndexOf('_');
    if (lastUnderscoreIndex !== -1) {
      const suffix = jobId.substring(lastUnderscoreIndex + 1);
      const version = parseInt(suffix);
      if (!isNaN(version)) {
        return jobId.substring(0, lastUnderscoreIndex + 1) + (version + 1);
      }
    }
    return jobId + '_1';
  }

  ensureJobIdSuffix(jobId: string | null | undefined): string {
    if (!jobId) return '';
    if (/_\d+$/.test(jobId)) {
      return jobId;
    }
    return jobId + '_1';
  }
}