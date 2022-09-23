import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { etat } from 'src/structureData/Item';
import { ObjetRepereUtile } from 'src/structureData/ObjetRepere';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchExportationService {

      /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient) { }



  /**
   * recupère les items correspondant aux filtres suivant
   * @param atelier : Identifiant de l'atelier
   * @param typeObjet : Identifiant du type de l'objet 
   * @param objetRepere : Identifiant de l'objet repère parent
   * @param dateDebut : Début d'intervalle sur la dernière activité effectué sur l'item
   * @param dateFin : Fin d'intervalle sur la dernière activité effectué sur l'item
   * @param etat : Etat de l'item
   * @param estSecurite : L'item est un item de sécurité (true or false)
   * @returns 
   */
  async getExportItem(atelier : string, typeObjet : string, objetRepere : string, dateDebut : string, dateFin : string, etatItem : etat, estSecurite : number): Promise<any> {
    let url = "http://"+environment.API_URL+"/item/getItemForExport/{atelier}/{typeObjet}/{objetRepere}/{dateDebut}/{dateFin}/{estActif}/{estSecurite}"
    url = url.replace("{atelier}", atelier)
    url = url.replace("{typeObjet}", typeObjet)
    url = url.replace("{objetRepere}", objetRepere)
    url = url.replace("{dateDebut}", dateDebut)
    url = url.replace("{dateFin}", dateFin)
    url = url.replace("{estActif}", etat[etatItem])
    url = url.replace("{estSecurite}", estSecurite.toString())
    
    try {
      const res : any[] = await lastValueFrom(this.http.get<any[]>(url, {withCredentials: true}));
      
      if (res.hasOwnProperty('error')) {
        return res[0].error
      } else if (res.length == 0 ){
        return undefined
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
   * Recupère les informations d'un objet repère par son identifiant
   * @param idOr : Identifiant de l'objet repère
   * @returns Identifiant et libellé de l'objet rpeère (ObjetRepereUtile) ou undefined
   */
  async getORbyId (idOr : string) : Promise<any>{
    let url = "http://"+environment.API_URL+"/objetrepere/{idOr}"
    url = url.replace("{idOr}", idOr)
    const res : ObjetRepereUtile = await lastValueFrom(this.http.get<ObjetRepereUtile>(url, {withCredentials: true}));
    if( res == null){
      return undefined
    }
    return res;
  }

}
