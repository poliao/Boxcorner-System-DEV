import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Dcsm32Service {
    private apiUrl = `${environment.apiUrl}/stock-logs`;

    constructor(private http: HttpClient) { }

    searchLogs(page: number, size: number, params: any): Observable<any> {
        let httpParams = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (params.unitStockId) {
            httpParams = httpParams.set('unitStockId', params.unitStockId);
        }
        if (params.transactionType) {
            httpParams = httpParams.set('transactionType', params.transactionType);
        }
        if (params.operatorName) {
            httpParams = httpParams.set('operatorName', params.operatorName);
        }

        return this.http.get<any>(this.apiUrl, { params: httpParams });
    }

    getLogsByUnitStockId(unitStockId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/unit/${unitStockId}`);
    }
}
