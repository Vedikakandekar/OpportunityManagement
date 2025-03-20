import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../Shared/constants';
import { environment } from 'src/environments/environment';
import { catchError, map, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OpportunityServiceService {

  constructor(private http : HttpClient) { }
 
  getAllOpportunities(curentPage:number,pageSize : number)
    {
      let params = new HttpParams()
      .set('page',curentPage)
      .set('pageSize',pageSize);

      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
      return this.http.get<any[]>(environment.apiBaseUrl+"/Opportunity/getAllOpportunities",{headers : reqHeader,params : params});
    }
   
    getOpportunitiesRelatedToCustomer(customerId:number)
    {
      let params = new HttpParams()
      .set('customerId',customerId);

      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
      return this.http.get<any[]>(environment.apiBaseUrl+"/Opportunity/GetOpportunitiesRelatedToCustomer",{headers : reqHeader,params : params});
    }
  

    IsOpportunityNameUniqueForCustomer(name:string,customerId:string, opportunityId:string)
    {
      let params = new HttpParams()
    .set('name',name)
    .set('customerId',customerId);
    if (opportunityId) {
      params = params.set('opportunityId', opportunityId);
    }
      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY)});
      return this.http.
      get(environment.apiBaseUrl+"/Opportunity/IsOpportunityNameUniqueForCustomer",
        {headers : reqHeader,params:params})
      . pipe(
        map((res:any) => res.res),
        catchError(()=> of(false))
      )
      ;
    }
    addOpportunity(formData:any)
    {
      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
      return this.http.post(environment.apiBaseUrl+"/Opportunity/addOpportunity",formData,{headers : reqHeader});
    }
  
    editOpportunity(formData:any)
    {
      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
      return this.http.post(environment.apiBaseUrl+"/Opportunity/updateOpportunity",formData,{headers : reqHeader});
    }
     
  filterOpportunity(curentPage:number,pageSize : number,filters?:any)
  {
    let params = new HttpParams()
    .set('page',curentPage)
    .set('pageSize',pageSize);
    if(filters)
    {
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    });
  }
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
    return this.http.get<any[]>(environment.apiBaseUrl+`/Opportunity/filter`,{headers : reqHeader,params:params});
  }

  // filterOpportunity(filters:any,curentPage:number,pageSize : number)
  // {
  //   let params = new HttpParams()
  //   .set('page',curentPage)
  //   .set('pageSize',pageSize);
  
  //   Object.keys(filters).forEach((key) => {
  //     if (filters[key]) {
  //       params = params.append(key, filters[key]);
  //     }
  //   });
  //   const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
  //   return this.http.get<any[]>(environment.apiBaseUrl+`/Opportunity/filter`,{params:params, headers : reqHeader});
  // }
}
