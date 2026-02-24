import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { MenuService } from '../services/menu.service';

@Injectable({
  providedIn: 'root'
})
export class MenuGuard implements CanActivate {
  constructor(private menuService: MenuService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requestedUrl = '/' + route.url.join('/');

    return this.menuService.getMenu().pipe(
      map(menus => {
        const hasAccess = this.checkMenuAccess(menus, requestedUrl);
        if (!hasAccess) {
          this.router.navigate(['/default']);
        }
        return hasAccess;
      }),
      catchError(() => {
        this.router.navigate(['/default']);
        return of(false);
      })
    );
  }

  private checkMenuAccess(menus: any[], url: string): boolean {
    // ตรวจสอบ URL ตรงๆ ก่อน
    for (const menu of menus) {
      if (menu.url === url) return true;
      if (menu.children && this.checkMenuAccess(menu.children, url)) return true;
    }

    // ถ้าเป็นหน้า Detail หรือ Map ให้ตรวจสอบหน้าหลัก
    if (url.includes('Detail') || url.includes('Map')) {
      const mainPageUrl = url.replace(/(Detail|Map).*$/, '');
      return this.checkMenuAccess(menus, mainPageUrl);
    }

    return false;
  }
}