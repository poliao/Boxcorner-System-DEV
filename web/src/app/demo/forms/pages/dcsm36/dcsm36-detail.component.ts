import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm36Service } from './dcsm36.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';

@Component({
  selector: 'app-dcsm36-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm36-detail.component.html',
  styleUrls: ['./dcsm36-detail.component.scss']
})
export class Dcsm36DetailComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private dcsm36Service: Dcsm36Service,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private loadingService: LoadingService
  ) {

  }

  ngOnInit() {

  }

}
