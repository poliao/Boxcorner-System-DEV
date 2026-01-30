import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm25Service } from './dcsm25.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm25DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm25Service, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(Number(id)).pipe(
        catchError(error => {
          console.error('Data not found', error);
          this.router.navigate(['/Dcsm25']); 
          return of(null);
        })
      );
    }
    return { id: null };
  }
}
