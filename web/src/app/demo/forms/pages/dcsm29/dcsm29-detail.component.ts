import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dcsm29Service } from './dcsm29.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

declare var bootstrap: any;

@Component({
  selector: 'app-dcsm29-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm29-detail.component.html',
  styleUrls: ['./dcsm29-detail.component.scss']
})
export class Dcsm29DetailComponent implements OnInit {

  printJobForm: FormGroup;
  printJobId: string | null = null;
  printLogs: any[] = [];
  extraPrints: any[] = [];
  previousState: any;

  totalMeterImpressions = 0;
  totalMeterColor = 0;
  totalMeterBw = 0;
  totalMeterSpecial = 0;

  orderedQuantity = 0;
  difference = 0;
  extraQuantity = 0;
  printSidedness = '-';
  totalPaperUsed = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dcsm29Service: Dcsm29Service,
    private authService: AuthService,
    private sweetAlert: SweetAlertService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.previousState = history.state;
    this.printJobId = this.route.snapshot.paramMap.get('id');
    if (this.printJobId) {
      this.loadJobDetails(Number(this.printJobId));
      this.loadPrintLogs(Number(this.printJobId));
    }
  }

  createForm() {
    this.printJobForm = this.fb.group({
      id: [null],
      jobId: [null],
      deliveryDate: [null],
      deliveryTime: [null],
      totalPrintSheets: [0],
      customerJobName: [''],
      jobStatus: [''],
      productionQty: [0],
      setupWaste: [0],
      issample: ['']
    });

    this.printJobForm.disable(); // Make form readonly
  }

  loadJobDetails(id: number) {
    this.dcsm29Service.getById(id).subscribe({
      next: (data) => {
        let issampleFormatted = data.issample;
        if (data.issample !== undefined && data.issample !== null) {
          const valUpper = String(data.issample).toUpperCase();
          if (valUpper === 'YES' || valUpper === 'TRUE') {
            issampleFormatted = 'เป็น';
          } else if (valUpper === 'NO' || valUpper === 'FALSE') {
            issampleFormatted = 'ไม่เป็น';
          }
        }

        const formattedData = {
          ...data,
          issample: issampleFormatted
        };
        this.printJobForm.patchValue(formattedData);
        this.calculateDifference();
      },
      error: (err) => {
        console.error('Error loading job:', err);
        this.sweetAlert.error('Error', 'ไม่สามารถโหลดข้อมูลงานได้');
      }
    });
  }

  loadPrintLogs(jobId: number) {
    forkJoin({
      logs: this.dcsm29Service.getLogsByJobId(jobId),
      extra: this.dcsm29Service.getExtraPrintsByJobId(jobId)
    }).subscribe({
      next: (results) => {
        this.printLogs = results.logs || [];
        this.extraPrints = results.extra || [];
        this.calculateMeterUsage();
      },
      error: (err) => {
        console.error('Error loading logs or extra prints:', err);
      }
    });
  }

  calculateMeterUsage() {
    this.totalMeterColor = 0;
    this.totalMeterBw = 0;
    this.totalMeterSpecial = 0;
    this.totalMeterImpressions = 0;
    this.totalPaperUsed = 0;

    if (this.printLogs && this.printLogs.length > 0) {
      this.printLogs.forEach(log => {
        let colorDiff = 0;
        let bwDiff = 0;
        let specialDiff = 0;

        // Color
        if (log.meterColorEnd && log.meterColorStart) {
          colorDiff = log.meterColorEnd - log.meterColorStart;
          this.totalMeterColor += colorDiff;
        }
        // BW
        if (log.meterBwEnd && log.meterBwStart) {
          bwDiff = log.meterBwEnd - log.meterBwStart;
          this.totalMeterBw += bwDiff;
        }
        // Special
        if (log.meterSpecialEnd && log.meterSpecialStart) {
          specialDiff = log.meterSpecialEnd - log.meterSpecialStart;
          this.totalMeterSpecial += specialDiff;
        }

        // Track total paper used
        if (log.totalSheetsUsed) {
          this.totalPaperUsed += log.totalSheetsUsed;
        }

        // Impressions per sheet:
        // Typically, color and special toners hit the same physical sheet simultaneously.
        // Therefore, the total impressions per pass is the max of the individual meters.
        this.totalMeterImpressions += Math.max(colorDiff, bwDiff, specialDiff);
      });
    }

    this.calculateDifference();
  }

  calculateDifference() {
    const totalPrintSheets = this.printJobForm.get('totalPrintSheets')?.value || 0;
    const setupWaste = this.printJobForm.get('setupWaste')?.value || 0;

    let orderedQuantity = totalPrintSheets + setupWaste;

    let hasFront = false;
    let hasBack = false;
    let extraPrintQuantity = 0;

    if (this.extraPrints && this.extraPrints.length > 0) {
      this.extraPrints.forEach(extra => {
        if (extra.status !== 'REJECTED') {
          extraPrintQuantity += extra.additionalQty || 0;
        }
      });
    }

    if (this.printLogs && this.printLogs.length > 0) {
      this.printLogs.forEach(log => {
        if (log.printSide === 'FRONT') hasFront = true;
        if (log.printSide === 'BACK') hasBack = true;
      });

      if (hasFront && hasBack) {
        orderedQuantity = orderedQuantity * 2;
        this.printSidedness = 'หน้า-หลัง (2 หน้า)';
      } else if (hasFront) {
        this.printSidedness = 'หน้าเดียว (Front)';
      } else if (hasBack) {
        this.printSidedness = 'หน้าเดียว (Back)';
      } else {
        this.printSidedness = 'ไม่ทราบ';
      }

      orderedQuantity += extraPrintQuantity;
      this.extraQuantity = extraPrintQuantity;
    } else {
      this.printSidedness = '-';
      this.extraQuantity = 0;
    }

    this.orderedQuantity = orderedQuantity;
    this.difference = this.totalMeterImpressions - this.orderedQuantity;
  }

  getMax(a: number, b: number, c: number): number {
    return Math.max(a, b, c);
  }

  onBack() {
    this.router.navigate(['/Dcsm29'], {
      state: this.previousState
    });
  }
}
