import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { Dcsm39Service } from './dcsm39.service';
import { Dcsm38Service } from '../dcsm38/dcsm38.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm39-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm39-detail.component.html',
  styleUrls: ['./dcsm39-detail.component.scss']
})
export class Dcsm39DetailComponent implements OnInit {

  mainForm: FormGroup;
  id: number | null = null;
  type: 'supplier' | 'brand' | 'uom' | 'materialType' | 'material' | 'uomConversion' = 'supplier';
  
  // Data for dropdowns
  materials: any[] = [];
  uoms: any[] = [];
  materialTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: Dcsm39Service,
    private dcsm38Service: Dcsm38Service,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) {
    this.mainForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      // Fields for Material
      code: ['', [Validators.maxLength(50)]],
      baseUom: [null],
      materialType: [null],
      rowVersion: [null],
      // Fields for UOM Conversion
      material: [null],
      largeUom: [null],
      smallUom: [null],
      multiplier: [null]
    });
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.type = params['type'] as any;
    this.id = params['id'] ? Number(params['id']) : null;

    this.loadDropdownData();

    if (this.id) {
      this.loadData();
    } else {
      this.setupForm();
    }
  }

  loadDropdownData() {
    if (this.type === 'material' || this.type === 'uomConversion') {
      this.service.getAllUoms().subscribe(data => this.uoms = data);
      this.service.getAllMaterialTypes().subscribe(data => this.materialTypes = data);
    }
    if (this.type === 'uomConversion') {
      this.service.getAllMaterials().subscribe(data => this.materials = data);
    }
  }

  setupForm() {
    // Add dynamic validation if needed, or just rely on template-based logic
    if (this.type === 'material') {
      this.mainForm.get('code')?.setValidators([Validators.required, Validators.maxLength(50)]);
      this.mainForm.get('baseUom')?.setValidators([Validators.required]);
      this.mainForm.get('name')?.setValidators([Validators.required, Validators.maxLength(255)]);
    } else if (this.type === 'uomConversion') {
      this.mainForm.get('material')?.setValidators([Validators.required]);
      this.mainForm.get('largeUom')?.setValidators([Validators.required]);
      this.mainForm.get('smallUom')?.setValidators([Validators.required]);
      this.mainForm.get('multiplier')?.setValidators([Validators.required, Validators.min(0)]);
      this.mainForm.get('name')?.clearValidators();
    } else {
      this.mainForm.get('name')?.setValidators([Validators.required, Validators.maxLength(255)]);
    }
    this.mainForm.updateValueAndValidity();
  }

  getTypeLabel() {
    if (this.type === 'supplier') return 'ผู้จำหน่าย';
    if (this.type === 'brand') return 'ยี่ห้อ';
    if (this.type === 'uom') return 'หน่วยนับ';
    if (this.type === 'materialType') return 'ประเภทวัสดุ';
    if (this.type === 'material') return 'วัสดุ';
    return 'สูตรการแปลงหน่วย';
  }

  loadData() {
    this.loadingService.show();
    this.setupForm();
    if (this.type === 'supplier') {
      this.service.getAllSuppliers().subscribe(list => this.handleList(list));
    } else if (this.type === 'brand') {
      this.service.getAllBrands().subscribe(list => this.handleList(list));
    } else if (this.type === 'uom') {
      this.service.getAllUoms().subscribe(list => this.handleList(list));
    } else if (this.type === 'materialType') {
      this.service.getAllMaterialTypes().subscribe(list => this.handleList(list));
    } else if (this.type === 'material') {
      this.service.getMaterialById(this.id!).subscribe(data => {
        this.mainForm.patchValue({
          ...data,
          baseUom: data.baseUom?.id,
          materialType: data.materialType?.id,
          rowVersion: data.rowVersion
        });
        this.loadingService.hide();
      });
    } else if (this.type === 'uomConversion') {
      this.dcsm38Service.getConversionById(this.id!).subscribe(data => {
        this.mainForm.patchValue({
          ...data,
          material: data.material?.id,
          largeUom: data.largeUom?.id,
          smallUom: data.smallUom?.id
        });
        this.loadingService.hide();
      });
    }
  }

  handleList(list: any[]) {
    const item = list.find(i => i.id === this.id);
    if (item) this.mainForm.patchValue(item);
    this.loadingService.hide();
  }

  save() {
    if (this.mainForm.invalid) {
      this.sweetAlert.error('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.loadingService.show();
    const data = this.mainForm.getRawValue();
    let obs: Observable<any>;
    
    if (this.type === 'material') {
      const payload = {
        ...data,
        baseUom: data.baseUom ? { id: data.baseUom } : null,
        materialType: data.materialType ? { id: data.materialType } : null
      };
      obs = this.service.saveMaterial(payload);
    } else if (this.type === 'uomConversion') {
      const payload = {
        ...data,
        material: { id: data.material },
        largeUom: { id: data.largeUom },
        smallUom: { id: data.smallUom }
      };
      obs = this.dcsm38Service.saveConversion(payload);
    } else if (this.type === 'supplier') {
      obs = this.service.saveSupplier(data);
    } else if (this.type === 'brand') {
      obs = this.service.saveBrand(data);
    } else if (this.type === 'uom') {
      obs = this.service.saveUom(data);
    } else {
      obs = this.service.saveMaterialType(data);
    }

    obs.subscribe({
      next: () => {
        this.sweetAlert.success('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
        this.router.navigate(['/Dcsm39']);
        this.loadingService.hide()
      },
      error: () => this.loadingService.hide()
    });
  }

  delete() {
    this.sweetAlert.confirm('ยืนยันการลบ', 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?').then(res => {
      if (res.isConfirmed) {
        this.loadingService.show();
        let obs: Observable<any>;
        if (this.type === 'material') obs = this.service.deleteMaterial(this.id!);
        else if (this.type === 'uomConversion') obs = this.dcsm38Service.deleteConversion(this.id!);
        else if (this.type === 'supplier') obs = this.service.deleteSupplier(this.id!);
        else if (this.type === 'brand') obs = this.service.deleteBrand(this.id!);
        else if (this.type === 'uom') obs = this.service.deleteUom(this.id!);
        else obs = this.service.deleteMaterialType(this.id!);

        obs.subscribe({
          next: () => {
            this.sweetAlert.success('สำเร็จ', 'ลบข้อมูลเรียบร้อยแล้ว');
            this.router.navigate(['/Dcsm39']);
          },
          error: () => this.loadingService.hide()
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/Dcsm39']);
  }
}
