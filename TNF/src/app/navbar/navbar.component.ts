import { Component, Input, OnInit, SimpleChange } from '@angular/core';
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
  public nbDemande : string = "-1";

  constructor(private navbarService : NavBarService, private authService : AuthService) { 
    this.navbarService.isUserLoggedIn.subscribe( value => {
      this.estConnecte = value;
      if(value === true) {
        this.ngOnInit()
      }
    });

  }
  
  

  ngOnInit(): void { 
    // this.estAdmin = this.navbarService.getEstAdmin();
    //this.estConnecte = this.navbarService.getEstConnecte();
    const decodetoken = this.authService.getInfoToken();
    if (decodetoken != null) {
      this.Prenom = decodetoken.prenom;
      this.Nom = decodetoken.nom
      this.estAdmin = String(decodetoken.estAdministrateur) === "true" ? true : false;
      this.navbarService.setLogin(decodetoken.login);
      if(this.estAdmin) {
        this.navbarService.setEstAdmin(true)
      }
    }
    const nomPage = localStorage.getItem('page');
    this.Page = (nomPage) != null ? nomPage : "";
    if (this.estAdmin) { 
      this.navbarService.sendChat(); 
    }
    this.navbarService.receiveChat().subscribe( payload => {
      const nbDemandePayload = payload as number;
      this.nbDemande =  (nbDemandePayload > 9 ? "9+" : nbDemandePayload.toString());
    }); 
  }

  printMenu() {
    this.estConnecte = this.navbarService.getEstConnecte();
    return this.estConnecte;
  }

  async disconnect(){
    await this.authService.deconnexion();
    this.navbarService.setEstConnecte(false);
    this.navbarService.setEstAdmin(false);  
    this.navbarService.setLogin("");
    localStorage.setItem('page', "Accueil");
  }

  public selectPage(nomPage : string){
    this.Page = nomPage;
    localStorage.setItem('page', nomPage)
  }

}
