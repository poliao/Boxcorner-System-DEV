import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm26Service } from './dcsm26.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm26DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm26Service, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(error => {
          console.error('Data not found', error);
          this.router.navigate(['/Dcsm26']); 
          return of(null);
        })
      );
    }
    return { id: null };
  }
}
