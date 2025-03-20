import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TOKEN_KEY } from '../Shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ResourceServiceService {

  constructor(private http: HttpClient) { }
 
   
   getAllResources(curentPage:number,pageSize : number)
   {
      let params = new HttpParams()
         .set('page',curentPage)
         .set('pageSize',pageSize);
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.get<any[]>(environment.apiBaseUrl+"/Resources/getAllResources",{headers : reqHeader,params:params});
   }
 
   getAllResourcesNonPaginated()
   {
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.get<any[]>(environment.apiBaseUrl+"/Resources/getAllResourcesNonPaginated",{headers : reqHeader});
   }
   addResource(formData:FormData)
   {
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY) });
     return this.http.post(environment.apiBaseUrl+"/Resources/addResource",formData,{headers : reqHeader});
   }
 
   editResource(formData:any)
   {
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.post(environment.apiBaseUrl+"/Resources/updateResource",JSON.stringify(formData),{headers : reqHeader});
   }
 
   searchResource(searchTerm:string,curentPage:number,pageSize : number)
   {
     let param = new HttpParams()
     .set('page',curentPage)
     .set('pageSize',pageSize)
     .set('searchTerm',searchTerm);
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.get<any[]>(environment.apiBaseUrl+"/Resources/search",{headers : reqHeader,params:param});
   }

   addProjectToResource(projectId:string, resourceIdList: string[])
   {
    const formData = new FormData();
    formData.append('projectId', projectId);

    resourceIdList.forEach(resourceId => {
      formData.append('selectedResourceIds', resourceId);
    });
    //  .set('searchTerm',searchTerm);
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY)});
     return this.http.post<any>(environment.apiBaseUrl+"/Resources/addProjectToResource",formData,{headers : reqHeader});
   }

   deleteResource(resourceId:any)
   {
    let param = new HttpParams()
    .set('resourceId',resourceId);
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.delete(environment.apiBaseUrl+"/Resources/deleteResource",{headers : reqHeader,params:param});
   }
}
