import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { NavigationItem } from '../theme/layout/admin/navigation/navigation';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = environment.apiUrl;
  private cachedMenu: NavigationItem[] | null = null;

  constructor(private http: HttpClient) {}

  getMenu(): Observable<NavigationItem[]> {
    if (this.cachedMenu) {
      return of(this.cachedMenu);
    }
    
    return this.http.get<NavigationItem[]>(`${this.apiUrl}/menu/getmenu`).pipe(
      tap(menu => this.cachedMenu = menu)
    );
  }

  clearCache(): void {
    this.cachedMenu = null;
  }
}