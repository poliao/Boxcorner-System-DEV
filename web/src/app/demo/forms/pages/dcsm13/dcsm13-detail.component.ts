import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.coatingForm.patchValue(resolvedData);
    }
  }

  createForm() {
    const today = new Date().toISOString().split('T')[0];
    this.coatingForm = this.fb.group({
      id: [null],
      reportDate: [today],
      jobOrderNo: [null, [Validators.required, Validators.maxLength(50)]],
      jobName: [null, [Validators.required, Validators.maxLength(255)]],
      coatingType: ['glossy', Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      totalTime: [null, Validators.maxLength(50)],
      quantity: [null, [Validators.required, Validators.min(1)]],
      remarks: [null],
      reporterName: [null, [Validators.required, Validators.maxLength(100)]]
    });
    this.coatingForm.get('id')?.disable();
    this.coatingForm.get('reportDate')?.disable();
    this.coatingForm.get('totalTime')?.disable();
    this.coatingForm.get('reporter_name')?.disable();
  }

  calculateTotalTime() {
    const start = this.coatingForm.get('startTime')?.value;
    const end = this.coatingForm.get('endTime')?.value;
    
    if (start && end) {
      const startTime = new Date(`2000-01-01 ${start}`);
      const endTime = new Date(`2000-01-01 ${end}`);
      const diff = endTime.getTime() - startTime.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        this.coatingForm.patchValue({ totalTime: `${hours}:${minutes.toString().padStart(2, '0')}` });
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
    this.coatingService.save(this.coatingForm.getRawValue()).subscribe({
      next: (res) => {
        this.loadingService.hide();
        this.coatingForm.patchValue(res);
        this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
        this.router.navigate(['/Dcsm13']);
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', err.error || err.message);
      }
    });
  }
}
