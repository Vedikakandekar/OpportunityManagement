import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../Shared/constants';
import { environment } from 'src/environments/environment';
import { Customer } from '../Models/Customer';
import { Contacts } from '../Models/Contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {

  constructor(private http: HttpClient) { }

  
  getAllContacts(curentPage:number,pageSize : number)
  {
     let params = new HttpParams()
        .set('page',curentPage)
        .set('pageSize',pageSize);
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.get<Contacts[]>(environment.apiBaseUrl+"/Contacts/getAllContacts",{headers : reqHeader,params:params});
  }

  getContactsRelatedToCustomer(customerId:number)
  {
     let params = new HttpParams()
        .set('customerId',customerId);
       
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.get<any[]>(environment.apiBaseUrl+"/Contacts/GetContactsRelatedToCustomer",{headers : reqHeader,params:params});
  }

  getAllContactsNonPaginated()
  {
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.get<Contacts[]>(environment.apiBaseUrl+"/Contacts/getAllContactsNonPaginated",{headers : reqHeader});
  }
  addContact(formData:FormData)
  {
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY) });
    return this.http.post(environment.apiBaseUrl+"/Contacts/addContact",formData,{headers : reqHeader});
  }

  editContact(formData:any)
  {
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.post(environment.apiBaseUrl+"/Contacts/updateContact",formData,{headers : reqHeader});
  }

  searchContact(searchTerm:string,curentPage:number,pageSize : number)
  {
    let param = new HttpParams()
    .set('page',curentPage)
    .set('pageSize',pageSize)
    .set('searchTerm',searchTerm);
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.get<Customer[]>(environment.apiBaseUrl+"/Contacts/search",{headers : reqHeader,params:param});
  }

}
