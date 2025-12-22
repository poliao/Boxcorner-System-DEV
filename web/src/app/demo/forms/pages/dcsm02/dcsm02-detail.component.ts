import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm02Service } from './dcsm02.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
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
      processStatus: ['รอดำเนินการ', Validators.required],
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
          this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
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
      case 'ปรับไดคัท': return 'bg-primary text-white';
      case 'แก้ไขอาร์ต': return 'bg-warning text-dark';
      case 'รอลูกค้าแจ้งกลับ': return 'bg-danger text-white';
      case 'ออกแบบรายละเอียดใน Line': return 'bg-info text-dark';
      case 'เคลียร์ไฟล์ ส่งคอนเฟิร์ม': return 'bg-success text-white';
      default: return 'bg-light text-dark';
    }
  }

}
