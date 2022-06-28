import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  estAdmin : boolean = false;
  estConnecte : boolean = false ;

  constructor( private socket: Socket) { }

  getEstAdmin() {
    return this.estAdmin;
  }

  getEstConnecte() {
    return this.estConnecte;
  }

  setEstAdmin(value : boolean) {
    this.estAdmin = value;
  }

  setEstConnecte(value: boolean) {
    this.estConnecte = value;
  }

  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  receiveChat(){ 
    return this.socket.fromEvent('testreceive') 
  }

  sendChat(){
    this.socket.emit('testsend', "ceci est un test");
  }
  
}
