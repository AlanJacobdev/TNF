import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { AtelierInfo } from 'src/structureData/Atelier';
import { ItemInfo, ItemSave } from 'src/structureData/Item';
import { ObjetRepereInfo, ObjetRepereSave } from 'src/structureData/ObjetRepere';
import { SousItemInfo, SousItemSave } from 'src/structureData/SousItem';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchVisuService {

  constructor(private readonly http: HttpClient, private navBarService: NavBarService) { }

  async getAllAteliers(): Promise<any> {
    const admin = this.navBarService.getEstAdmin();
    let url;
    if (admin){
      url = "http://"+environment.API_URL+"/atelier"
    } else {
      url = "http://"+environment.API_URL+"/atelier/getAll/isActif"
    }
    const res : AtelierInfo[] = await lastValueFrom(this.http.get<AtelierInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getObjetRepereByAteliers(Atelier : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/objetrepere/getORByAtelier/{atelier}"
    url = url.replace("{atelier}", Atelier)
    const res : ObjetRepereInfo[] = await lastValueFrom(this.http.get<ObjetRepereInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getHistoryObjetRepere(idOr : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/objetrepere/history/{OR}"
    url = url.replace("{OR}", idOr)
    const res : ObjetRepereSave[] = await lastValueFrom(this.http.get<ObjetRepereSave[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getItemByObjetRepere(objetRepere : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/item/getItemByOR/{OR}"
    url = url.replace("{OR}", objetRepere)
    const res : ItemInfo[] = await lastValueFrom(this.http.get<ItemInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getHistoryItem(idItem : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/item/history/{Item}"
    url = url.replace("{Item}", idItem)
    const res : ItemSave[] = await lastValueFrom(this.http.get<ItemSave[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getSousItemByItem(Item : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/sousitem/getSousItemByItem/{SI}"
    url = url.replace("{SI}", Item)
    const res : SousItemInfo[] = await lastValueFrom(this.http.get<SousItemInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getHistorySousItem(idSI : string) : Promise<any> {
    let url = "http://"+environment.API_URL+"/sousitem/history/{SI}"
    url = url.replace("{SI}", idSI);
    const res : SousItemSave[] = await lastValueFrom(this.http.get<SousItemSave[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }
}
