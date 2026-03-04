import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm33Service } from './dcsm33.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm33DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm33Service, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(error => {
          console.error('Data not found', error);
          this.router.navigate(['/Dcsm33']);
          return of(null);
        })
      );
    }
    return { id: null };
  }
}
