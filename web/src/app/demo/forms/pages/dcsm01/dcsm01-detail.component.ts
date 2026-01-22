import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// ต้อง import FormArray ด้วยครับ
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Dcsm01Service } from 'src/app/demo/forms/pages/dcsm01/dcsm01.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { count } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-docsystem',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dcsm01-detail.component.html',
  styleUrls: ['./dcsm01-detail.component.scss']
})
export class Dcsm01DetailComponent implements OnInit {

  docForm: FormGroup;
  totalWeight: number = 0;
  dbFormulaItems: any[] = [];
  dbTotalWeight: number = 0;
  recipe: any;
  isUpdateMode: boolean = false;
  calculatedColors: any[] = [];
  calculatedTotalWeight: number = 0;

  // ตัวแปรสำหรับ modal เพิ่มน้ำหนัก
  additionalWeight: number = 0;
  selectedColorIndex: number | null = null;
  showAddWeightModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dcsm01Service: Dcsm01Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit() {
    const defaultColors = ['M', 'C', 'Y', 'K'];
    this.createMainForm();

    defaultColors.forEach(item => {
      this.addColorItem(item);
    });

    this.colorForms.valueChanges.subscribe(() => {
      this.calculateTotalWeight();
      this.calresult();
    });
    this.loadDbData();

    this.route.data.subscribe((data) => {
      this.recipe = data['recipeData'];
      if (this.recipe) {
        this.patchDataToForm(this.recipe);
      }
    });
    if (this.docForm.getRawValue().recipeid) {
      this.isUpdateMode = true;
    }
  }

  get colorForms(): FormArray {
    return this.docForm.get('colors') as FormArray;
  }
  calculateTotalWeight() {
    const items = this.colorForms.getRawValue();

    const sumWeight = items.reduce((sum: number, item: any) => {
      const weight = Number(item.weight) || 0;
      return sum + weight;
    }, 0);

    this.totalWeight = Number(sumWeight.toFixed(2));
  }

  createMainForm() {
    this.docForm = this.fb.group({
      recipeid: [null],
      jobid: [null, [Validators.required, Validators.maxLength(100)]],
      jobname: [null, [Validators.maxLength(100)]],
      updatedate: [null],
      updateby: [null],
      reqtotalweight: [null, [Validators.maxLength(10), Validators.pattern('^\\d+(\\.\\d{1,2})?$')]],
      lightness: [null],
      greenred: [null],
      blueyellow: [null],

      colors: this.fb.array([])
    })
    this.docForm.controls['recipeid'].disable({ emitEvent: false });
    this.docForm.controls['updatedate'].disable({ emitEvent: false });
    this.docForm.controls['updateby'].disable({ emitEvent: false });
  }

  createColorItem(defaultColor: string = ''): FormGroup {
    return this.fb.group({
      color: [defaultColor, Validators.required],
      weight: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('^\\d+(\\.\\d{1,2})?$')]],
      lot: ['']
    });
  }

  addColorItem(defaultColor?: string) {
    this.colorForms.push(this.createColorItem(defaultColor));
  }

  removeColorItem(index: number) {
    this.colorForms.removeAt(index);
  }

  onSubmit() {
    if (this.docForm.invalid) {
      this.docForm.markAllAsTouched();
      this.sweetAlert.warning('Warning', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    this.loadingService.show();

    this.dcsm01Service.save(this.docForm.getRawValue()).subscribe({

      next: (res: any) => {
        this.docForm.patchValue({
          recipeid: res.recipeid,
          jobid: res.jobid,
          jobname: res.jobname,
          updatedate: res.updatedate,
          updateby: res.updateby
        });

        const colorControl = this.docForm.get('colors') as FormArray;

        colorControl.clear();

        if (res.colors && Array.isArray(res.colors)) {
          res.colors.forEach((item: any) => {
            const newRow = this.createColorItem();

            newRow.patchValue({
              color: item.colorname,
              weight: item.weight,
              lot: item.lot
            });

            colorControl.push(newRow);
          });
        }

        this.calculateTotalWeight();
        this.loadingService.hide();
        this.isUpdateMode = true;
        this.sweetAlert.success('Success', 'บันทึกข้อมูลสำเร็จ!');

      },
      error: (err) => {
        console.error('Save Error:', err);
        this.sweetAlert.success('Error', (err.error || err.message));
      }
    });
  }

  loadDbData() {
    const dataFromDb = [
    ];

    this.dbFormulaItems = dataFromDb;

    this.calculateDbTotal();
  }

  calculateDbTotal() {
    let sum = 0;
    for (const item of this.dbFormulaItems) {
      sum += Number(item.weight) || 0;
    }
    this.dbTotalWeight = Number(sum.toFixed(2));
  }

  patchDataToForm(recipe: any) {
    this.docForm.patchValue({
      recipeid: recipe.recipeid,
      jobid: recipe.jobid,
      jobname: recipe.jobname,
      updatedate: recipe.updatedate,
      updateby: recipe.updateby,
      reqtotalweight: recipe.reqtotalweight,
      lightness: recipe.lightness,
      greenred: recipe.greenred,
      blueyellow: recipe.blueyellow
    });

    const colorControl = this.docForm.get('colors') as FormArray;
    colorControl.clear();

    if (recipe.colors && Array.isArray(recipe.colors)) {
      recipe.colors.forEach((item: any) => {
        const newRow = this.createColorItem();
        newRow.patchValue({
          color: item.colorname,
          weight: item.weight,
          lot: item.lot
        });
        colorControl.push(newRow);
      });
    }

    this.calculateTotalWeight();
    this.calresult();
  }

  calresult() {
    const reqTotal = Number(this.docForm.get('reqtotalweight')?.value) || 0;
    const currentTotal = this.totalWeight;

    if (currentTotal === 0 || reqTotal === 0) {
      this.calculatedColors = [];
      this.calculatedTotalWeight = 0;
      return;
    }

    const ratio = Number((reqTotal / currentTotal).toFixed(2));

    const currentItems = this.colorForms.getRawValue();
    let runningSum = 0;

    this.calculatedColors = currentItems.map((item: any, index: number) => {
      const originalWeight = Number(item.weight) || 0;
      let newWeight: number;

      if (index === currentItems.length - 1) {
        newWeight = Number((reqTotal - runningSum).toFixed(2));
      } else {
        newWeight = Number((originalWeight * ratio).toFixed(2));
        runningSum += newWeight;
      }

      return {
        color: item.color,
        weight: newWeight,
        lot: item.lot
      };
    });

    this.calculatedTotalWeight = reqTotal;
  }

  get labColorString(): string {

    const l = Number(this.docForm.get('lightness')?.value) || 0;
    const a = Number(this.docForm.get('greenred')?.value) || 0;
    const b = Number(this.docForm.get('blueyellow')?.value) || 0;

    if (this.docForm.get('lightness')?.value === null) {
      return '#f0f0f0';
    }

    return `lab(${l} ${a} ${b})`;
  }

  openAddWeightModal(colorIndex: number) {
    this.selectedColorIndex = colorIndex;
    this.additionalWeight = 0;
    this.showAddWeightModal = true;
  }

  closeAddWeightModal() {
    this.showAddWeightModal = false;
    this.additionalWeight = 0;
    this.selectedColorIndex = null;
  }

  addWeight() {
    if (this.selectedColorIndex !== null && this.additionalWeight && this.additionalWeight > 0) {
      const currentWeight = Number(this.colorForms.at(this.selectedColorIndex).get('weight')?.value) || 0;
      const newWeight = currentWeight + Number(this.additionalWeight);

      this.colorForms.at(this.selectedColorIndex).patchValue({
        weight: newWeight
      });

      this.colorForms.at(this.selectedColorIndex).get('weight')?.updateValueAndValidity();

      this.closeAddWeightModal();
    }
  }
}