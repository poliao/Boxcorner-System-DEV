import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm31Service } from './dcsm31.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm31DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm31Service, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(() => {
          this.router.navigate(['/Dcsm31']);
          return of(null);
        })
      );
    }
    return of(null);
  }
}


