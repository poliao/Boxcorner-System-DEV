import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { AuthService } from 'src/app/services/auth.service';

import { Dcsm40Service } from './dcsm40.service';

@Component({
  selector: 'app-dcsm40',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm40.component.html',
  styleUrls: ['./dcsm40.component.scss']
})
export class Dcsm40Component implements OnInit {

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'material.name', label: 'วัสดุ' },
    { key: 'lotNumber', label: 'เลข Lot' },
    { key: 'supplier.name', label: 'ผู้จำหน่าย' },
    { key: 'brand.name', label: 'ยี่ห้อ' },
    { key: 'receiveQty', label: 'จำนวนรับเข้า' },
    { key: 'receiveUom.name', label: 'หน่วยรับเข้า' },
    { key: 'baseQty', label: 'จำนวนหน่วยเล็ก' },
    { key: 'material.baseUom.name', label: 'หน่วยเล็ก' },
  ];

  tableData: any[] = [];

  constructor(
    private service: Dcsm40Service,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.service.getAllLots().subscribe({
      next: (data) => {
        this.tableData = data;
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide()
    });
  }

  openDetail(id?: number) {
    if (id) {
      this.router.navigate(['/Dcsm40Detail', id]);
    } else {
      this.router.navigate(['/Dcsm40Detail']);
    }
  }

  onRowClick(row: any) {
    this.openDetail(row.id);
  }
}
