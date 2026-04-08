import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PapService {

  private apiUrl = `${environment.apiUrl}/pap`;

  constructor(private http: HttpClient) { }

  getByJobId(jobId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getByJobId?jobId=${jobId}`);
  }

  getJob(oid: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getJob?oid=${oid}`);
  }
}
