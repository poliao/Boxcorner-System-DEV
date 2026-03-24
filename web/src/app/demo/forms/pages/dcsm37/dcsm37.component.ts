import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm37Service } from './dcsm37.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { AuthService } from 'src/app/services/auth.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dcsm37',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm37.component.html',
  styleUrls: ['./dcsm37.component.scss']
})
export class Dcsm37Component implements OnInit {

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'code', label: 'รหัสวัสดุ' },
    { key: 'name', label: 'ชื่อวัสดุ' },
    { key: 'baseUom.name', label: 'หน่วยย่อยสุด' },
  ];

  tableData: any[] = [];

  constructor(
    private service: Dcsm37Service,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.service.getAllMaterials().subscribe({
      next: (data) => {
        this.tableData = data;
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide()
    });
  }

  openDetail(id?: number) {
    if (id) {
      this.router.navigate(['/Dcsm37Detail', id]);
    } else {
      this.router.navigate(['/Dcsm37Detail']);
    }
  }

  onRowClick(row: any) {
    this.openDetail(row.id);
  }
}
