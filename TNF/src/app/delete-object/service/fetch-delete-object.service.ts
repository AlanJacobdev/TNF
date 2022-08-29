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
export class FetchDeleteObjectService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService, private socket: Socket) { }

  async supprimerObject(idOR : string): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/objetrepere/{idOR}/{User}";
    url = url.replace("{idOR}", idOR)
    url = url.replace("{User}", user)
    try {
      const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));
      console.log(res);

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

  async supprimerItem(idItem : string): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/item/{idItem}/{User}";
    url = url.replace("{idItem}", idItem)
    url = url.replace("{User}", user)
    try {
      const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));
      console.log(res);

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


  async deleteObjects(ObjectToDelete : deleteObject){
    
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/service-suppression/deleteObject/{login}";
    url = url.replace("{login}", user)
    try {
      const res : any = await lastValueFrom(this.http.delete<any>(url, {body:ObjectToDelete, withCredentials: true}))
      console.log(res);
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


  async demandeAdmin(deleteObjects : demandeAdmin) : Promise<any> {
    let url = "http://"+environment.API_URL+"/demande-admin"
    const res : any = await lastValueFrom(this.http.post<any>(url, deleteObjects, {withCredentials: true})); 
    console.log(res)   
    return res
    
  }


  refreshDemande(){
    this.socket.emit('demande', "Nouvelle Demande");
  }


}
