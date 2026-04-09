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
    { key: 'parent.name', label: 'หมวดหมู่หลัก' },
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

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private service: Dcsm39Service,
    private dcsm38Service: Dcsm38Service,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadActiveTabData();
  }

  onTabChange(tab: any) {
    this.activeTab = tab;
    this.pageIndex = 0; // Reset pagination when switching tabs
    this.loadActiveTabData();
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadActiveTabData();
  }

  loadActiveTabData() {
    this.loadingService.show();
    if (this.activeTab === 'material') this.loadMaterials();
    else if (this.activeTab === 'supplier') this.loadSuppliers();
    else if (this.activeTab === 'brand') this.loadBrands();
    else if (this.activeTab === 'uom') this.loadUoms();
    else if (this.activeTab === 'materialType') this.loadMaterialTypes();
    else if (this.activeTab === 'uomConversion') this.loadUomConversions();
  }

  loadSuppliers() {
    this.service.getAllSuppliers(this.pageIndex, this.pageSize).subscribe(data => {
      this.suppliers = data.content || data;
      this.totalElements = data.totalElements || data.length;
      this.loadingService.hide();
    });
  }

  loadBrands() {
    this.service.getAllBrands(this.pageIndex, this.pageSize).subscribe(data => {
      this.brands = data.content || data;
      this.totalElements = data.totalElements || data.length;
      this.loadingService.hide();
    });
  }

  loadUoms() {
    this.service.getAllUoms(this.pageIndex, this.pageSize).subscribe(data => {
      this.uoms = data.content || data;
      this.totalElements = data.totalElements || data.length;
      this.loadingService.hide();
    });
  }

  loadMaterialTypes() {
    this.service.getAllMaterialTypes(this.pageIndex, this.pageSize).subscribe(data => {
      this.materialTypes = data.content || data;
      this.totalElements = data.totalElements || data.length;
      this.loadingService.hide();
    });
  }

  loadUomConversions() {
    this.dcsm38Service.getAllConversions(this.pageIndex, this.pageSize).subscribe(data => {
      this.uomConversions = data.content || data;
      this.totalElements = data.totalElements || data.length;
      this.loadingService.hide();
    });
  }

  loadMaterials() {
    this.service.getAllMaterials(this.pageIndex, this.pageSize).subscribe(data => {
      this.materials = data.content || data;
      this.totalElements = data.totalElements || data.length;
      this.loadingService.hide();
    });
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
