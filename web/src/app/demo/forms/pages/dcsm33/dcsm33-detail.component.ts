import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm33Service } from './dcsm33.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';

@Component({
  selector: 'app-dcsm33-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm33-detail.component.html',
  styleUrls: ['./dcsm33-detail.component.scss']
})
export class Dcsm33DetailComponent implements OnInit {

  form: FormGroup;
  filmUsageForm: FormGroup;
  startCoatingForm: FormGroup;

  id: string | null = null;
  isEditMode = false;
  showFilmUsageModal = false;
  showStartCoatingModal = false;
  showFilmDropdown = false;
  selectedFilm: any = null;

  filmStockList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dcsm33Service: Dcsm33Service,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private loadingService: LoadingService
  ) {
    this.createForm();
    this.createFilmUsageForm();
    this.createStartCoatingForm();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id;

    if (this.isEditMode) {
      this.loadData();
    }
  }

  createForm() {
    this.form = this.fb.group({
      id: [null],
      joId: [null, Validators.required],
      jobCustomerName: [null, Validators.required],
      jobOwnerName: [null],
      deliveryDatetime: [null],
      orderDatetime: [null],
      receivedSheetsQty: [0, [Validators.required, Validators.min(0)]],
      requiredSheetsQty: [0, [Validators.required, Validators.min(0)]],
      productJobId: [null],
      createdAt: [null],
      updatedAt: [null],
      rowVersion: [null]
    });

    // Disable auto-generated fields
    this.form.get('id')?.disable();
    this.form.get('joId')?.disable();
    this.form.get('jobCustomerName')?.disable();
    this.form.get('jobOwnerName')?.disable();
    this.form.get('productJobId')?.disable();
    this.form.get('receivedSheetsQty')?.disable();
    this.form.get('requiredSheetsQty')?.disable();
    this.form.get('deliveryDatetime')?.disable();
    this.form.get('orderDatetime')?.disable();
    this.form.get('rowVersion')?.disable();
    this.form.get('createdAt')?.disable();
    this.form.get('updatedAt')?.disable();
  }

  createFilmUsageForm() {
    this.filmUsageForm = this.fb.group({
      id: [null],
      filmSize: [null, Validators.required],
      thickness: [null, Validators.required],
      laminatingTemp: [null, Validators.required],
      filmLot: [null, Validators.required],
      filmManufacturerCode: [null, Validators.required],
      stampedDate: [null, Validators.required],
      purchasedShop: [null, Validators.required]
    });
  }

  createStartCoatingForm() {
    this.startCoatingForm = this.fb.group({
      laminatingTemp: [null, [Validators.required]],
      coatingType: ['เงา', Validators.required],
      filmStockId: [null, Validators.required],
      paperLength: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  loadData() {
    this.loadingService.show();
    this.dcsm33Service.getById(Number(this.id)).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Failed to load detail', err);
        this.sweetAlert.error('Error', 'ไม่สามารถโหลดข้อมูลได้');
        this.loadingService.hide();
        this.goBack();
      }
    });
  }

  openStartCoatingModal() {
    this.startCoatingForm.reset({ coatingType: 'เงา' });
    this.filmStockList = [];
    this.selectedFilm = null;
    this.showFilmDropdown = false;
    this.loadingService.show();
    this.dcsm33Service.getFilmStockAvailable().subscribe({
      next: (data) => {
        this.filmStockList = data;
        this.loadingService.hide();
        this.showStartCoatingModal = true;
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', 'ไม่สามารถโหลดรายการฟิล์มได้');
      }
    });
  }

  closeStartCoatingModal() {
    this.showStartCoatingModal = false;
    this.showFilmDropdown = false;
    this.selectedFilm = null;
    this.startCoatingForm.reset({ coatingType: 'เงา' });
  }

  selectFilm(film: any) {
    this.selectedFilm = film;
    this.startCoatingForm.get('filmStockId')?.setValue(film.id);
    this.showFilmDropdown = false;
  }

  confirmStartCoating() {
    if (this.startCoatingForm.invalid) {
      this.startCoatingForm.markAllAsTouched();
      this.sweetAlert.warning('กรุณากรอกข้อมูลให้ครบ', '');
      return;
    }

    const val = this.startCoatingForm.value;
    const selected = this.filmStockList.find(f => f.id === val.filmStockId);
    const filmName = selected
      ? `${selected.itemName} (${selected.paperSize || ''})`
      : String(val.filmStockId);

    const payload = {
      coatingJobId: Number(this.id),
      laminatingTemp: val.laminatingTemp,
      coatingType: val.coatingType,
      filmStockId: val.filmStockId,
      filmStockName: filmName,
      paperLength: val.paperLength,
    };

    this.loadingService.show();
    this.dcsm33Service.startCoating(payload).subscribe({
      next: () => {
        this.loadingService.hide();
        this.showStartCoatingModal = false;
        this.sweetAlert.success('สำเร็จ', 'เริ่มเคลือบเรียบร้อยแล้ว');
      },
      error: (err) => {
        this.loadingService.hide();
        this.sweetAlert.error('Error', err.error?.error || 'เกิดข้อผิดพลาด');
      }
    });
  }

  save() {
    if (this.form.valid) {
      this.loadingService.show();
      const payload = this.form.getRawValue();
      this.dcsm33Service.save(payload).subscribe({
        next: (res) => {
          this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ');
          this.loadingService.hide();
          this.goBack();
        },
        error: (err) => {
          this.loadingService.hide();
          this.sweetAlert.error('Error', err.error?.message || 'เกิดข้อผิดพลาดในการบันทึก');
        }
      });
    } else {
      this.form.markAllAsTouched();
      this.sweetAlert.warning('Warning', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  goBack() {
    this.router.navigate(['/Dcsm33']);
  }
}
