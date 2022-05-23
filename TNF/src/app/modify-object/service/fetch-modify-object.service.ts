import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { Description } from 'src/structureData/Description';
import { ItemInfo } from 'src/structureData/Item';
import { ObjetRepereInfo } from 'src/structureData/ObjetRepere';

@Injectable({
  providedIn: 'root'
})
export class FetchModifyObjectService {

  constructor(private readonly http: HttpClient, private cookieService : CookieService) { }



  async modifyObject(idOR : string, libelle : string, valide: boolean, description : Description[]): Promise<any> {
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/objetrepere/{ID}"
    url = url.replace("{ID}", idOR)
    let payload = {
      libelleObjetRepere : libelle,
      valide: valide,
      description : description,
      profilModification : global,
      posteModification : ""
    }
    try {
      const res : ObjetRepereInfo = await lastValueFrom(this.http.put<ObjetRepereInfo>(url, payload));
      if (res.hasOwnProperty('error')) {
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

  async modifyitem(idItem : string, libelle : string, etat: string, description : Description[]): Promise<any> {
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/item/{ID}"
    url = url.replace("{ID}", idItem)
    let payload = {
      libelleItem : libelle,
      etat: etat,
      description : description,
      profilModification : global,
      posteModification : ""
    }
    try {
      const res : ItemInfo = await lastValueFrom(this.http.put<ItemInfo>(url, payload));
      if (res.hasOwnProperty('error')) {
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


}
