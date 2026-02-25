import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { MaterialService } from './material-inventory.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
    selector: 'app-material-inventory',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, DataTableComponent],
    templateUrl: './material-inventory.component.html',
    styleUrls: ['./material-inventory.component.scss']
})
export class MaterialInventoryComponent implements OnInit {
    tableColumns = [
        { key: 'materialId', label: 'ID' },
        { key: 'category', label: 'หมวดหมู่' },
        { key: 'materialName', label: 'ชื่อวัสดุ' },
        { key: 'materialSize', label: 'ขนาด' },
        { key: 'unitLargeName', label: 'หน่วยใหญ่' },
        { key: 'currentStockLarge', label: 'สต็อกใหญ่' },
        { key: 'unitSmallName', label: 'หน่วยย่อย' },
        { key: 'currentStockSmall', label: 'สต็อกย่อย' },
        { key: 'qtyPerBox', label: 'อัตราบรรจุ' },
        { key: 'totalStockPices', label: 'จำนวนทั้งหมด (ชิ้น)' }
    ];

    tableData: any[] = [];
    totalElements = 0;
    pageSize = 10;
    pageIndex = 0;
    searchTerm = '';

    materialForm: FormGroup;
    isEditMode = false;
    modalInstance: any;

    constructor(
        private fb: FormBuilder,
        private materialService: MaterialService
    ) {
        this.createForm();
    }

    ngOnInit() {
        this.loadData();
    }

    createForm() {
        this.materialForm = this.fb.group({
            materialId: [null],
            materialName: ['', Validators.required],
            materialSize: [''],
            category: [''],
            unitLargeName: ['กล่อง'],
            unitSmallName: ['แผ่น'],
            qtyPerBox: [1, [Validators.required, Validators.min(1)]],
            currentStockLarge: [0, Validators.min(0)],
            currentStockSmall: [0, Validators.min(0)]
        });
    }

    loadData() {
        this.materialService.getAllMaterials(this.searchTerm, this.pageIndex, this.pageSize).subscribe({
            next: (res) => {
                this.tableData = res.content || [];
                this.totalElements = res.totalElements || 0;
            },
            error: (err) => {
                console.error('Error loading materials', err);
            }
        });
    }

    onPageChange(event: { pageIndex: number, pageSize: number }) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadData();
    }

    onSearch(event: any) {
        this.searchTerm = event?.target?.value || '';
        this.pageIndex = 0;
        this.loadData();
    }

    clearSearch() {
        this.searchTerm = '';
        this.pageIndex = 0;
        this.loadData();
    }

    openModal(material?: any) {
        const modalEl = document.getElementById('materialModal');
        if (modalEl) {
            this.modalInstance = new bootstrap.Modal(modalEl);
            if (material) {
                this.isEditMode = true;
                this.materialForm.patchValue(material);
            } else {
                this.isEditMode = false;
                this.materialForm.reset({
                    unitLargeName: 'กล่อง',
                    unitSmallName: 'แผ่น',
                    qtyPerBox: 1,
                    currentStockLarge: 0,
                    currentStockSmall: 0
                });
            }
            this.modalInstance.show();
        }
    }

    closeModal() {
        if (this.modalInstance) {
            this.modalInstance.hide();
        }
    }

    onSubmit() {
        if (this.materialForm.invalid) {
            this.materialForm.markAllAsTouched();
            Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
            return;
        }

        const formData = this.materialForm.getRawValue();
        this.materialService.saveMaterial(formData).subscribe({
            next: () => {
                Swal.fire('สำเร็จ', 'บันทึกข้อมูลเรียบร้อย', 'success');
                this.closeModal();
                this.loadData();
            },
            error: (err) => {
                console.error('Save error', err);
                Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
            }
        });
    }

    onRowClick(row: any) {
        // Open edit modal on row click
        this.openModal(row);
    }
}
