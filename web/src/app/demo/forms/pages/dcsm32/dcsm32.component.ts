import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm32Service } from './dcsm32.service';

@Component({
    selector: 'app-dcsm32',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, DataTableComponent],
    templateUrl: './dcsm32.component.html',
    styleUrls: ['./dcsm32.component.scss']
})
export class Dcsm32Component implements OnInit {

    tableColumns = [
        { key: 'id', label: 'รหัสอ้างอิง' },
        { key: 'transactionDate', label: 'วันที่-เวลา', isDate: true },
        { key: 'transactionType', label: 'ประเภทรายการ' },
        { key: 'quantityStr', label: 'จำนวนกระดาษ' },
        { key: 'operatorName', label: 'ผู้ทำรายการ' },
        { key: 'referenceJobId', label: 'รหัสงานพิมพ์อ้างอิง' },
        { key: 'note', label: 'หมายเหตุ' }
    ];

    tableData: any[] = [];
    totalElements = 0;
    pageSize = 20;
    pageIndex = 0;

    searchParams: any = {
        transactionType: '',
        operatorName: ''
    };

    transactionTypes = [
        { value: '', label: 'ทั้งหมด' },
        { value: 'IN', label: 'รับเข้า (IN)' },
        { value: 'OUT', label: 'เบิกใช้ (OUT)' },
        { value: 'RETURN', label: 'คืน (RETURN)' },
        { value: 'ADJUST', label: 'ปรับปรุง (ADJUST)' }
    ];

    constructor(private dcsm32Service: Dcsm32Service) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.dcsm32Service.searchLogs(this.pageIndex, this.pageSize, this.searchParams).subscribe({
            next: (res: any) => {
                // Format data
                this.tableData = (res.content || []).map((row: any) => {
                    row.quantityStr = `${row.quantityMajor || 0} รีม ${row.quantityMinor || 0} ใบ (รวม ${row.totalSheets || 0} ใบ)`;

                    if (row.transactionType === 'IN') row.transactionType = 'รับเข้า (IN)';
                    else if (row.transactionType === 'OUT') row.transactionType = 'เบิกใช้ (OUT)';
                    else if (row.transactionType === 'RETURN') row.transactionType = 'คืน (RETURN)';
                    else if (row.transactionType === 'ADJUST') row.transactionType = 'ปรับปรุง (ADJUST)';

                    return row;
                });

                this.totalElements = res.totalElements || 0;
            },
            error: (err) => console.error('Error loading stock logs', err)
        });
    }

    onPageChange(event: { pageIndex: number; pageSize: number }) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadData();
    }

    onSearch() {
        this.pageIndex = 0;
        this.loadData();
    }

    clearSearch() {
        this.searchParams = { transactionType: '', operatorName: '' };
        this.pageIndex = 0;
        this.loadData();
    }
}
