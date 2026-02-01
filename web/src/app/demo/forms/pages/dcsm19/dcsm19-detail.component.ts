import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm19Service } from './dcsm19.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dcsm19-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm19-detail.component.html',
  styleUrl: './dcsm19-detail.component.scss'
})
export class Dcsm19DetailComponent implements OnInit {
  mainForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isNoteEdit = false

  confirm = false;
  confirmDeliver = false;
  notDeliver = false;
  clearFile = false;
  inspection = false;
  samples = false;
  deadline = false;

  showNotDeliverModal = false;
  notDeliverTime = new FormControl('');
  notDeliverDate = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm19Service: Dcsm19Service,
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
    }
  }

  initForm(): void {
    this.mainForm = this.fb.group({
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      jobOwner: [''],
      deliveryDate: [''],
      deliveryTime: [''],
      responsiblePerson: ['รอผู้รับผิดชอบอนุมัติ'],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
      isCreateSample: [false],
      status: ['รอผู้รับผิดชอบอนุมัติ'],
      note: [''],
      noteEdit: [''],
      customerName: [''],
      rowVersion: [null]
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
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.mainForm.patchValue(apiData);
  }

  checkBtn() {
    if (this.mainForm.getRawValue().status === 'ขึ้นตัวอย่างแล้ว') {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = true;
    } else if ((this.getCurrentUserFromToken() === this.mainForm.getRawValue().responsiblePerson && this.mainForm.getRawValue().status === 'สำเร็จ รออนุมัติไปตารางรอผลิต') ) {
      this.confirm = false;
      this.confirmDeliver = false;
      this.notDeliver = false;
      this.clearFile = false;
      this.inspection = false;
      this.samples = false;
      this.deadline = false;
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
          this.dcsm19Service.save(this.mainForm.getRawValue()).subscribe({
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
}
