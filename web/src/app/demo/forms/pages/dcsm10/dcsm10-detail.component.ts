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
      jobType: [''],
      createdAt: [''],
      updatedAt: [''],
      moldMakerName: [''],
      printingMachine: ['', Validators.required],
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
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
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
    const apiFilters = {
      id: this.mainForm.getRawValue().id,
      moldStatus: 'กำลังทำแม่พิมพ์',
    };

    const data = {
      id: this.mainForm.getRawValue().id,
      printingMachine: this.mainForm.getRawValue().printingMachine
    }
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
          this.dcsm10Service.updateMoldStatus(apiFilters).subscribe({
            next: () => {
              this.dcsm10Service.updateMoldMakerName(apiFilters).subscribe({
                next: (response) => {
                  this.dcsm10Service.updatePrintingMachine(data).subscribe({
                    next: () => { },
                    error: (error) => {
                      this.loadingService.hide();
                      const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
                      this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
                    }
                  })
                  this.patchFormData(response);
                  this.checkBtn();
                  this.loadingService.hide();
                  this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
                  this.router.navigate(['/Dcsm10']);
                },
                error: (error) => {
                  this.loadingService.hide();
                  const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
                  this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
                }
              });
            },
            error: (error) => {
              this.loadingService.hide();
              const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
              this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
            }
          })
        }
      });
    }else {
      this.sweetAlert.warning('เกิดข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ');
    }
  }

  updateMoldSuccess() {
    const apiFilters = {
      id: this.mainForm.getRawValue().id,
      moldStatus: 'แม่พิมพ์เสร็จแล้ว',
    };

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
        this.dcsm10Service.updateMoldStatus(apiFilters).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm10']);
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    });
  }

  updateSendMold() {
    const apiFilters = {
      id: this.mainForm.getRawValue().id,
      moldStatus: 'ส่งแม่พิมพ์',
    };

    const data = {
      id: this.mainForm.getRawValue().id,
      printingMachine: this.mainForm.getRawValue().printingMachine
    };

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
        this.dcsm10Service.updateMoldStatus(apiFilters).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('ยืนยันสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm10']);

          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    });
  }


}
