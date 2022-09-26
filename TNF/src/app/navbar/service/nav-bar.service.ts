import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service permettant d'interroger l'API par des requetes HTTPs
 */
export class NavBarService {

  estAdmin : boolean = false;
  estConnecte : boolean = false ;
  login : string = "";
  deconnecteTO : boolean = false;
  iduser : number = -1;

  /**
   * Constructeur de la classe 
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor( private socket: Socket, private readonly http: HttpClient) { }
  
  /**
   * Recupère le statut adminsitrateur de l'utilisateur 
   * @param id : identifiant de l'administrateur
   * @returns true or false
   */
  async estAdmininistrateur(id : string): Promise<any> {
    let url = "http://"+environment.API_URL+"/utilisateur/estAdmin/{user}";
    url = url.replace("{user}", id);
    const res : any = (await lastValueFrom(this.http.get<any>(url, {withCredentials: true}))).estAdministrateur;
    return res
  }
  
  /**
   * Défini l'identifiant utilisateur
   * @param value 
   */
  setIdentifiant(value : number) {
    this.iduser = value;
  }

  /**
   * Recupère l'identifiant de l'utilisateur courant
   * @returns 
   */
  getIdentifiant() {
    return this.iduser;
  }

  /**
   * Recupère le statut administrateur de l'utilisateur courant
   * @returns true or false
   */
  getEstAdmin() {
    return this.estAdmin;
  }

  /**
   * Récupère le statut de connexion 
   * @returns true or false 
   */
  getEstConnecte() {
    return this.estConnecte;
  }

  /**
   * Récupère le login de l'utilisateur courant
   * @returns 
   */
  getLogin(){
    return this.login;
  }

  /**
   * Défini le statut administrateur
   * @param value 
   */
  setEstAdmin(value : boolean) {
    this.estAdmin = value;
  }

  /**
   * Défini le statut de connexion
   * @param value 
   */
  setEstConnecte(value: boolean) {
    this.estConnecte = value;
  }
  
  /**
   * Défini le login utilisateur 
   * @param value 
   */
  setLogin(value : string){
    this.login = value;
  }

  /**
   * Variable attestant de la connexion (temps réel)
   */
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Notification modification du nombre de demande de suppression
   * @returns Nombre de demande de suppression
   */
  receiveChat(){ 
    return this.socket.fromEvent('demandeResponse') 
  }

  /**
   * Envoie une notification afin de recevoir le nombre de demandes de suppression
   */
  sendChat(){
    this.socket.emit('demande', "NbDemandes");
  }

  /**
   * Défini si l'utilisateur à été déconnecté dû à une inactivité ou non 
   * @param value true or false 
   */
  setDeconnecteTimeOut(value: boolean){
    this.deconnecteTO = value
  }

  /**
   * Recupère le statut de deconnexion
   * @returns true or false 
   */
  getDeconnecteTimeOut(){
    return this.deconnecteTO;
  }


  
}
