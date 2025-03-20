import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TOKEN_KEY } from '../Shared/constants';
import { Observable } from 'rxjs';
import { Opportunity } from '../Models/Opportunity';
import { Customer } from '../Models/Customer';

@Injectable({
  providedIn: 'root',
})
export class ReportsServiceService {

  constructor(private http: HttpClient) {}

  getKeyMetrics() {
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem(TOKEN_KEY),
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(
      environment.apiBaseUrl + '/Reports/getKeyMetrics',
      { headers: reqHeader}
    );
  }


  getAnalyticsData() {
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem(TOKEN_KEY),
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(
      environment.apiBaseUrl + '/Reports/getAnalyticsData',
      { headers: reqHeader}
    );
  }

 
}
