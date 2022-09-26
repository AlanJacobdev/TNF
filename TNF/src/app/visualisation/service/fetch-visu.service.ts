import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { AtelierInfo } from 'src/structureData/Atelier';
import { ItemInfo, ItemSave } from 'src/structureData/Item';
import { ObjetRepereInfo, ObjetRepereSave } from 'src/structureData/ObjetRepere';
import { SousItemInfo, SousItemSave } from 'src/structureData/SousItem';
import { TypeObjetRepereInfo, TypeObjetInfo } from 'src/structureData/TypeObject';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchVisuService {

  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }


  /**
   * Recupère l'ensemble des ateliers (non limités aux droits d'une personne)
   * @returns Liste des ateliers actifs
   */
  async getAteliersVisu(): Promise<any>{
    let url;
    const admin = this.navBarService.getEstAdmin();
    if (admin){
      url = "http://"+environment.API_URL+"/atelier"
    }else {
      url = "http://"+environment.API_URL+"/atelier/getAll/isActif"
    }

    const res : AtelierInfo[] = await lastValueFrom(this.http.get<AtelierInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Fonction permettant de récupérer les ateliers en fonction de son statut
   * @returns Liste des ateliers
   */
  async getAllAteliers(){
    const admin = this.navBarService.getEstAdmin();
    if (admin){
      return this.getAllAteliersForAdmin();
    } else {
      return this.getAtelierForOneUser();
    }
  }

  /**
   * Recupère l'ensemble des ateleirs ( droits administrateur)
   * @returns Liste des ateliers existant
   */
  async getAllAteliersForAdmin(): Promise<any> {
    let url;
    url = "http://"+environment.API_URL+"/atelier"
    const res : AtelierInfo[] = await lastValueFrom(this.http.get<AtelierInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Recupère les ateliers pour un utilisateur
   * @returns Liste des ateliers 
   */
  async getAtelierForOneUser () {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/atelier/findAllAteliersActifForUser/{user}"
    url = url.replace("{user}", user )
    const res : AtelierInfo[] = await lastValueFrom(this.http.get<AtelierInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Recupère les objets repères d'un atelier
   * @param Atelier : Identifiant de l'atelier
   * @returns Liste des objets repères liés à cet atelier
   */
  async getObjetRepereByAteliers(Atelier : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/objetrepere/getORByAtelier/{atelier}"
    url = url.replace("{atelier}", Atelier)
    const res : ObjetRepereInfo[] = await lastValueFrom(this.http.get<ObjetRepereInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Recupère l'historique d'un objet repère
   * @param idOr : Identifiant de l'objet repère
   * @returns Liste des différents état de l'objet 
   */
  async getHistoryObjetRepere(idOr : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/objetrepere/history/{OR}"
    url = url.replace("{OR}", idOr)
    const res : ObjetRepereSave[] = await lastValueFrom(this.http.get<ObjetRepereSave[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Recupère les items d'un objet repère
   * @param objetRepere : identifiant de l'objet repère
   * @returns Liste des items 
   */
  async getItemByObjetRepere(objetRepere : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/item/getItemByOR/{OR}"
    url = url.replace("{OR}", objetRepere)
    const res : ItemInfo[] = await lastValueFrom(this.http.get<ItemInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Recupère l'historique d'un item
   * @param idItem : Identifiant de l'item
   * @returns Liste des différents état de l'item
   */
  async getHistoryItem(idItem : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/item/history/{Item}"
    url = url.replace("{Item}", idItem)
    const res : ItemSave[] = await lastValueFrom(this.http.get<ItemSave[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Récupère l'ensemble des types d'objet repère
   * @returns Liste des types d'objet repère existant
   */
  async getTypeObjetRepere(): Promise<any> {
    let url = "http://"+environment.API_URL+"/typeobjetrepere"
    const res : TypeObjetRepereInfo[] = await lastValueFrom(this.http.get<TypeObjetRepereInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Recupère la liste des type d'objet pour sous item
   * @returns Liste des types d'objet pour sous item
   */
  async getTypeSIActif() : Promise<any>{
    let url = "http://"+environment.API_URL+"/typeobjet/getAll/isActif"
    const res : TypeObjetInfo[] = await lastValueFrom(this.http.get<TypeObjetInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Recupère la liste des types d'objet 
   * @returns Liste de l'ensemble des types d'objets
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
   * Recupère les sous item liés à un item
   * @param Item : Identifiant de l'item
   * @returns Liste des sous items 
   */
  async getSousItemByItem(Item : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/sousitem/getSousItemByItem/{SI}"
    url = url.replace("{SI}", Item)
    const res : SousItemInfo[] = await lastValueFrom(this.http.get<SousItemInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  /**
   * Recupère l'historique d'un sous item
   * @param idSI : Identifiant du sous item
   * @returns Liste des différents état d'un sous item
   */
  async getHistorySousItem(idSI : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/sousitem/history/{SI}"
    url = url.replace("{SI}", idSI);
    const res : SousItemSave[] = await lastValueFrom(this.http.get<SousItemSave[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }
}
