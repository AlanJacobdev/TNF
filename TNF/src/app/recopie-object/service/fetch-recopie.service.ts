import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { modificationTypeObject } from 'src/structureData/TypeObject';

@Injectable({
  providedIn: 'root'
})
export class FetchRecopieService {

  constructor(private readonly http: HttpClient) { }


  async getHistoryItem(idOR : string) : Promise<any> {
    let url = "http://localhost:3000/item/getTypeOfItemsOfOR/{idOR}"
    url = url.replace("{idOR}", idOR)
    const res : modificationTypeObject[] = await lastValueFrom(this.http.get<modificationTypeObject[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  


  async recopySpecificItemFromOR(listItems : any[], idOR: string, nu : string) : Promise<any> {
    let url = "http://localhost:3000/service-recopie/recopySpecificItemFromOR/{idOR}/{NU}"
    url = url.replace("{idOR}", idOR)
    url = url.replace("{NU}", nu)
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
