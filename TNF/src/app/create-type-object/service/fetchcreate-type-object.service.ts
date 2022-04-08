import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { TypeObjetInfo, TypeObjetRepereInfo } from 'src/structureData/TypeObject';

@Injectable({
  providedIn: 'root'
})
export class FetchcreateTypeObjectService {

  constructor(private readonly http: HttpClient, private cookieService : CookieService) { }

  async getTypeObjetRepere(): Promise<any> {
    let url = "http://localhost:3000/typeobjetrepere"
    const res : TypeObjetRepereInfo[] = await lastValueFrom(this.http.get<TypeObjetRepereInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getTypeObjet(): Promise<any> {
    let url = "http://localhost:3000/typeobjet"
    const res : TypeObjetInfo[] = await lastValueFrom(this.http.get<TypeObjetInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async createTypeOR(ID: string, libelle : string): Promise<any> {
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/typeobjetrepere"
    let payload = {
      idTypeOR : ID.toUpperCase(),
      libelleTypeOR : libelle,
      profilCreation : global,
      posteCreation : ""
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.post<TypeObjetRepereInfo>(url, payload));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  async updateTypeOR(ID: string, libelle : string): Promise<any> {
    let global = this.cookieService.get('login');
    console.log(global)
    let url = "http://localhost:3000/typeobjetrepere/{ID}"
    url = url.replace("{ID}", ID)
    let payload = {
      libelleTypeOR : libelle,
      profilModification : global,
      posteModification : ""
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.put<TypeObjetRepereInfo>(url, payload));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  async deleteTypeOR(ID: string): Promise<any> {
    let global = this.cookieService.get('login');
    console.log(global)
    let url = "http://localhost:3000/typeobjetrepere/{ID}"
    url = url.replace("{ID}", ID)
    const res : any = await lastValueFrom(this.http.delete<any>(url));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }


  async createTypeO(ID: string, libelle : string): Promise<any> {
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/typeobjet"
    let payload = {
      idType : ID.toUpperCase(),
      libelleType : libelle,
      profilCreation : global,
      posteCreation : ""
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.post<TypeObjetRepereInfo>(url, payload));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  async updateTypeO(ID: string, libelle : string): Promise<any> {
    let global = this.cookieService.get('login');
    console.log(global)
    let url = "http://localhost:3000/typeobjet/{ID}"
    url = url.replace("{ID}", ID)
    let payload = {
      libelleType : libelle,
      profilModification : global,
      posteModification : ""
    }
    const res : TypeObjetRepereInfo = await lastValueFrom(this.http.put<TypeObjetRepereInfo>(url, payload));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }

  async deleteTypeO(ID: string): Promise<any> {
    let global = this.cookieService.get('login');
    console.log(global)
    let url = "http://localhost:3000/typeobjet/{ID}"
    url = url.replace("{ID}", ID)
    const res : any = await lastValueFrom(this.http.delete<any>(url));
    console.log(res)
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }



}