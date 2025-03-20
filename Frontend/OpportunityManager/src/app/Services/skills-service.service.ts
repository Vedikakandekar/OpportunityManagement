import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../Shared/constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class SkillsServiceService {

   constructor(private http : HttpClient) { }
 
   SaveSkill(formData:FormData)
   {
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY)});
     return this.http.post(environment.apiBaseUrl+"/Skills/addSkill", formData,{headers : reqHeader});
   }
 
   GetAllSkills(curentPage:number,pageSize : number)
   {
     let params = new HttpParams()
     .set('page',curentPage)
     .set('pageSize',pageSize);
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.get<any[]>(environment.apiBaseUrl+"/Skills/getAllSkills",{headers : reqHeader,params:params});
   }
 
   GetAllSkillsNonPaginated()
   {
 
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.get<any[]>(environment.apiBaseUrl+"/Skills/getAllSkillsNonPaginated",{headers : reqHeader});
   }
 
   editSkill(skillData:any)
   {
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.post(environment.apiBaseUrl+"/Skills/updateSkill", JSON.stringify(skillData),{headers : reqHeader});
   }

   deleteSkill(skillId:any)
   {
    let param = new HttpParams()
    .set('skillId',skillId);
    const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.delete(environment.apiBaseUrl+"/Skills/deleteSkill",{headers : reqHeader,params:param});
   }
 
   searchSkill(searchTerm:string,curentPage:number,pageSize : number)
   {
     let param = new HttpParams()
     .set('page',curentPage)
     .set('pageSize',pageSize)
     .set('searchTerm',searchTerm);
     const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' +localStorage.getItem(TOKEN_KEY), 'Content-Type': 'application/json' });
     return this.http.get<any[]>(environment.apiBaseUrl+"/Skills/search",{headers : reqHeader,params:param});
   }
}
