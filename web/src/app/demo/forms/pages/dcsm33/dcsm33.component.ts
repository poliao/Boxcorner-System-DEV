import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm33Service } from './dcsm33.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';

@Component({
  selector: 'app-dcsm33',
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm33.component.html',
  styleUrls: ['./dcsm33.component.scss']
})
export class Dcsm33Component implements OnInit {


  tableColumns = [
    { key: '', label: '' },

  ];


  constructor(
    private dcsm33Service: Dcsm33Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private statusColorService: StatusColorService,
  ) { }

  ngOnInit() {

  }
}
