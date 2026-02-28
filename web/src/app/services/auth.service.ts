import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private menuService: MenuService) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.menuService.clearCache(); // Clear menu cache เมื่อ login ใหม่
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserFromToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  getFullName(): string {
    const user = this.getUserFromToken();
    return user?.sub || 'Unknown';
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return false;
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;

    } catch (error) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.menuService.clearCache(); // Clear menu cache เมื่อ logout
  }
}