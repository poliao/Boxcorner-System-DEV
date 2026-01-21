import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dcsm14Service } from './dcsm14.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-dcsm14-detail',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dcsm14-detail.component.html',
  styleUrls: ['./dcsm14-detail.component.scss']
})
export class Dcsm14DetailComponent implements OnInit {
  printingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private printingService: Dcsm14Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    const resolvedData = this.route.snapshot.data['designOrder'];
    if (resolvedData) {
      this.printingForm.patchValue(resolvedData);
    }
  }

  createForm() {
    const today = new Date().toISOString().split('T')[0];
    this.printingForm = this.fb.group({
      id: [null],
      reportDate: [today],
      jobOrderNo: [null, [Validators.required, Validators.maxLength(50)]],
      jobName: [null, [Validators.required, Validators.maxLength(255)]],
      colorCount: [null, [Validators.required, Validators.min(1)]],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      totalTime: [null, Validators.maxLength(50)],
      quantity: [null, [Validators.required, Validators.min(1)]],
      remarks: [null],
      reporterName: [null, [Validators.required, Validators.maxLength(100)]]
    });
    this.printingForm.get('id')?.disable();
    this.printingForm.get('reportDate')?.disable();
    this.printingForm.get('totalTime')?.disable();
    this.printingForm.get('reporterName')?.disable();
  }

  calculateTotalTime() {
    const start = this.printingForm.get('startTime')?.value;
    const end = this.printingForm.get('endTime')?.value;
    
    if (start && end) {
      const startTime = new Date(`2000-01-01 ${start}`);
      const endTime = new Date(`2000-01-01 ${end}`);
      const diff = endTime.getTime() - startTime.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        this.printingForm.patchValue({ totalTime: `${hours}:${minutes.toString().padStart(2, '0')}` });
      }
    }
  }

  onSubmit() {
    if (this.printingForm.invalid) {
      this.printingForm.markAllAsTouched();
      this.sweetAlert.warning('Warning', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    this.printingService.save(this.printingForm.getRawValue()).subscribe({
      next: (res) => {
        this.loadingService.hide();
        this.printingForm.patchValue(res);
        this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');
        this.router.navigate(['/Dcsm14']);
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', err.error || err.message);
      }
    });
  }
}
