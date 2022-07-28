import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import {DocName, DocumentInfo, documentInfoModify, DocumentReceive, InformationCreate, InformationInfo, InformationModify } from 'src/structureData/Informations';
import { stream } from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class FetchInformationService {

constructor(private readonly http: HttpClient, private navBarService: NavBarService){
}

    
    async getInformations(): Promise<any> {
        let url = "http://"+environment.API_URL+"/informations"
        const res : InformationInfo[] = await lastValueFrom(this.http.get<InformationInfo[]>(url));
        if (res.length == 0) {
        return undefined;
        } else {
        return res;
        }
    }

    async readFile(idDoc : number) {
        let url = "http://"+environment.API_URL+"/document/readFile/{idDoc}"
        url = url.replace("{idDoc}",idDoc.toString())
        return this.http.get(url,{ responseType: 'blob', observe: 'response'}).pipe(
            map((res: any) => {
              return new Blob([res.body]);
            })
          );
    }

    

    async exportFiles( files : FormData){
        let user = this.navBarService.getLogin();
        let url = "http://"+environment.API_URL+"/document/file-upload/{User}"
        url = url.replace("{User}", user)
        try {
        const res : any = await lastValueFrom(this.http.post<any>(url, files));

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

    async createInformations( payload : InformationCreate){
        let user = this.navBarService.getLogin();
        let url = "http://"+environment.API_URL+"/informations"
        payload.profilCreation = user;
        try {
        const res : any = await lastValueFrom(this.http.post<any>(url, payload));

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

    async updateInformation(idInformation : number, payload : InformationModify): Promise<any> {
        let user = this.navBarService.getLogin();
        let url = "http://"+environment.API_URL+"/informations/{idInformation}"
        url = url.replace("{idInformation}", idInformation.toString())
        payload.profilModification = user;
        try {
          const res : InformationInfo = await lastValueFrom(this.http.put<InformationInfo>(url, payload));
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


      async updateLibelleFromDoc(payload : documentInfoModify): Promise<any> {
        let url = "http://"+environment.API_URL+"/document"
        try {
          const res : DocumentReceive = await lastValueFrom(this.http.put<DocumentReceive>(url, payload));
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


    async deleteInformation(idInformation : number): Promise<any> {
        let url = "http://"+environment.API_URL+"/informations/{idInformation}";
        url = url.replace("{idInformation}", idInformation.toString())
        try {
            const res : any = await lastValueFrom(this.http.delete<any>(url));
            if(res.hasOwnProperty('error')){
                return res.error;
            } else if (res.hasOwnProperty('message')) {
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
}