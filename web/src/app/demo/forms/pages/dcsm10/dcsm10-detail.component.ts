import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm10Service } from './dcsm10.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
import { TokenService } from 'src/app/shared/token.service';
@Component({
  selector: 'app-dcsm10-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm10-detail.component.html',
  styleUrl: './dcsm10-detail.component.scss'
})
export class Dcsm10DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isMoldStart = false;
  isMoldSuccess = false;
  isSendMold = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm10Service: Dcsm10Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);

      this.mainForm.get('jobId')?.enable({ emitEvent: false });
      this.mainForm.get('qtId')?.enable({ emitEvent: false });
      this.mainForm.get('qpId')?.enable({ emitEvent: false });

      this.mainForm.get('qpId')?.valueChanges.subscribe(val => {
        if (val) {
          this.mainForm.get('jobId')?.setValidators(null);
        } else {
          this.mainForm.get('jobId')?.setValidators([Validators.required]);
        }
        this.mainForm.get('jobId')?.updateValueAndValidity();
      });
    }
    if (this.mainForm.getRawValue().printingMachine != null) {
      this.mainForm.get('printingMachine')?.disable();
    }
    this.checkBtn();
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
      inspector: [''],
      jobType: [''],
      createdAt: [''],
      updatedAt: [''],
      moldMakerName: [''],
      printingMachine: ['', Validators.required],
      customerName: [''],
      dataDalivery: [false],
      postpone: [null],
      rowVersion: [null],
      decisionAuthority: [null],
      createdTime: [null],
      jobId: [null],
      qtId: [null],
      qpId: [null],
      qcType: [null],
      qcLocation: [null],
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
    this.mainForm.get('createdTime')?.disable();
    this.mainForm.get('jobId')?.disable();
    this.mainForm.get('qtId')?.disable();
    this.mainForm.get('qpId')?.disable();

    const sampleFields = [
      'decisionAuthority', 'sampleJobType', 'samplePrintingSystem', 'samplePrintingStyle',
      'samplePrintingColor', 'samplePaperSize', 'samplePaperGrammage', 'sampleCoatingStyle',
      'sampleDiecutStyle', 'sampleSpecialInstructions'
    ];
    sampleFields.forEach(field => this.mainForm.get(field)?.disable({ emitEvent: false }));
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

  checkBtn() {
    if ((this.mainForm.getRawValue().moldStatus == 'รอดำเนินการ') && (this.mainForm.getRawValue().jobType == 'OS')) {
      this.isMoldStart = true;
    } else if (this.tokenService.getCurrentUserFromToken() === this.mainForm.getRawValue().moldMakerName && this.mainForm.getRawValue().moldStatus == 'กำลังทำแม่พิมพ์') {
      this.isMoldSuccess = true;
    } else if (this.tokenService.getCurrentUserFromToken() === this.mainForm.getRawValue().moldMakerName && this.mainForm.getRawValue().moldStatus == 'แม่พิมพ์เสร็จแล้ว') {
      this.isSendMold = true;
    } else {
      this.isMoldStart = false;
      this.isMoldSuccess = false;
      this.isSendMold = false;
    }
  }

  updateMoldStart() {
    if (this.mainForm.valid) {
      Swal.fire({
        title: 'ยืนยันกำลังทำแม่พิมพ์',
        text: "ยืนยันกำลังทำแม่พิมพ์ ใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e1b4b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.mainForm.get('moldStatus')?.setValue('กำลังทำแม่พิมพ์');
          this.mainForm.get('moldMakerName')?.setValue(this.tokenService.getCurrentUserFromToken());
          const formData = this.prepareDataForSave(this.mainForm.getRawValue());
          this.dcsm10Service.save(formData).subscribe({
            next: (response) => {
              this.patchFormData(response);
              this.checkBtn();
              this.loadingService.hide();
              this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
              this.router.navigate(['/Dcsm10']);
            },
            error: (error) => {
              this.loadingService.hide();
              const msg = error.error || 'ไม่สามารถบันทึกข้อมูลได้';
              this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
            }
          });
        }
      });
    } else {
      this.sweetAlert.warning('เกิดข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }

  updateMoldSuccess() {
    Swal.fire({
      title: 'ยืนยันแม่พิมพ์เสร็จแล้ว',
      text: "ยืนยันแม่พิมพ์เสร็จแล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('moldStatus')?.setValue('แม่พิมพ์เสร็จแล้ว');
        const formData = this.prepareDataForSave(this.mainForm.getRawValue());
        this.dcsm10Service.save(formData).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm10']);
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

  updateSendMold() {
    Swal.fire({
      title: 'ยืนยันส่งแม่พิมพ์',
      text: "ยืนยันส่งแม่พิมพ์ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('moldStatus')?.setValue('ส่งแม่พิมพ์');
        const formData = this.prepareDataForSave(this.mainForm.getRawValue());
        this.dcsm10Service.save(formData).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm10']);
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
