import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { ItemEtDispo } from 'src/structureData/Item';

@Injectable({
  providedIn: 'root'
})
export class FetchExportationService {

  constructor(private readonly http: HttpClient, private cookieService : CookieService) { }



  async getExportItem(atelier : string, typeObjet : string, objetRepere : string, dateDebut : string, dateFin : string, estActif : number, estSecurite : number): Promise<any> {
    let url = "http://localhost:3000/item/getItemForExport/{atelier}/{typeObjet}/{objetRepere}/{dateDebut}/{dateFin}/{estActif}/{estSecurite}"
    url = url.replace("{atelier}", atelier)
    url = url.replace("{typeObjet}", typeObjet)
    url = url.replace("{objetRepere}", objetRepere)
    url = url.replace("{dateDebut}", dateDebut)
    url = url.replace("{dateFin}", dateFin)
    url = url.replace("{estActif}", estActif.toString())
    url = url.replace("{estSecurite}", estSecurite.toString())
    
    try {
      const res : ItemEtDispo = await lastValueFrom(this.http.get<ItemEtDispo>(url));
      if (res.hasOwnProperty('error')) {
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


}
