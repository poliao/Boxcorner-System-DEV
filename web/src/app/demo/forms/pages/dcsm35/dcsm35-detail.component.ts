import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dcsm35Service } from './dcsm35.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';

@Component({
  selector: 'app-dcsm35-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dcsm35-detail.component.html',
  styleUrls: ['./dcsm35-detail.component.scss']
})
export class Dcsm35DetailComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private dcsm35Service: Dcsm35Service,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private loadingService: LoadingService
  ) {

  }

  ngOnInit() {

  }

}
