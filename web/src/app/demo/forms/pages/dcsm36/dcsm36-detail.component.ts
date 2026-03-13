import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm36Service } from './dcsm36.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';

@Component({
  selector: 'app-dcsm36-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm36-detail.component.html',
  styleUrls: ['./dcsm36-detail.component.scss']
})
export class Dcsm36DetailComponent implements OnInit {

  qcJobForm!: FormGroup;
  papOrderForm!: FormGroup;
  jobId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dcsm36Service: Dcsm36Service,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.jobId = +idStr;
        this.loadJobDetails(this.jobId);
      }
    });
  }

  initForm() {
    this.qcJobForm = this.fb.group({
      id: [''],
      status: [''],
      joId: [''],
      jobName: [''],
      responsibleName: [''],
      deliveryDatetime: [''],
      productJobId: [''],
      papOrderId: [''],
      createdAt: [''],
      updatedAt: ['']
    });

    this.papOrderForm = this.fb.group({
      qcRequiredQty: [''],
      orderedBy: [''],
      qcQa: [''],
      sale: [''],
      jobName: [''],
      qcDetail: [''],
      qcBookletSt: [''],
      qcNote: [''],
    });

    this.qcJobForm.disable();
    this.papOrderForm.disable();
  }

  loadJobDetails(id: number) {
    this.loadingService.show();
    this.dcsm36Service.getQcJobById(id).subscribe({
      next: (job) => {
        // Format dates
        if (job.deliveryDatetime) job.deliveryDatetime = this.formatDate(job.deliveryDatetime);
        if (job.createdAt) job.createdAt = this.formatDate(job.createdAt);
        if (job.updatedAt) job.updatedAt = this.formatDate(job.updatedAt);

        this.qcJobForm.patchValue(job);

        // Fetch Pap details if a papOrderId is present
        if (job.papOrderId) {
          this.loadPapOrderDetails(job.papOrderId);
        } else {
          this.loadingService.hide();
        }
      },
      error: (err) => {
        console.error('Error loading QC job details', err);
        this.sweetAlert.error('Error', 'ไม่สามารถโหลดข้อมูลงาน QC ได้');
        this.loadingService.hide();
        this.goBack();
      }
    });
  }

  formatDate(dateStr: any): string {
    if (!dateStr) return '-';
    try {
      // Handle ISO format: 2026-03-13T11:42:58.053456
      if (dateStr.includes('T')) {
        const [datePart, timePart] = dateStr.split('T');
        const [y, m, d] = datePart.split('-');
        const time = timePart.substring(0, 5); // 11:42
        return `${d}/${m}/${y} ${time}`;
      }
      // Handle LocalDate format: 2026-03-13
      if (dateStr.includes('-')) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  loadPapOrderDetails(papOrderId: string) {
    const numericId = parseInt(papOrderId, 10);
    if (isNaN(numericId)) {
      this.loadingService.hide();
      return;
    }

    this.dcsm36Service.getPapOrderById(numericId).subscribe({
      next: (papData) => {
        this.papOrderForm.patchValue(papData);
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error loading Pap Order details', err);
        // non-blocking if pap details fail
        this.loadingService.hide();
      }
    });
  }

  goBack() {
    this.router.navigate(['/Dcsm36']);
  }
}
