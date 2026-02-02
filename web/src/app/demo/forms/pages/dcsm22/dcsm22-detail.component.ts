import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm22Service } from './dcsm22.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm22-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule,],
  templateUrl: './dcsm22-detail.component.html',
  styleUrl: './dcsm22-detail.component.scss'
})
export class Dcsm22DetailComponent implements OnInit {
  designForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isBtnAccept = false
  isBtnWorking = false
  isBtnComplete = false
  isNoteEdit = false

  showCompleteModal = false;
  latestFileName = new FormControl('', Validators.required);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm22Service: Dcsm22Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    this.initForm();

    const resolvedData = this.route.snapshot.data['designInside'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
      if (this.designForm.getRawValue().noteEdit) {
        this.isNoteEdit = true
      }
    }
    this.checkButtonVisibility();
  }

  initForm(): void {
    this.designForm = this.fb.group({
      id: [''],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      folderName: ['', Validators.required],
      jobDetails: [''],
      remarks: [''],
      jobOwner: ['', Validators.required],
      deadlineDate: [''],
      deadlineTime: [''],
      assignee: [''],
      processStatus: ['', Validators.required],
      confirmStatus: ['', Validators.required],
      noteEdit: [''],
      fileName: [''],
      startDate: [null],
      startTime: [null],
      endDate:[null],
      endTime:[null],
      rowVersion: [null]
    });
    this.designForm.controls['id'].disable({ emitEvent: false });
    this.designForm.controls['orderDate'].disable({ emitEvent: false });
    this.designForm.controls['folderName'].disable({ emitEvent: false });
    this.designForm.controls['jobDetails'].disable({ emitEvent: false });
    this.designForm.controls['remarks'].disable({ emitEvent: false });
    this.designForm.controls['jobOwner'].disable({ emitEvent: false });
    this.designForm.controls['deadlineDate'].disable({ emitEvent: false });
    this.designForm.controls['deadlineTime'].disable({ emitEvent: false });
    this.designForm.controls['assignee'].disable({ emitEvent: false });
    this.designForm.controls['processStatus'].disable({ emitEvent: false });
    this.designForm.controls['confirmStatus'].disable({ emitEvent: false });
    this.designForm.controls['noteEdit'].disable({ emitEvent: false });
    this.designForm.controls['fileName'].disable({ emitEvent: false });
  }
  patchFormData(data: any): void {
    const apiData = data as any;
    this.designForm.patchValue(apiData);
  }

  checkButtonVisibility() {
    if (this.designForm.getRawValue().assignee === 'รอผู้รับผิดชอบยืนยัน') {
      this.isBtnAccept = true;
      this.isBtnWorking = false;
      this.isBtnComplete = false;
    } else if ((this.getCurrentUserFromToken() === this.designForm.get('assignee')?.value && this.designForm.get('processStatus')?.value === 'รอดำเนินการ') || (this.getCurrentUserFromToken() === this.designForm.get('assignee')?.value && this.designForm.get('processStatus')?.value === 'รอดำเนินการแก้ไข')) {
      this.isBtnWorking = true;
      this.isBtnAccept = false;
      this.isBtnComplete = false;
    } else if (this.designForm.get('processStatus')?.value === 'กำลังดำเนินการ' && this.getCurrentUserFromToken() === this.designForm.get('assignee')?.value) {
      this.isBtnComplete = true;
      this.isBtnWorking = false;
      this.isBtnAccept = false;
    } else if (this.designForm.get('confirmStatus')?.value === 'รอตรวจสอบ') {
      this.isBtnComplete = false;
      this.isBtnWorking = false;
      this.isBtnAccept = false;
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

  updateStatus() {
    Swal.fire({
      title: 'ยืนยันการยอมรับงาน',
      text: "คุณต้องการยอมรับงาน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm22Service.updateStatus(this.designForm.getRawValue().id).subscribe((response) => {
          this.designForm.patchValue(response);
          this.checkButtonVisibility();
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'ยอมรับงานสำเร็จ!');
          this.router.navigate(['/Dcsm22']);
        })
      }
    });
  }

  updateStatusWorking() {
    Swal.fire({
      title: 'ยืนยันการยอมรับงาน',
      text: "ระบบจะเริ่มนับเวลาเมื่อยืนยันรับงาน",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.designForm.get('processStatus')?.setValue("กำลังดำเนินการ")
        this.designForm.get('confirmStatus')?.setValue("กำลังดำเนินการ")
        this.designForm.get('startDate')?.setValue(new Date().toISOString().substring(0, 10))
        this.designForm.get('startTime')?.setValue(new Date().toTimeString().substring(0, 8));

        this.dcsm22Service.save(this.designForm.getRawValue()).subscribe((response) => {
          this.designForm.patchValue(response);
          this.checkButtonVisibility();
          this.loadingService.hide();
          this.sweetAlert.success('Success', 'กำลังดำเนินการ!');
          this.router.navigate(['/Dcsm22']);
        });
      }
    });
  }

  openCompleteModal() {
    this.latestFileName.setValue('');
    this.showCompleteModal = true;
  }

  closeCompleteModal() {
    this.showCompleteModal = false;
  }

  confirmComplete() {

    Swal.fire({
      title: 'ยืนยันการยอมรับงาน',
      text: "คุณต้องการยอมรับงาน ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.latestFileName.valid) {
          this.loadingService.show();
          this.designForm.get('processStatus')?.setValue("เสร็จสิ้น")
          this.designForm.get('confirmStatus')?.setValue("รอตรวจสอบ")
          this.designForm.get('fileName')?.setValue(this.latestFileName.value)
          this.designForm.get('endDate')?.setValue(new Date().toISOString().substring(0, 10))
          this.designForm.get('endTime')?.setValue(new Date().toTimeString().substring(0, 8))

          this.dcsm22Service.save(this.designForm.getRawValue()).subscribe((response) => {
            this.designForm.patchValue(response);
            this.checkButtonVisibility();
            this.closeCompleteModal();
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'เสร็จสิ้น!');
            this.router.navigate(['/Dcsm22']);
          });
        }
      }
    });
  }

}
