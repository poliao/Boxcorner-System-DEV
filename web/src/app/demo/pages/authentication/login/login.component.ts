import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('card') cardRef!: ElementRef;
  
  loginForm: FormGroup;
  status: 'IDLE' | 'LOADING' | 'SUCCESS' = 'IDLE';
  
  // Text Animation
  titleText = 'System';
  displayTitle = '';
  private chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
  private intervalId: any;
  
  focusedField: string | null = null;

  constructor(private fb: FormBuilder, private loadingService: LoadingService, private authService: AuthService,private sweetAlert: SweetAlertService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.authService.isTokenValid()) {
      this.authService.logout();
    }
    this.animateText();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  animateText() {
    let iteration = 0;
    this.intervalId = setInterval(() => {
      this.displayTitle = this.titleText
        .split('')
        .map((letter, index) => {
          if (index < iteration) return this.titleText[index];
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');

      if (iteration >= this.titleText.length) clearInterval(this.intervalId);
      iteration += 1 / 3;
    }, 50);
  }

  onMouseMove(e: MouseEvent) {
    const card = this.cardRef.nativeElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3; 
    const rotateY = ((x - centerX) / centerX) * 3;  

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  onMouseLeave() {
    const card = this.cardRef.nativeElement;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    card.style.setProperty('--mouse-x', `-1000px`);
    card.style.setProperty('--mouse-y', `-1000px`);
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

  setFocus(fieldName: string) {
    this.focusedField = fieldName;
  }

  removeFocus() {
    this.focusedField = null;
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
}