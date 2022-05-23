import { Component, Input, OnInit, SimpleChange } from '@angular/core';
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

  public estAdmin : boolean = false;
  @Input() public estConnecte : boolean = false;
  public Nom : string ="";
  public Prenom : string = "";
  public Page : string = "";

  constructor(private navbarService : NavBarService, private authService : AuthService, private cookieService: CookieService) { 
    this.navbarService.isUserLoggedIn.subscribe( value => {
      this.estConnecte = value;
      if(value === true) {
        this.ngOnInit()
      }
    });

  }
  
  

  ngOnInit(): void {    
    this.estAdmin = this.navbarService.getEstAdmin();
    //this.estConnecte = this.navbarService.getEstConnecte();
    this.Prenom = this.cookieService.get('UserName');
    this.Nom = this.cookieService.get('UserLastName')
    this.estAdmin = this.cookieService.get('Admin') === "true" ? true : false;
    const nomPage = localStorage.getItem('page');
    this.Page = (nomPage) != null ? nomPage : "";
  }

  printMenu() {
    this.estConnecte = this.navbarService.getEstConnecte();
    return this.estConnecte;
  }

  async disconnect(){
    await this.authService.deconnexion();
    this.navbarService.setEstConnecte(false);
    this.navbarService.setEstAdmin(false);  
    localStorage.setItem('page', "Acceuil");
  }

  public selectPage(nomPage : string){
    this.Page = nomPage;
    localStorage.setItem('page', nomPage)
  }

}
