import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { typeInfoPerDay, typeInfoPerMounth } from 'src/structureData/Accueil';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FetchAccueilService {

    constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

    async getNumberOfActivityForEachDay(start : string, end : string) {
        let admin = this.navBarService.getEstAdmin();
        let login = this.navBarService.getLogin();
        let url : string = "";
        if (admin){
          url = "http://"+environment.API_URL+"/service-accueil/getNumberOfActivityForEachDay/{start}/{end}";
        } else {
          url = "http://"+environment.API_URL+"/service-accueil/getNumberOfActivityForEachDay/{start}/{end}/{login}";
          url = url.replace("{login}", login);
        }
        
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
      
      let admin = this.navBarService.getEstAdmin();
      let login = this.navBarService.getLogin();
      let url : string = "";
      if (admin){
        url = "http://"+environment.API_URL+"/service-accueil/getHistoryOfOneDay/{day}";
      } else {
        url = "http://"+environment.API_URL+"/service-accueil/getHistoryOfOneDay/{day}/{login}";
        url = url.replace("{login}", login);
      }
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

    async refresh() {
      
    
      let url = "http://"+environment.API_URL+"/auth/refresh-tokens";
      const res : any= await lastValueFrom(this.http.get<any>(url, {withCredentials: true}));

    }

    async get() {
      
    
      let url = "http://"+environment.API_URL+"/auth/fav-movies";
      const res : any= await lastValueFrom(this.http.get<any>(url, {withCredentials: true}));
      console.log(res);
      
    }

}
