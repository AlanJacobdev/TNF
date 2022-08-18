import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { etat } from 'src/structureData/Item';
import { ObjetRepereUtile } from 'src/structureData/ObjetRepere';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchExportationService {

  constructor(private readonly http: HttpClient) { }



  async getExportItem(atelier : string, typeObjet : string, objetRepere : string, dateDebut : string, dateFin : string, etatItem : etat, estSecurite : number): Promise<any> {
    let url = "http://"+environment.API_URL+"/item/getItemForExport/{atelier}/{typeObjet}/{objetRepere}/{dateDebut}/{dateFin}/{estActif}/{estSecurite}"
    url = url.replace("{atelier}", atelier)
    url = url.replace("{typeObjet}", typeObjet)
    url = url.replace("{objetRepere}", objetRepere)
    url = url.replace("{dateDebut}", dateDebut)
    url = url.replace("{dateFin}", dateFin)
    url = url.replace("{estActif}", etat[etatItem])
    url = url.replace("{estSecurite}", estSecurite.toString())
    
    try {
      const res : any[] = await lastValueFrom(this.http.get<any[]>(url));
      console.log(res);
      
      if (res.hasOwnProperty('error')) {
        return res[0].error
      } else if (res.length == 0 ){
        return undefined
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


  async getORbyId (idOr : string) : Promise<any>{
    let url = "http://"+environment.API_URL+"/objetrepere/{idOr}"
    url = url.replace("{idOr}", idOr)
    const res : ObjetRepereUtile = await lastValueFrom(this.http.get<ObjetRepereUtile>(url));
    if( res == null){
      return undefined
    }
    return res;
  }

}
