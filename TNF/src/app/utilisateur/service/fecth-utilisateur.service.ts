import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import { UtilisateurInfo } from 'src/structureData/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class FecthUtilisateurService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  async getUtilisateurs() : Promise<any>{
    let url = "http://"+environment.API_URL+"/utilisateur"
    const res : UtilisateurInfo[] = await lastValueFrom(this.http.get<UtilisateurInfo[]>(url));
    if (res.length == 0) {
    return undefined;
    } else {
    return res;
    }
  }
}
