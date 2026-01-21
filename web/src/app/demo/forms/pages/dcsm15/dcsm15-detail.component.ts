import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Dcsm15Service } from './dcsm15.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm15-detail',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dcsm15-detail.component.html',
  styleUrls: ['./dcsm15-detail.component.scss']
})
export class Dcsm15DetailComponent implements OnInit {
  stampingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private stampingService: Dcsm15Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.createForm();
    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
    }
  }

  createForm() {
    const today = new Date().toISOString().split('T')[0];
    this.stampingForm = this.fb.group({
      id: [null],
      reportDate: [today],
      jobOrderNo: [null, [Validators.required, Validators.maxLength(50)]],
      jobName: [null, [Validators.required, Validators.maxLength(255)]],
      stampingType: ['embossing', Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      totalTime: [null, Validators.maxLength(50)],
      quantity: [null, [Validators.required, Validators.min(1)]],
      remarks: [null],
      reporterName: [null],
    });
    this.stampingForm.get('id')?.disable();
    this.stampingForm.get('reportDate')?.disable();
    this.stampingForm.get('reporterName')?.disable();
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.stampingForm.patchValue(apiData);
  }

  calculateTotalTime() {
    const start = this.stampingForm.get('startTime')?.value;
    const end = this.stampingForm.get('endTime')?.value;

    if (start && end) {
      const startTime = new Date(`2000-01-01 ${start}`);
      const endTime = new Date(`2000-01-01 ${end}`);
      const diff = endTime.getTime() - startTime.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        this.stampingForm.patchValue({ totalTime: `${hours}:${minutes.toString().padStart(2, '0')}` });
      }
    }
  }

  onSubmit() {
    if (this.stampingForm.invalid) {
      this.stampingForm.markAllAsTouched();
      this.sweetAlert.warning('Warning', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    Swal.fire({
      title: 'ยืนยันบันทึกข้อมูล',
      text: "ยืนยันบันทึกข้อมูล ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.stampingService.save(this.stampingForm.getRawValue()).subscribe({
          next: (res) => {
            this.loadingService.hide();
            this.patchFormData(res);
            this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
          },
          error: (err) => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', err.error || err.message);
          }
        });
      }
    });
  }



}
