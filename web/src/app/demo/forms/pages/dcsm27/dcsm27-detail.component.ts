import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dcsm27Service } from './dcsm27.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

declare var bootstrap: any;

@Component({
  selector: 'app-dcsm27-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm27-detail.component.html',
  styleUrls: ['./dcsm27-detail.component.scss']
})
export class Dcsm27DetailComponent implements OnInit {
  printJobForm!: FormGroup;
  extraPrintForm!: FormGroup;
  printJobId: number | null = null;
  extraPrints: any[] = [];
  modal: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm27Service: Dcsm27Service,
    private authService: AuthService,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.initForms();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.printJobId = +params['id'];
        this.loadPrintJob();
        this.loadExtraPrints();
      }
    });
  }

  initForms() {
    this.printJobForm = this.fb.group({
      jobId: [null],
      deliveryDate: [null],
      deliveryTime: [null],
      customerJobName: [null],
      jobStatus: [null],
      productionQty: [0]
    });

    this.extraPrintForm = this.fb.group({
      additionalQty: [null, [Validators.required, Validators.min(1)]],
      reason: [null, Validators.required],
      requestedBy: [null],
      status: ['PENDING']
    });
  }

  loadPrintJob() {
    if (this.printJobId) {
      this.dcsm27Service.getById(this.printJobId).subscribe({
        next: (data: any) => {
          this.printJobForm.patchValue(data);
        },
        error: (err) => {
          console.error('Error loading print job:', err);
        }
      });
    }
  }

  loadExtraPrints() {
    if (this.printJobId) {
      this.dcsm27Service.getExtraPrintsByJobId(this.printJobId).subscribe({
        next: (data: any[]) => {
          this.extraPrints = data;
        },
        error: (err) => {
          console.error('Error loading extra prints:', err);
        }
      });
    }
  }

  openExtraPrintModal() {
    this.extraPrintForm.reset({
      additionalQty: '',
      reason: '',
      status: 'PENDING'
    });
    const modalElement = document.getElementById('extraPrintModal');
    this.modal = new bootstrap.Modal(modalElement);
    this.modal.show();
  }

  saveExtraPrint() {
    if (this.extraPrintForm.valid && this.printJobId) {
      const formData = {
        ...this.extraPrintForm.value,
        printJobId: this.printJobId,
        requestedBy: this.authService.getUserFromToken().sub
      };

      this.dcsm27Service.saveExtraPrint(formData).subscribe({
        next: () => {
          this.sweetAlert.success('Success', 'บันทึกสำเร็จ');
          this.modal.hide();
          this.loadExtraPrints();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: err.message
          });
        }
      });
    } else {
      Object.keys(this.extraPrintForm.controls).forEach(key => {
        this.extraPrintForm.get(key)?.markAsTouched();
      });
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }
  }

  viewExtraPrint(extra: any) {
    // Optional: implement view/edit functionality
    console.log('View extra print:', extra);
  }

  deleteExtraPrint(id: number, event: Event) {
    event.stopPropagation();
    Swal.fire({
      title: 'คุณต้องการลบรายการนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dcsm27Service.deleteExtraPrint(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'ลบสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            });
            this.loadExtraPrints();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: err.message
            });
          }
        });
      }
    });
  }

  onBack() {
    this.router.navigate(['/Dcsm27']);
  }
}
