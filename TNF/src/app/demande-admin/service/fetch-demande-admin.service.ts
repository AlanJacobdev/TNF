import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { ArborescenceItem, ArborescenceOR, DemandeAdmin, DemandeAdminInfo, DemandeAdminTraitee } from 'src/structureData/DemandeAdmin';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchDemandeAdminService {

    /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService,  private socket: Socket) { }


  /**
   * Recupère l'ensemble des demandes de suppression en attente
   * @returns Liste des demandes de suppression en attente
   */
  async getAllDemandeAdmin(): Promise<any> {
    let url = "http://"+environment.API_URL+"/demande-admin";
    const res : DemandeAdmin[] = await lastValueFrom(this.http.get<DemandeAdmin[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Retourne l'ensemble des demandes de suppression traitées
   * @returns Liste des demandes de suppression traitées
   */
  async getAllDemandeAdminTraitee(): Promise<any> {
    let url = "http://"+environment.API_URL+"/demande-admin-traitee";
    const res : DemandeAdminTraitee[] = await lastValueFrom(this.http.get<DemandeAdminTraitee[]>(url, {withCredentials: true}));
    
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }


  /**
   * Recupère les objets liés à une demande de suppression
   * @param idDmd : Identifiant de la demande de suppression
   * @returns Liste des objets lié à la demande (DemandeAdminInfo)
   */
  async getAllObjetFromDemandeAdmin(idDmd : number): Promise<any>{
    let url = "http://"+environment.API_URL+"/demande-admin/getAllObjectsFromDmd/{idDmd}";
    url = url.replace("{idDmd}", idDmd.toString())
    const res : DemandeAdminInfo = await lastValueFrom(this.http.get<DemandeAdminInfo>(url, {withCredentials: true}));
    return res;
   
   
  }

    /**
   * Recupère les objets liés à une demande de suppression traitée
   * @param idDmd : Identifiant de la demande de suppression traitée
   * @returns Liste des objets lié à la demande (DemandeAdminTraitee)
   */
  async getAllObjetFromDemandeAdminTraitee(idDmd : number): Promise<any>{
    let url = "http://"+environment.API_URL+"/demande-admin-traitee/getAllObjectsFromDmd/{idDmd}";
    url = url.replace("{idDmd}", idDmd.toString())
    const res : DemandeAdminTraitee = await lastValueFrom(this.http.get<DemandeAdminTraitee>(url, {withCredentials: true}));
    return res;
   
   
  }

  /**
   * Met à jour le status de suppression d'une demande 
   * Suppression des objets si isDelete = true
   * @param ID : Identifiant de la demande de suppression
   * @param isDelete : True or false (acceptée ou refusée)
   * @returns Message de validation ou erreur
   */
  async updateDemandeAdmin(ID: number, isDelete: boolean ): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/demande-admin/{ID}/{Profil}/{Delete}"
    url = url.replace("{ID}", ID.toString())
    url = url.replace("{Profil}", user)
    url = url.replace("{Delete}", String(isDelete))
    const res : DemandeAdminInfo = await lastValueFrom(this.http.delete<DemandeAdminInfo>(url, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  /**
   * Recupéré l'arboresence d'un objet repère
   * @param idObjetRepere : Identifiant de l'objet repère
   * @returns Arborescence de l'objet repère (ArborescenceOR)
   */
  async getArborescenceOfOR(idObjetRepere : string) {
    let url = "http://"+environment.API_URL+"/demande-admin/getArborescenceOfOR/{idObjetRepere}";
    url = url.replace("{idObjetRepere}", idObjetRepere)
    const res : ArborescenceOR = await lastValueFrom(this.http.get<ArborescenceOR>(url, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      const resAny : any = res;
      return resAny.error;
    } else {
      return res;
    }
  }

    /**
   * Recupéré l'arboresence d'un objet repère au sein d'une demande traitée
   * @param idObjetRepere : Identifiant de l'objet repère
   * @param date : Date du traitement de la demande 
   * @returns Arborescence de l'objet repère (ArborescenceOR)
   */
  async getArborescenceOfORTraite(idObjetRepere : string, date : Date) {
    let url = "http://"+environment.API_URL+"/demande-admin-traitee/getArborescenceOfOR/{idObjetRepere}/{date}";
    url = url.replace("{idObjetRepere}", idObjetRepere)
    url = url.replace("{date}", date.toISOString())
    const res : ArborescenceOR = await lastValueFrom(this.http.get<ArborescenceOR>(url, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      const resAny : any = res;
      return resAny.error;
    } else {
      return res;
    }
  }

  /**
   * Recupéré l'arboresence d'un item
   * @param idItem : Identifiant de l'item
   * @returns Arborescence de l'item (ArborescenceItem)
   */
  async getArborescenceOfItem (idItem : string) {
    let url = "http://"+environment.API_URL+"/demande-admin/getArborescenceOfItem/{idItem}";
    url = url.replace("{idItem}", idItem)
    const res : ArborescenceItem = await lastValueFrom(this.http.get<ArborescenceItem>(url, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      const resAny : any = res;
      return resAny.error;
    } else {
      return res;
    }
  }

      /**
   * Recupéré l'arboresence d'un item au sein d'une demande traitée
   * @param idItem : Identifiant de l'item
   * @param date : Date du traitement de la demande 
   * @returns Arborescence de l'item (ArborescenceItem)
   */
  async getArborescenceOfItemTraite (idItem : string, date : Date) {
    let url = "http://"+environment.API_URL+"/demande-admin-traitee/getArborescenceOfItem/{idItem}/{date}";
    url = url.replace("{idItem}", idItem)
    url = url.replace("{date}", date.toISOString())
    const res : ArborescenceItem = await lastValueFrom(this.http.get<ArborescenceItem>(url, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      const resAny : any = res;
      return resAny.error;
    } else {
      return res;
    }
  }

  /**
   * Envoie une notification au websocket pour alerter du traitement d'une demande
   */
  refreshDemande(){
    this.socket.emit('demande', "Nouvelle Demande");
  }

}
