import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { Description } from 'src/structureData/Description';
import { ItemInfo } from 'src/structureData/Item';
import { ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { SousItemInfo } from 'src/structureData/SousItem';
import { modificationTypeObject } from 'src/structureData/TypeObject';
import { utilisateur } from 'src/structureData/Utilisateur';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchModifyObjectService {

  
  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService, private socket: Socket) { }


  /**
   * Modification d'un objet
   * @param idOR : Identifiant de l'objet repère
   * @param libelle : Libelle de l'objet repère
   * @param etat : Etat de l'objet repère (reservé / actif)
   * @param description : Liste des descriptions
   * @returns Structure de l'objet repère modifié ou erreur
   */
  async modifyObject(idOR : string, libelle : string, etat: string, description : Description[]): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/objetrepere/{ID}"
    url = url.replace("{ID}", idOR)
    let payload = {
      libelleObjetRepere : libelle,
      etat: etat,
      description : description,
      profilModification : user,
      posteModification : ""
    }
    try {
      const res : ObjetRepereInfo = await lastValueFrom(this.http.put<ObjetRepereInfo>(url, payload, {withCredentials: true}));
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
   * Modification d'un item
   * @param idItem : Identifiant de l'item
   * @param libelle : Libelle de l'item
   * @param etat : Etat de l'item (actif, en attente, hors service)
   * @param description : Liste des description
   * @returns Structure de l'item modifié ou erreur
   */
  async modifyitem(idItem : string, libelle : string, etat: string, description : Description[]): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/item/{ID}"
    url = url.replace("{ID}", idItem)
    let payload = {
      libelleItem : libelle,
      etat: etat,
      description : description,
      profilModification : user,
      posteModification : ""
    }
    try {
      const res : ItemInfo = await lastValueFrom(this.http.put<ItemInfo>(url, payload, {withCredentials: true}));
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
   * Modification d'un sous item
   * @param idSousItem : Identifiant sous item
   * @param libelle : Libelle du sous item
   * @param etat : Etat du sous item (actif, en attente, hors service)
   * @param description : Liste de descriptions 
   * @returns Structure du sous item modifié ou erreur
   */
  async modifySI(idSousItem : string, libelle : string, etat: string, description : Description[]): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/sousitem/{ID}"
    url = url.replace("{ID}", idSousItem)
    let payload = {
      libelleSousItem : libelle,
      etat : etat,
      description :description,
      profilModification : user,
      posteModification : ""
    }

    try {
      const res : SousItemInfo = await lastValueFrom(this.http.put<SousItemInfo>(url, payload, {withCredentials: true}));
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
   * Recupère les types d'objets au sein d'un atelier
   * @param Atelier 
   * @returns 
   */
  async getTypeOfItemsOfOR(Atelier : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/objetrepere/getTypeOfItemsForOR/{Atelier}"
    url = url.replace("{Atelier}", Atelier)
    const res : modificationTypeObject[] = await lastValueFrom(this.http.get<modificationTypeObject[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }


  /**
   * Recupère le nom et prénom d'un utilisateur en fonction de son login
   * @param login : Login de l'utilisateur
   * @returns : Nom et prénom de l'utilisateur 
   */
  async getIdentity(login : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/utilisateur/getIdentityFromLogin/{login}"
    url = url.replace("{login}", login)
    const res : utilisateur = await lastValueFrom(this.http.get<utilisateur>(url, {withCredentials: true}));
    return res;
  }


  /**
   * Reserve un objet pour modification
   * @param id : Identifiant de l'objet
   */
  sendChange(id: string){
    let user = this.navBarService.getLogin();
    let payload = {
      id : id,
      login : user
    }
    this.socket.emit('reservationObject', payload)
  }

  /**
   * Connexion au websocket (pour la réservation)
   * @returns 
   */
  connexionSocket(){
    this.socket.connect();
    return this.socket.fromEvent('sendReservation') 
  }

/**
 * En attente des changement de sélection (websocket)
 * @returns 
 */
  receiveChange(){
    return this.socket.fromEvent('broadcastReservation') 
  }
  
  /**
   * Quitte le serveur websocket
   */
  leaveWS(){
    this.socket.disconnect();
  }

  /**
   * Libère un objet après modification
   * @param type : Type de l'objet modifié
   */
  freeObject(type : string){
    this.socket.emit('modificationObjet', type)
  }


  /**
   * En attente des changements d'objet
   * @returns 
   */
  receiveUpdate(){
    return this.socket.fromEvent('updateElementEdit') 
  }

}
