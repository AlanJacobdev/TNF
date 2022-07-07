import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { typeInfoPerDay, typeInfoPerMounth } from 'src/structureData/Accueil';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FetchAccueilService {

    constructor(private readonly http: HttpClient) { }

    async getNumberOfActivityForEachDay(start : string, end : string) {
        let url = "http://"+environment.API_URL+"/service-accueil/getNumberOfActivityForEachDay/{start}/{end}";
        url = url.replace("{start}", start);
        url = url.replace("{end}", end);

        try {
            const res : typeInfoPerMounth= await lastValueFrom(this.http.get<typeInfoPerMounth>(url));
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

    async getHistoryOfOneDay( day : string) {
      let url = "http://"+environment.API_URL+"/service-accueil/getHistoryOfOneDay/{day}";
      url = url.replace("{day}", day);

      
      try {
        const res : typeInfoPerDay= await lastValueFrom(this.http.get<typeInfoPerDay>(url));
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



}
