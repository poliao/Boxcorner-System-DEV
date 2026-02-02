import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm23Service } from './dcsm23.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dcsm23-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm23-detail.component.html',
  styleUrl: './dcsm23-detail.component.scss'
})
export class Dcsm23DetailComponent implements OnInit {
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
  approveRemarks = new FormControl('');

  showEditModal = false;
  editNote = new FormControl('', Validators.required);

  showCancelModal = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm23Service: Dcsm23Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;

    this.initForm();
    const resolvedData = this.route.snapshot.data['designDiecut'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
    }

    if (this.designForm.getRawValue().processStatus == 'กำลังดำเนินการ' || this.designForm.getRawValue().confirmStatus == 'กำลังดำเนินการ' || this.designForm.getRawValue().processStatus == 'เสร็จสิ้น') {
      this.designForm.controls['folderName'].disable({ emitEvent: false });
      this.designForm.controls['jobDetails'].disable({ emitEvent: false });
      this.designForm.controls['remarks'].disable({ emitEvent: false });
      this.designForm.controls['deadlineDate'].disable({ emitEvent: false });
      this.designForm.controls['deadlineTime'].disable({ emitEvent: false });

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
      rowVersion: [null]
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
    if (this.designForm.valid) {
      this.loadingService.show();
      const data = this.designForm.getRawValue();
      this.dcsm23Service.save(data).subscribe((response) => {
        try {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
          this.router.navigate(['/Dcsm23']);
        } catch (error) {
          this.loadingService.hide();
          this.sweetAlert.error('Save', error);
        }
      });
    }
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

  updateStatusApprove() {
    Swal.fire({
      title: 'ยืนยันการอนุมัติงาน',
      text: "คุณต้องการอนุมัติงาน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm23Service.updateStatusApprove(this.designForm.getRawValue().id).subscribe((response) => {
          this.designForm.patchValue(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'อนุมัติสำเร็จ!');
        })
      }
    });
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
        this.dcsm23Service.updateStatusEdit(this.designForm.getRawValue().id).subscribe((response) => {
          this.designForm.patchValue(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'ส่งแก้ไขสำเร็จ!');
        })
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
    this.showApproveModal = true;
  }

  closeApproveModal() {
    this.showApproveModal = false;
  }

  confirmApprove() {
    Swal.fire({
      title: 'ตรวจงาน',
      text: "ยื่นยันงานถูกต้อง ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm23Service.updateStatusApprove(this.designForm.getRawValue().id).subscribe((responses) => {
          this.designForm.patchValue(responses);
          this.checkBtn();
          this.loadingService.hide();
          this.closeApproveModal();
            this.sweetAlert.success('Success', 'ตรวจเรียบร้อย!');
            this.router.navigate(['/Dcsm23']);
        })
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
        this.dcsm23Service.save(data).subscribe((response) => {
          try {
            this.patchFormData(response);
            this.loadingService.hide();
            this.checkBtn();
            this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
            this.router.navigate(['/Dcsm23']);
          } catch (error) {
            this.loadingService.hide();
            this.sweetAlert.error('Save', error);
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
    const year = date.getFullYear();
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

}
