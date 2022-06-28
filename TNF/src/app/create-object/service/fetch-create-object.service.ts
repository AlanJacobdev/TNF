import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { ItemInfo } from 'src/structureData/Item';
import { NUetOR, ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { SousItemInfo } from 'src/structureData/SousItem';
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
    const admin = this.cookieService.get('Admin');
    let url;
    if (admin == "true"){
      console.log(admin);
      url = "http://localhost:3000/sousitem/getAllTypeAvailable/{idItem}"
    } else {
      url = "http://localhost:3000/sousitem/getAllTypeAvailableAndActif/{idItem}"
    }
    url = url.replace("{idItem}", idItem);
    const res : TypeObjetInfo[] = await lastValueFrom(this.http.get<TypeObjetInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }


  async createObject(libelle : string, codeType :string, nu : string, description : any[]): Promise<any> {
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/objetrepere"
    let payload = {
      libelleObjetRepere : libelle,
      codeType : codeType,
      numeroUnique : nu,
      valide: 'Actif',
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

  async createMultipleObject(libelle : string, codeType :string, nu : string, rangeNu : string[] ,valide: boolean, description : any[]): Promise<any> {
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/objetrepere/create/createMultipleObject"
    let payload = {
      libelleObjetRepere : libelle,
      codeType : codeType,
      numeroUnique : nu,
      rangeNu : rangeNu,
      valide: valide,
      description : description,
      profilCreation : global,
      posteCreation : ""
    }
    try {
      const res : any = await lastValueFrom(this.http.post<any>(url, payload));
      console.log(res);
      
      let returnError;
      if (res.hasOwnProperty('error')){
        returnError = res.error;
      } else {
        returnError = res;
      }
      return returnError;
    } catch (e : any) {
      let returnError;
      if (e.hasOwnProperty('error')){
        returnError = e.error;
      } else {
        returnError = e;
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


  async reservationIsPossible (Atelier : string, startNU : string , additionalNU : number) {
    let url = "http://localhost:3000/objetrepere/reservationIsPossible/{Atelier}/{startNU}/{additionalNU}"
    url = url.replace("{Atelier}", Atelier);
    url = url.replace("{startNU}", startNU);
    url = url.replace("{additionalNU}", additionalNU.toString());
    const res : any = await lastValueFrom(this.http.get<any>(url));
    console.log(res.hasOwnProperty('error'));
    
    let returnError;
    if(res.hasOwnProperty('error')){
      returnError = undefined;
    } else if (res.hasOwnProperty('message')){
      returnError=res.message;
    } else {
      returnError = res;
    }
    
    return returnError;
  }

  async getRangeToCreateOR (Atelier : string, start : number , bookOr : number, isForward? :boolean) {
    let url
    if (isForward != undefined){
      url = "http://localhost:3000/objetrepere/getRangeToCreateOR/{Atelier}/{start}/{bookOr}/{isForward}"
      url = url.replace("{isForward}", isForward.toString());
    } else {
      url = "http://localhost:3000/objetrepere/getRangeToCreateOR/{Atelier}/{start}/{bookOr}"
    }

    url = url.replace("{Atelier}", Atelier);
    url = url.replace("{start}", start.toString());
    url = url.replace("{bookOr}", bookOr.toString());
    

    const res : any = await lastValueFrom(this.http.get<any>(url));
    
    let returnError;
    if (res.hasOwnProperty('error')){
      returnError=res.error;
    } else {
      returnError = res;
    }
    
    return returnError;

  }


}
