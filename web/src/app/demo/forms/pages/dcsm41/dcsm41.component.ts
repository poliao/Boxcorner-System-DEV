import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm41Service } from './dcsm41.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';

@Component({
  selector: 'app-dcsm41',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatButtonModule, DataTableComponent],
  templateUrl: './dcsm41.component.html',
  styleUrls: ['./dcsm41.component.scss']
})
export class Dcsm41Component implements OnInit {

  tableColumns = [
    { key: 'materialId', label: 'ลำดับ' },
    { key: 'materialCode', label: 'รหัสวัสดุ' },
    { key: 'materialName', label: 'ชื่อวัสดุ' },
    { key: 'materialTypeName', label: 'ประเภท' },
    { key: 'largeQty', label: 'ยอดคงเหลือใหญ่' },
    { key: 'largeUomName', label: 'หน่วยใหญ่' },
    { key: 'smallQty', label: 'ยอดคงเหลือเล็ก' },
    { key: 'baseUomName', label: 'หน่วยเล็ก' },
    { key: 'totalBaseQty', label: 'จำนวนรวม (หน่วยเล็ก)' },
    { key: 'displayQuantity', label: 'สรุปจำนวน' }
  ];

  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private service: Dcsm41Service,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  onRowClick(row: any) {
    this.router.navigate(['/Dcsm41Detail', row.materialId]);
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.service.getInventory(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        const content = data.content || data;
        this.totalElements = data.totalElements || data.length;

        this.tableData = content.map(item => {
          const total = item.totalBaseQty || 0;
          const mult = item.multiplier || 1;
          const largeQty = mult > 1 ? Math.floor(total / mult) : 0;
          const smallQty = mult > 1 ? total % mult : total;

          return {
            ...item,
            largeQty: largeQty,
            smallQty: smallQty,
            displayQuantity: this.formatQuantity(item)
          };
        });
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide()
    });
  }

  formatQuantity(item: any): string {
    const total = item.totalBaseQty || 0;
    const mult = item.multiplier || 1;
    
    if (mult <= 1) {
      return `${total} ${item.baseUomName}`;
    }

    const largeQty = Math.floor(total / mult);
    const smallQty = total % mult;

    let display = '';
    if (largeQty > 0) {
      display += `${largeQty} ${item.largeUomName || 'หน่วยใหญ่'}`;
    }
    
    if (smallQty > 0 || largeQty === 0) {
      if (display) display += ' ';
      display += `${smallQty} ${item.baseUomName}`;
    }

    return display;
  }
}
