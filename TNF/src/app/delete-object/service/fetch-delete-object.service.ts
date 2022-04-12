import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDeleteObjectService {

  constructor(private readonly http: HttpClient, private cookieService : CookieService) { }

  async supprimerObject(idOR : string): Promise<any> {
    let user = this.cookieService.get('login');
    let url = "http://localhost:3000/objetrepere/{idOR}/{User}";
    url = url.replace("{idOR}", idOR)
    url = url.replace("{User}", user)
    try {
      const res : any = await lastValueFrom(this.http.delete<any>(url));
      console.log(res);

      if (res.length == 0) {
        return undefined;
      } else {
          if(res.hasOwnProperty('error')){
              return res.error;
          } else if (res.hasOwnProperty('message')) {
              return res;
          }
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

  async supprimerItem(idItem : string): Promise<any> {
    let user = this.cookieService.get('login');
    let url = "http://localhost:3000/item/{idItem}/{User}";
    url = url.replace("{idItem}", idItem)
    url = url.replace("{User}", user)
    try {
      const res : any = await lastValueFrom(this.http.delete<any>(url));
      console.log(res);

      if (res.length == 0) {
        return undefined;
      } else {
          if(res.hasOwnProperty('error')){
              return res.error;
          } else if (res.hasOwnProperty('message')) {
              return res;
          }
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
