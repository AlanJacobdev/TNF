import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';
import { exportInfo } from 'src/structureData/Exportations';
import { ObjectToExportGmao } from 'src/structureData/ObjetRepere';

@Injectable({
  providedIn: 'root'
})
export class FetchExportationGmaoService {


  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }


  async getAllObjetToExportGmao(): Promise<any> {
    let url = "http://"+environment.API_URL+"/service-exportation/export/getAllExportItem";
    const res : ObjectToExportGmao = await lastValueFrom(this.http.get<ObjectToExportGmao>(url));
    return res
  }

  async getAllExportation(): Promise<any> {
    let url = "http://"+environment.API_URL+"/exportation";
    const res : exportInfo = await lastValueFrom(this.http.get<exportInfo>(url));
    return res
  }


  async exportData(payload: any) {
    let user = this.navBarService.getLogin();
    payload.profilCreation = user;
    let url = "http://"+environment.API_URL+"/service-exportation/export/exportationData"
    
    return this.http.post(url, payload,{ responseType: 'blob', observe: 'response'}).pipe(
        map((res: any) => {
          
          if (res != undefined){
            if (res.hasOwnProperty('error')) {
              const resAny : any = res;
              return resAny.error;
            }
            if (res.body.type == "application/json") {
              return undefined;
            }
            
            return new Blob([res.body]);
          }
          return res
        })
      );
    }

    async readExp(idExp: number) {
      
      let url = "http://"+environment.API_URL+"/exportation/readFile/{idExp}"
      url = url.replace("{idExp}",idExp.toString())
      return this.http.get(url,{ responseType: 'blob', observe: 'response'}).pipe(
          map((res: any) => {
            if (res != undefined){
              if (res.body.type == "application/json") {
                return undefined;
              }
              return new Blob([res.body]);
            }
            return res
          })
        );
    
    }

    
}



