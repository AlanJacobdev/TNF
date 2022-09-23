import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import {documentInfoModify, DocumentReceive, InformationCreate, InformationInfo, InformationModify } from 'src/structureData/Informations';

@Injectable({
    providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchInformationService {

  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService){
  }

    /**
     * Retourne la liste de toutes les informations
     * @returns Liste des informations existantes 
     */
    async getInformations(): Promise<any> {
        let url = "http://"+environment.API_URL+"/informations"
        const res : InformationInfo[] = await lastValueFrom(this.http.get<InformationInfo[]>(url, {withCredentials: true}));
        if (res.length == 0) {
        return undefined;
        } else {
        return res;
        }
    }

    /**
     * Lire un document lié à une information
     * @param idDoc : Identifiant du docuement
     * @returns Blob du document
     */
    async readFile(idDoc : number) {
        let url = "http://"+environment.API_URL+"/document/readFile/{idDoc}"
        url = url.replace("{idDoc}",idDoc.toString())
        return this.http.get(url,{ responseType: 'blob', observe: 'response', withCredentials: true}).pipe(
            map((res: any) => {        
              let type = res.headers.get('Content-Type');
              if (res != undefined){
                if (type == "application/json") {
                  return undefined;
                }
                return {
                  blob : res.body,
                  type: type
                };
              }
              return res
            })
          );
    }

    

    /**
     * Upload les documents sur le serveur
     * @param files : Fichier à exporter
     * @returns Message de validation ou erreur
     */
    async exportFiles( files : FormData){
        let user = this.navBarService.getLogin();
        let url = "http://"+environment.API_URL+"/document/file-upload/{User}"
        url = url.replace("{User}", user)
        try {
        const res : any = await lastValueFrom(this.http.post<any>(url, files, {withCredentials: true}));

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

    /**
     * Création d'une information
     * @param payload : Informations utiles à la création d'une information
     * @returns Structure de l'information ou erreur
     */
    async createInformations( payload : InformationCreate){
        let user = this.navBarService.getLogin();
        let url = "http://"+environment.API_URL+"/informations"
        payload.profilCreation = user;
        try {
        const res : any = await lastValueFrom(this.http.post<any>(url, payload, {withCredentials: true}));

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

    /**
     * Modification d'une information
     * @param idInformation : Identifiant de l'information
     * @param payload : Information a modifier
     * @returns Structure de l'information modifiée
     */
    async updateInformation(idInformation : number, payload : InformationModify): Promise<any> {
        let user = this.navBarService.getLogin();
        let url = "http://"+environment.API_URL+"/informations/{idInformation}"
        url = url.replace("{idInformation}", idInformation.toString())
        payload.profilModification = user;
        try {
          const res : InformationInfo = await lastValueFrom(this.http.put<InformationInfo>(url, payload, {withCredentials: true}));
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


      /**
       * Modifie le libellé d'un document
       * @param payload : Information a modifier
       * @returns Structure du document modifié
       */
      async updateLibelleFromDoc(payload : documentInfoModify): Promise<any> {
        let url = "http://"+environment.API_URL+"/document"
        try {
          const res : DocumentReceive = await lastValueFrom(this.http.put<DocumentReceive>(url, payload, {withCredentials: true}));
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


      /**
       * Supprime une information
       * @param idInformation : Identifiant de l'information
       * @returns Message de validation ou erreur 
       */
    async deleteInformation(idInformation : number): Promise<any> {
        let url = "http://"+environment.API_URL+"/informations/{idInformation}";
        url = url.replace("{idInformation}", idInformation.toString())
        try {
            const res : any = await lastValueFrom(this.http.delete<any>(url, {withCredentials: true}));
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