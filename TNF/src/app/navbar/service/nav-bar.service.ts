import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  estAdmin : boolean = false;
  estConnecte : boolean = false ;
  login : string = "";
  deconnecteTO : boolean = false;

  constructor( private socket: Socket) { }

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
