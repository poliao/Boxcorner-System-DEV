import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm02Service } from './dcsm02.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dcsm02-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm02-detail.component.html',
  styleUrl: './dcsm02-detail.component.scss'
})
export class Dcsm02DetailComponent implements OnInit {
  designForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isBtnApprove = false;
  isBtnEdit = false;
  isBtnSave = true;
  isBtnCancel = false;
  isFileName = false;
  isCancel = true;

  showApproveModal = false;
  approveDate = new FormControl('', Validators.required);
  approveTime = new FormControl('', Validators.required);
  approveQty = new FormControl('', Validators.required);
  approveUnit = new FormControl('', Validators.required);
  isCreateSample = new FormControl(true);
  print2Page = new FormControl(false);
  approveRemarks = new FormControl('');
  jobId = new FormControl('', Validators.required);
  showEditModal = false;
  editNote = new FormControl('', Validators.required);
  showCancelModal = false;

  showEditModalProduct = false;
  showApproveProductModal = false;
  showCancelModalProduct = false;
  //-------------------------------------------------------------------------
  usedFile = new FormControl('', Validators.required);
  colorSample = new FormControl('');
  deadlineDate = new FormControl('');
  deadlineTime = new FormControl('');
  remarks = new FormControl('');
  decisionAuthority = new FormControl('', Validators.required);
  designDate = new FormControl('', Validators.required);
  designTime = new FormControl('', Validators.required);
  designRemarks = new FormControl('', Validators.required);
  planDate = new FormControl('', Validators.required);
  planTime = new FormControl('', Validators.required);
  planRemarks = new FormControl('', Validators.required);
  decisionAuthorityRemarks = new FormControl('');
  customerName = new FormControl('', Validators.required);


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm02Service: Dcsm02Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;

    this.initForm();

    this.isCreateSample.valueChanges.subscribe(value => {
      if (value) {
        this.approveQty.setValidators([Validators.required]);
        this.approveUnit.setValidators([Validators.required]);
      } else {
        this.approveQty.clearValidators();
        this.approveUnit.clearValidators();
      }
      this.approveQty.updateValueAndValidity();
      this.approveUnit.updateValueAndValidity();
    });

    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
    }

    if (this.designForm.getRawValue().processStatus == 'กำลังดำเนินการ' || this.designForm.getRawValue().confirmStatus == 'กำลังดำเนินการ' || this.designForm.getRawValue().processStatus == 'เสร็จสิ้น') {
      this.designForm.controls['folderName'].disable({ emitEvent: false });
      this.designForm.controls['jobDetails'].disable({ emitEvent: false });
      this.designForm.controls['remarks'].disable({ emitEvent: false });
      this.designForm.controls['deadlineDate'].disable({ emitEvent: false });
      this.designForm.controls['deadlineTime'].disable({ emitEvent: false });
      this.designForm.controls['customerName'].disable({ emitEvent: false });
      this.isBtnSave = false;
    }
    if (this.designForm.getRawValue().processStatus == 'เสร็จสิ้น') {
      this.isFileName = true;
    }
    this.checkBtn();
  }

  initForm(): void {
    this.designForm = this.fb.group({
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      jobDetails: ['', Validators.required],
      remarks: [''],
      jobOwner: ['', Validators.required],
      deadlineDate: ['', Validators.required],
      deadlineTime: ['', Validators.required],
      assignee: [''],
      processStatus: ['รอผู้รับผิดชอบยืนยัน', Validators.required],
      confirmStatus: ['รอผู้รับผิดชอบยืนยัน', Validators.required],
      fileName: [''],
      customerName: [''],
      rowVersion: [null],
      confirmDate: [null],
    });
    this.designForm.controls['id'].disable({ emitEvent: false });
    this.designForm.controls['orderDate'].disable({ emitEvent: false });
    this.designForm.controls['jobOwner'].disable({ emitEvent: false });
    this.designForm.controls['assignee'].disable({ emitEvent: false });
    this.designForm.controls['processStatus'].disable({ emitEvent: false });
    this.designForm.controls['confirmStatus'].disable({ emitEvent: false });
    this.designForm.controls['fileName'].disable({ emitEvent: false });
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.designForm.patchValue(apiData);
  }

  onSubmit(): void {
    Swal.fire({
      title: 'ยืนยันบันทึก',
      text: "คุณต้องการบันทึก ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (this.designForm.valid) {
        this.loadingService.show();
        const data = this.designForm.getRawValue();
        this.dcsm02Service.save(data).subscribe(
          {
            next: (response) => {
              this.patchFormData(response);
              this.loadingService.hide();
              this.checkBtn();
              this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
              this.router.navigate(['/Dcsm02']);
            },
            error: (error) => {
              this.loadingService.hide();
              this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
            }
          }
        );
      }
    });
  }

  Complete(): void {
    Swal.fire({
      title: 'ยืนยันเสร็จสิ้น',
      text: "คุณต้องเสร็จสิ้นงาน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (this.designForm.valid) {
        this.loadingService.show();
        const data = this.designForm.getRawValue();
        data.confirmStatus = 'ผ่าน';
        data.processStatus = 'เสร็จสิ้น';
        this.dcsm02Service.save(data).subscribe(
          {
            next: (response) => {
              this.patchFormData(response);
              this.loadingService.hide();
              this.checkBtn();
              this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
              this.router.navigate(['/Dcsm02']);
            },
            error: (error) => {
              this.loadingService.hide();
              this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
            }
          }
        );
      }
    });
  }

  checkBtn() {
    if (this.designForm.getRawValue().jobOwner === this.getCurrentUserFromToken() && this.designForm.getRawValue().confirmStatus === 'รอตรวจสอบ') {
      this.isBtnApprove = true;
      this.isBtnEdit = true;
    } else {
      this.isBtnApprove = false;
      this.isBtnEdit = false;
    }
  }

  private getCurrentUserFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || payload.name || payload.sub;
    } catch (error) {
      return null;
    }
  }

  updateStatusEdit() {
    Swal.fire({
      title: 'ยืนยันการส่งแก้ไข',
      text: "คุณต้องการส่งแก้ไข ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.designForm.get('processStatus').setValue('รอดำเนินการแก้ไข')
        this.designForm.get('confirmStatus').setValue('ไม่ผ่าน')
        this.dcsm02Service.save(this.designForm.getRawValue()).subscribe(
          {
            next: (response) => {
              this.designForm.patchValue(response);
              this.loadingService.hide();
              this.checkBtn();
              this.sweetAlert.success('Success', 'ส่งแก้ไขสำเร็จ!');
              this.router.navigate(['/Dcsm02']);
            },
            error: (error) => {
              this.loadingService.hide();
              this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
            }
          }
        )
      }
    });
  }

  openApproveModal() {
    const now = new Date();
    this.approveDate.setValue(now.toISOString().substring(0, 10));
    this.approveTime.setValue(now.toTimeString().substring(0, 5));
    this.approveQty.setValue('');
    this.approveUnit.setValue('');
    this.isCreateSample.setValue(true);
    this.approveRemarks.setValue('');
    this.jobId.setValue('');
    this.showApproveModal = true;
  }

  openApproveProductModal() {
    this.showApproveProductModal = true;
  }

  closeApproveProductModal() {
    this.showApproveProductModal = false;
  }

  openApproveSampleModal() {
    this.openApproveModal();
  }

  closeApproveModal() {
    this.showApproveModal = false;
  }

  confirmApprove() {
    const data = {
      id: '',
      orderDate: new Date().toISOString().substring(0, 10),
      folderName: this.designForm.getRawValue().folderName,
      jobOwner: this.designForm.getRawValue().jobOwner,
      deliveryDate: this.approveDate.value,
      deliveryTime: this.approveTime.value,
      quantity: this.approveQty.value,
      unit: this.approveUnit.value,
      isCreateSample: this.isCreateSample.value,
      note: this.approveRemarks.value,
      responsiblePerson: 'รอผู้รับผิดชอบอนุมัติ',
      status: 'รอผู้รับผิดชอบอนุมัติ',
      designOrderId: this.designForm.getRawValue().id,
      customerName: this.designForm.getRawValue().customerName,
      fileName: this.designForm.getRawValue().fileName,
      jobId: this.jobId.value,
      print2Page: this.print2Page.value
    };
    Swal.fire({
      title: 'อนุมัติส่งไปตารางขึ้นตัวอย่าง',
      text: "คุณต้องอนุมัติส่งไปตารางขึ้นตัวอย่าง ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.designForm.get('processStatus').setValue('เสร็จสิ้น')
        this.designForm.get('confirmStatus').setValue('ผ่าน')
        this.designForm.get('confirmDate').setValue(new Date());
        this.dcsm02Service.savesampleOrders(data).subscribe({
          next: (response) => {
            this.dcsm02Service.save(this.designForm.getRawValue()).subscribe({
              next: (responses) => {
                this.designForm.patchValue(responses);
                this.closeApproveModal();
                this.loadingService.hide();
                this.sweetAlert.success('Success', 'อนุมัติส่งไปตารางขึ้นตัวอย่างสำเร็จ!');
                this.checkBtn();
                this.router.navigate(['/Dcsm02']);
              },
              error: (error) => {
                this.loadingService.hide();
                this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
              }
            })
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        });
      }
    });
  }

  openEditModal() {
    this.editNote.setValue('');
    this.editNote.markAsUntouched();
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  openEditModalProduct() {
    this.editNote.setValue('');
    this.editNote.markAsUntouched();
    this.showEditModal = true;
  }

  closeEditModalProduct() {
    this.showEditModal = false;
  }

  confirmEdit() {
    const note = this.editNote.value;

    Swal.fire({
      title: 'ยืนยันการส่งแก้ไข',
      text: "คุณต้องการส่งแก้ไข ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b61a1a',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = this.designForm.getRawValue();
        data.noteEdit = note;
        data.processStatus = 'รอดำเนินการแก้ไข';
        data.confirmStatus = 'ไม่ผ่าน'
        this.loadingService.show();
        this.dcsm02Service.save(data).subscribe((response) => {
          try {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
            this.router.navigate(['/Dcsm02']);
          } catch (error) {
            this.loadingService.hide();
            this.sweetAlert.error('Save', error.error);
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
    const year = date.getFullYear().toString().slice(-2); // เอาแค่ 2 หลักท้าย ค.ศ.
    return `${day}/${month}/${year}`;
  }

  getThaiDateInput(controlName: string): string {
    const value = this.designForm.get(controlName)?.value;
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
          if (this.designForm.get(controlName)) {
            this.designForm.get(controlName)?.setValue(isoDate);
          }
        }
      }
    } else {
      if (this.designForm.get(controlName)) {
        this.designForm.get(controlName)?.setValue('');
      }
    }
  }

  closeCancelModal() {
    this.showCancelModal = false;
  }

  confirmApproveProduction() {
    const data = {
      orderDate: new Date().toISOString().substring(0, 10),
      folderName: this.designForm.getRawValue().folderName,
      usedFile: this.usedFile.value,
      colorSample: this.colorSample.value,
      jobOwner: null,
      deadlineDate: this.deadlineDate.value,
      deadlineTime: this.deadlineTime.value,
      deliveryDate: null,
      jobStatus: null,
      processStatus: null,
      operatorName: null,
      inspectionDate: null,
      remarks: this.remarks.value,
      moldStatus: null,
      createdAt: null,
      updatedAt: null,
      responsiblePerson: 'รอผู้รับผิดชอบอนุมัติ',
      status: 'รอผู้รับผิดชอบอนุมัติ',
      sampleOrderId: null,
      customerName: this.designForm.getRawValue().customerName,
      dataDalivery: false,
      jobId: this.jobId.value,
      decisionAuthority: this.decisionAuthority.value,
      decisionAuthorityRemarks: this.decisionAuthorityRemarks.value,
      print2Page: this.print2Page.value
    };
    Swal.fire({
      title: 'อนุมัติส่งไปตารางคอนเฟิร์มรอผลิต',
      text: "อนุมัติส่งไปตารางคอนเฟิร์มรอผลิต ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm02Service.saveProduction(data).subscribe({
          next: (response) => {
            if (response) {
              this.designForm.get('processStatus').setValue('เสร็จสิ้น')
              this.designForm.get('confirmStatus').setValue('ผ่าน')
              this.designForm.get('confirmDate').setValue(new Date());
              this.dcsm02Service.save(this.designForm.getRawValue()).subscribe({
                next: (responses) => {
                  this.designForm.patchValue(responses);
                  this.closeApproveProductModal();
                  this.loadingService.hide();
                  this.sweetAlert.success('Success', 'อนุมัติส่งไปตารางคอนเฟิร์มรอผลิตสำเร็จ!');
                  this.checkBtn();
                  this.router.navigate(['/Dcsm02']);
                },
                error: (error) => {
                  this.loadingService.hide();
                  this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
                }
              })
            }
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        });
      }
    });
  }
}
