import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm09Service } from './dcsm09.service';
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
    private authService: AuthService
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
      inspector: [''],
      createdAt: [''],
      updatedAt: [''],
      customerName: [''],
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
      parts: this.fb.array([])
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
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
  }

  add() {
    this.router.navigate(['/Dcsm20DetailStatus', this.mainForm.getRawValue().id], {
      state: {
        referenceId: this.mainForm.getRawValue().id,
        decisionAuthority: this.mainForm.getRawValue().decisionAuthority,
        decisionAuthorityRemarks: this.mainForm.getRawValue().decisionAuthorityRemarks,
        print2Page: this.mainForm.getRawValue().print2Page,
        qcType: this.mainForm.getRawValue().qcType
      }
    });
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

}
