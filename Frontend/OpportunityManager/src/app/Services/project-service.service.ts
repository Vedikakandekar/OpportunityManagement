import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TOKEN_KEY } from '../Shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {

  constructor(private http: HttpClient) { }


    getAllProjects(curentPage:number,pageSize : number)
      {
        let params = new HttpParams()
        .set('page',curentPage)
        .set('pageSize',pageSize);
  
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
        return this.http.get<any[]>(environment.apiBaseUrl+"/Projects/getAllProjects",{headers : reqHeader,params : params});
      }
    
      IsProjectNameUniqueForCustomer(name:string,customerId:string, projectId:string)
      {
        let params = new HttpParams()
      .set('name',name)
      .set('customerId',customerId);
      if (projectId) {
        params = params.set('projectId', projectId);
      }
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY)});
        return this.http.
        get(environment.apiBaseUrl+"/Projects/IsProjectsNameUniqueForCustomer",
          {headers : reqHeader,params:params})
        . pipe(
          map((res:any) => res.res),
          catchError(()=> of(false))
        )
        ;
      }
      addProject(formData:any)
      {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
        return this.http.post(environment.apiBaseUrl+"/Projects/addProject",formData,{headers : reqHeader});
      }
    
      editProject(formData:any)
      {
        const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
        return this.http.post(environment.apiBaseUrl+"/Projects/updateProject",formData,{headers : reqHeader});
      }
       
    filterProjects(curentPage:number,pageSize : number,filters?:any)
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
      return this.http.get<any[]>(environment.apiBaseUrl+`/Projects/filter`,{headers : reqHeader,params:params});
    }
  
}
