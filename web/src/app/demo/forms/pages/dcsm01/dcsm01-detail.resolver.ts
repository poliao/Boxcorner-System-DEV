import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm01Service } from './dcsm01.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm01DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm01Service, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getRecipeById(id).pipe(
        catchError(error => {
          console.error('Data not found', error);
          this.router.navigate(['/Dcsm01']); 
          return of(null);
        })
      );
    }
    return { id: null };
  }
}

