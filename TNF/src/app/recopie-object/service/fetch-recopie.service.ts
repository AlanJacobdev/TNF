import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { ObjetRepereUtile } from 'src/structureData/ObjetRepere';
import { TypeObjet } from 'src/structureData/TypeObject';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchRecopieService {

  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  /**
   * Recupère les types objet (item) lié à un objet repère
   * @param idOR : Identifiant de l'objet repère
   * @returns Liste des types d'objets 
   */
  async getTypeOfItemsOfOR(idOR : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/item/getTypeOfItemsOfOR/{idOR}"
    url = url.replace("{idOR}", idOR)
    const res : TypeObjet[] = await lastValueFrom(this.http.get<TypeObjet[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  
  /**
   * Retourne le libelle et l'identifiant de l'objet repère lié à un numéro unique
   * @param nu : Numéro unique
   * @returns ObjetRepereUtile OU undefined
   */
  async getORByNU(nu : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/objetrepere/getORByNU/{NU}"
    url = url.replace("{NU}", nu)
    const res : ObjetRepereUtile = await lastValueFrom(this.http.get<ObjetRepereUtile>(url, {withCredentials: true}));
    if (res == undefined) {
      return undefined;
    } else {
      return res;
    }
  }

  

  /**
   * Recopie une liste d'item d'un objet repère à un autre
   * @param listItems : Liste des items à recopier
   * @param idOR : Identifiant objet repère source
   * @param nu : Numéro unique cible 
   * @returns Message de validation ou erreur
   */
  async recopySpecificItemFromOR(listItems : any[], idOR: string, nu : string) : Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/service-recopie/recopySpecificItemFromOR/{idOR}/{NU}/{profil}"
    url = url.replace("{idOR}", idOR)
    url = url.replace("{NU}", nu)
    url = url.replace("{profil}", user)
    const res : any = await lastValueFrom(this.http.post<any>(url, listItems, {withCredentials: true}));    
    if (res.length == 0) {
      return undefined;
    } else {
        if(res.hasOwnProperty('error')){
            return res.error;
        } else if (res.hasOwnProperty('message')) {
            return res;
        }
    }
  }

}
