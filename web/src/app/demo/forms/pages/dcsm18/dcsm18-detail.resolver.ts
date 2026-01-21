import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm18Service } from './dcsm18.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm18DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm18Service, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(error => {
          this.router.navigate(['/Dcsm18']); 
          return of(null);
        })
      );
    }
    return { id: null };
  }
}

