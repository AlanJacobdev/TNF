import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class AuthService {
  
     /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private http : HttpClient, private route : Router ) {  }
 

  UserName:string | undefined= undefined;
  UserLastName:string | undefined= undefined;
  connection : boolean = false;
  

  /**
   * Vérifie si l'utilisateur est connecté 
   * @returns true or false
   */
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


  /**
   * Retourne les informations du jeton
   * @returns Structure du jeton de connexion ou null
   */
  getInfoToken(){
    const token = localStorage.getItem("token");
    if(token != null) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken;
    }
    return null
  }

  /**
   * Envoie une requête à l'api pour vérifier qu'un utilisateur est associé aux informations suivantes
   * Si l'utilisateur existe, il est redirigé vers l'accueil
   * @param login : Login de l'utilisateur
   * @param pwd : Password de l'utilisateur
   * @returns Reception du token de connexion ou erreur 
   */
  async connexion(login : string, pwd:string): Promise<any> {
    try {

    let url = "http://"+environment.API_URL+"/auth/auth/login"
    let payload = {
      "login": login,
      "password" : pwd 
  }
  
    const res : any = await lastValueFrom(this.http.post<any>(url, payload, {withCredentials: true}));

    

    if (res.hasOwnProperty('error')) {
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

  /**
   * Déconnecte l'utilisateur actuel en le redirigeant vers la page de connexion.
   * Supprime les informations en local
   */
  async deconnexion() {
    this.route.navigate(['/connexion']);
    this.UserName = undefined;
    this.UserLastName = undefined;
    this.connection = false;
    localStorage.removeItem("token");
  }

  
  /**
   * Rafraichit le jeton de connexion.
   */
  async refresh() {
    let url = "http://"+environment.API_URL+"/auth/refresh-tokens";
    try {
      const res : any= await lastValueFrom(this.http.get<any>(url, {withCredentials: true}));
    } catch(e :any){
      
    }
  }


}
