import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm36Service } from './dcsm36.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-dcsm36',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm36.component.html',
  styleUrls: ['./dcsm36.component.scss']
})
export class Dcsm36Component implements OnInit {


  tableColumns = [
    { key: '', label: '' },

  ];

  tableData: any[] = [];
  searchParams = {
    startDate: '',
    endDate: ''
  };

  constructor(
    private dcsm36Service: Dcsm36Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService
  ) {
  }

  ngOnInit() {
  }
}
