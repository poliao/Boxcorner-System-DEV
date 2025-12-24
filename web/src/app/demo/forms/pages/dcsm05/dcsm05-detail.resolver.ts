import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm05Service } from './dcsm05.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm05DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm05Service, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(error => {
          this.router.navigate(['/Dcsm05']); 
          return of(null);
        })
      );
    }
    return { id: null };
  }
}

