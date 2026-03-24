import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Dcsm39Service } from './dcsm39.service';

@Injectable({
  providedIn: 'root'
})
export class Dcsm39DetailResolver implements Resolve<any> {
  constructor(private service: Dcsm39Service, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id) {

    }
    return { id: null };
  }
}
