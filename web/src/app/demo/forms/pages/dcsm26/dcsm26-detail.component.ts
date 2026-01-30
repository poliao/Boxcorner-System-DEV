import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dcsm26Service } from './dcsm26.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm26-detail',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dcsm26-detail.component.html',
  styleUrls: ['./dcsm26-detail.component.scss']
})
export class Dcsm26DetailComponent implements OnInit {
  printingForm: FormGroup;
  id: string | null = null;
  isEditMode = false;
  isPrint = false;
  isInPrint = false;

  constructor(
    private fb: FormBuilder,
    private dcsm26Service: Dcsm26Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    const resolvedData = this.route.snapshot.data['designDiecut'];
    if (resolvedData) {
      this.printingForm.patchValue(resolvedData);
    }
    this.checkbntPrint();
  }

  createForm() {
    this.printingForm = this.fb.group({
      id: [null],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      jobId: ['', Validators.required],
      customerJobName: ['', Validators.required],
      printQuantity: [0],
      productionQuantity: [0],
      printingDate: [null],
      printingResponsible: [''],
      coatingDate: [null],
      coatingResponsible: [''],
      stampingDate: [null],
      stampingResponsible: [''],
      gluingDate: [null],
      gluingResponsible: [''],
      qcDate: [null],
      dueDate: ['', Validators.required],
      printStatus: [''],
      shippingAddress: [''],
      remark: [''],
      deliveryStatus: [''],
      imageUrl: [null],
      dataDalivery: [false],
      machineSetupCount: [''],
    });
    this.printingForm.get('date')?.disable();
    this.printingForm.get('jobId')?.disable();
    this.printingForm.get('customerJobName')?.disable();
    this.printingForm.get('printQuantity')?.disable();
    this.printingForm.get('productionQuantity')?.disable();
    this.printingForm.get('printingDate')?.disable();
    this.printingForm.get('printingResponsible')?.disable();
    this.printingForm.get('printStatus')?.disable();
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

  onUpdatePrint(status: string): void {
    if (this.printingForm.valid) {
      Swal.fire({
        title: 'ยืนยันอัพเดตสถานะ',
        text: "ยืนยันอัพเดตสถานะ ใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e1b4b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {

          this.loadingService.show();
          if (status === 'Print') {
            this.printingForm.get('printStatus')?.setValue('พิมพ์แล้ว');
          }
          if (status === 'inPrint') {
            this.printingForm.get('printStatus')?.setValue('กำลังพิมพ์');
          }
          const data = this.printingForm.getRawValue();

          this.dcsm26Service.save(data).subscribe((response) => {
            this.checkbntPrint();
            this.printingForm.patchValue(response);
            this.loadingService.hide();
            this.sweetAlert.success('Success', 'ยืนยันอัพเดตสถานะ!');
          })
        }
      });
    } else {
      this.markFormGroupTouched();
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.printingForm.controls).forEach(key => {
      const control = this.printingForm.get(key);
      control?.markAsTouched();
    });
  }

  checkbntPrint(){
    if ( this.printingForm.get('printStatus')?.value === '' || this.printingForm.get('printStatus')?.value === null) {
      this.isInPrint = true;
      this.isPrint =false;
    }else if(this.printingForm.get('printStatus')?.value === 'กำลังพิมพ์') {
       this.isPrint = true;
       this.isInPrint = false;
    }else{
      this.isPrint = false;
      this.isInPrint = false;
    }
  }
}
