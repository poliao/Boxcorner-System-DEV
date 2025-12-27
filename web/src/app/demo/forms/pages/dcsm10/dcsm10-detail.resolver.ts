import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm10Service } from './dcsm10.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm10DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm10Service, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(error => {
          this.router.navigate(['/Dcsm10']); 
          return of(null);
        })
      );
    }
    return { id: null };
  }
}

