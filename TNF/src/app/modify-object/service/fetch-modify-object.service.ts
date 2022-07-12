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
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchModifyObjectService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService, private socket: Socket) { }



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
      const res : ObjetRepereInfo = await lastValueFrom(this.http.put<ObjetRepereInfo>(url, payload));
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
      const res : ItemInfo = await lastValueFrom(this.http.put<ItemInfo>(url, payload));
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
      const res : SousItemInfo = await lastValueFrom(this.http.put<SousItemInfo>(url, payload));
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


  async getTypeOfItemsOfOR(Atelier : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/objetrepere/getTypeOfItemsForOR/{Atelier}"
    url = url.replace("{Atelier}", Atelier)
    const res : modificationTypeObject[] = await lastValueFrom(this.http.get<modificationTypeObject[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  sendChange(id: string){
    let user = this.navBarService.getLogin();
    let payload = {
      idObjetRepere : id,
      login : user
    }
    this.socket.emit('reservationItem', payload)
  }

  connexionSocket(){
    return this.socket.fromEvent('sendReservationOR') 
  }


  receiveChangeOR(){
    return this.socket.fromEvent('broadcastReservation') 
  }
  



}
