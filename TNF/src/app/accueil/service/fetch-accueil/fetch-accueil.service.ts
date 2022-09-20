import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { typeInfoPerDay, typeInfoPerMounth } from 'src/structureData/Accueil';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */

export class FetchAccueilService {

  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
    constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

    /**
     * Retourne le nombre d'activité pour un mois donnée (1er lundi du moins au derniers, peut prendre des jours des jours dans les mois précédent et suivant)
     * @param start Intervalle inférieur (1er lundi)
     * @param end Intervalle supérieur (dernier dimanche)
     * @returns Message d'erreur ou typeInfoPerMounth
     */
    async getNumberOfActivityForEachDay(start : string, end : string) {
        let admin = this.navBarService.getEstAdmin();
        let login = this.navBarService.getLogin();
        let url : string = "";
        if (admin){
          url = "http://"+environment.API_URL+"/service-accueil/getNumberOfActivityForEachDay/{start}/{end}";
        } else {
          url = "http://"+environment.API_URL+"/service-accueil/getNumberOfActivityForEachDay/{start}/{end}/{login}";
          url = url.replace("{login}", login);
        }
        
        url = url.replace("{start}", start);
        url = url.replace("{end}", end);

        try {
            const res : typeInfoPerMounth= await lastValueFrom(this.http.get<typeInfoPerMounth>(url, {withCredentials: true}));
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
     * Retourne les activités d'un jour (creation, suppression ,modification)
     * @param day : Jour recherché 
     * @returns typeInfoPerDay ou Message erreur
     */
    async getHistoryOfOneDay( day : string) {
      
      let admin = this.navBarService.getEstAdmin();
      let login = this.navBarService.getLogin();
      let url : string = "";
      if (admin){
        url = "http://"+environment.API_URL+"/service-accueil/getHistoryOfOneDay/{day}";
      } else {
        url = "http://"+environment.API_URL+"/service-accueil/getHistoryOfOneDay/{day}/{login}";
        url = url.replace("{login}", login);
      }
      url = url.replace("{day}", day);

      
      try {
        const res : typeInfoPerDay= await lastValueFrom(this.http.get<typeInfoPerDay>(url, {withCredentials: true}));
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
