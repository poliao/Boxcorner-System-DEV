import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dcsm33Service } from './dcsm33.service';
import { LoadingService } from '../../../loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dcsm33-detail',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dcsm33-detail.component.html',
  styleUrls: ['./dcsm33-detail.component.scss']
})
export class Dcsm33DetailComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private dcsm33Service: Dcsm33Service,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {

  }

}
