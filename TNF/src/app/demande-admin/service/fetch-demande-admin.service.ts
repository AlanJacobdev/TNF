import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { ArborescenceItem, ArborescenceOR, DemandeAdmin, DemandeAdminInfo } from 'src/structureData/DemandeAdmin';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FetchDemandeAdminService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  async getAllDemandeAdmin(): Promise<any> {
    let url = "http://"+environment.API_URL+"/demande-admin";
    const res : DemandeAdmin[] = await lastValueFrom(this.http.get<DemandeAdmin[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getAllDemandeAdminTraitee(): Promise<any> {
    let url = "http://"+environment.API_URL+"/demande-admin/get/findAllTraitee";
    const res : DemandeAdmin[] = await lastValueFrom(this.http.get<DemandeAdmin[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }


  async getAllObjetFromDemandeAdmin(idDmd : number): Promise<any>{
    let url = "http://"+environment.API_URL+"/demande-admin/getAllObjectsFromDmd/{idDmd}";
    url = url.replace("{idDmd}", idDmd.toString())
    const res : DemandeAdminInfo[] = await lastValueFrom(this.http.get<DemandeAdminInfo[]>(url));
    if (res.length === 0 )  {
      return undefined
    } else {
      return res[0];
    }
   
  }


  async updateDemandeAdmin(ID: number, isDelete: boolean ): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/demande-admin/{ID}"
    url = url.replace("{ID}", ID.toString())
    let payload = {
      isDelete : isDelete,
      profilModification : user,
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
    let url = "http://"+environment.API_URL+"/demande-admin/getArborescenceOfOR/{idObjetRepere}";
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
    let url = "http://"+environment.API_URL+"/demande-admin/getArborescenceOfItem/{idItem}";
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
