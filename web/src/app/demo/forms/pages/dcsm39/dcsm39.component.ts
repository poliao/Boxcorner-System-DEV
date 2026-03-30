import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm39Service } from './dcsm39.service';
import { Dcsm38Service } from '../dcsm38/dcsm38.service';
import { Dcsm37Service } from '../dcsm37/dcsm37.service';
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
  
  materialColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'code', label: 'รหัสวัสดุ' },
    { key: 'name', label: 'ชื่อวัสดุ' },
    { key: 'materialType.name', label: 'ประเภท' },
    { key: 'baseUom.name', label: 'หน่วยย่อยสุด' },
  ];

  uomConversionColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'material.name', label: 'วัสดุ' },
    { key: 'largeUom.name', label: 'หน่วยใหญ่' },
    { key: 'smallUom.name', label: 'หน่วยเล็ก' },
    { key: 'multiplier', label: 'อัตราส่วนคูณ' },
  ];

  suppliers: any[] = [];
  brands: any[] = [];
  uoms: any[] = [];
  materialTypes: any[] = [];
  uomConversions: any[] = [];
  materials: any[] = [];
  activeTab: 'material' | 'supplier' | 'brand' | 'uom' | 'materialType' | 'uomConversion' = 'material';

  constructor(
    private service: Dcsm39Service,
    private dcsm38Service: Dcsm38Service,
    private dcsm37Service: Dcsm37Service,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadMaterials();
    this.loadSuppliers();
    this.loadBrands();
    this.loadUoms();
    this.loadMaterialTypes();
    this.loadUomConversions();
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

  loadUomConversions() {
    this.dcsm38Service.getAllConversions().subscribe(data => this.uomConversions = data);
  }

  loadMaterials() {
    this.dcsm37Service.getAllMaterials().subscribe(data => this.materials = data);
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
