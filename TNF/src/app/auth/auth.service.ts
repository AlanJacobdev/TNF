import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
 
  constructor(private http : HttpClient, private route : Router ) {  }
  UserName:string | undefined= undefined;
  UserLastName:string | undefined= undefined;
  connection : boolean = false;
  

  estAuthentifie(){
    const token = this.getInfoToken();
    if(token != null) {
      this.UserName = token.prenom;
      this.UserLastName = token.nom;
    }
    if (this.UserName != undefined && this.UserLastName != undefined){
      return true;
    } 
    return false;
  }


  getInfoToken(){
    const token = localStorage.getItem("token");
    if(token != null) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken;
    }
    return null
  }

  async connexion(login : string, pwd:string): Promise<any> {
    try {

    let url = "http://"+environment.API_URL+"/auth/auth/login"
    let payload = {
      "login": login,
      "password" : pwd 
  }
  
    const res : any = await lastValueFrom(this.http.post<any>(url, payload, {withCredentials: true}));

    

    if (res.hasOwnProperty('error')) {
      console.log(res);
      return res.error;
    }

    if (res != undefined){
      localStorage.setItem("token", res.access_token)
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(res.access_token);
      this.UserName = decodedToken.prenom;
      this.UserLastName = decodedToken.nom;
      this.connection = true;
    }
    
    return res;
    }catch{
      return undefined;
    }

  }

  async deconnexion() {
    this.route.navigate(['/connexion']);
    this.UserName = undefined;
    this.UserLastName = undefined;
    this.connection = false;
    localStorage.removeItem("token");
  }

  
  async refresh() {
    let url = "http://"+environment.API_URL+"/auth/refresh-tokens";
    try {
      const res : any= await lastValueFrom(this.http.get<any>(url, {withCredentials: true}));
    } catch(e :any){
      
    }
  }


}
