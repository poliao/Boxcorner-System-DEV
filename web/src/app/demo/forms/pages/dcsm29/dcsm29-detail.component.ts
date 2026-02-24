import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dcsm29Service } from './dcsm29.service';
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

  totalMeterImpressions = 0;
  totalMeterColor = 0;
  totalMeterBw = 0;
  totalMeterSpecial = 0;

  orderedQuantity = 0;
  difference = 0;

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
      setupWaste: [0]
    });

    this.printJobForm.disable(); // Make form readonly
  }

  loadJobDetails(id: number) {
    this.dcsm29Service.getById(id).subscribe({
      next: (data) => {
        this.printJobForm.patchValue(data);
        this.calculateDifference();
      },
      error: (err) => {
        console.error('Error loading job:', err);
        this.sweetAlert.error('Error', 'ไม่สามารถโหลดข้อมูลงานได้');
      }
    });
  }

  loadPrintLogs(jobId: number) {
    this.dcsm29Service.getLogsByJobId(jobId).subscribe({
      next: (logs) => {
        this.printLogs = logs || [];
        this.calculateMeterUsage();
      },
      error: (err) => {
        console.error('Error loading logs:', err);
      }
    });
  }

  calculateMeterUsage() {
    this.totalMeterColor = 0;
    this.totalMeterBw = 0;
    this.totalMeterSpecial = 0;
    this.totalMeterImpressions = 0;

    this.printLogs.forEach(log => {
      // Color
      if (log.meterColorEnd && log.meterColorStart) {
        this.totalMeterColor += (log.meterColorEnd - log.meterColorStart);
      }
      // BW
      if (log.meterBwEnd && log.meterBwStart) {
        this.totalMeterBw += (log.meterBwEnd - log.meterBwStart);
      }
      // Special
      if (log.meterSpecialEnd && log.meterSpecialStart) {
        this.totalMeterSpecial += (log.meterSpecialEnd - log.meterSpecialStart);
      }
    });

    this.totalMeterImpressions = this.totalMeterColor + this.totalMeterBw + this.totalMeterSpecial;
    this.calculateDifference();
  }

  calculateDifference() {
    const totalPrintSheets = this.printJobForm.get('totalPrintSheets')?.value || 0;
    const setupWaste = this.printJobForm.get('setupWaste')?.value || 0;

    this.orderedQuantity = totalPrintSheets + setupWaste;
    this.difference = this.totalMeterImpressions - this.orderedQuantity;
  }

  onBack() {
    this.router.navigate(['/Dcsm29']);
  }
}
