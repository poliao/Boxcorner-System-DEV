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
  checklistForm: FormGroup;
  id: string | null = null;
  isEditMode = false;
  isPrint = false;
  isInPrint = false;
  recipeList: any[] = [];
  showChecklistModal = false;
  isSample = false;

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
    this.createChecklistForm();
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    const resolvedData = this.route.snapshot.data['designDiecut'];
    if (resolvedData) {
      this.printingForm.patchValue(resolvedData);
      this.loadRecipeList(resolvedData.jobId);
    }
    if (this.printingForm.getRawValue().issample == true) {
      this.isSample = true
    } else {
      this.isSample = false
    }
    this.checkbntPrint();
  }

  createForm() {
    this.printingForm = this.fb.group({
      id: [null],
      jobId: [null, Validators.required],
      customerJobName: ['', Validators.required],
      totalPrintSheets: [0],
      productionQty: [0],
      printerName: [null],
      setupWaste: [null],
      sampleId: [null],
      deliveryDate: [null],
      deliveryTime: [null],
      printingResponsible: ['', Validators.required],
      stampingDate: [null],
      stampingResponsible: [''],
      gluingDate: [null],
      gluingResponsible: [''],
      qcDate: [null],
      dueDate: ['', Validators.required],
      jobStatus: [''],
      shippingAddress: [''],
      remark: [''],
      deliveryStatus: [''],
      imageUrl: [null],
      dataDalivery: [false],
      machineSetupCount: [''],
      rowVersion: [null],
      printingRecordId: [null],
      issample: [false],
      jobType: [null],
      printType: [null],
      paperType: [null],
      diecuttingType: [null],
      coatType: [null],
      systemPrint: [null],
      colorPrint: [null],
      paperGram: [null],
      productionJobId: [null],
    });
    this.printingForm.get('createdAt')?.disable();
    this.printingForm.get('jobId')?.disable();
    this.printingForm.get('customerJobName')?.disable();
    this.printingForm.get('totalPrintSheets')?.disable();
    this.printingForm.get('productionQty')?.disable();
    this.printingForm.get('printerName')?.disable();
    this.printingForm.get('setupWaste')?.disable();
    this.printingForm.get('sampleId')?.disable();
    this.printingForm.get('deliveryDate')?.disable();
    this.printingForm.get('deliveryTime')?.disable();
    this.printingForm.get('printingResponsible')?.disable();
    this.printingForm.get('stampingDate')?.disable();
    this.printingForm.get('stampingResponsible')?.disable();
    this.printingForm.get('gluingDate')?.disable();
    this.printingForm.get('gluingResponsible')?.disable();
    this.printingForm.get('qcDate')?.disable();
    this.printingForm.get('dueDate')?.disable();
    this.printingForm.get('jobStatus')?.disable();
    this.printingForm.get('shippingAddress')?.disable();
    this.printingForm.get('remark')?.disable();
    this.printingForm.get('deliveryStatus')?.disable();
    this.printingForm.get('imageUrl')?.disable();
    this.printingForm.get('dataDalivery')?.disable();
    this.printingForm.get('machineSetupCount')?.disable();
    this.printingForm.get('rowVersion')?.disable();
    this.printingForm.get('printingRecordId')?.disable();
    this.printingForm.get('issample')?.disable();
    this.printingForm.get('jobType')?.disable();
    this.printingForm.get('printType')?.disable();
    this.printingForm.get('paperType')?.disable();
    this.printingForm.get('diecuttingType')?.disable();
    this.printingForm.get('coatType')?.disable();
    this.printingForm.get('systemPrint')?.disable();
    this.printingForm.get('colorPrint')?.disable();
    this.printingForm.get('paperGram')?.disable();
  }

  createChecklistForm() {
    this.checklistForm = this.fb.group({
      waterTemp: [''],
      ipaValue: [''],
      conductivity: [''],
      airPressure: [''],
      hasCMYK: [false],
      hasSpecial: [false],
      isNewInk: [false],
      isOldInk: [false],
      cLotNo: [''],
      cBrand: [''],
      mLotNo: [''],
      mBrand: [''],
      yLotNo: [''],
      yBrand: [''],
      kLotNo: [''],
      kBrand: [''],
      plateCondition: [false],
      rubberCondition: [false],
      cleanedBed: [false],
      colorMatchProof: [false],
      colorMatchDigital: [false],
      colorMatchPrevious: [false],
      colorNotSerious: [false],
    });
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
    if (status === 'inPrint') {
      this.showChecklistModal = true;
      return;
    }

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

  checkbntPrint() {
    if (this.printingForm.get('jobStatus')?.value === '' || this.printingForm.get('jobStatus')?.value === null) {
      this.isInPrint = true;
      this.isPrint = false;
    } else if (this.printingForm.get('jobStatus')?.value === 'กำลังพิมพ์') {
      this.isPrint = true;
      this.isInPrint = false;
    } else {
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

  closeChecklistModal() {
    this.showChecklistModal = false;
  }

  submitChecklist() {
    if (this.printingForm.valid) {
      this.loadingService.show();
      this.printingForm.get('printStatus')?.setValue('กำลังพิมพ์');
      const data = {
        ...this.printingForm.getRawValue(),
        checklist: this.checklistForm.value
      };

      this.dcsm26Service.save(data).subscribe((response) => {
        this.checkbntPrint();
        this.printingForm.patchValue(response);
        this.loadingService.hide();
        this.showChecklistModal = false;
        this.sweetAlert.success('Success', 'เริ่มพิมพ์สำเร็จ!');
      });
    } else {
      this.markFormGroupTouched();
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
}
