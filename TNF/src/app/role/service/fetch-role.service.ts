import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import { roleInfo } from 'src/structureData/Role';

@Injectable({
  providedIn: 'root'
})
export class FetchRoleService {
  
   
  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  async getRole() : Promise<any>{
    let url = "http://"+environment.API_URL+"/role"
    const res : roleInfo[] = await lastValueFrom(this.http.get<roleInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
    return undefined;
    } else {
    return res;
    }
  }

  async createRole(payload: any) {
    let user = this.navBarService.getLogin();
    payload.profilCreation = user;
    let url = "http://"+environment.API_URL+"/role"
    
    const res : roleInfo = await lastValueFrom(this.http.post<roleInfo>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      const resAny : any = res;
      return resAny.error;
    } else {
      return res;
    }
  }

  async updateRole(idRole : number ,payload: any) {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/role/{idInformation}"
    url = url.replace("{idInformation}", idRole.toString())
    payload.profilModification = user;
    try {
      const res : roleInfo = await lastValueFrom(this.http.put<roleInfo>(url, payload, {withCredentials: true}));
      if (res.hasOwnProperty('error')) {
        const resAny : any = res;
        return resAny.error;
      } else {
        return res;
      }
    } catch (e : any) {
        let returnError;
        if(e.hasOwnProperty('error')){
          if(e.error.hasOwnProperty('status')){
            returnError=e.error["error"];
          } else {
            returnError=e.error.message[0];
          }
        }
      return returnError;
    }
  }



  async deleteRole(selectedRole: number) {
    let url = "http://"+environment.API_URL+"/role/{idInformation}";
    url = url.replace("{idInformation}", selectedRole.toString())
    try {
        const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));
        if(res.hasOwnProperty('error')){
            return res.error;
        } else if (res.hasOwnProperty('message')) {
            return res;
        }
    } catch (e : any){
      let returnError;
      if(e.hasOwnProperty('error')){
        if(e.error.hasOwnProperty('error')){
          returnError=e.error["error"];
        } else {
          returnError=e.error["message"];
        }
      }
    return returnError;
    }
  }
  

}
