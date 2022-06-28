import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { typeInfoPerMounth } from 'src/structureData/Accueil';

@Injectable({
    providedIn: 'root'
})
export class FetchAccueilService {

    constructor(private readonly http: HttpClient, private cookieService : CookieService) { }

    async getNumberOfActivityForEachDay(start : string, end : string) {
        let url = "http://localhost:3000/service-accueil/getNumberOfActivityForEachDay/{start}/{end}";
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



}
