import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { ObjetRepereUtile } from 'src/structureData/ObjetRepere';
import { TypeObjet } from 'src/structureData/TypeObject';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchRecopieService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }


  async getTypeOfItemsOfOR(idOR : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/item/getTypeOfItemsOfOR/{idOR}"
    url = url.replace("{idOR}", idOR)
    const res : TypeObjet[] = await lastValueFrom(this.http.get<TypeObjet[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  

  async getORByNU(nu : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/objetrepere/getORByNU/{NU}"
    url = url.replace("{NU}", nu)
    const res : ObjetRepereUtile = await lastValueFrom(this.http.get<ObjetRepereUtile>(url));
    if (res == undefined) {
      return undefined;
    } else {
      return res;
    }
  }

  


  async recopySpecificItemFromOR(listItems : any[], idOR: string, nu : string) : Promise<any> {
    let user = this.navBarService.getLogin();
    let url = "http://"+environment.API_URL+"/service-recopie/recopySpecificItemFromOR/{idOR}/{NU}/{profil}"
    url = url.replace("{idOR}", idOR)
    url = url.replace("{NU}", nu)
    url = url.replace("{profil}", user)
    const res : any = await lastValueFrom(this.http.post<any>(url, listItems));    
    console.log(res.error)
    if (res.length == 0) {
      return undefined;
    } else {
        if(res.hasOwnProperty('error')){
            return res.error;
        } else if (res.hasOwnProperty('message')) {
            return res;
        }
    }
  }

}
