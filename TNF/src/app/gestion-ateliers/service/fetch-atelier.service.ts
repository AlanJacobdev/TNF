import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { Atelier, AtelierInfo } from 'src/structureData/Atelier';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchAtelierService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService) {}

  async getAllAteliers(): Promise<any> {
    let url = "http://"+environment.API_URL+"/atelier"
    const res : AtelierInfo[] = await lastValueFrom(this.http.get<AtelierInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async updateActifAtelier(idAtelier : string, actif : boolean) : Promise<any>{
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/atelier/{idAtelier}"
    url = url.replace("{idAtelier}", idAtelier)
    let payload = {
      actif : actif,
      profilModification : user,
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

  async updateAtelier(id : string, libelle : string ) : Promise<any>{
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/atelier/{idAtelier}"
    url = url.replace("{idAtelier}", id)
    let payload = {
      libelleAtelier : libelle,
      profilModification : user,
      posteModification : ''
    }
    const res : Atelier = await lastValueFrom(this.http.put<Atelier>(url, payload));
    if (res.hasOwnProperty('error')) {
      return undefined
    } else {
      return res;
    }

    
  }
  
}
