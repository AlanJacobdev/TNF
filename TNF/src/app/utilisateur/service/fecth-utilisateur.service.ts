import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import { UtilisateurInfo } from 'src/structureData/Utilisateur';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FecthUtilisateurService {

  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  /**
   * Recupère l'ensemble des utilisateurs
   * @returns Liste des utilisateurs existant
   */
  async getUtilisateurs() : Promise<any>{
    let url = "http://"+environment.API_URL+"/utilisateur"
    const res : UtilisateurInfo[] = await lastValueFrom(this.http.get<UtilisateurInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
    return undefined;
    } else {
    return res;
    }
  }

  /**
   * Creation d'un utilisateur
   * @param payload : Infirmations utiles à la création
   * @returns Structure du nouvel utilisateur ou erreur
   */
  async createUtilisateur(payload: any) {
    let user = this.navBarService.getLogin();
    payload.profilCreation = user;
    let url = "http://"+environment.API_URL+"/utilisateur"
    
    const res : UtilisateurInfo = await lastValueFrom(this.http.post<UtilisateurInfo>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      const resAny : any = res;
      return resAny.error;
    } else {
      return res;
    }
  }

  /**
   * Modification d'un utilisateur
   * @param idUser : Identifiant de l'utilisateur
   * @param payload : Informations utiles à la modification
   * @returns Structure de l'utilisateur modifiée
   */
  async updateUtilisateur(idUser : number, payload: any) {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/utilisateur/{idUser}"
    url = url.replace("{idUser}", idUser.toString())
    payload.profilModification = user;
    try {
      const res : UtilisateurInfo = await lastValueFrom(this.http.put<UtilisateurInfo>(url, payload, {withCredentials: true}));
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
   * Modifie le mot de passe de l'utilisateur
   * @param selectedUser : Identifiant de l'utilisateur
   * @param payload : Informations utiles à la modification
   * @returns Structure modifiée ou erreur (Mot de passe non retouné = Sécurité )
   */
  async updatePwdUtilisateur(selectedUser: number, payload: any) {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/utilisateur/updatePwd/{idUser}"
    url = url.replace("{idUser}", selectedUser.toString())
    payload.profilModification = user;
    try {
      const res : UtilisateurInfo = await lastValueFrom(this.http.put<UtilisateurInfo>(url, payload, {withCredentials: true}));
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
   * Mise à jour du statut actif d'un utilisateur
   * @param idUser : Identifiant de l'utilisateur
   * @param estActif : Statut d'activité / inactivité : True or false
   * @returns : Structure de l'utilisateur modifiée ou erreur
   */
  async updateActifUser(idUser: number, estActif: boolean) {
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
      const res : UtilisateurInfo = await lastValueFrom(this.http.put<UtilisateurInfo>(url, payload, {withCredentials: true}));
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
   * Suppresion d'un utilisateur
   * @param selectedUser : Identifiant de l'utilisateur
   * @returns Message de valdiation ou erreur
   */
  async deleteUtilisateur(selectedUser: any) {
    let url = "http://"+environment.API_URL+"/utilisateur/{idUser}";
    url = url.replace("{idUser}", selectedUser.toString())
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
