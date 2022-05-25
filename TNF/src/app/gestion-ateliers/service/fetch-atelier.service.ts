import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { Atelier, AtelierInfo } from 'src/structureData/Atelier';

@Injectable({
  providedIn: 'root'
})
export class FetchAtelierService {

  constructor(private readonly http: HttpClient, private cookieService : CookieService) {}

  async getAllAteliers(): Promise<any> {
    let url = "http://localhost:3000/atelier"
    const res : AtelierInfo[] = await lastValueFrom(this.http.get<AtelierInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async updateActifAtelier(idAtelier : string, actif : boolean) : Promise<any>{
    let global = this.cookieService.get('login');
    let url = "http://localhost:3000/atelier/{idAtelier}"
    url = url.replace("{idAtelier}", idAtelier)
    let payload = {
      actif : actif,
      profilModification : global,
      posteModification : "",
      dateModification : new Date()
    }
    const res : Atelier = await lastValueFrom(this.http.put<Atelier>(url, payload));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }
  }
  
}
