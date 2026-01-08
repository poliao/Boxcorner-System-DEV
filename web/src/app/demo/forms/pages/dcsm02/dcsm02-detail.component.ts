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

  showApproveModal = false;
  approveDate = new FormControl('', Validators.required);
  approveTime = new FormControl('', Validators.required);
  approveQty = new FormControl('', Validators.required);
  approveUnit = new FormControl('', Validators.required);
  isCreateSample = new FormControl(false);

  showEditModal = false;
  editNote = new FormControl('', Validators.required);

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

      this.isBtnSave = false;
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
      confirmStatus: ['รอผู้รับผิดชอบยืนยัน', Validators.required]
    });
    this.designForm.controls['id'].disable({ emitEvent: false });
    this.designForm.controls['orderDate'].disable({ emitEvent: false });
    this.designForm.controls['jobOwner'].disable({ emitEvent: false });
    this.designForm.controls['assignee'].disable({ emitEvent: false });
    this.designForm.controls['processStatus'].disable({ emitEvent: false });
    this.designForm.controls['confirmStatus'].disable({ emitEvent: false });
    
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.designForm.patchValue(apiData);
  }

  onSubmit(): void {
    if (this.designForm.valid) {
      this.loadingService.show();
      const data = this.designForm.getRawValue();
      this.dcsm02Service.save(data).subscribe((response) => {
        try {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
          this.router.navigate(['/Dcsm02']);
        } catch (error) {
          this.loadingService.hide();
          this.sweetAlert.error('Save', error);
        }
      });
    }
  }

  getJobDetailsColor() {
    const value = this.designForm.get('jobDetails')?.value;
    switch (value) {
      case 'ปรับไดคัท': return 'bg-warning text-white';
      case 'แก้ไขอาร์ต': return 'bg-danger text-white';
      case 'รอลูกค้าแจ้งกลับ': return 'bg-success text-white';
      case 'ออกแบบรายละเอียดใน Line': return 'bg-info text-white';
      case 'เคลียร์ไฟล์ ส่งคอนเฟิร์ม': return 'bg-danger text-white';
      default: return 'bg-light text-dark';
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
        this.dcsm02Service.updateStatusApprove(this.designForm.getRawValue().id).subscribe((response) => {
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
        this.dcsm02Service.updateStatusEdit(this.designForm.getRawValue().id).subscribe((response) => {
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
    this.isCreateSample.setValue(false);
    this.showApproveModal = true;
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
      responsiblePerson: 'รอผู้รับผิดชอบอนุมัติ',
      status: 'รอผู้รับผิดชอบอนุมัติ',
      designOrderId: this.designForm.getRawValue().id
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
        this.dcsm02Service.savesampleOrders(data).subscribe((response) => {
          if (response) {
            this.dcsm02Service.updateStatusApprove(this.designForm.getRawValue().id).subscribe((responses) => {
              this.designForm.patchValue(responses);
              this.checkBtn();
               this.loadingService.hide();
            })
            this.closeApproveModal();
            this.sweetAlert.success('Success', 'อนุมัติส่งไปตารางขึ้นตัวอย่างสำเร็จ!');
            this.router.navigate(['/Dcsm02']);
          }
        });
      }
    });

  }

  openEditModal() {
    this.editNote.setValue(''); // เคลียร์ค่าเก่า
    this.editNote.markAsUntouched(); // รีเซ็ตสถานะ error
    this.showEditModal = true;
  }

  // 2. ปิด Modal แก้ไข
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
        this.dcsm02Service.save(data).subscribe((response) => {
        try {
          this.patchFormData(response);
          this.loadingService.hide();
          this.checkBtn();
          this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
          this.router.navigate(['/Dcsm02']);
        } catch (error) {
          this.loadingService.hide();
          this.sweetAlert.error('Save', error);
        }
      });
      }
    });
  }

}
