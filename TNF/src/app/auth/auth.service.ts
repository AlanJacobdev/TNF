import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { connexion } from '../interface/connexion';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  


  constructor(private http : HttpClient, private cookieService: CookieService, private route : Router) {  }
  UserName:string ="";
  UserLastName:string="";
  connection : boolean = false;

  estAuthentifie(){
    if (this.cookieService.get('UserName') != undefined && this.cookieService.get('UserName') != ''){
      return true;
    } 
    return false;
  }

  async connexion(login : string, pwd:string): Promise<any> {
    try {
    let url = "http://localhost:3000/utilisateur/connexion/exist/{login}/{pwd}"
    url = url.replace("{login}", login)
    url = url.replace("{pwd}", pwd)
    const res : connexion[] = await lastValueFrom(this.http.get<connexion[]>(url));

    if (res != undefined){
      this.UserName=res[0].PRENOMUT.trim();
      this.UserLastName=res[0].NOMUTILI.trim();
      this.connection = true;
      this.cookieService.set('UserName', res[0].PRENOMUT.trim());
      this.cookieService.set('UserLastName', res[0].NOMUTILI.trim());
      this.cookieService.set('Admin', "true");
    }
        
    return res;
    }catch{
      return undefined;
    }

  }

  async deconnexion() {
    this.cookieService.delete('UserName');
    this.cookieService.delete('UserLastName');
    this.route.navigate(['/connexion']);

  }

}
