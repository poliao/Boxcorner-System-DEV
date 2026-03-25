import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm39Service } from './dcsm39.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm39',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm39.component.html',
  styleUrls: ['./dcsm39.component.scss']
})
export class Dcsm39Component implements OnInit {

  supplierColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'name', label: 'ชื่อผู้จำหน่าย' },
  ];

  brandColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'name', label: 'ชื่อยี่ห้อ' },
  ];

  uomColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'name', label: 'ชื่อหน่วย' },
  ];
  
  materialTypeColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'name', label: 'ชื่อประเภทวัสดุ' },
  ];

  suppliers: any[] = [];
  brands: any[] = [];
  uoms: any[] = [];
  materialTypes: any[] = [];
  activeTab: 'supplier' | 'brand' | 'uom' | 'materialType' = 'supplier';

  constructor(
    private service: Dcsm39Service,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadSuppliers();
    this.loadBrands();
    this.loadUoms();
    this.loadMaterialTypes();
  }

  loadSuppliers() {
    this.service.getAllSuppliers().subscribe(data => this.suppliers = data);
  }

  loadBrands() {
    this.service.getAllBrands().subscribe(data => this.brands = data);
  }

  loadUoms() {
    this.service.getAllUoms().subscribe(data => this.uoms = data);
  }

  loadMaterialTypes() {
    this.service.getAllMaterialTypes().subscribe(data => this.materialTypes = data);
  }

  openDetail(type: string, id?: number) {
    if (id) {
      this.router.navigate(['/Dcsm39Detail', type, id]);
    } else {
      this.router.navigate(['/Dcsm39Detail', type]);
    }
  }

  onRowClick(row: any) {
    this.openDetail(this.activeTab, row.id);
  }
}
