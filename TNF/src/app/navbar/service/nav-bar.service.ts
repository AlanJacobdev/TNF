import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  estAdmin : boolean = false;
  estConnecte : boolean = false ;

  constructor() { }

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

}
