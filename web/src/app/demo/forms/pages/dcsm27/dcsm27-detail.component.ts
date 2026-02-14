import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dcsm27Service } from './dcsm27.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dcsm27-detail.component',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm27-detail.component.html',
  styleUrl: './dcsm27-detail.component.scss'
})
export class Dcsm27DetailComponent implements OnInit {
  printingForm!: FormGroup;
  isEditMode = false;
  id: string | null = null;
  isSample = false;

  showCompleteModal = false;
  latestFileName = new FormControl('', Validators.required);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm27Service: Dcsm27Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;
    this.initForm();

    const resolvedData = this.route.snapshot.data['designDiecut'];
    if (resolvedData) {
      this.patchFormData(resolvedData);
    }
  }

  initForm(): void {
    this.printingForm = this.fb.group({
      rowVersion: [null],
      id: [null],
      createdAt: [null],
      jobId: [null],
      deliveryDate: [null, Validators.required],
      customerJobName: [null],
      jobStatus: [null],
      totalPrintSheets: [null],
      productionQty: [null],
      printerName: [null],
      setupWaste: [null],
      sampleRefNo: [null],
      deliveryTime: [null, Validators.required],
      issample: [null],
      jobType: [null],
      printType: [null],
      paperType: [null],
      diecuttingType: [null],
      coatType: [null],
      systemPrint: [null],
      colorPrint: [null],
      paperGram: [null],
      printingRecordId: [null],
      sampleId: [null],
      productionJobId: [null],
      print2Page: [false],
      typeJob: [null],
      productionOrderId: [null]
    });
    
    if (this.isEditMode) {
      this.printingForm.disable();
    }
  }

  patchFormData(data: any): void {
    const apiData = data as any;
    this.printingForm.patchValue(apiData);
    this.isSample = apiData.issample || false;
  }

  onSave(): void {
    if (this.printingForm.invalid) {
      this.sweetAlert.error('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    const formData = this.printingForm.getRawValue();

    this.dcsm27Service.save(formData).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.sweetAlert.success('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
        this.router.navigate(['/Dcsm27']);
      },
      error: (error) => {
        this.loadingService.hide();
        this.sweetAlert.error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
      }
    });
  }

}
