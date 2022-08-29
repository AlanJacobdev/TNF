import { HttpClient } from '@angular/common/http';
import { Injectable, SecurityContext } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { ItemInfo } from 'src/structureData/Item';
import { NUetOR, ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { SousItemInfo } from 'src/structureData/SousItem';
import { TypeObjetInfo } from 'src/structureData/TypeObject';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchCreateObjectService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  async getAllNUandORByAtelier(Atelier : string): Promise<any> {
    let url = "http://"+environment.API_URL+"/objetrepere/getAllNUAndORByAtelier/{Atelier}";
    url = url.replace("{Atelier}", Atelier)
    const res : NUetOR[] = await lastValueFrom(this.http.get<NUetOR[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getObjetRepereByAtelierForOneUser(Atelier : string) : Promise<any> {
    let user = this.navBarService.getLogin();
    let admin = this.navBarService.getEstAdmin();
    let url;
    if (admin) {
      url = "http://"+environment.API_URL+"/objetrepere/getORByAtelier/{atelier}"
    } else {
      url = "http://"+environment.API_URL+"/objetrepere/getORByAtelierForOneUser/{atelier}/{profil}"
      url = url.replace("{profil}", user)
    }
    url = url.replace("{atelier}", Atelier)
   
    const res : ObjetRepereInfo[] = await lastValueFrom(this.http.get<ObjetRepereInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getItemFromOrAndDispo(idOr : string, type : string): Promise<any> {
    let url = "http://"+environment.API_URL+"/item/getItemFromOrAndDispo/{idOR}/{type}";
    url = url.replace("{idOR}", idOr);
    url = url.replace("{type}", type);
    const res : ItemInfo[] = await lastValueFrom(this.http.get<ItemInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getAllTypeAvailable (idItem: string): Promise<any>{
    const admin = this.navBarService.getEstAdmin();
    let url;
    if (admin){
      console.log(admin);
      url = "http://"+environment.API_URL+"/sousitem/getAllTypeAvailable/{idItem}"
    } else {
      url = "http://"+environment.API_URL+"/sousitem/getAllTypeAvailableAndActif/{idItem}"
    }
    url = url.replace("{idItem}", idItem);
    const res : TypeObjetInfo[] = await lastValueFrom(this.http.get<TypeObjetInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }


  async createObject(libelle : string, codeType :string, nu : string, securite : boolean,description : any[]): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/objetrepere"
    let payload = {
      libelleObjetRepere : libelle,
      codeType : codeType,
      numeroUnique : nu,
      etat: 'A',
      securite : securite,
      description : description,
      profilCreation : user,
      posteCreation : ""
    }
    try {
      const res : ObjetRepereInfo = await lastValueFrom(this.http.post<ObjetRepereInfo>(url, payload, {withCredentials: true}));
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

  async createMultipleObject(libelle : string, codeType :string, nu : string, rangeNu : string[], securite : boolean, etat: boolean, description : any[]): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/objetrepere/create/createMultipleObject"
    let payload = {
      libelleObjetRepere : libelle,
      codeType : codeType,
      numeroUnique : nu,
      rangeNu : rangeNu,
      securite : securite,
      etat: etat,
      description : description,
      profilCreation : user,
      posteCreation : ""
    }
    try {
      const res : any = await lastValueFrom(this.http.post<any>(url, payload, {withCredentials: true}));
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
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/item"
    let payload = {
      libelleItem : libelle,
      idOR : idOR,
      codeObjet : codeObjet,
      numeroUnique : nu,
      digit: digit,
      securite : securite,
      etat: etat,
      description : description,
      profilCreation : user,
      posteCreation : ""
    }
    try {
      const res : ItemInfo = await lastValueFrom(this.http.post<ItemInfo>(url, payload, {withCredentials: true}));
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
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/sousitem"
    let payload = {
      libelleSousItem : libelle,
      idItem : idItem,
      codeSousItem : codeObjet,
      securite : securite,
      estPrefixe : prefixe,
      etat : etat,
      description : description,
      profilCreation : user,
      posteCreation : ''
    }
    try {
      const res : SousItemInfo = await lastValueFrom(this.http.post<SousItemInfo>(url, payload, {withCredentials: true}));

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
    let url = "http://"+environment.API_URL+"/objetrepere/reservationIsPossible/{Atelier}/{startNU}/{additionalNU}"
    url = url.replace("{Atelier}", Atelier);
    url = url.replace("{startNU}", startNU);
    url = url.replace("{additionalNU}", additionalNU.toString());
    const res : any = await lastValueFrom(this.http.get<any>(url, {withCredentials: true}));
        
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
      url = "http://"+environment.API_URL+"/objetrepere/getRangeToCreateOR/{Atelier}/{start}/{bookOr}/{isForward}"
      url = url.replace("{isForward}", isForward.toString());
    } else {
      url = "http://"+environment.API_URL+"/objetrepere/getRangeToCreateOR/{Atelier}/{start}/{bookOr}"
    }

    url = url.replace("{Atelier}", Atelier);
    url = url.replace("{start}", start.toString());
    url = url.replace("{bookOr}", bookOr.toString());
    

    const res : any = await lastValueFrom(this.http.get<any>(url, {withCredentials: true}));
    
    let returnError;
    if (res.hasOwnProperty('error')){
      returnError=res.error;
    } else {
      returnError = res;
    }
    
    return returnError;

  }


}
