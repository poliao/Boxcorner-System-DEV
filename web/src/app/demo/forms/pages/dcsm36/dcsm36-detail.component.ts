import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm36Service } from './dcsm36.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { AuthService } from 'src/app/services/auth.service';

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
    private loadingService: LoadingService,
    private authService: AuthService
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
      receivedQty: [''],
      passedQty: [''],
      bundlesPerPack: [''],
      boxesPerBundle: [''],
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
        if (job.deliveryDatetime) job.deliveryDatetime = this.formatDate(job.deliveryDatetime);
        if (job.createdAt) job.createdAt = this.formatDate(job.createdAt);
        if (job.updatedAt) job.updatedAt = this.formatDate(job.updatedAt);

        this.qcJobForm.patchValue(job);

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
      if (dateStr.includes('T')) {
        const [datePart, timePart] = dateStr.split('T');
        const [y, m, d] = datePart.split('-');
        const time = timePart.substring(0, 5);
        return `${d}/${m}/${y} ${time}`;
      }
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
        this.loadingService.hide();
      }
    });
  }

  startQc() {
    const receivedQty = this.qcJobForm.get('receivedQty')?.value;
    const operatorName = this.authService.getFullName();
    
    if (receivedQty) {
      this.loadingService.show();

      this.dcsm36Service.startQc(this.jobId!, receivedQty, operatorName).subscribe({
        next: () => {
          this.updateQcStatusProductionJob();
          this.sweetAlert.success('สำเร็จ', 'เริ่มงาน QC เรียบร้อยแล้ว');
          this.loadJobDetails(this.jobId!);
        },
        error: (err) => {
          this.sweetAlert.error('Error', 'ไม่สามารถเริ่มงาน QC ได้');
          this.loadingService.hide();
        }
      });
    } else {
      this.sweetAlert.input('เริ่ม QC', 'กรุณากรอกจำนวนที่รับมา', 'number').then((res) => {
        if (res.isConfirmed && res.value) {
          const qty = parseInt(res.value, 10);
          if (isNaN(qty) || qty <= 0) {
            this.sweetAlert.error('Error', 'กรุณากรอกจำนวนที่ถูกต้อง');
            return;
          }

          this.loadingService.show();
          this.dcsm36Service.startQc(this.jobId!, qty, operatorName).subscribe({
            next: () => {
              this.sweetAlert.success('สำเร็จ', 'เริ่มงาน QC เรียบร้อยแล้ว');
              this.loadJobDetails(this.jobId!);
            },
            error: (err) => {
              console.error('Error starting QC', err);
              this.sweetAlert.error('Error', 'ไม่สามารถเริ่มงาน QC ได้');
              this.loadingService.hide();
            }
          });
        }
      });
    }
  }

  completeQc() {
    const modalContent = document.getElementById('qcCompleteModalTemplate')?.innerHTML;
    if (!modalContent) return;

    this.sweetAlert.html(
      'QC แล้ว (เสร็จสิ้น)',
      modalContent,
      'ยืนยัน',
      'ยกเลิก'
    ).then((res) => {
      if (res.isConfirmed) {
        const passedQty = parseInt((document.querySelector('.swal2-html-container #passedQty') as HTMLInputElement).value, 10);
        const bundlesPerPack = parseInt((document.querySelector('.swal2-html-container #bundlesPerPack') as HTMLInputElement).value, 10);
        const boxesPerBundle = parseInt((document.querySelector('.swal2-html-container #boxesPerBundle') as HTMLInputElement).value, 10);

        if (isNaN(passedQty) || passedQty < 0) {
          this.sweetAlert.error('Error', 'กรุณากรอกยอดงานดีที่ถูกต้อง');
          return;
        }
        if (isNaN(bundlesPerPack) || bundlesPerPack <= 0) {
          this.sweetAlert.error('Error', 'กรุณากรอกจำนวนมัดต่อห่อที่ถูกต้อง');
          return;
        }
        if (isNaN(boxesPerBundle) || boxesPerBundle <= 0) {
          this.sweetAlert.error('Error', 'กรุณากรอกจำนวนกล่องต่อมัดที่ถูกต้อง');
          return;
        }

        this.loadingService.show();
        this.dcsm36Service.completeQc(this.jobId!, passedQty, bundlesPerPack, boxesPerBundle).subscribe({
          next: () => {
            this.updateCompletedStatusProductionJob();
            this.sweetAlert.success('สำเร็จ', 'QC เสร็จสิ้นแล้ว');
            this.loadJobDetails(this.jobId!);
          },
          error: (err) => {
            console.error('Error completing QC', err);
            this.sweetAlert.error('Error', 'ไม่สามารถบันทึกข้อมูล QC ได้');
            this.loadingService.hide();
          }
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/Dcsm36']);
  }

  updateQcStatusProductionJob() {
    this.dcsm36Service.getByIdProductionJob(this.qcJobForm.getRawValue().productJobId).subscribe({
      next: (data) => {
        data.printStatus = 'เริ่มQc' 
        this.dcsm36Service.updateProductionJob(data).subscribe({
          next: (updateResponse) => {
          },
        })
      },
      error: (err) => {
        console.error('Error fetching production job:', err);
      }
    });
  }

  updateCompletedStatusProductionJob() {
    this.dcsm36Service.getByIdProductionJob(this.qcJobForm.getRawValue().productJobId).subscribe({
      next: (data) => {
        data.printStatus = 'เสร็จสิ้น' 
        this.dcsm36Service.updateProductionJob(data).subscribe({
          next: (updateResponse) => {
          },
        })
      },
      error: (err) => {
        console.error('Error fetching production job:', err);
      }
    });
  }
}
