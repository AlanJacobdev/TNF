import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { async } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NavBarService } from './service/nav-bar.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private navbarService : NavBarService, private authService : AuthService, private cookieService: CookieService) { }
  public estAdmin : boolean = false;
  public estConnecte : boolean = false;
  public Nom : string ="";
  public Prenom : string = "";

  ngOnInit(): void {
    this.estAdmin = this.navbarService.getEstAdmin();
    this.estConnecte = this.navbarService.getEstConnecte();
    this.Prenom = this.cookieService.get('UserName');
    this.Nom = this.cookieService.get('UserLastName')
    this.estAdmin = this.cookieService.get('Admin') === "true" ? true : false;
  }

  printMenu() {
    this.estConnecte = this.navbarService.getEstConnecte();
    return this.estConnecte;
  }

  async disconnect(){
    await this.authService.deconnexion();
    this.navbarService.setEstConnecte(false);
    this.navbarService.setEstAdmin(false);    
  }

}
