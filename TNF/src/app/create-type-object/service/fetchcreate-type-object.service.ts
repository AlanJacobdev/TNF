import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TypeObjetInfo, TypeObjetRepereInfo } from 'src/structureData/TypeObject';

@Injectable({
  providedIn: 'root'
})
export class FetchcreateTypeObjectService {

  constructor(private readonly http: HttpClient) { }

  async getTypeObjetRepere(): Promise<any> {
    let url = "http://localhost:3000/typeobjetrepere"
    const res : TypeObjetRepereInfo[] = await lastValueFrom(this.http.get<TypeObjetRepereInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }

  async getTypeObjet(): Promise<any> {
    let url = "http://localhost:3000/typeobjet"
    const res : TypeObjetInfo[] = await lastValueFrom(this.http.get<TypeObjetInfo[]>(url));
    if (res.length == 0) {
      return undefined;
    } else {
      return res;
    }
  }
}
