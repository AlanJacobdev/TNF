import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { lastValueFrom } from 'rxjs';
import { ArborescenceItem, ArborescenceOR, DemandeAdmin, DemandeAdminInfo } from 'src/structureData/DemandeAdmin';

@Injectable({
  providedIn: 'root'
})
export class FetchDemandeAdminService {

  constructor(private readonly http: HttpClient, private cookieService : CookieService, private socket: Socket) { }

  async getAllDemandeAdmin(): Promise<any> {
    let url = "http://localhost:3000/demande-admin";
    const res : DemandeAdmin[] = await lastValueFrom(this.http.get<DemandeAdmin[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getAllDemandeAdminTraitee(): Promise<any> {
    let url = "http://localhost:3000/demande-admin/get/findAllTraitee";
    const res : DemandeAdmin[] = await lastValueFrom(this.http.get<DemandeAdmin[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }


  async getAllObjetFromDemandeAdmin(idDmd : number): Promise<any>{
    let url = "http://localhost:3000/demande-admin/getAllObjectsFromDmd/{idDmd}";
    url = url.replace("{idDmd}", idDmd.toString())
    const res : DemandeAdminInfo[] = await lastValueFrom(this.http.get<DemandeAdminInfo[]>(url));
    if (res.length === 0 )  {
      return undefined
    } else {
      return res[0];
    }
   
  }


  async updateDemandeAdmin(ID: number, isDelete: boolean ): Promise<any> {
    let global = this.cookieService.get('login');
    console.log(global)
    let url = "http://localhost:3000/demande-admin/{ID}"
    url = url.replace("{ID}", ID.toString())
    let payload = {
      isDelete : isDelete,
      profilModification : global,
      posteModification : "",
    }
    const res : DemandeAdminInfo = await lastValueFrom(this.http.put<DemandeAdminInfo>(url, payload));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }




  async getArborescenceOfOR(idObjetRepere : string) {
    let url = "http://localhost:3000/demande-admin/getArborescenceOfOR/{idObjetRepere}";
    url = url.replace("{idObjetRepere}", idObjetRepere)
    const res : ArborescenceOR = await lastValueFrom(this.http.get<ArborescenceOR>(url));
    if (res.hasOwnProperty('error')) {
      const resAny : any = res;
      return resAny.error;
    } else {
      return res;
    }
  }

  async getArborescenceOfItem (idItem : string) {
    let url = "http://localhost:3000/demande-admin/getArborescenceOfItem/{idItem}";
    url = url.replace("{idItem}", idItem)
    const res : ArborescenceItem = await lastValueFrom(this.http.get<ArborescenceItem>(url));
    if (res.hasOwnProperty('error')) {
      const resAny : any = res;
      return resAny.error;
    } else {
      return res;
    }
  }
  

 

 
}
