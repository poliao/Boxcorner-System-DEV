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
  recipeList: any[] = [];

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
      this.loadRecipeList(resolvedData.jobId);
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
      rowVersion: [null]
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

  loadRecipeList(jobId: string) {
    if (jobId) {
      this.dcsm26Service.getRecipesByJobId(jobId).subscribe({
        next: (data) => {
          this.recipeList = data;
        },
        error: (err) => {
          console.error('Error loading recipes:', err);
        }
      });
    }
  }

  getLabColor(l: number, a: number, b: number): string {
    if (l == null || a == null || b == null) return '#ffffff';
    
    const y = (l + 16) / 116;
    const x = a / 500 + y;
    const z = y - b / 200;

    const xn = x > 0.206897 ? x ** 3 : (x - 16 / 116) / 7.787;
    const yn = y > 0.206897 ? y ** 3 : (y - 16 / 116) / 7.787;
    const zn = z > 0.206897 ? z ** 3 : (z - 16 / 116) / 7.787;

    const X = xn * 95.047;
    const Y = yn * 100.000;
    const Z = zn * 108.883;

    let r = X * 0.032406 + Y * -0.015372 + Z * -0.004986;
    let g = X * -0.009689 + Y * 0.018758 + Z * 0.000415;
    let bl = X * 0.000557 + Y * -0.002040 + Z * 0.010570;

    r = r > 0.0031308 ? 1.055 * r ** (1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * g ** (1 / 2.4) - 0.055 : 12.92 * g;
    bl = bl > 0.0031308 ? 1.055 * bl ** (1 / 2.4) - 0.055 : 12.92 * bl;

    const red = Math.max(0, Math.min(255, Math.round(r * 255)));
    const green = Math.max(0, Math.min(255, Math.round(g * 255)));
    const blue = Math.max(0, Math.min(255, Math.round(bl * 255)));

    return `rgb(${red}, ${green}, ${blue})`;
  }
}
