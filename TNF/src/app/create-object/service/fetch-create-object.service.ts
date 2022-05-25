import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { ItemEtDispo, ItemInfo } from 'src/structureData/Item';
import { NUetOR, ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { SousItemInfo } from 'src/structureData/SousItem';
import { Sousitem } from 'src/structureData/Suppression';
import { TypeObjetInfo } from 'src/structureData/TypeObject';

@Injectable({
  providedIn: 'root'
})
export class FetchCreateObjectService {

  constructor(private readonly http: HttpClient, private cookieService : CookieService) { }

  async getAllNUandORByAtelier(Atelier : string): Promise<any> {
    let url = "http://localhost:3000/objetrepere/getAllNUAndORByAtelier/{Atelier}";
    url = url.replace("{Atelier}", Atelier)
    const res : NUetOR[] = await lastValueFrom(this.http.get<NUetOR[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getItemFromOrAndDispo(idOr : string, type : string): Promise<any> {
    let url = "http://localhost:3000/item/getItemFromOrAndDispo/{idOR}/{type}";
    url = url.replace("{idOR}", idOr);
    url = url.replace("{type}", type);
    const res : ItemInfo[] = await lastValueFrom(this.http.get<ItemInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getAllTypeAvailable (idItem: string): Promise<any>{
    let url = "http://localhost:3000/sousitem/getAllTypeAvailable/{idItem}"
    url = url.replace("{idItem}", idItem);
    const res : TypeObjetInfo[] = await lastValueFrom(this.http.get<TypeObjetInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }


  async createObject(libelle : string, codeType :string, nu : string, valide: boolean, description : any[]): Promise<any> {
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/objetrepere"
    let payload = {
      libelleObjetRepere : libelle,
      codeType : codeType,
      numeroUnique : nu,
      valide: valide,
      description : description,
      profilCreation : global,
      posteCreation : ""
    }
    try {
      const res : ObjetRepereInfo = await lastValueFrom(this.http.post<ObjetRepereInfo>(url, payload));
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


  async createItem(libelle : string, idOR : string, codeObjet :string, digit : number, securite : boolean, nu : string, etat: string, description : any[]): Promise<any> {
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/item"
    let payload = {
      libelleItem : libelle,
      idOR : idOR,
      codeObjet : codeObjet,
      numeroUnique : nu,
      digit: digit,
      securite : securite,
      etat: etat,
      description : description,
      profilCreation : global,
      posteCreation : ""
    }
    try {
      const res : ItemInfo = await lastValueFrom(this.http.post<ItemInfo>(url, payload));
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


  async createSousItem(libelle : string, idItem : string, codeObjet :string, prefixe : boolean, securite : boolean, etat: string, description : any[]){
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/sousitem"
    let payload = {
      libelleSousItem : libelle,
      idItem : idItem,
      codeSousItem : codeObjet,
      securite : securite,
      estPrefixe : prefixe,
      etat : etat,
      description : description,
      profilCreation : global,
      posteCreation : ''
    }
    try {
      const res : SousItemInfo = await lastValueFrom(this.http.post<SousItemInfo>(url, payload));

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
