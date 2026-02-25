import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MaterialService {
    private apiUrl = environment.apiUrl + '/materials';

    constructor(private http: HttpClient) { }

    getAllMaterials(searchTerm: string, page: number, size: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/list?searchTerm=${searchTerm}&page=${page}&size=${size}`);
    }

    getMaterialById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/detail?id=${id}`);
    }

    saveMaterial(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/save`, data);
    }

    deleteMaterial(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete?id=${id}`);
    }
}
