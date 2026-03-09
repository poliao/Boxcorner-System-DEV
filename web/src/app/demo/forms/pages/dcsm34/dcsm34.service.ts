import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class Dcsm34Service {
    private apiUrl = `${environment.apiUrl}/api/coating-log`;

    constructor(private http: HttpClient) { }

    getAll(page: number, size: number, filters: any): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (filters.joId) params = params.set('joId', filters.joId);
        if (filters.technicianName) params = params.set('technicianName', filters.technicianName);

        return this.http.get<any>(`${this.apiUrl}/list`, { params });
    }
}
