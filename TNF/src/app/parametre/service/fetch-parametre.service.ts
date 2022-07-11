import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import { ParamInfo } from 'src/structureData/Parametre';

@Injectable({
  providedIn: 'root'
})
export class FetchParametreService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }


  async getEmail(){
    let url = "http://"+environment.API_URL+"/parametre/email"
    const res : ParamInfo = await lastValueFrom(this.http.get<ParamInfo>(url));
    return res;
  }

  async updateEmail(value : string){
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/parametre/updateEmail/email"
    let payload = {
      valeur: value,
      profilModification: user,
      posteModification: "",
      dateModification: new Date()
    }
    try {
      const res : ParamInfo = await lastValueFrom(this.http.put<ParamInfo>(url, payload));
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

  async getnbHeure(){
    let url = "http://"+environment.API_URL+"/parametre/nbHeure"
    const res : ParamInfo = await lastValueFrom(this.http.get<ParamInfo>(url));
    return res;
  }

  async updateNbHeure(value : number){
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/parametre/updateHeure/nbHeure"
    let payload = {
      valeur: value,
      profilModification: user,
      posteModification: "",
      dateModification: new Date()
    }
    try {
      const res : ParamInfo = await lastValueFrom(this.http.put<ParamInfo>(url, payload));
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

}
