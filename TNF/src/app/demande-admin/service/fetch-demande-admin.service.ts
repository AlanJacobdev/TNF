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
export class FetchDemandeAdminService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService,  private socket: Socket) { }

  async getAllDemandeAdmin(): Promise<any> {
    let url = "http://"+environment.API_URL+"/demande-admin";
    const res : DemandeAdmin[] = await lastValueFrom(this.http.get<DemandeAdmin[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getAllDemandeAdminTraitee(): Promise<any> {
    let url = "http://"+environment.API_URL+"/demande-admin-traitee";
    const res : DemandeAdminTraitee[] = await lastValueFrom(this.http.get<DemandeAdminTraitee[]>(url, {withCredentials: true}));
    console.log(res);
    
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }


  async getAllObjetFromDemandeAdmin(idDmd : number): Promise<any>{
    let url = "http://"+environment.API_URL+"/demande-admin/getAllObjectsFromDmd/{idDmd}";
    url = url.replace("{idDmd}", idDmd.toString())
    const res : DemandeAdminInfo = await lastValueFrom(this.http.get<DemandeAdminInfo>(url, {withCredentials: true}));
    return res;
   
   
  }

  async getAllObjetFromDemandeAdminTraitee(idDmd : number): Promise<any>{
    let url = "http://"+environment.API_URL+"/demande-admin-traitee/getAllObjectsFromDmd/{idDmd}";
    url = url.replace("{idDmd}", idDmd.toString())
    const res : DemandeAdminTraitee = await lastValueFrom(this.http.get<DemandeAdminTraitee>(url, {withCredentials: true}));
    return res;
   
   
  }

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


  refreshDemande(){
    this.socket.emit('demande', "Nouvelle Demande");
  }

}
