import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm35Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

}
