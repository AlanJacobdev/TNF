import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import { UtilisateurInfo } from 'src/structureData/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class FecthUtilisateurService {


  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  async getUtilisateurs() : Promise<any>{
    let url = "http://"+environment.API_URL+"/utilisateur"
    const res : UtilisateurInfo[] = await lastValueFrom(this.http.get<UtilisateurInfo[]>(url));
    if (res.length == 0) {
    return undefined;
    } else {
    return res;
    }
  }

  async createUtilisateur(payload: any) {
    let user = this.navBarService.getLogin();
    payload.profilCreation = user;
    let url = "http://"+environment.API_URL+"/utilisateur"
    
    const res : UtilisateurInfo = await lastValueFrom(this.http.post<UtilisateurInfo>(url, payload));
    if (res.hasOwnProperty('error')) {
      const resAny : any = res;
      return resAny.error;
    } else {
      return res;
    }
  }

  async updateUtilisateur(idUser : number, payload: any) {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/utilisateur/{idUser}"
    url = url.replace("{idUser}", idUser.toString())
    payload.profilModification = user;
    try {
      const res : UtilisateurInfo = await lastValueFrom(this.http.put<UtilisateurInfo>(url, payload));
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

  async updatePwdUtilisateur(selectedUser: number, payload: any) {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/utilisateur/updatePwd/{idUser}"
    url = url.replace("{idUser}", selectedUser.toString())
    payload.profilModification = user;
    try {
      const res : UtilisateurInfo = await lastValueFrom(this.http.put<UtilisateurInfo>(url, payload));
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

  async updateActifAtelier(idUser: number, estActif: boolean) {
    let payload = {
      profilModification: '',
      estActif : false
    };
    let user = this.navBarService.getLogin();
    payload.profilModification = user;
    payload.estActif = estActif;
    let url = "http://"+environment.API_URL+"/utilisateur/updateActif/{idUser}"
    url = url.replace("{idUser}", idUser.toString())
    try {
      const res : UtilisateurInfo = await lastValueFrom(this.http.put<UtilisateurInfo>(url, payload));
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


  async deleteUtilisateur(selectedUser: any) {
    let url = "http://"+environment.API_URL+"/utilisateur/{idUser}";
    url = url.replace("{idUser}", selectedUser.toString())
    try {
        const res : any = await lastValueFrom(this.http.delete<any>(url));
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
