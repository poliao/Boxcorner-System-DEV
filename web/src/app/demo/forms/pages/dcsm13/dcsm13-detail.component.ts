import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Dcsm13Service } from './dcsm13.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-dcsm13-detail',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dcsm13-detail.component.html',
  styleUrls: ['./dcsm13-detail.component.scss']
})
export class Dcsm13DetailComponent implements OnInit {
  coatingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private coatingService: Dcsm13Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.coatingForm = this.fb.group({
      report_date: [null, Validators.required],
      job_order_no: [null, [Validators.required, Validators.maxLength(50)]],
      job_name: [null, [Validators.required, Validators.maxLength(255)]],
      coating_type: [null, Validators.required],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
      total_time: [null, Validators.maxLength(50)],
      quantity: [null, [Validators.required, Validators.min(1)]],
      remarks: [null],
      reporter_name: [null, [Validators.required, Validators.maxLength(100)]]
    });
  }

  calculateTotalTime() {
    const start = this.coatingForm.get('start_time')?.value;
    const end = this.coatingForm.get('end_time')?.value;
    
    if (start && end) {
      const startTime = new Date(`2000-01-01 ${start}`);
      const endTime = new Date(`2000-01-01 ${end}`);
      const diff = endTime.getTime() - startTime.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        this.coatingForm.patchValue({ total_time: `${hours}:${minutes.toString().padStart(2, '0')}` });
      }
    }
  }

  onSubmit() {
    if (this.coatingForm.invalid) {
      this.coatingForm.markAllAsTouched();
      this.sweetAlert.warning('Warning', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    this.coatingService.save(this.coatingForm.value).subscribe({
      next: (res) => {
        this.loadingService.hide();
        this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
        this.coatingForm.reset();
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', err.error || err.message);
      }
    });
  }
}
