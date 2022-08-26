import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  estAdmin : boolean = false;
  estConnecte : boolean = false ;
  login : string = "";
  deconnecteTO : boolean = false;

  constructor( private socket: Socket, private readonly http: HttpClient) { }
  
  async estAdmininistrateur(id : string): Promise<any> {
    let url = "http://"+environment.API_URL+"/utilisateur/estAdmin/{user}";
    url = url.replace("{user}", id);
    const res : any = (await lastValueFrom(this.http.get<any>(url))).estAdministrateur;
    return res
  }
  
  getEstAdmin() {
    return this.estAdmin;
  }

  getEstConnecte() {
    return this.estConnecte;
  }

  getLogin(){
    return this.login;
  }

  setEstAdmin(value : boolean) {
    this.estAdmin = value;
  }

  setEstConnecte(value: boolean) {
    this.estConnecte = value;
  }
  
  setLogin(value : string){
    this.login = value;
  }

  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  receiveChat(){ 
    return this.socket.fromEvent('demandeResponse') 
  }

  sendChat(){
    this.socket.emit('demande', "NbDemandes");
  }

  setDeconnecteTimeOut(value: boolean){
    this.deconnecteTO = value
  }

  getDeconnecteTimeOut(){
    return this.deconnecteTO;
  }


  
}
