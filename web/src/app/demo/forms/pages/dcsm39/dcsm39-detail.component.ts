import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm39Service } from './dcsm39.service';
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
  type: 'supplier' | 'brand' | 'uom' = 'supplier';

  constructor(
    private fb: FormBuilder,
    private service: Dcsm39Service,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) {
    this.mainForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.type = params['type'] as any;
    this.id = params['id'] ? Number(params['id']) : null;

    if (this.id) {
      this.loadData();
    }
  }

  getTypeLabel() {
    if (this.type === 'supplier') return 'ผู้จำหน่าย';
    if (this.type === 'brand') return 'ยี่ห้อ';
    return 'หน่วยนับ';
  }

  loadData() {
    this.loadingService.show();
    if (this.type === 'supplier') {
      this.service.getAllSuppliers().subscribe(list => this.handleList(list));
    } else if (this.type === 'brand') {
      this.service.getAllBrands().subscribe(list => this.handleList(list));
    } else {
      this.service.getAllUoms().subscribe(list => this.handleList(list));
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
    let obs;
    if (this.type === 'supplier') obs = this.service.saveSupplier(data);
    else if (this.type === 'brand') obs = this.service.saveBrand(data);
    else obs = this.service.saveUom(data);

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
        let obs;
        if (this.type === 'supplier') obs = this.service.deleteSupplier(this.id!);
        else if (this.type === 'brand') obs = this.service.deleteBrand(this.id!);
        else obs = this.service.deleteUom(this.id!);

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
