import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AtelierInfo } from 'src/structureData/Atelier';
import { ItemInfo } from 'src/structureData/Item';
import { ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { SousItemInfo } from 'src/structureData/SousItem';

@Injectable({
  providedIn: 'root'
})
export class FetchVisuService {

  constructor(private readonly http: HttpClient) { }

  async getAllAteliers(): Promise<any> {
    let url = "http://localhost:3000/atelier"
    const res : AtelierInfo[] = await lastValueFrom(this.http.get<AtelierInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getObjetRepereByAteliers(Atelier : string) : Promise<any> {
    let url = "http://localhost:3000/objetrepere/getORByAtelier/{atelier}"
    url = url.replace("{atelier}", Atelier)
    const res : ObjetRepereInfo[] = await lastValueFrom(this.http.get<ObjetRepereInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getItemByObjetRepere(objetRepere : string) : Promise<any> {
    let url = "http://localhost:3000/item/getItemByOR/{OR}"
    url = url.replace("{OR}", objetRepere)
    const res : ItemInfo[] = await lastValueFrom(this.http.get<ItemInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getSousItemByItem(Item : string) : Promise<any> {
    let url = "http://localhost:3000/sousitem/getSousItemByItem/{SI}"
    url = url.replace("{SI}", Item)
    const res : SousItemInfo[] = await lastValueFrom(this.http.get<SousItemInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }
}
