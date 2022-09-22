import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { deleteObject, demandeAdmin, returnDeleteObject } from 'src/structureData/Suppression';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchDeleteObjectService {

  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService, private socket: Socket) { }

  /**
   * Suppression d'un objet repère
   * @param idOR : Identifiant de l'objet repère
   * @returns Message de validation ou erreur
   */
  async supprimerObject(idOR : string): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/objetrepere/{idOR}/{User}";
    url = url.replace("{idOR}", idOR)
    url = url.replace("{User}", user)
    try {
      const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));

      if (res.length == 0) {
        return undefined;
      } else {
          if(res.hasOwnProperty('error')){
              return res.error;
          } else if (res.hasOwnProperty('message')) {
              return res;
          }
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

  /**
   * Suppression d'un item
   * @param idItem : Identifiant de l'item 
   * @returns Message de validation ou d'erreur
   */
  async supprimerItem(idItem : string): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/item/{idItem}/{User}";
    url = url.replace("{idItem}", idItem)
    url = url.replace("{User}", user)
    try {
      const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));

      if (res.length == 0) {
        return undefined;
      } else {
          if(res.hasOwnProperty('error')){
              return res.error;
          } else if (res.hasOwnProperty('message')) {
              return res;
          }
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


  /**
   * Suppression de mutliples objets (objet repère, item, sous item)
   * @param ObjectToDelete : Structure comprenant les objets a supprimer
   * @returns Structure contenant les status de suppression de chaque objet 
   */
  async deleteObjects(ObjectToDelete : deleteObject){
    
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/service-suppression/deleteObject/{login}";
    url = url.replace("{login}", user)
    try {
      const res : any = await lastValueFrom(this.http.delete<any>(url, {body:ObjectToDelete, withCredentials: true}))
      if (res.listeOR.length == 0 && res.listeItem.length == 0 && res.listeSI.length == 0) {        
        return undefined;
      } else {
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

  /**
   * Suppression de mutliples objets (objet repère, item, sous item) en tant qu'ADMINISTRATEUR (aucune limite d'heure)
   * @param ObjectToDelete : Structure comprenant les objets a supprimer
   * @returns Structure contenant les status de suppression de chaque objet 
   */
  async deleteObjectsAsAdmin(ObjectToDelete : deleteObject){
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/service-suppression/deleteObjectAsAdmin/{login}";
    url = url.replace("{login}", user)
    try {
      const res : returnDeleteObject = await lastValueFrom(this.http.delete<returnDeleteObject>(url, {body:ObjectToDelete, withCredentials: true}));
      if (res.listeOR.length == 0 && res.listeItem.length == 0 && res.listeSI.length == 0) {        
        return undefined;
      } else {
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


  /**
   * Création d'une demande de suppression administrateur
   * @param deleteObjects : Liste des objets a supprimer
   * @returns Structure de la demande
   */
  async demandeAdmin(deleteObjects : demandeAdmin) : Promise<any> {
    let url = "http://"+environment.API_URL+"/demande-admin"
    const res : any = await lastValueFrom(this.http.post<any>(url, deleteObjects, {withCredentials: true})); 
    return res
  }


  /**
   * Envoie un signal au websocket pour avertir de la création d'une nouvelle demande
   */
  refreshDemande(){
    this.socket.emit('demande', "Nouvelle Demande");
  }


}
