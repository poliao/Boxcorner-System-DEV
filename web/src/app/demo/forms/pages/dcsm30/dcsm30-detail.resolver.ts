import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm30Service } from './dcsm30.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm30DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm30Service, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(() => {
          this.router.navigate(['/Dcsm30']);
          return of(null);
        })
      );
    }
    return of(null);
  }
}


