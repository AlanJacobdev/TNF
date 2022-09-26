import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import { roleInfo } from 'src/structureData/Role';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchRoleService {
  
  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  /**
   * Recupère l'ensemble des rôles 
   * @returns Liste des rôles existant
   */
  async getRole() : Promise<any>{
    let url = "http://"+environment.API_URL+"/role"
    const res : roleInfo[] = await lastValueFrom(this.http.get<roleInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
    return undefined;
    } else {
    return res;
    }
  }

  /**
   * Création d'un rôle
   * @param payload : Informations utiles à la création du rôle
   * @returns Structure du nouveau rôle ou erreur
   */
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

  /**
   * Modification d'un rôle
   * @param idRole : Identifiant du rôle
   * @param payload : Informations utiles à la modification
   * @returns Structure du rôle modifié ou erreur
   */
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


  /**
   * Suppression d'un rôle 
   * @param selectedRole : Identifiant du rôle à modifier
   * @returns Message de validation ou erreur
   */
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
