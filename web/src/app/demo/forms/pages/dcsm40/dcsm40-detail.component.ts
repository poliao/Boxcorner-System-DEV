import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm40Service } from './dcsm40.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';

@Component({
  selector: 'app-dcsm40-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm40-detail.component.html',
  styleUrls: ['./dcsm40-detail.component.scss']
})
export class Dcsm40DetailComponent implements OnInit {

  mainForm: FormGroup;
  id: number | null = null;

  materials: any[] = [];
  suppliers: any[] = [];
  brands: any[] = [];
  conversions: any[] = [];
  availableUoms: any[] = [];
  baseUomName: string = '';

  constructor(
    private fb: FormBuilder,
    private service: Dcsm40Service,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) {
    this.mainForm = this.fb.group({
      id: [null],
      material: [null, Validators.required],
      supplier: [null, Validators.required],
      brand: [null, Validators.required],
      lotNumber: ['', Validators.required],
      receiveUom: [null, Validators.required],
      receiveQty: [0, [Validators.required, Validators.min(0)]],
      baseQty: [{ value: 0, disabled: true }]
    });

    // Watch for material changes to load UOMs
    this.mainForm.get('material')?.valueChanges.subscribe(val => {
      if (val) {
        this.onMaterialChange(val);
      }
    });

    // Watch for qty or UOM changes to calculate base qty
    this.mainForm.get('receiveQty')?.valueChanges.subscribe(() => this.calculateBaseQty());
    this.mainForm.get('receiveUom')?.valueChanges.subscribe(() => this.calculateBaseQty());
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : null;
    if (this.id != null) {
      this.mainForm.get('material').disable();
      this.mainForm.get('supplier').disable();
      this.mainForm.get('brand').disable();
      this.mainForm.get('lotNumber').disable();
      this.mainForm.get('receiveUom').disable();
      this.mainForm.get('receiveQty').disable();
      this.mainForm.get('baseQty').disable();
    }
    this.loadMasters();
    if (this.id) {
      this.loadData();
    }
  }

  loadMasters() {
    this.service.getAllMaterials().subscribe(data => this.materials = data);
    this.service.getAllSuppliers().subscribe(data => this.suppliers = data);
    this.service.getAllBrands().subscribe(data => this.brands = data);
  }

  loadData() {
    this.loadingService.show();
    this.service.getLotById(this.id!).subscribe({
      next: (data) => {
        this.mainForm.patchValue({
          ...data,
          material: data.material?.id,
          supplier: data.supplier?.id,
          brand: data.brand?.id,
          receiveUom: data.receiveUom?.id
        });
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide()
    });
  }

  onMaterialChange(materialId: number) {
    const material = this.materials.find(m => m.id === materialId);
    this.baseUomName = material?.baseUom?.name || '';

    this.service.getConversionsByMaterial(materialId).subscribe(data => {
      this.conversions = data;
      // Filter out UOMs that have conversions for this material
      // Also include the base UOM itself (multiplier 1)
      this.availableUoms = data.map(c => c.largeUom);
      if (material?.baseUom) {
        this.availableUoms.push(material.baseUom);
      }
    });
  }

  calculateBaseQty() {
    const qty = this.mainForm.get('receiveQty')?.value || 0;
    const uomId = this.mainForm.get('receiveUom')?.value;
    const materialId = this.mainForm.get('material')?.value;

    if (!materialId || !uomId) {
      this.mainForm.get('baseQty')?.setValue(0);
      return;
    }

    const material = this.materials.find(m => m.id === materialId);
    if (material?.baseUom?.id === uomId) {
      this.mainForm.get('baseQty')?.setValue(qty);
      return;
    }

    const conversion = this.conversions.find(c => c.largeUom?.id === uomId);
    if (conversion) {
      this.mainForm.get('baseQty')?.setValue(qty * conversion.multiplier);
    } else {
      this.mainForm.get('baseQty')?.setValue(0);
    }
  }

  generateLotNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.mainForm.get('lotNumber')?.setValue(`LOT-${year}${month}${day}-${random}`);
  }

  save() {
    if (this.mainForm.invalid) {
      this.sweetAlert.error('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    const formValue = this.mainForm.getRawValue();
    const payload = {
      ...formValue,
      material: { id: formValue.material },
      supplier: { id: formValue.supplier },
      brand: { id: formValue.brand },
      receiveUom: { id: formValue.receiveUom }
    };

    this.service.saveLot(payload).subscribe({
      next: () => {
        this.sweetAlert.success('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
        this.router.navigate(['/Dcsm40']);
      },
      error: () => this.loadingService.hide()
    });
  }

  delete() {
    this.sweetAlert.confirm('ยืนยันการลบ', 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?').then(res => {
      if (res.isConfirmed) {
        this.loadingService.show();
        this.service.deleteLot(this.id!).subscribe({
          next: () => {
            this.sweetAlert.success('สำเร็จ', 'ลบข้อมูลเรียบร้อยแล้ว');
            this.router.navigate(['/Dcsm40']);
          },
          error: () => this.loadingService.hide()
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/Dcsm40']);
  }
}
