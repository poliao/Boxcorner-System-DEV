import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dcsm26Service } from './dcsm26.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Dcsm06Service } from '../dcsm06/dcsm06.service';

@Component({
  selector: 'app-dcsm26-detail',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dcsm26-detail.component.html',
  styleUrls: ['./dcsm26-detail.component.scss']
})
export class Dcsm26DetailComponent implements OnInit {
  printingForm: FormGroup;
  checklistForm: FormGroup;
  qcForm: FormGroup;
  id: string | null = null;
  isEditMode = false;
  isPrint = false;
  isInPrint = false;
  recipeList: any[] = [];
  showChecklistModal = false;
  showPrintedQtyModal = false;
  showQcModal = false;
  printedQuantity: number = 0;
  currentPrintStatus: string = '';
  isSample = false;
  currentRound: number = 0;

  // Extra Print
  extraPrints: any[] = [];
  selectedExtraPrint: any = null;
  showExtraPrintChecklistModal = false;
  showExtraPrintQtyModal = false;
  extraPrintedQuantity: number = 0;
  usersList: any[] = [
    {
      "text": "บัญชา"
    },
    {
      "text": "วันชัย"
    }
  ]

  constructor(
    private fb: FormBuilder,
    private dcsm26Service: Dcsm26Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dcsm06Service: Dcsm06Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.createChecklistForm();
    this.createQcForm();
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
    if (this.id) {
      this.loadExtraPrints();
    }
    this.currentRound = resolvedData?.currentRound || 0;
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
      print2Page: [false],
      productionOrderId: [null],
      decisionAuthority: [null],
      decisionAuthorityRemarks: [null],
      sampleJobType: [null],
      samplePrintingSystem: [null],
      samplePrintingStyle: [null],
      samplePrintingColor: [null],
      samplePaperSize: [null],
      samplePaperGrammage: [null],
      sampleCoatingStyle: [null],
      sampleDiecutStyle: [null],
      sampleSpecialInstructions: [null],
      sampleDeliveryTimestamp: [null],
      printRound: [null],
      printRoundPage2: [null],
      currentRound: [0]
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
    this.printingForm.get('decisionAuthority')?.disable();
    this.printingForm.get('print2Page')?.disable();
    this.printingForm.get('sampleJobType')?.disable();
    this.printingForm.get('samplePrintingSystem')?.disable();
    this.printingForm.get('samplePrintingStyle')?.disable();
    this.printingForm.get('samplePrintingColor')?.disable();
    this.printingForm.get('samplePaperSize')?.disable();
    this.printingForm.get('samplePaperGrammage')?.disable();
    this.printingForm.get('sampleCoatingStyle')?.disable();
    this.printingForm.get('sampleDiecutStyle')?.disable();
    this.printingForm.get('sampleSpecialInstructions')?.disable();
    this.printingForm.get('sampleDeliveryTimestamp')?.disable();
    // ไม่ disable currentRound เพื่อให้ส่งค่าได้ตอน save
  }

  createChecklistForm() {
    this.checklistForm = this.fb.group({
      machineType: [null, Validators.required],
      waterTemp: [null, Validators.required],
      ipaValue: [null, Validators.required],
      conductivity: [null, Validators.required],
      airPressure: [null, Validators.required],
      paperBrightness: [null, Validators.required],
      operatorName: [null, Validators.required],
      hasCMYK: [false],
      hasSpecial: [false],
      isNewInk: [false],
      isOldInk: [false],
      cLotNo: [null],
      cBrand: [null],
      mLotNo: [null],
      mBrand: [null],
      yLotNo: [null],
      yBrand: [null],
      kLotNo: [null],
      kBrand: [null],
      plateCondition: [false],
      rubberCondition: [false],
      cleanedBed: [false],
      colorMatchProof: [false],
      colorMatchDigital: [false],
      colorMatchPrevious: [false],
      colorNotSerious: [false],
      printSide: [null],
      status: [null],
      totalProduct: [null],
    });
  }

  createQcForm() {
    this.qcForm = this.fb.group({
      qcColorMatch: [false],
      qcColorConsistency: [false],
      qcInkResidue: [false],
      qcInkTransfer: [false],
      qcStains: [false],
      qcAlignment: [false],
      qcScratches: [false],
      qcMixedJobs: [false],
      printedSheetNumber: [null, [Validators.required, Validators.min(1)]],
      qcRemark: [null]
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
      // Reset round counter whenever a completely new print session starts
      this.currentRound = 0;
      this.checklistForm.patchValue({ machineType: this.printingForm.get('printerName')?.value });
      this.showChecklistModal = true;
    } else if (status === 'WAITPAGE2') {
      // Starting page 2 – reset round counter for page 2 side
      this.currentRound = 0;
      this.checklistForm.patchValue({ machineType: this.printingForm.get('printerName')?.value });
      this.showChecklistModal = true;
    } else if (status === 'PROOF_PAGE2') {
      // Starting proof page 2 – reset round counter
      this.currentRound = 0;
      this.checklistForm.patchValue({ machineType: this.printingForm.get('printerName')?.value });
      this.showChecklistModal = true;
    }
  }

  checkbntPrint() {
    const status = this.printingForm.get('jobStatus')?.value;
    if (status === '' || status === null || status === 'รอพิมพ์') {
      this.isInPrint = true;
      this.isPrint = false;
    } else if (status === 'กำลังพิมพ์ด้านหน้า') {
      this.isPrint = true;
      this.isInPrint = false;
    } else if (status === 'กำลังพิมพ์ด้านหลัง' || status === 'กำลังพิมพ์ส่งลูกค้า' || status === 'กำลังพิมพ์ส่งลูกค้าหน้า 2') {
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

  openNextRoundChecklist() {
    // Open checklist for the next round without resetting the round counter
    this.checklistForm.reset({
      machineType: this.printingForm.get('printerName')?.value, waterTemp: null, ipaValue: null, conductivity: null,
      airPressure: null, paperBrightness: null, hasCMYK: false, hasSpecial: false,
      isNewInk: false, isOldInk: false, cLotNo: null, cBrand: null,
      mLotNo: null, mBrand: null, yLotNo: null, yBrand: null, kLotNo: null, kBrand: null,
      plateCondition: false, rubberCondition: false, cleanedBed: false,
      colorMatchProof: false, colorMatchDigital: false, colorMatchPrevious: false,
      colorNotSerious: false, printSide: null, status: null, totalProduct: null
    });
    this.showChecklistModal = true;
  }

  submitChecklist(status) {
    if (this.checklistForm.valid) {
      this.loadingService.show();

      if (status === 'inPrint') {
        this.printingForm.get('jobStatus')?.setValue('กำลังพิมพ์ด้านหน้า');
        this.checklistForm.get('printSide')?.setValue('FRONT');
        this.checklistForm.get('status')?.setValue('RUNNING');
      } else if (status === 'WAITPAGE2') {
        this.printingForm.get('jobStatus')?.setValue('กำลังพิมพ์ด้านหลัง');
        this.checklistForm.get('printSide')?.setValue('BACK');
        this.checklistForm.get('status')?.setValue('RUNNING');
      } else if (status === 'PROOF') {
        this.printingForm.get('jobStatus')?.setValue('กำลังพิมพ์ส่งลูกค้า');
        this.checklistForm.get('printSide')?.setValue('PROOF');
        this.checklistForm.get('status')?.setValue('RUNNING');
      } else if (status === 'PROOF_PAGE2') {
        this.printingForm.get('jobStatus')?.setValue('กำลังพิมพ์ส่งลูกค้าหน้า 2');
        this.checklistForm.get('printSide')?.setValue('PROOF_BACK');
        this.checklistForm.get('status')?.setValue('RUNNING');
      } else if (status === 'nextRound') {
        // Continue same side for next round – derive side from current jobStatus
        const currentStatus = this.printingForm.get('jobStatus')?.value;
        if (currentStatus === 'กำลังพิมพ์ด้านหลัง') {
          this.checklistForm.get('printSide')?.setValue('BACK');
        } else if (currentStatus === 'กำลังพิมพ์ส่งลูกค้าหน้า 2') {
          this.checklistForm.get('printSide')?.setValue('PROOF_BACK');
        } else if (currentStatus === 'กำลังพิมพ์ส่งลูกค้า') {
          this.checklistForm.get('printSide')?.setValue('PROOF');
        } else {
          this.checklistForm.get('printSide')?.setValue('FRONT');
        }
        this.checklistForm.get('status')?.setValue('RUNNING');
      }
      this.saveRecordOs().subscribe({
        next: (response) => {
          this.printingForm.get('printingRecordId')?.setValue(response.id);
          this.currentRound++;
          this.printingForm.get('currentRound')?.setValue(this.currentRound);
          this.dcsm26Service.save(this.printingForm.getRawValue()).subscribe({
            next: (response) => {
              this.loadingService.hide();
              this.showChecklistModal = false;
              const savedRound = this.currentRound;
              const form = this.printingForm.getRawValue();
              const printRound = form.printRound || 1;
              const printRoundPage2 = form.printRoundPage2 || 1;
              const jobStatus = form.jobStatus;
              const remainingMsg =
                (jobStatus === 'กำลังพิมพ์ด้านหลัง' || jobStatus === 'กำลังพิมพ์ส่งลูกค้าหน้า 2')
                  ? (this.currentRound < printRoundPage2
                    ? `เริ่มพิมพ์หน้า 2 รอบที่ ${this.currentRound}/${printRoundPage2} เรียบร้อย`
                    : 'บันทึกข้อมูลสำเร็จ')
                  : (this.currentRound < printRound
                    ? `เริ่มพิมพ์รอบที่ ${this.currentRound}/${printRound} เรียบร้อย`
                    : 'บันทึกข้อมูลสำเร็จ');
              this.sweetAlert.success('Success', remainingMsg);
              this.printingForm.patchValue(response);
              // restore currentRound หลัง patchValue เพราะ response จาก backend อาจทับค่า
              this.currentRound = savedRound;
              this.printingForm.get('currentRound')?.setValue(savedRound);
            },
            error: (error) => {
              this.loadingService.hide();
              this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
          });
        },
        error: (error) => {
          this.loadingService.hide();
          this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการบันทึก Log');
        }
      });
    } else {
      Object.keys(this.checklistForm.controls).forEach(key => {
        this.checklistForm.get(key)?.markAsTouched();
      });
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลเครื่องพิมพ์และพารามิเตอร์ให้ครบถ้วน');
    }
  }

  saveRecordOs(): Observable<any> {
    const checklist = this.checklistForm.value;
    const form = this.printingForm.getRawValue();
    const data = {
      jobId: form.id,
      machineName: form.printerName,
      tempFountain: checklist.waterTemp,
      ipaPercent: checklist.ipaValue,
      conductivity: checklist.conductivity,
      airPressure: checklist.airPressure,
      paperBrightness: checklist.paperBrightness,
      flagHasCmyk: checklist.hasCMYK,
      flagSpecialColor: checklist.hasSpecial,
      flagInkNew: checklist.isNewInk,
      flagInkOld: checklist.isOldInk,
      clot: checklist.cLotNo,
      cbrand: checklist.cBrand,
      mlot: checklist.mLotNo,
      mbrand: checklist.mBrand,
      ylot: checklist.yLotNo,
      ybrand: checklist.yBrand,
      klot: checklist.kLotNo,
      kbrand: checklist.kBrand,
      checkPlateCondition: checklist.plateCondition,
      checkBlanketCondition: checklist.rubberCondition,
      checkMachineWashed: checklist.cleanedBed,
      refProof: checklist.colorMatchProof,
      refDigital: checklist.colorMatchDigital,
      refOldJob: checklist.colorMatchPrevious,
      refNotSerious: checklist.colorNotSerious,
      status: checklist.status,
      printSide: checklist.printSide,
      operatorName: checklist.operatorName,
      totalProduct: checklist.totalProduct
    };

    return this.dcsm26Service.savePrintLogOs(data);
  }

  updatePrintStatus(status: string): void {
    this.currentPrintStatus = status;
    this.showPrintedQtyModal = true;
  }

  closePrintedQtyModal() {
    this.showPrintedQtyModal = false;
    this.printedQuantity = 0;
  }

  onInkTypeChange(type: string) {
    // Allows CMYK and Special to be selected together, as well as NEW and OLD ink
  }

  confirmPrintComplete(): void {
    if (!this.printedQuantity || this.printedQuantity <= 0) {
      this.sweetAlert.error('Error', 'กรุณากรอกจำนวนที่พิมพ์ได้');
      return;
    }

    this.showPrintedQtyModal = false;
    this.loadingService.show();

    const status = this.currentPrintStatus;
    const is2Page = this.printingForm.getRawValue().print2Page == true;

    const decisionAuthority = this.printingForm.getRawValue().decisionAuthority;
    const requiresApproval = ['sampleToCustomer', 'customerOnSite'].includes(decisionAuthority);

    if (status === 'Print' && !is2Page || status === 'กำลังพิมพ์ด้านหลัง') {
      this.printingForm.get('jobStatus')?.setValue('พิมพ์เสร็จแล้ว');
    } else if (status === 'Print' && is2Page) {
      this.printingForm.get('jobStatus')?.setValue('รอพิมพ์หน้า 2');
    } else if (status === 'กำลังพิมพ์ส่งลูกค้า' && !is2Page) {
      // sampleToCustomer/customerOnSite: ต้องให้เจ้าของงานอนุมัติก่อนพิมพ์จริง
      this.printingForm.get('jobStatus')?.setValue(requiresApproval ? 'รอการอนุมัติผลิต' : 'พิมพ์ส่งลูกค้าเสร็จแล้ว');
    } else if (status === 'กำลังพิมพ์ส่งลูกค้า' && is2Page) {
      this.printingForm.get('jobStatus')?.setValue('รอพิมพ์ส่งลูกค้าหน้า 2');
    } else if (status === 'กำลังพิมพ์ส่งลูกค้าหน้า 2') {
      // sampleToCustomer/customerOnSite: ต้องให้เจ้าของงานอนุมัติหลังพิมพ์ proof ครบทั้ง 2 หน้า
      this.printingForm.get('jobStatus')?.setValue(requiresApproval ? 'รอการอนุมัติผลิต' : 'พิมพ์ส่งลูกค้าเสร็จแล้ว');
    }

    const data = this.printingForm.getRawValue();
    this.dcsm26Service.getLogById(this.printingForm.getRawValue().printingRecordId).subscribe((response) => {
      const now = new Date();
      const offset = 7 * 60 * 60 * 1000;
      response.status = 'COMPLETED';
      response.endTime = new Date(now.getTime() + offset);
      response.totalProduct = this.printedQuantity;
      this.dcsm26Service.savePrintLogOs(response).subscribe({ next: () => { } });
    });

    this.dcsm26Service.save(data).subscribe((response) => {
      const savedStatus = this.printingForm.getRawValue().jobStatus;
      if (!is2Page || status === 'กำลังพิมพ์ด้านหลัง') {
        this.updateProductionJob();
      }
      // ถ้าเป็น sampleToCustomer/customerOnSite และ proof เสร็จ → อัปเดต ProductionOrder ด้วย
      if (savedStatus === 'รอการอนุมัติผลิต') {
        const productionOrderId = this.printingForm.getRawValue().productionOrderId;
        if (productionOrderId) {
          this.dcsm06Service.getById(productionOrderId).subscribe((prodOrder) => {
            if (prodOrder) {
              prodOrder.processStatus = 'รอการอนุมัติผลิต';
              this.dcsm06Service.save(prodOrder).subscribe();
            }
          });
        }
      }
      this.checkbntPrint();
      this.printingForm.patchValue(response);
      this.loadingService.hide();
      this.sweetAlert.success('Success', 'บันทึกจำนวนที่พิมพ์ได้สำเร็จ!');
      this.printedQuantity = 0;
      this.currentRound = 0;
      this.printingForm.get('currentRound')?.setValue(0);
    });
  }

  getJobStatusLabel(): string {
    const value = this.printingForm.get('jobStatus')?.value;
    const labels: Record<string, string> = {
      'PENDING': 'รอพิมพ์',
      'IN_PROGRESS': 'กำลังพิมพ์ด้านหน้า',
      'COMPLETED': 'พิมพ์เสร็จแล้ว',
      'PAUSED': 'หยุดชั่วคราว',
      'WAITPAGE2': 'รอพิมพ์หน้า 2',
      'IN_PROGRESS_PAGE2': 'กำลังพิมพ์ด้านหลัง',
      'PAUSED_PAGE2': 'หยุดชั่วคราว (หน้า 2)',
      'PROOF': 'กำลังพิมพ์ส่งลูกค้า',
      'PROOFCOMPLETED': 'พิมพ์ส่งลูกค้าเสร็จแล้ว',
      'PROOF_WAITPAGE2': 'รอพิมพ์ส่งลูกค้าหน้า 2',
      'PROOF_PAGE2': 'กำลังพิมพ์ส่งลูกค้าหน้า 2',
      'CANCEL': 'ยกเลิก',
      'WAIT_APPROVAL': 'รอการอนุมัติผลิต',
      'APPROVED_FOR_PRODUCTION': 'อนุมัติผลิตแล้ว',
    };
    return labels[value] || value || '';
  }

  getDecisionAuthorityLabel(): string {
    const value = this.printingForm.get('decisionAuthority')?.value;
    const labels = {
      'customerOnSite': 'ลูกค้าเข้าดูงานหน้างาน',
      'sampleToCustomer': 'ขึ้นตัวอย่างส่งลูกค้าตรวจ',
      'salesDecision': 'เซลล์ตัดสินใจแทนลูกค้า',
      'planningDecision': 'ฝ่ายแผนตัดสินใจ',
      'operatorQaDecision': 'ช่างพิมพ์ + QA ร่วมกัน'
    };
    return labels[value] || '';
  }

  getDecisionAuthorityBadge(): string {
    const value = this.printingForm.get('decisionAuthority')?.value;
    const badges = {
      'customerOnSite': 'ลูกค้า',
      'sampleToCustomer': 'ลูกค้า',
      'salesDecision': 'เซลล์',
      'planningDecision': 'ฝ่ายแผน',
      'operatorQaDecision': 'ช่าง/QA'
    };
    return badges[value] || '';
  }

  getDecisionAuthorityDescription(): string {
    const value = this.printingForm.get('decisionAuthority')?.value;
    const descriptions = {
      'customerOnSite': 'รันตามที่ลูกค้าอนุมัติหน้าแท่น',
      'sampleToCustomer': 'รันตามที่ลูกค้าอนุมัติหน้าแท่น',
      'salesDecision': 'รันตามคำสั่งเซลล์ ไม่ปรับนอกคำสั่ง',
      'planningDecision': 'รันตามใบปรู๊ฟและมาตรฐาน',
      'operatorQaDecision': 'ปรับสีให้อยู่ในมาตรฐาน บันทึกเหตุผล'
    };
    return descriptions[value] || '';
  }

  getDecisionAuthorityColor(): string {
    const value = this.printingForm.get('decisionAuthority')?.value;
    const colors = {
      'customerOnSite': '#0d6efd',
      'sampleToCustomer': '#198754',
      'salesDecision': '#ffc107',
      'planningDecision': '#6c757d',
      'operatorQaDecision': '#dc3545'
    };
    return colors[value] || '#6c757d';
  }

  getDecisionAuthorityClass(): string {
    const value = this.printingForm.get('decisionAuthority')?.value;
    const classes = {
      'customerOnSite': 'text-primary',
      'sampleToCustomer': 'text-success',
      'salesDecision': 'text-warning',
      'planningDecision': 'text-secondary',
      'operatorQaDecision': 'text-danger'
    };
    return classes[value] || 'text-secondary';
  }

  getDecisionAuthorityBadgeClass(): string {
    const value = this.printingForm.get('decisionAuthority')?.value;
    const classes = {
      'customerOnSite': 'bg-info text-dark',
      'sampleToCustomer': 'bg-info text-dark',
      'salesDecision': 'bg-warning text-dark',
      'planningDecision': 'bg-secondary',
      'operatorQaDecision': 'bg-danger'
    };
    return classes[value] || 'bg-secondary';
  }

  getCombinedDateTime(field: string): string {
    const value = this.printingForm.get(field)?.value;
    if (!value) return '-';
    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  updateProductionJob() {
    this.dcsm26Service.getByIdProductionJob(this.printingForm.getRawValue().productionJobId).subscribe((response) => {
      if (response.coatingDate != null) {
        response.printStatus = 'กำลังเคลือบ';
        this.sendToProductJob(response);
      } else if (response.stampingDate != null) {
        response.printStatus = 'กำลังปั้ม';
        this.sendToProductJob(response);
      } else if (response.gluingDate != null) {
        response.printStatus = 'กำลังปะ';
        this.sendToProductJob(response);
      } else if (response.qcDate != null) {
        response.printStatus = 'กำลังQc';
        this.sendToProductJob(response);
      }
    })
  }

  sendToProductJob(data: any) {
    this.dcsm26Service.saveProductionJob(data).subscribe({
      next: (response) => {
      },
      error: (error) => {
        this.sweetAlert.error('Error', error.error);
      }
    });
  }

  openQcModal() {
    this.qcForm.reset({
      qcColorMatch: false,
      qcColorConsistency: false,
      qcInkResidue: false,
      qcInkTransfer: false,
      qcStains: false,
      qcAlignment: false,
      qcScratches: false,
      qcMixedJobs: false,
      printedSheetNumber: null,
      qcRemark: null
    });
    this.showQcModal = true;
  }

  closeQcModal() {
    this.showQcModal = false;
  }

  submitQc() {
    if (this.qcForm.valid) {
      this.loadingService.show();
      const form = this.printingForm.getRawValue();
      const qcData = {
        ...this.qcForm.value,
        jobId: form.id,
        operatorName: this.authService.getUserFromToken().sub
      };

      this.dcsm26Service.saveQa(qcData).subscribe({
        next: (response) => {
          this.loadingService.hide();
          this.showQcModal = false;
          this.sweetAlert.success('Success', 'บันทึกข้อมูลแบบฟอร์มเช็คคุณภาพสำเร็จ');
        },
        error: (error) => {
          this.loadingService.hide();
          this.sweetAlert.error('Error', error.error || 'เกิดข้อผิดพลาดในการบันทึกเช็คคุณภาพ');
        }
      });
    } else {
      this.qcForm.markAllAsTouched();
    }
  }

  // ─── Extra Print Methods ───────────────────────────────────────────────────

  loadExtraPrints() {
    if (this.id) {
      this.dcsm26Service.getExtraPrintsByJobId(+this.id).subscribe({
        next: (data: any[]) => {
          this.extraPrints = data;
        },
        error: (err) => console.error('Error loading extra prints:', err)
      });
    }
  }

  selectExtraPrint(print: any) {
    this.selectedExtraPrint = print;
  }

  startExtraPrint(print: any) {
    this.selectedExtraPrint = print;
    this.checklistForm.reset({
      machineType: this.printingForm.get('printerName')?.value, waterTemp: null, ipaValue: null, conductivity: null,
      airPressure: null, paperBrightness: null, hasCMYK: false, hasSpecial: false,
      isNewInk: false, isOldInk: false, cLotNo: null, cBrand: null,
      mLotNo: null, mBrand: null, yLotNo: null, yBrand: null, kLotNo: null, kBrand: null,
      plateCondition: false, rubberCondition: false, cleanedBed: false,
      colorMatchProof: false, colorMatchDigital: false, colorMatchPrevious: false,
      colorNotSerious: false, printSide: null, status: null, totalProduct: null
    });
    this.showExtraPrintChecklistModal = true;
  }

  closeExtraPrintChecklistModal() {
    this.showExtraPrintChecklistModal = false;
    this.selectedExtraPrint = null;
  }

  submitExtraPrintChecklist() {
    if (!this.checklistForm.valid || !this.selectedExtraPrint) {
      Object.keys(this.checklistForm.controls).forEach(key =>
        this.checklistForm.get(key)?.markAsTouched()
      );
      this.sweetAlert.error('Validation', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    this.checklistForm.get('printSide')?.setValue('FRONT');
    this.checklistForm.get('status')?.setValue('RUNNING');

    this.saveRecordOs().subscribe({
      next: (response) => {
        const updateData = {
          id: this.selectedExtraPrint.id,
          printJobId: this.selectedExtraPrint.printJobId,
          additionalQty: this.selectedExtraPrint.additionalQty,
          reason: this.selectedExtraPrint.reason,
          status: 'IN_PROGRESS',
          requestedBy: this.selectedExtraPrint.requestedBy,
          printingRecordId: response.id
        };
        this.dcsm26Service.updateExtraPrint(updateData).subscribe({
          next: () => {
            this.loadingService.hide();
            this.showExtraPrintChecklistModal = false;
            this.loadExtraPrints();
            this.sweetAlert.success('Success', 'เริ่มพิมพ์เพิ่มเรียบร้อย');
          },
          error: () => {
            this.loadingService.hide();
            this.sweetAlert.error('Error', 'ไม่สามารถอัปเดตสถานะพิมพ์เพิ่มได้');
          }
        });
      },
      error: () => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการบันทึก Checklist');
      }
    });
  }

  openStopExtraPrintModal(print: any) {
    this.selectedExtraPrint = print;
    this.extraPrintedQuantity = 0;
    this.showExtraPrintQtyModal = true;
  }

  closeExtraPrintQtyModal() {
    this.showExtraPrintQtyModal = false;
    this.selectedExtraPrint = null;
    this.extraPrintedQuantity = 0;
  }

  confirmExtraPrintAction(action: 'PAUSE' | 'FINISH') {
    if (action === 'FINISH' && (!this.extraPrintedQuantity || this.extraPrintedQuantity <= 0)) {
      this.sweetAlert.error('Error', 'กรุณากรอกจำนวนที่พิมพ์ได้');
      return;
    }
    this.loadingService.show();
    this.showExtraPrintQtyModal = false;

    const logId = this.selectedExtraPrint?.printingRecordId;
    if (logId) {
      this.dcsm26Service.getLogById(logId).subscribe({
        next: (log) => {
          const now = new Date();
          const offset = 7 * 60 * 60 * 1000;
          log.status = 'COMPLETED';
          log.endTime = new Date(now.getTime() + offset);
          log.totalProduct = this.extraPrintedQuantity;
          this.dcsm26Service.savePrintLogOs(log).subscribe();
        }
      });
    }

    const newStatus = action === 'FINISH' ? 'COMPLETED' : 'PAUSED';
    const updateData = {
      id: this.selectedExtraPrint.id,
      printJobId: this.selectedExtraPrint.printJobId,
      additionalQty: this.selectedExtraPrint.additionalQty,
      reason: this.selectedExtraPrint.reason,
      status: newStatus,
      requestedBy: this.selectedExtraPrint.requestedBy,
      printingRecordId: action === 'PAUSE' ? this.selectedExtraPrint.printingRecordId : null
    };
    this.dcsm26Service.updateExtraPrint(updateData).subscribe({
      next: () => {
        this.loadingService.hide();
        this.selectedExtraPrint = null;
        this.loadExtraPrints();
        this.sweetAlert.success('Success', action === 'FINISH' ? 'พิมพ์เพิ่มเสร็จสิ้น' : 'หยุดชั่วคราว');
      },
      error: () => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', 'ไม่สามารถอัปเดตสถานะได้');
      }
    });
  }
}
