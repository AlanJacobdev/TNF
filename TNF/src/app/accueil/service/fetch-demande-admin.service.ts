import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { DemandeAdmin } from 'src/structureData/DemandeAdmin';

@Injectable({
  providedIn: 'root'
})
export class FetchDemandeAdminService {

  constructor(private readonly http: HttpClient, private cookieService : CookieService) { }

  async getAllDemandeAdmin(): Promise<any> {
    let url = "http://localhost:3000/demande-admin";
    const res : DemandeAdmin[] = await lastValueFrom(this.http.get<DemandeAdmin[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }
}
