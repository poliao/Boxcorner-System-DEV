import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm05Service } from './dcsm05.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dcsm05-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm05-detail.component.html',
  styleUrl: './dcsm05-detail.component.scss'
})
export class Dcsm05DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isNoteEdit = false
  isDesign = false
  confirm = false;
  confirmDeliver = false;
  notDeliver = false;
  clearFile = false;
  inspection = false;
  samples = false;
  deadline = false;
  inFileProof = false;
  checkFileProof = false;
  sendFileProof = false;

  showNotDeliverModal = false;
  notDeliverTime = new FormControl('', Validators.required);
  notDeliverDate = new FormControl('', Validators.required);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm05Service: Dcsm05Service,
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
      this.checkBtn();
      if (this.mainForm.getRawValue().noteEdit) {
        this.isNoteEdit = true
      }
      if (resolvedData.designOrderId != null) {
        this.isDesign = true
      }
    }
    if (this.mainForm.getRawValue().status == 'ขอปรู๊ฟหน้าแท่น') {
      this.mainForm.controls['machineName'].enable;
    } else if (this.mainForm.getRawValue().machineName != null) {
      this.mainForm.controls['machineName'].disable({ emitEvent: false });
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
      noteEdit: [''],
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
      jobId: [null],
      qtId: [null],
      typeJob: [null],
      machineName: [null, Validators.required],
    });
    this.mainForm.controls['id'].disable({ emitEvent: false });
    this.mainForm.controls['orderDate'].disable({ emitEvent: false });
    this.mainForm.controls['folderName'].disable({ emitEvent: false });
    this.mainForm.controls['jobOwner'].disable({ emitEvent: false });
    this.mainForm.controls['deliveryDate'].disable({ emitEvent: false });
    this.mainForm.controls['deliveryTime'].disable({ emitEvent: false });
    this.mainForm.controls['responsiblePerson'].disable({ emitEvent: false });
    this.mainForm.controls['quantity'].disable({ emitEvent: false });
    this.mainForm.controls['unit'].disable({ emitEvent: false });
    this.mainForm.controls['isCreateSample'].disable({ emitEvent: false });
    this.mainForm.controls['status'].disable({ emitEvent: false });
    this.mainForm.controls['note'].disable({ emitEvent: false });
    this.mainForm.controls['noteEdit'].disable({ emitEvent: false });
    this.mainForm.controls['customerName'].disable({ emitEvent: false });
    this.mainForm.controls['fileName'].disable({ emitEvent: false });
    this.mainForm.controls['designOrderId'].disable({ emitEvent: false });
    this.mainForm.controls['updateDateDelivery'].disable({ emitEvent: false });
    this.mainForm.controls['updateTimeDelivery'].disable({ emitEvent: false });
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
    this.mainForm.controls['typeJob'].disable({ emitEvent: false });
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
  }

  checkBtn() {
    if (this.mainForm.getRawValue().status === 'รอผู้รับผิดชอบอนุมัติ') {
      this.confirm = true;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    } else if ((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'รอดำเนินการ') || (this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'ไม่อนุมัติเลื่อนส่ง') || (this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'อนุมัติขอเลื่อนส่ง') || (this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'รอเคลียร์ไฟล์ใหม่')) {
      this.confirm = false;
      this.confirmDeliver = true;
      this.notDeliver = true;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    } else if ((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'จัดส่งได้ รอเคลียร์ไฟล์') || this.mainForm.getRawValue().status === 'แก้ไขไฟล์') {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = true;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    } else if (this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'กำลังเคลียร์ไฟล์') {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = true;
      this.samples = false;
      this.deadline = false;
    } else if (this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง รอขึ้นตัวอย่าง' && this.mainForm.getRawValue().isCreateSample === true) {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = true;
      this.deadline = false;
    } else if ((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson) && (this.mainForm.getRawValue().status === 'ไฟล์ถูกต้อง ไม่ต้องขึ้นตัวอย่าง')) {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = true;
    } else if ((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'สำเร็จ รออนุมัติไปตารางรอผลิต')) {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
    }

    if (this.mainForm.getRawValue().status == 'ขอปรู๊ฟหน้าแท่น') {
      this.inFileProof = true
      this.checkFileProof = false
      this.sendFileProof = false
    } else if (this.mainForm.getRawValue().status == 'เริ่มเคลียร์ไฟล์ Proof') {
      this.inFileProof = false
      this.checkFileProof = true
      this.sendFileProof = false
    } else if (this.mainForm.getRawValue().status == 'ไฟล์Proofถูกต้อง รอส่งไปช่างพิมพ์') {
      this.inFileProof = false
      this.checkFileProof = false
      this.sendFileProof = true
    }
  }

  CheckBtnProof() {
    
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

  updateStatusComplete() {
    Swal.fire({
      title: 'ยืนยันรับงาน',
      text: "ยืนยันรับงาน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status')!.setValue('รอดำเนินการ');
        this.mainForm.get('responsiblePerson')!.setValue(this.getCurrentUserFromToken());
        this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe(
          {
            next: (response) => {
              this.patchFormData(response);
              this.checkBtn();
              this.loadingService.hide();
              this.sweetAlert.success('Success', 'รับงานสำเร็จ!');
              this.router.navigate(['/Dcsm05']);
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

  updateStatusDeliver() {
    Swal.fire({
      title: 'ยืนยันจัดส่งได้',
      text: "ยืนยันจัดส่งได้ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.loadingService.show();
        this.mainForm.get('status')!.setValue('จัดส่งได้ รอเคลียร์ไฟล์');
        this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'ยืนยันจัดส่งได้!');
            this.router.navigate(['/Dcsm05']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  updateStatusClearFile() {
    Swal.fire({
      title: 'กำลังเคลียร์ไฟล์',
      text: "ยืนยันกำลังเคลียร์ไฟล์ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status')!.setValue('กำลังเคลียร์ไฟล์');
        this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'เคลียร์ไฟล์แล้ว!');
            this.router.navigate(['/Dcsm05']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  updateStatusInspection() {
    Swal.fire({
      title: 'ยืนยันเคลียร์ไฟล์แล้ว',
      text: "ยืนยันเคลียร์ไฟล์แล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status')!.setValue('ไฟล์เสร็จ รอตรวจสอบไฟล์');
        this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'ส่งตรวจสอบไฟล์!');
            this.router.navigate(['/Dcsm05']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  updateStatusSamples() {
    Swal.fire({
      title: 'ยืนยันขึ้นตัวอย่างแล้ว',
      text: "ยืนยันขึ้นตัวอย่างแล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        const data = {
          id: '',
          createdAt: new Date(),
          jobId: this.mainForm.getRawValue().jobId,
          deliveryDate: this.mainForm.getRawValue().deliveryDate,
          deliveryTime: this.mainForm.getRawValue().deliveryTime,
          customerJobName: this.mainForm.getRawValue().customerName,
          jobStatus: null,
          totalPrintSheets: null,
          productionQty: this.mainForm.getRawValue().quantity,
          printerName: this.mainForm.getRawValue().machineName,
          setupWaste: null,
          issample: true,
          jobType: this.mainForm.getRawValue().jobType,
          printType: this.mainForm.getRawValue().printType,
          paperType: this.mainForm.getRawValue().paperType,
          diecuttingType: this.mainForm.getRawValue().diecuttingType,
          coatType: this.mainForm.getRawValue().coatType,
          systemPrint: this.mainForm.getRawValue().systemPrint,
          colorPrint: this.mainForm.getRawValue().colorPrint,
          paperGram: this.mainForm.getRawValue().paperGram,
          sampleId: this.mainForm.getRawValue().id
        };

        this.mainForm.get('status')!.setValue('ขึ้นตัวอย่างแล้ว');
        this.dcsm05Service.savePrintJob(data).subscribe({
          next: (response) => {
            this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe({
              next: (response) => {
                this.patchFormData(response);
                this.checkBtn();
                this.loadingService.hide();
                this.sweetAlert.success('Success', 'ขึ้นตัวอย่างแล้ว!');
                this.router.navigate(['/Dcsm05']);
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
        })

      }
    });
  }

  updateStatusSucsess() {
    Swal.fire({
      title: 'ยืนยันเสร็จสิ้น รอตรวจสอบ',
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
        this.mainForm.get('status')!.setValue('สำเร็จ รออนุมัติไปตารางรอผลิต');
        this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.checkBtn();
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'เสร็จสิ้น รอตรวจสอบ!');
            this.router.navigate(['/Dcsm05']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        })
      }
    });
  }

  openNotDeliverModal() {
    this.notDeliverTime.setValue('');
    this.notDeliverDate.setValue(new Date().toISOString().substring(0, 10));
    this.showNotDeliverModal = true;
  }

  closeNotDeliverModal() {
    this.showNotDeliverModal = false;
  }

  confirmNotDeliver() {
    const dateValue = this.notDeliverDate.value;
    const timeValue = this.notDeliverTime.value;
    if (!dateValue || !timeValue) {
      this.sweetAlert.error('Error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    Swal.fire({
      title: 'ขอเลื่อนวันส่ง',
      text: "คุณต้องการขอเลื่อนวันส่ง ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b61a1a',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = this.mainForm.getRawValue();
        data.updateDateDelivery = dateValue;
        data.updateTimeDelivery = timeValue
        data.status = 'ขอเลื่อนวันส่ง';
        this.loadingService.show();
        this.dcsm05Service.save(data).subscribe({
          next: (response) => {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
            this.router.navigate(['/Dcsm05']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาด');
          }
        });
      }
    });
    this.closeNotDeliverModal();
  }

  proofStatusClearFile() {
    Swal.fire({
      title: 'เริ่มเคลียร์ไฟล์',
      text: "ยืนยันเริ่มเคลียร์ไฟล์ ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status')?.setValue('เริ่มเคลียร์ไฟล์ Proof');
        this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.router.navigate(['/Dcsm05']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
          }
        });
      }
    });
  }

  proofStatusFileComplet() {
    Swal.fire({
      title: 'ส่งตรวจไฟล์ Proof',
      text: "ยืนยันส่งตรวจไฟล์ Proof ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status')?.setValue('ไฟล์Proofเสร็จ รอตรวจ');
        this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.router.navigate(['/Dcsm05']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('เกิดข้อผิดพลาด', error.error || 'ไม่สามารถส่งข้อมูลได้');
          }
        });
      }
    });
  }


  proofStatusSend() {
    Swal.fire({
      title: 'ยืนยันขึ้นตัวอย่างแล้ว',
      text: "ยืนยันขึ้นตัวอย่างแล้ว ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        const data = {
          id: '',
          createdAt: new Date(),
          jobId: this.mainForm.getRawValue().jobId,
          deliveryDate: this.mainForm.getRawValue().deliveryDate,
          deliveryTime: this.mainForm.getRawValue().deliveryTime,
          customerJobName: this.mainForm.getRawValue().customerName,
          jobStatus: null,
          totalPrintSheets: null,
          productionQty: this.mainForm.getRawValue().quantity,
          printerName: this.mainForm.getRawValue().machineName,
          setupWaste: null,
          issample: true,
          jobType: this.mainForm.getRawValue().jobType,
          printType: this.mainForm.getRawValue().printType,
          paperType: this.mainForm.getRawValue().paperType,
          diecuttingType: this.mainForm.getRawValue().diecuttingType,
          coatType: this.mainForm.getRawValue().coatType,
          systemPrint: this.mainForm.getRawValue().systemPrint,
          colorPrint: this.mainForm.getRawValue().colorPrint,
          paperGram: this.mainForm.getRawValue().paperGram,
          sampleId: this.mainForm.getRawValue().id
        };

        this.mainForm.get('status')!.setValue('ส่งProofหน้าแท่นแล้ว');
        this.dcsm05Service.savePrintJob(data).subscribe({
          next: (response) => {
            this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe({
              next: (response) => {
                this.patchFormData(response);
                this.checkBtn();
                this.loadingService.hide();
                this.sweetAlert.success('Success', 'ขึ้นตัวอย่างแล้ว!');
                this.router.navigate(['/Dcsm05']);
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
        })

      }
    });
  }

  proofStatusSendห() {
    Swal.fire({
      title: 'ส่งตรวจไฟล์ Proof',
      text: "ยืนยันส่งตรวจไฟล์ Proof ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.mainForm.get('status')?.setValue('ส่งไปช่างพิมพ์แล้ว');
        this.dcsm05Service.save(this.mainForm.getRawValue()).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.patchFormData(response);
            this.router.navigate(['/Dcsm05']);
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
