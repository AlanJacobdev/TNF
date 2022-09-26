import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import { ParamInfo } from 'src/structureData/Parametre';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchParametreService {

    /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  /**
   * Recupère l'email dédié à l'envoi de notification lors de nouvelle demande de suppression
   * @returns Structure du paramètre atenndu (email)
   */
  async getEmail(){
    let url = "http://"+environment.API_URL+"/parametre/email"
    const res : ParamInfo = await lastValueFrom(this.http.get<ParamInfo>(url, {withCredentials: true}));
    return res;
  }

  /**
   * Mise à jour de l'email dédié à l'envoi de notification lors de nouvelle demande de suppression
   * @param value : Nouvelle valeur de l'email
   * @returns Structure du paramètre modifié (email)
   */
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
      const res : ParamInfo = await lastValueFrom(this.http.put<ParamInfo>(url, payload, {withCredentials: true}));
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
   * Recupère le nombre d'heure servant à limiter les suppressions d'arborescence
   * @returns Structure du paramètre attendu (nbHeure)
   */
  async getnbHeure(){
    let url = "http://"+environment.API_URL+"/parametre/nbHeure"
    const res : ParamInfo = await lastValueFrom(this.http.get<ParamInfo>(url, {withCredentials: true}));
    return res;
  }

  /**
   * Modification du nombre d'heure servant à limiter les suppressions d'arborescence
   * @param value : Nouvelle valeur de nbheure
   * @returns : Structure du paramètre modifié (nbHeure)
   */
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
      const res : ParamInfo = await lastValueFrom(this.http.put<ParamInfo>(url, payload, {withCredentials: true}));
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
