import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { TypeObjetInfo, TypeObjetRepereInfo } from 'src/structureData/TypeObject';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchcreateTypeObjectService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  async getTypeObjetRepere(): Promise<any> {
    let user = this.navBarService.getLogin();
    let admin = this.navBarService.getEstAdmin();
    let url
    if (admin){
      url = "http://"+environment.API_URL+"/typeobjetrepere"
    }else{
      url =  "http://"+environment.API_URL+"/typeobjetrepere/findAllTypeORForUser/{profil}"
      url = url.replace("{profil}", user)
    }
    const res : TypeObjetRepereInfo[] = await lastValueFrom(this.http.get<TypeObjetRepereInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getTypeObjet(): Promise<any> {
    let url = "http://"+environment.API_URL+"/typeobjet"
    const res : TypeObjetInfo[] = await lastValueFrom(this.http.get<TypeObjetInfo[]>(url, {withCredentials: true}));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async createTypeOR(ID: string, libelle : string, actif :boolean): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjetrepere"
    let payload = {
      idTypeOR : ID.toUpperCase(),
      libelleTypeOR : libelle,
      profilCreation : user,
      posteCreation : "",
      actif : actif
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.post<TypeObjetRepereInfo>(url, payload, {withCredentials: true}));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  async updateTypeOR(ID: string, libelle : string, actif : boolean): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjetrepere/{ID}"
    url = url.replace("{ID}", ID)
    let payload = {
      libelleTypeOR : libelle,
      profilModification : user,
      posteModification : "",
      actif : actif
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.put<TypeObjetRepereInfo>(url, payload, {withCredentials: true}));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  async deleteTypeOR(ID: string): Promise<any> {
    let url = "http://"+environment.API_URL+"/typeobjetrepere/{ID}"
    url = url.replace("{ID}", ID)
    const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }


  async createTypeO(ID: string, libelle : string, actif : boolean): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjet"
    let payload = {
      idType : ID.toUpperCase(),
      libelleType : libelle,
      profilCreation : user,
      posteCreation : "",
      actif : actif
    }
    const res : any = await lastValueFrom(this.http.post<any>(url, payload, {withCredentials: true}));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return res['error'];
    } else {
      return res;
    }
  }

  async updateTypeO(ID: string, libelle : string, actif : boolean): Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjet/{ID}"
    url = url.replace("{ID}", ID)
    let payload = {
      libelleType : libelle,
      profilModification : user,
      posteModification : "",
      actif : actif
    }
    const res : any = await lastValueFrom(this.http.put<any>(url, payload, {withCredentials: true}));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return res['error']
    } else {
      return res;
    }
  }

  async deleteTypeO(ID: string): Promise<any> {
    let url = "http://"+environment.API_URL+"/typeobjet/{ID}"
    url = url.replace("{ID}", ID)
    const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  
  
  async updateActifTypeO(idTypeO : string, actif : boolean) : Promise<any>{
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjet/{idTypeO}"
    url = url.replace("{idTypeO}", idTypeO)
    let payload = {
      profilModification : user,
      actif : actif,
      posteModification : ''
    }
    const res : TypeObjetInfo = await lastValueFrom(this.http.put<TypeObjetInfo>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }


  async updateActifTypeOr(idTypeOR : string, actif : boolean) : Promise<any>{
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/typeobjetrepere/{idTypeOR}"
    url = url.replace("{idTypeOR}", idTypeOR)
    let payload = {
      profilModification : user,
      actif : actif,
      posteModification : ''
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.put<TypeObjetRepereInfo>(url, payload, {withCredentials: true}));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }



}
