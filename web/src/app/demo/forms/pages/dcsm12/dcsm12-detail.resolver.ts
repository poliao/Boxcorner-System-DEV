import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm12Service } from './dcsm12.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm12DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm12Service, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(error => {
          this.router.navigate(['/Dcsm12']); 
          return of(null);
        })
      );
    }
    return { id: null };
  }
}

