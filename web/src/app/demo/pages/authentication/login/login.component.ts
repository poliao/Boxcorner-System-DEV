// angular import
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private sweetAlert: SweetAlertService,private loadingService: LoadingService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Clear expired token on login page
    if (!this.authService.isTokenValid()) {
      this.authService.logout();
    }
  }

  onPasswordKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.which === 13) {
      return;
    }
    const char = String.fromCharCode(event.which);
    if (!/[A-Za-z0-9]/.test(char)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.loginForm.value != null) {
      const { username, password } = this.loginForm.value;
      this.loadingService.show();
      this.authService.login({ username, password }).subscribe({
        next: (response) => {
          this.sweetAlert.success('Login', 'Login successful!');
          this.loadingService.hide();
          this.router.navigate(['/default']);
        },
        error: (error) => {
          console.log(error);
          
          this.loadingService.hide();
          this.sweetAlert.error('Login', 'Login failed!');
        }
      });
    }
  }
}
