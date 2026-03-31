import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm41Service } from './dcsm41.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-dcsm41-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule, DataTableComponent],
  templateUrl: './dcsm41-detail.component.html',
  styleUrls: ['./dcsm41-detail.component.scss']
})
export class Dcsm41DetailComponent implements OnInit {

  materialId: number;
  material: any;
  lots: any[] = [];
  selectedLot: any;
  lotLogs: any[] = [];

  lotColumns = [
    { key: 'lotNumber', label: 'หมายเลข Lot' },
    { key: 'supplier.name', label: 'ผู้จำหน่าย' },
    { key: 'brand.name', label: 'ยี่ห้อ' },
    { key: 'receiveQty', label: 'จำนวนรับเข้า' },
    { key: 'receiveUom.name', label: 'หน่วยรับเข้า' },
    { key: 'baseQty', label: 'จำนวนคงเหลือ' },
    { key: 'material.baseUom.name', label: 'หน่วยเล็ก' },
    { key: 'createdAt', label: 'วันที่รับเข้า', type: 'datetime' }
  ];

  logColumns = [
    { key: 'transactionDate', label: 'วันที่-เวลา', type: 'datetime' },
    { key: 'transactionType', label: 'ประเภท' },
    { key: 'quantityMajor', label: 'จำนวน (หน่วยใหญ่)' },
    { key: 'quantityMinor', label: 'จำนวน (หน่วยเล็ก)' },
    { key: 'operatorName', label: 'พนักงาน' },
    { key: 'note', label: 'หมายเหตุ' }
  ];

  constructor(
    private route: ActivatedRoute,
    private service: Dcsm41Service,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.materialId = +this.route.snapshot.paramMap.get('id');
    if (this.materialId) {
      this.loadData();
    }
  }

  loadData() {
    this.loadingService.show();
    this.service.getMaterial(this.materialId).subscribe(m => {
      this.material = m;
      this.updateLogColumns();
    });
    this.service.getMaterialConversions(this.materialId).subscribe(conversions => {
      if (conversions && conversions.length > 0) {
        const conv = conversions[0];
        this.logColumns[2].label = `จำนวน (${conv.largeUom?.name || 'หน่วยใหญ่'})`;
        this.logColumns[3].label = `จำนวน (${conv.smallUom?.name || 'หน่วยเล็ก'})`;
      }
    });

    this.service.getLotsByMaterial(this.materialId).subscribe({
      next: (data) => {
        this.lots = data;
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide()
    });
  }

  updateLogColumns() {
    if (this.material && this.material.baseUom) {
      if (this.logColumns[3].label.includes('หน่วยเล็ก')) {
        this.logColumns[3].label = `จำนวน (${this.material.baseUom.name})`;
      }
    }
  }

  onRowClick(row: any) {
    this.viewLotLogs(row);
  }

  viewLotLogs(lot: any) {
    this.selectedLot = lot;
    this.loadingService.show();
    this.service.getLotLogs(lot.id).subscribe({
      next: (res) => {
        this.lotLogs = res.content.map(log => ({
          ...log,
          transactionType: this.translateTransactionType(log.transactionType)
        }));
        this.loadingService.hide();
        // Refresh ยอด baseQty ที่ selected lot ให้เป็นปัจจุบัน
        this.refreshLotData(lot.id);
      },
      error: () => this.loadingService.hide()
    });
  }

  refreshLotData(lotId: number) {
    this.service.getLotById(lotId).subscribe({
      next: (updatedLot) => {
        this.selectedLot = updatedLot;
        // อัปเดต list ด้วย
        const idx = this.lots.findIndex(l => l.id === lotId);
        if (idx !== -1) {
          this.lots[idx] = { ...this.lots[idx], baseQty: updatedLot.baseQty };
          this.lots = [...this.lots]; // trigger change detection
        }
      }
    });
  }

  refreshLotLogs() {
    if (this.selectedLot) {
      this.viewLotLogs(this.selectedLot);
    }
  }

  translateTransactionType(type: string): string {
    const types = {
      'IN': 'รับเข้า',
      'OUT': 'เบิกออก',
      'RETURN': 'คืนสต็อค',
      'ADJUST': 'ปรับปรุง'
    };
    return types[type] || type;
  }

  goBack() {
    this.router.navigate(['/Dcsm41']);
  }

  goToReceiptDetail(lotId: number) {
    this.router.navigate(['/Dcsm40Detail', lotId]);
  }
}
