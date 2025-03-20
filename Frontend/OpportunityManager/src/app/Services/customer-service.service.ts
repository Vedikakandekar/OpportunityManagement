import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TOKEN_KEY } from '../Shared/constants';
import { Customer } from '../Models/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  constructor(private http : HttpClient) { }

  SaveCustomer(formData:FormData)
  {
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY)});
    return this.http.post(environment.apiBaseUrl+"/Customer/addCustomer", formData,{headers : reqHeader});
  }

  GetAllCustomers(curentPage:number,pageSize : number)
  {
    let params = new HttpParams()
    .set('page',curentPage)
    .set('pageSize',pageSize);
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.get<Customer[]>(environment.apiBaseUrl+"/Customer/getAllCustomers",{headers : reqHeader,params:params});
  }

  GetAllCustomersNonPaginated()
  {

    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.get<Customer[]>(environment.apiBaseUrl+"/Customer/getAllCustomersNonPaginated",{headers : reqHeader});
  }

  editCustomer(formData:any)
  {
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.post(environment.apiBaseUrl+"/Customer/updateCustomer", formData,{headers : reqHeader});
  }

  searchCustomer(searchTerm:string,curentPage:number,pageSize : number)
  {
    let param = new HttpParams()
    .set('page',curentPage)
    .set('pageSize',pageSize)
    .set('searchTerm',searchTerm);
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.get<any[]>(environment.apiBaseUrl+"/Customer/search",{headers : reqHeader,params:param});
  }
}
