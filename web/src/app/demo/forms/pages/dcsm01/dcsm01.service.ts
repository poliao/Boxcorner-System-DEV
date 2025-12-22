import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dcsm01Service {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl;

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recipes/save`, data);
  }

  getAllRecipes(filterRecipeId: string, filterJobId: string, jobName: string, page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipes/list?recipeid=${filterRecipeId}&jobid=${filterJobId}&jobName=${jobName}&page=${page}&size=${size}`);
  }

  getRecipeById(recipeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipes/detail?recipeId=${recipeId}`);
  }

  getUniqueRecipeIds(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipes/dropdownrecipe?query=${query}`);
  }

  getUniqueJobIds(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipes/dropdownjobid?query=${query}`);
  }

}