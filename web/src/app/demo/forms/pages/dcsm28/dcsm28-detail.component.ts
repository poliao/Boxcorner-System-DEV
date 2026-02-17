import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm28Service } from './dcsm28.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm28-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm28-detail.component.html',
  styleUrl: './dcsm28-detail.component.scss'
})
export class Dcsm28DetailComponent implements OnInit {
  activityForm!: FormGroup;
  quotationForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  showQuotationModal = false;
  hasQuotation = false;
  currentQuotation: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm28Service: Dcsm28Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    this.initForm();

    const resolvedData = this.route.snapshot.data['salesActivity'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
    }

    if (this.isEditMode) {
      this.activityForm.disable();
      this.loadCurrentQuotation();
    }
  }

  loadCurrentQuotation(): void {
    if (!this.id) return;
    
    this.dcsm28Service.getCurrentQuotation(Number(this.id)).subscribe({
      next: (response) => {
        if (response) {
          this.hasQuotation = true;
          this.currentQuotation = response;
        }
      },
      error: () => {
        this.hasQuotation = false;
      }
    });
  }

  initForm(): void {
    this.activityForm = this.fb.group({
      activityId: [null],
      rowVersion: [null],
      activityDate: [new Date().toISOString().substring(0, 10), Validators.required],
      customerName: [null, Validators.required],
      contactPerson: [null, Validators.required],
      contact: [null, Validators.required],
      contactChannel: [null, Validators.required],
      objective: [null, Validators.required],
      discussionResult: [null, Validators.required],
      isNewCustomer: [false],
      nextStep: [null],
    });

    this.quotationForm = this.fb.group({
      quoteNumber: ['', Validators.required],
      amount: [null, Validators.required],
      cost: [null],
      remark: ['']
    });

    this.activityForm.get('activityDate')?.disable();
  }

  patchFormData(data: any): void {
    this.activityForm.patchValue(data);
  }

  onSave(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      this.sweetAlert.warning('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    Swal.fire({
      title: 'ยืนยันการบันทึก',
      text: "ยืนยันการบันทึก ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        const formData = this.activityForm.getRawValue();

        this.dcsm28Service.save(formData).subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.sweetAlert.success('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
            this.router.navigate(['/Dcsm28']);
          },
          error: (error) => {
            this.loadingService.hide();
            const msg = error.error || 'ไม่สามารถบันทึกข้อมูลได้';
            this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
          }
        });
      }
    });
  }

  onDelete(): void {
    if (!this.id) return;

    Swal.fire({
      title: 'ยืนยันการลบ',
      text: "คุณต้องการลบข้อมูลนี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.dcsm28Service.delete(Number(this.id)).subscribe({
          next: () => {
            this.loadingService.hide();
            this.sweetAlert.success('สำเร็จ', 'ลบข้อมูลเรียบร้อยแล้ว');
            this.router.navigate(['/Dcsm28']);
          },
          error: (error) => {
            this.loadingService.hide();
            this.sweetAlert.error('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้');
          }
        });
      }
    });
  }

  addQuotation(): void {
    this.quotationForm.reset();
    this.showQuotationModal = true;
  }

  editQuotation(): void {
    if (this.currentQuotation) {
      this.quotationForm.patchValue({
        quoteNumber: this.currentQuotation.quoteNumber,
        amount: this.currentQuotation.amount,
        cost: this.currentQuotation.cost,
        remark: this.currentQuotation.remark
      });
    }
    this.showQuotationModal = true;
  }

  closeQuotationModal(): void {
    this.showQuotationModal = false;
  }

  saveQuotation(): void {
    if (this.quotationForm.invalid) {
      this.quotationForm.markAllAsTouched();
      this.sweetAlert.warning('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    const quotationData = {
      ...this.quotationForm.value,
      activityId: Number(this.id)
    };

    const saveObservable = this.hasQuotation
      ? this.dcsm28Service.reviseQuotation(Number(this.id), quotationData)
      : this.dcsm28Service.createQuotation(quotationData);

    saveObservable.subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.sweetAlert.success('สำเร็จ', 'บันทึกใบเสนอราคาเรียบร้อยแล้ว');
        this.closeQuotationModal();
        this.loadCurrentQuotation();
      },
      error: (error) => {
        this.loadingService.hide();
        const msg = error.error || 'ไม่สามารถบันทึกได้';
        this.sweetAlert.error('เกิดข้อผิดพลาด', msg);
      }
    });
  }
}
