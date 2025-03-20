import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }


  createUser(formData:FormData)
  {
    return this.http.post(environment.apiBaseUrl+'/auth/signup',formData);
  }

  getUserProfileImage()
  {
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return  this.http.get(environment.apiBaseUrl+'/Opportunity/getUserProfileImage',{headers:reqHeader});
  }
  signIn(formData:any)
  {
    return this.http.post(environment.apiBaseUrl+'/auth/signin',formData);
  }
  isLoggedIn()
  {
    return localStorage.getItem(TOKEN_KEY) != null ? true : false;
  }
}
