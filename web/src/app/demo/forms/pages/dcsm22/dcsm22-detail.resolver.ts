import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm22Service } from './dcsm22.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm22DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm22Service, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(error => {
          this.router.navigate(['/Dcsm01']); 
          return of(null);
        })
      );
    }
    return { id: null };
  }
}

