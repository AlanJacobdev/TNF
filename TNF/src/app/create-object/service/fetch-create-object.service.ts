import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { NUetOR } from 'src/structureData/ObjetRepere';

@Injectable({
  providedIn: 'root'
})
export class FetchCreateObjectService {

  constructor(private readonly http: HttpClient, private cookieService : CookieService) { }

  async getAllNUandORByAtelier(Atelier : string): Promise<any> {
    let url = "http://localhost:3000/objetrepere/getAllNUAndORByAtelier/{Atelier}";
    url = url.replace("{Atelier}", Atelier)
    const res : NUetOR[] = await lastValueFrom(this.http.get<NUetOR[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

}
