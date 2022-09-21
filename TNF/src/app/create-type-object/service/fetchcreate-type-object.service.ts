import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { TypeObjetInfo, TypeObjetRepereInfo } from 'src/structureData/TypeObject';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchcreateTypeObjectService {

    /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  /**
   * Recupère l'ensemble des types d'objets repères
   * @returns Liste des types d'objets repères
   */
  async getTypeObjetRepere(): Promise<any> {
    let user = this.navBarService.getLogin();
    let admin = this.navBarService.getEstAdmin();
    let url
    if (admin){
      url = "http://"+environment.API_URL+"/typeobjetrepere"
    }else{
      url =  "http://"+environment.API_URL+"/typeobjetrepere/findAllTypeORForUser/{profil}"
      url = url.replace("{profil}", user)
    }
    const res : TypeObjetRepereInfo[] = await lastValueFrom(this.http.get<TypeObjetRepereInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Retourne la liste des types d'objets
   * @returns Liste des types d'objets
   */
  async getTypeObjet(): Promise<any> {
    let url = "http://"+environment.API_URL+"/typeobjet"
    const res : TypeObjetInfo[] = await lastValueFrom(this.http.get<TypeObjetInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Création d'un type d'objet repère
   * @param ID : Identifiant du type d'objet repère
   * @param libelle : Libelle du type d'objet repère
   * @param actif : Le type est actif ou non (true false)
   * @returns Structure du type d'objet repère ou erreur
   */
  async createTypeOR(ID: string, libelle : string, actif :boolean): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjetrepere"
    let payload = {
      idTypeOR : ID.toUpperCase(),
      libelleTypeOR : libelle,
      profilCreation : user,
      posteCreation : "",
      actif : actif
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.post<TypeObjetRepereInfo>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  /**
   * Modification du type d'objet repère 
   * @param ID : Identifiant du type d'objet repère
   * @param libelle : Libelle du type d'objet repère
   * @param actif : Le type est actif ou non (true false)
   * @returns Structure du type d'objet repère modifié ou erreur
   */
  async updateTypeOR(ID: string, libelle : string, actif : boolean): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjetrepere/{ID}"
    url = url.replace("{ID}", ID)
    let payload = {
      libelleTypeOR : libelle,
      profilModification : user,
      posteModification : "",
      actif : actif
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.put<TypeObjetRepereInfo>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  /**
   * Suppression d'un type d'objet repère
   * @param ID : Identifiant du type d'objet repère
   * @returns Message d'erreur ou de validation
   */
  async deleteTypeOR(ID: string): Promise<any> {
    let url = "http://"+environment.API_URL+"/typeobjetrepere/{ID}"
    url = url.replace("{ID}", ID)
    const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }


  /**
   * Création d'un type d'objet
   * @param ID : Identifiant du type d'objet
   * @param libelle : Libelle du type d'objet 
   * @param actif : Le type est actif ou non (true false)
   * @returns Structure du type d'objet ou erreur
   */
  async createTypeO(ID: string, libelle : string, actif : boolean): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjet"
    let payload = {
      idType : ID.toUpperCase(),
      libelleType : libelle,
      profilCreation : user,
      posteCreation : "",
      actif : actif
    }
    const res : any = await lastValueFrom(this.http.post<any>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return res['error'];
    } else {
      return res;
    }
  }

    /**
   * Modification du type d'objet 
   * @param ID : Identifiant du type d'objet
   * @param libelle : Libelle du type d'objet 
   * @param actif : Le type est actif ou non (true false)
   * @returns Structure du type d'objet modifié ou erreur
   */
  async updateTypeO(ID: string, libelle : string, actif : boolean): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjet/{ID}"
    url = url.replace("{ID}", ID)
    let payload = {
      libelleType : libelle,
      profilModification : user,
      posteModification : "",
      actif : actif
    }
    const res : any = await lastValueFrom(this.http.put<any>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return res['error']
    } else {
      return res;
    }
  }

  /**
   * Suppression d'un type d'objet 
   * @param ID : Identifiant du type d'objet
   * @returns Message d'erreur ou de validation
   */
  async deleteTypeO(ID: string): Promise<any> {
    let url = "http://"+environment.API_URL+"/typeobjet/{ID}"
    url = url.replace("{ID}", ID)
    const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  
  /**
   * Change le statut actif d'un type d'objet
   * @param idTypeO : Identifiant du type 
   * @param actif : Valeur du statut actif (true or false)
   * @returns Structure du type d'objet modifié
   */
  async updateActifTypeO(idTypeO : string, actif : boolean) : Promise<any>{
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjet/{idTypeO}"
    url = url.replace("{idTypeO}", idTypeO)
    let payload = {
      profilModification : user,
      actif : actif,
      posteModification : ''
    }
    const res : TypeObjetInfo = await lastValueFrom(this.http.put<TypeObjetInfo>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  /**
   * Change le statut actif d'un type d'objet repère
   * @param idTypeO : Identifiant du type d'objet repère
   * @param actif : Valeur du statut actif (true or false)
   * @returns Structure du type d'objet repère modifié
   */
  async updateActifTypeOr(idTypeOR : string, actif : boolean) : Promise<any>{
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjetrepere/{idTypeOR}"
    url = url.replace("{idTypeOR}", idTypeOR)
    let payload = {
      profilModification : user,
      actif : actif,
      posteModification : ''
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.put<TypeObjetRepereInfo>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }
}
