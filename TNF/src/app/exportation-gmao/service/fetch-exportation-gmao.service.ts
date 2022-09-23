import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import { exportInfo } from 'src/structureData/Exportations';
import { ObjectToExportGmao } from 'src/structureData/ObjetRepere';
import { roleInfo } from 'src/structureData/Role';
import { TypeObjetRepereInfo } from 'src/structureData/TypeObject';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class FetchExportationGmaoService {

    /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }


  /**
   * Recupère l'ensemble des objets non exporter pour la GMAO
   */
  async getAllObjetToExportGmao(): Promise<any> {
    let user = this.navBarService.getLogin();
    let admin = this.navBarService.getEstAdmin()
    let url;
    if (admin){
      url = "http://"+environment.API_URL+"/service-exportation/export/getAllExportItem";
    } else {
      url = "http://"+environment.API_URL+"/service-exportation/export/getAllExportItemForGMAOForOneUser/{user}";
      url = url.replace("{user}", user)
    }
    
    const res : ObjectToExportGmao = await lastValueFrom(this.http.get<ObjectToExportGmao>(url, {withCredentials: true}));
    return res
  }

  /**
   * Recupère l'ensemble des exportations précedentes 
   * @returns Liste des exportations existantes 
   */
  async getAllExportation(): Promise<any> {
    let url = "http://"+environment.API_URL+"/exportation";
    const res : exportInfo = await lastValueFrom(this.http.get<exportInfo>(url, {withCredentials: true}));
    return res
  }


  /**
   * Envoie les données à exporter pour en récupérer l'excel de récapitulation
   * Met à jour les états d'exportations des objets selectionnés
   * @param payload : Objet à exporter 
   * @returns Blob du fichier Excel
   */
  async exportData(payload: any) {
    let user = this.navBarService.getLogin();
    payload.user = user;
    let url = "http://"+environment.API_URL+"/service-exportation/export/exportationData"
    
    return this.http.post(url, payload,{ responseType: 'blob', observe: 'response' , withCredentials: true}).pipe(
        map((res: any) => {
          
          if (res != undefined){
            if (res.hasOwnProperty('error')) {
              const resAny : any = res;
              return resAny.error;
            }
            if (res.body.type == "application/json") {
              return undefined;
            }
            
            return new Blob([res.body]);
          }
          return res
        })
      );
    }

    /**
     * Lire un ancien fichier excel 
     * @param idExp : Identifiant de l'exportation
     * @returns : Le fichier sous forme de blob
     */
    async readExp(idExp: number) {
      
      let url = "http://"+environment.API_URL+"/exportation/readFile/{idExp}"
      url = url.replace("{idExp}",idExp.toString())
      return this.http.get(url,{ responseType: 'blob', observe: 'response', withCredentials: true}).pipe(
          map((res: any) => {
            if (res != undefined){
              if (res.body.type == "application/json") {
                return undefined;
              }
              return new Blob([res.body]);
            }
            return res
          })
        );
    
    }


    
  /**
   * Recupère l'ensemble des type d'objet repère lié à un utilisateur (droit)
   * Administrateur recupère l'ensemble sans contraintes
   * @returns Liste des types d'objet 
   */  
  async getAllTypeOrForOneUser(): Promise<any> {
    let admin = this.navBarService.getEstAdmin();
    let url;
    let res : any;
    if (admin) {
      url = "http://"+environment.API_URL+"/typeobjetrepere"
      res  = await lastValueFrom(this.http.get<TypeObjetRepereInfo>(url, {withCredentials: true}));

      
    } else {
      let user = this.navBarService.getLogin();
      url = "http://"+environment.API_URL+"/utilisateur/getTypeORFromUser/{user}";
      url = url.replace("{user}", user)
      res = await lastValueFrom(this.http.get<roleInfo>(url, {withCredentials: true}));
      res = res.typeObjet;
    }
    
    return res
  }

    

    
}



