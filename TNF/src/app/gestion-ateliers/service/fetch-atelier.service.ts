import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { Atelier, AtelierInfo } from 'src/structureData/Atelier';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchAtelierService {

  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService) {}

  /**
   * Recupère l'ensemble des ateliers
   * @returns Liste des ateliers existants 
   */
  async getAllAteliers(): Promise<any> {
    let url = "http://"+environment.API_URL+"/atelier"
    const res : AtelierInfo[] = await lastValueFrom(this.http.get<AtelierInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Change le status actif d'un atelier
   * @param idAtelier : Identifiant de l'atelier
   * @param actif : true or false
   * @returns Structure de l'atelier modifié ou undefined
   */
  async updateActifAtelier(idAtelier : string, actif : boolean) : Promise<any>{
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/atelier/{idAtelier}"
    url = url.replace("{idAtelier}", idAtelier)
    let payload = {
      actif : actif,
      profilModification : user,
      posteModification : "",
      dateModification : new Date()
    }
    const res : Atelier = await lastValueFrom(this.http.put<Atelier>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  /**
   * Modifie les paramètre d'un atelier
   * @param id : Identifiant de l'atelier
   * @param libelle : Libelle de l'atelier
   * @returns Structure de l'atelier modifié ou undefined
   */
  async updateAtelier(id : string, libelle : string ) : Promise<any>{
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/atelier/{idAtelier}"
    url = url.replace("{idAtelier}", id)
    let payload = {
      libelleAtelier : libelle,
      profilModification : user,
      posteModification : ''
    }
    const res : Atelier = await lastValueFrom(this.http.put<Atelier>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }

    
  }
  
}
