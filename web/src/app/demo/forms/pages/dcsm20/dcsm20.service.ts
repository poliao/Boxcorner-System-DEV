import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dcsm20Service {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  savePapOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pap/saveJob`, data);
  }

  save(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production-job/save`, data);
  }

  savePrintJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/print-job/save`, data);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-job/getById?id=${id}`);
  }

  getOrdersWithSearch(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      id: filters.id || '',
      jobId: filters.jobId || '',
      customerName: filters.customerName || '',
      printStatus: filters.printStatus || '',
      deliveryStatus: filters.deliveryStatus || '',
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.apiUrl}/production-job/search`, { params: params });
  }

  getOrdersWithSearchSort(page: number, size: number, filters: any): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      id: filters.id || '',
      folderName: filters.folderName || '',
      jobOwner: filters.jobOwner || '',
      responsiblePerson: filters.responsiblePerson || '',
      status: filters.status || '',
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      sortByDeadline: 'true'
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return this.http.get(`${this.apiUrl}/sampleOrders/searchDetailBack`, { params: params });
  }

  countBacklog(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklog`);
  }

  countBacklogShif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogShif`);
  }

  updateStatusConfirm(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateAssign?id=${id}`, {});
  }

  updateStatusDeliver(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusDeliver?id=${id}`, {});
  }

  updateStatusClearFile(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusClearFile?id=${id}`, {});
  }

  updateStatusInspection(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusInspection?id=${id}`, {});
  }

  updateStatusSamples(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusSamples?id=${id}`, {});
  }

  updateStatusSucsess(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/sampleOrders/updateStatusSucsess?id=${id}`, {});
  }

  countBacklogSendBackSample(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sampleOrders/countBacklogSendBackSampleBack`);
  }

  getJobPAP(oid: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pap/getJob?oid=${oid}`);
  }

  updateDataDalivery(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/production/updateDataDalivery?id=${data.id}&dataDalivery=true`, {});
  }

}