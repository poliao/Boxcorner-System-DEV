import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm38Service } from './dcsm38.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm38',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm38.component.html',
  styleUrls: ['./dcsm38.component.scss']
})
export class Dcsm38Component implements OnInit {

  tableColumns = [
    { key: 'id', label: 'ลำดับ' },
    { key: 'material.name', label: 'วัสดุ' },
    { key: 'largeUom.name', label: 'หน่วยใหญ่' },
    { key: 'smallUom.name', label: 'หน่วยเล็ก' },
    { key: 'multiplier', label: 'อัตราส่วนคูณ' },
  ];

  tableData: any[] = [];

  constructor(
    private service: Dcsm38Service,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.service.getAllConversions().subscribe({
      next: (data) => {
        this.tableData = data;
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide()
    });
  }

  openDetail(id?: number) {
    if (id) {
      this.router.navigate(['/Dcsm38Detail', id]);
    } else {
      this.router.navigate(['/Dcsm38Detail']);
    }
  }

  onRowClick(row: any) {
    this.openDetail(row.id);
  }
}
