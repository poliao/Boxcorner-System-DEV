import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Dcsm15Service } from './dcsm15.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

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
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.stampingForm = this.fb.group({
      report_date: [null, Validators.required],
      job_order_no: [null, [Validators.required, Validators.maxLength(50)]],
      job_name: [null, [Validators.required, Validators.maxLength(255)]],
      stamping_type: [null, Validators.required],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
      total_time: [null, Validators.maxLength(50)],
      quantity: [null, [Validators.required, Validators.min(1)]],
      remarks: [null],
      reporter_name: [null, [Validators.required, Validators.maxLength(100)]]
    });
  }

  calculateTotalTime() {
    const start = this.stampingForm.get('start_time')?.value;
    const end = this.stampingForm.get('end_time')?.value;
    
    if (start && end) {
      const startTime = new Date(`2000-01-01 ${start}`);
      const endTime = new Date(`2000-01-01 ${end}`);
      const diff = endTime.getTime() - startTime.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        this.stampingForm.patchValue({ total_time: `${hours}:${minutes.toString().padStart(2, '0')}` });
      }
    }
  }

  onSubmit() {
    if (this.stampingForm.invalid) {
      this.stampingForm.markAllAsTouched();
      this.sweetAlert.warning('Warning', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    this.stampingService.save(this.stampingForm.value).subscribe({
      next: (res) => {
        this.loadingService.hide();
        this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
        this.stampingForm.reset();
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', err.error || err.message);
      }
    });
  }
}
