import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm04Service } from './dcsm04.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ThaiDatePipe } from 'src/app/shared/pipes/thai-date.pipe';
import Swal from 'sweetalert2';
import { Dcsm02Service } from '../dcsm02/dcsm02.service';
@Component({
  selector: 'app-dcsm04-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, ThaiDatePipe],
  templateUrl: './dcsm04-detail.component.html',
  styleUrl: './dcsm04-detail.component.scss'
})
export class Dcsm04DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isDesign = false
  isBtnSave = false
  isBtnApprove = false
  isBtnReject = false
  isBtnApproveSample = false
  isBtnSampleProof = false
  isUpdateDelivery = false
  isPap = true

  showApproveModal = false;
  showRejectModal = false;
  showDesignModal = false;
  showPlanModal = false;
  usedFile = new FormControl('', Validators.required);
  colorSample = new FormControl('');
  deadlineDate = new FormControl('');
  deadlineTime = new FormControl('');
  remarks = new FormControl('');
  designDate = new FormControl('', Validators.required);
  designTime = new FormControl('', Validators.required);
  designRemarks = new FormControl('', Validators.required);
  planDate = new FormControl('', Validators.required);
  planTime = new FormControl('', Validators.required);
  planRemarks = new FormControl('', Validators.required);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm02Service: Dcsm02Service,
    private dcsm04Service: Dcsm04Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    this.initForm();

    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
      if (resolvedData.designOrderId != null) {
        this.isDesign = true
      }
    }

    if (this.mainForm.getRawValue().status === 'จัดส่งได้ รอเคลียร์ไฟล์' || this.mainForm.getRawValue().status === 'กำลังเคลียร์ไฟล์' || this.mainForm.getRawValue().status === 'ไฟล์เสร็จ รอตรวจสอบไฟล์' || this.mainForm.getRawValue().status === 'ขึ้นตัวอย่างแล้ว' || this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง' || this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง รอขึ้นตัวอย่าง' || this.mainForm.getRawValue().status === 'สำเร็จ ส่งตรวจสอบ' || this.mainForm.getRawValue().status === 'ผ่าน' || this.mainForm.getRawValue().status === 'สำเร็จ รออนุมัติไปตารางรอผลิต' || this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง' || this.mainForm.getRawValue().status === 'รอเจ้าของงานตรวจสอบ'|| this.mainForm.getRawValue().status === 'ส่งProofหน้าแท่นแล้ว' || this.mainForm.getRawValue().status === 'เริ่มเคลียร์ไฟล์ Proof' || this.mainForm.getRawValue().status === 'ไฟล์Proofเสร็จ รอตรวจ' || this.mainForm.getRawValue().status == 'ไฟล์Proofถูกต้อง รอส่งไปช่างพิมพ์') {
      this.mainForm.controls['folderName'].disable({ emitEvent: false });
      this.mainForm.controls['deliveryDate'].disable({ emitEvent: false });
      this.mainForm.controls['deliveryTime'].disable({ emitEvent: false });
      this.mainForm.controls['quantity'].disable({ emitEvent: false });
      this.mainForm.controls['unit'].disable({ emitEvent: false });
      this.mainForm.controls['isCreateSample'].disable({ emitEvent: false });
      this.mainForm.controls['note'].disable({ emitEvent: false });
      this.mainForm.controls['customerName'].disable({ emitEvent: false });
      this.mainForm.controls['typeJob'].disable({ emitEvent: false });
      this.mainForm.controls['jobType'].disable({ emitEvent: false });
      this.mainForm.controls['printType'].disable({ emitEvent: false });
      this.mainForm.controls['paperType'].disable({ emitEvent: false });
      this.mainForm.controls['diecuttingType'].disable({ emitEvent: false });
      this.mainForm.controls['coatType'].disable({ emitEvent: false });
      this.mainForm.controls['systemPrint'].disable({ emitEvent: false });
      this.mainForm.controls['colorPrint'].disable({ emitEvent: false });
      this.mainForm.controls['paperGram'].disable({ emitEvent: false });
      this.mainForm.controls['jobId'].disable({ emitEvent: false });
      this.mainForm.controls['qtId'].disable({ emitEvent: false });
      this.mainForm.controls['print2Page'].disable({ emitEvent: false });
      this.isPap = false
    }
    this.checkBtn();
    if (this.mainForm.getRawValue().status == 'ขอเลื่อนวันส่ง' && this.getCurrentUserFromToken() == this.mainForm.getRawValue().jobOwner) {
      this.isUpdateDelivery = true
    }
  }

  initForm(): void {
    this.mainForm = this.fb.group({
      id: [''],
      searchId: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      jobOwner: [''],
      deliveryDate: ['', Validators.required],
      deliveryTime: ['', Validators.required],
      responsiblePerson: ['รอผู้รับผิดชอบอนุมัติ'],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
      isCreateSample: [true],
      status: ['รอผู้รับผิดชอบอนุมัติ'],
      note: [''],
      fileName: [''],
      designOrderId: [''],
      updateDateDelivery: [new Date().toISOString().substring(0, 10)],
      updateTimeDelivery: [''],
      customerName: [''],
      jobType: [null],
      printType: [null],
      paperType: [null],
      diecuttingType: [null],
      coatType: [null],
      systemPrint: [null],
      colorPrint: [null],
      paperGram: [null],
      rowVersion: [null],
      jobId: [null, Validators.required],
      qtId: [null],
      typeJob: [null],
      machineName: [null],
      print2Page: [false],
    });

    this.mainForm.get('isCreateSample')?.valueChanges.subscribe(value => {
      const quantityControl = this.mainForm.get('quantity');
      const unitControl = this.mainForm.get('unit');

      if (value) {
        quantityControl?.setValidators([Validators.required]);
        unitControl?.setValidators([Validators.required]);
      } else {
        quantityControl?.clearValidators();
        unitControl?.clearValidators();
      }

      quantityControl?.updateValueAndValidity();
      unitControl?.updateValueAndValidity();
    });

    this.mainForm.controls['id'].disable({ emitEvent: false });
    this.mainForm.controls['orderDate'].disable({ emitEvent: false });
    this.mainForm.controls['jobOwner'].disable({ emitEvent: false });
    this.mainForm.controls['responsiblePerson'].disable({ emitEvent: false });
    this.mainForm.controls['status'].disable({ emitEvent: false });
    this.mainForm.controls['designOrderId'].disable({ emitEvent: false });
    this.mainForm.controls['updateDateDelivery'].disable({ emitEvent: false });
    this.mainForm.controls['updateTimeDelivery'].disable({ emitEvent: false });
    this.mainForm.controls['machineName'].disable({ emitEvent: false });
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
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
        this.mainForm.get('jobType')?.setValue(response.job_specifications.work_type);
        this.mainForm.get('printType')?.setValue(response.job_specifications.print_style);
        this.mainForm.get('paperType')?.setValue(response.job_specifications.paper_size);
        this.mainForm.get('diecuttingType')?.setValue(response.job_specifications.diecut_style);
        this.mainForm.get('coatType')?.setValue(response.job_specifications.coating_style);
        this.mainForm.get('systemPrint')?.setValue(response.job_specifications.print_system);
        this.mainForm.get('colorPrint')?.setValue(response.job_specifications.print_colors);
        this.mainForm.get('paperGram')?.setValue(response.job_specifications.paper_weight);
        this.mainForm.get('jobId')?.setValue(response.document_info.doc_no);
        this.mainForm.get('customerName')?.setValue(response.customer_info.name);
        this.mainForm.get('folderName')?.setValue(response.job_specifications.job_name);
        this.checkBtn();
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
      title: 'ยืนยันการบันทึก',
      text: "ยื่นยันการบันทึก ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.checkBtn();
            this.sweetAlert.success('บันทึกข้อมูลสำเร็จ', 'เรียบร้อย')
            this.router.navigate(['/Dcsm04']);
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

  updateFileChecked() {
    Swal.fire({
      title: 'ตรวจสอบไฟล์',
      text: "ยื่นยันตรวจสอบไฟล์ ผ่าน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        if (this.mainForm.getRawValue().isCreateSample == true) {
          this.mainForm.get('status')?.setValue('ไฟล์ถูกต้อง รอขึ้นตัวอย่าง')
        } else {
          this.mainForm.get('status')?.setValue('ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง')
        }
        this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.sweetAlert.success('Success', 'เสร็จสิ้น!');
            this.router.navigate(['/Dcsm04']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  checkBtn() {
    const formValue = this.mainForm.getRawValue();
    const currentUser = this.getCurrentUserFromToken();
    if (
      !formValue.id || (currentUser === formValue.jobOwner && formValue.status === 'รอผู้รับผิดชอบอนุมัติ') || (currentUser === formValue.jobOwner && formValue.status === 'รอดำเนินการ' || (currentUser === formValue.jobOwner && formValue.status === 'รอเคลียร์ไฟล์ใหม่'))
    ) {
      this.isBtnSave = true;
      this.isBtnApprove = false;
      this.isBtnReject = false;
      this.isBtnApproveSample = false;
      this.isBtnSampleProof = false;
    } else if (currentUser === formValue.jobOwner && (formValue.status === 'สำเร็จ รออนุมัติไปตารางรอผลิต' || formValue.status === 'Proofสำเร็จ รออนุมัติไปตารางรอผลิต')) {
      if (this.mainForm.getRawValue().typeJob == 'OS' && formValue.status != 'Proofสำเร็จ รออนุมัติไปตารางรอผลิต' ) {
        this.isBtnSampleProof = true;
      }
      this.isBtnSave = false;
      this.isBtnApprove = false;
      this.isBtnReject = false;
      this.isBtnApproveSample = true;
    } else if (currentUser === formValue.jobOwner && formValue.status === 'รอเจ้าของงานตรวจสอบ') {
      this.isBtnSave = false;
      this.isBtnApprove = true;
      this.isBtnReject = false;
      this.isBtnApproveSample = false;
      this.isBtnSampleProof = false;
    } else {
      this.isBtnSave = false;
      this.isBtnApprove = false;
      this.isBtnReject = false;
      this.isBtnApproveSample = false;
      this.isBtnSampleProof = false;
    }
  }

  updateDelivery() {
    Swal.fire({
      title: 'อนุมัติขอเลื่อนส่ง',
      text: "ยื่นยันอนุมัติขอเลื่อนส่ง  ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = this.mainForm.getRawValue();
        data.deliveryDate = this.mainForm.getRawValue().updateDateDelivery
        data.deliveryTime = this.mainForm.getRawValue().updateTimeDelivery
        data.status = 'อนุมัติขอเลื่อนส่ง';
        this.loadingService.show();
        this.dcsm04Service.save(data).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.isUpdateDelivery = false
            this.sweetAlert.success('Success', 'เสร็จสิ้น!');
            this.router.navigate(['/Dcsm04']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  updateNotDelivery() {
    Swal.fire({
      title: 'ไม่อนุมัติขอเลื่อนส่ง',
      text: "ยื่นยันไม่อนุมัติขอเลื่อนส่ง ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = this.mainForm.getRawValue();
        data.status = 'ไม่อนุมัติเลื่อนส่ง';
        this.loadingService.show();
        this.dcsm04Service.save(data).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.isUpdateDelivery = false
            this.sweetAlert.success('Success', 'เสร็จสิ้น!');
            this.router.navigate(['/Dcsm04']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  openApproveModal() {
    const now = new Date();
    this.deadlineDate.setValue(now.toISOString().substring(0, 10));
    this.deadlineTime.setValue(now.toTimeString().substring(0, 5));
    this.usedFile.setValue('');
    this.colorSample.setValue('');
    this.remarks.setValue('');
    this.showApproveModal = true;
  }

  closeApproveModal() {
    this.showApproveModal = false;
  }

  confirmApprove() {
    const data = {
      orderDate: new Date().toISOString().substring(0, 10),
      folderName: this.mainForm.getRawValue().folderName,
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
      jobType: null,
      createdAt: null,
      updatedAt: null,
      responsiblePerson: 'รอผู้รับผิดชอบอนุมัติ',
      status: 'รอผู้รับผิดชอบอนุมัติ',
      sampleOrderId: this.mainForm.getRawValue().id,
      customerName: this.mainForm.getRawValue().customerName,
      dataDalivery: false
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
        this.dcsm04Service.saveProduction(data).subscribe({
          next: (response) => {
            if (response) {
              this.mainForm.get('status')?.setValue('ผ่าน');
              this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
                next: (response) => {
                  this.patchFormData(response);
                  this.loadingService.hide();
                  this.checkBtn();
                  this.sweetAlert.success('Success', 'เสร็จสิ้น!');
                  this.router.navigate(['/Dcsm04']);
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

  formatDateThai(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
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

  openRejectModal() {
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
  }

  sendToDesign() {
    Swal.fire({
      title: 'ส่งไปฝ่ายออกแบบ',
      text: "ยืนยันส่งงานไปฝ่ายออกแบบ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status')?.setValue('แก้ไขงานตัวอย่าง');
        this.dcsm02Service.getById(this.mainForm.getRawValue().designOrderId).subscribe({
          next: (response) => {
            response.confirmStatus = 'ไม่ผ่าน';
            response.processStatus = 'รอดำเนินการแก้ไข';
            this.dcsm02Service.save(response).subscribe({
              next: (response) => {
                this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
                  next: (response) => {
                    this.loadingService.hide();
                    this.patchFormData(response);
                    this.checkBtn();
                    this.closeRejectModal();
                    this.sweetAlert.success('ส่งไปฝ่ายออกแบบสำเร็จ');
                    this.router.navigate(['/Dcsm04']);
                  },
                  error: (error) => {
                    this.loadingService.hide();
                    this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
                  }
                });
                this.loadingService.hide();
                this.sweetAlert.success('ส่งไปฝ่ายออกแบบสำเร็จ');
                this.router.navigate(['/Dcsm04']);
              },
              error: (error) => {
                this.loadingService.hide();
                this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
              }
            });
          }
        })

      }
    });
  }

  sendToPlan() {
    Swal.fire({
      title: 'ส่งไปฝ่ายแผน',
      text: "ยืนยันส่งงานไปฝ่ายแผน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status')?.setValue('แก้ไขงานตัวอย่าง');
        this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.mainForm.get('id')?.setValue(null)
            this.mainForm.get('status')?.setValue('รอเคลียร์ไฟล์ใหม่');
            this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
              next: (response) => {
                this.loadingService.hide();
                this.patchFormData(response);
                this.checkBtn();
                this.closeRejectModal();
                this.sweetAlert.success('ส่งไปฝ่ายแผนสำเร็จ');
                this.router.navigate(['/Dcsm04']);
              },
              error: (error) => {
                this.loadingService.hide();
                this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
              }
            });
            this.patchFormData(response);
            this.checkBtn();
            this.closeRejectModal();
            this.sweetAlert.success('ส่งไปฝ่ายแผนสำเร็จ');
            this.router.navigate(['/Dcsm04']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
          }
        });
      }
    });
  }

  openDesignModal() {
    this.designDate.setValue('');
    this.designTime.setValue('');
    this.designRemarks.setValue('');
    this.showDesignModal = true;
  }

  closeDesignModal() {
    this.showDesignModal = false;
  }

  confirmSendToDesign() {
    if (this.designDate.valid && this.designTime.valid && this.designRemarks.valid) {
      Swal.fire({
        title: 'ส่งไปฝ่ายออกแบบ',
        text: "ยืนยันส่งงานไปฝ่ายออกแบบ ใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e1b4b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.mainForm.get('status')?.setValue('แก้ไขงานตัวอย่าง');
          this.dcsm02Service.getById(this.mainForm.getRawValue().designOrderId).subscribe({
            next: (response) => {
              response.confirmStatus = 'ไม่ผ่าน';
              response.processStatus = 'รอดำเนินการแก้ไข';
              response.deadlineDate = this.designDate.value;
              response.deadlineTime = this.designTime.value;
              response.noteEdit = this.designRemarks.value;
              this.dcsm02Service.save(response).subscribe({
                next: (response) => {
                  this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
                    next: (response) => {
                      this.loadingService.hide();
                      this.patchFormData(response);
                      this.checkBtn();
                      this.closeDesignModal();
                      this.closeRejectModal();
                      this.sweetAlert.success('ส่งไปฝ่ายออกแบบสำเร็จ');
                      this.router.navigate(['/Dcsm04']);
                    },
                    error: (error) => {
                      this.loadingService.hide();
                      this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
                    }
                  });
                },
                error: (error) => {
                  this.loadingService.hide();
                  this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
                }
              });
            }
          })
        }
      });
    }
  }

  openPlanModal() {
    this.planDate.setValue('');
    this.planTime.setValue('');
    this.planRemarks.setValue('');
    this.showPlanModal = true;
  }

  closePlanModal() {
    this.showPlanModal = false;
  }

  confirmSendToPlan() {
    if (this.planDate.valid && this.planTime.valid && this.planRemarks.valid) {
      Swal.fire({
        title: 'ส่งไปฝ่ายแผน',
        text: "ยืนยันส่งงานไปฝ่ายแผน ใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e1b4b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.mainForm.get('status')?.setValue('แก้ไขงานตัวอย่าง');
          this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
            next: (response) => {
              this.loadingService.hide();
              this.mainForm.get('id')?.setValue(null)
              this.mainForm.get('status')?.setValue('รอเคลียร์ไฟล์ใหม่');
              this.mainForm.get('deliveryDate')?.setValue(this.planDate.value);
              this.mainForm.get('deliveryTime')?.setValue(this.planTime.value);
              this.mainForm.get('note')?.setValue(this.planRemarks.value);
              this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
                next: (response) => {
                  this.loadingService.hide();
                  this.patchFormData(response);
                  this.checkBtn();
                  this.closePlanModal();
                  this.closeRejectModal();
                  this.sweetAlert.success('ส่งไปฝ่ายแผนสำเร็จ');
                  this.router.navigate(['/Dcsm04']);
                },
                error: (error) => {
                  this.loadingService.hide();
                  this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
                }
              });
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

  proofStatus(){
    Swal.fire({
        title: 'ส่งขอปรู๊บ',
        text: "ยืนยันขอปรู๊บไปฝ่ายแผน ใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e1b4b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.mainForm.get('status')?.setValue('ขอปรู๊ฟหน้าแท่น');
          this.dcsm04Service.save(this.mainForm.getRawValue()).subscribe({
            next: (response) => {
              this.loadingService.hide();
              this.patchFormData(response);
              this.router.navigate(['/Dcsm04']);
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