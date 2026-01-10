import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // หรือลบออกถ้าใช้แบบ Module
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 loginForm: FormGroup;
  loginState: 'IDLE' | 'AUTHENTICATING' | 'SUCCESS' = 'IDLE';
  
  tiltX = 0;
  tiltY = 0;

  constructor(private fb: FormBuilder, private loadingService : LoadingService, private authService: AuthService, private sweetAlert: SweetAlertService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(){
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

  // ฟังก์ชันคำนวณการเอียงแบบ 3D ตามเมาส์
  onMouseMove(e: MouseEvent) {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    
    // หาจุดกึ่งกลางการ์ด
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // คำนวณองศา (จำกัดไว้ที่ 10 องศาเพื่อให้ดูนุ่มนวล)
    this.tiltX = ((y - centerY) / centerY) * -10; 
    this.tiltY = ((x - centerX) / centerX) * 10;
  }

  // รีเซ็ตค่าเมื่อเมาส์ออก
  onMouseLeave() {
    this.tiltX = 0;
    this.tiltY = 0;
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