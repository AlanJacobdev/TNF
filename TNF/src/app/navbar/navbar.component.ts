import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NavBarService } from './service/nav-bar.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class NavbarComponent implements OnInit {

  public estAdmin : boolean = false;
  @Input() public estConnecte : boolean = false;
  public Nom : string ="";
  public Prenom : string = "";
  public Page : string = "";
  public nbDemande : string = "-1";
  @Output() newItemEvent = new EventEmitter<string>();


  /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private navbarService : NavBarService, private authService : AuthService) { 
    this.navbarService.isUserLoggedIn.subscribe( value => {
      this.estConnecte = value;
      if(value === true) {
        this.ngOnInit()
      }
    });

  }
  
  
  /**
  * Méthode appellée à l'initialisation du composant
  */
  ngOnInit(): void { 
    const decodetoken = this.authService.getInfoToken();
    
    if (decodetoken != null) {
      this.Prenom = decodetoken.prenom;
      this.Nom = decodetoken.nom
      this.estAdmin = String(decodetoken.estAdministrateur) === "true" ? true : false;
      this.navbarService.setLogin(decodetoken.login); 
      this.navbarService.setIdentifiant(decodetoken.idUtilisateur)
      if(this.estAdmin) {
        this.navbarService.setEstAdmin(true)
      }
      // var currentTimestamp = new Date().getTime() / 1000;
      // if (decodetoken.exp < currentTimestamp){
      //   this.disconnect()
      // }

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

  /**
   * Affichage du menu si l'utilisateur est connecté
   * @returns 
   */
  printMenu() {
    this.estConnecte = this.navbarService.getEstConnecte();
    return this.estConnecte;
  }

  /**
   * Déconnexion de l'utilisateur
   * Retour à la page de connexion
   */
  async disconnect(){
    await this.authService.deconnexion();
    this.navbarService.setEstConnecte(false);
    this.navbarService.setEstAdmin(false);  
    this.navbarService.setLogin("");
    localStorage.setItem('page', "Accueil");
  }

  /**
   * Défini le nom de la page courante
   * @param nomPage : Nom de la page 
   */
  public selectPage(nomPage : string){
    this.Page = nomPage;
    localStorage.setItem('page', nomPage)
    // var currentTimestamp = new Date().getTime() / 1000;
    // const decodetoken = this.authService.getInfoToken();
    // if (decodetoken.exp < currentTimestamp){
    //   this.disconnect()
    // }
  }

  /**
   * Affiche la fenêtre de modification de mot de passe
   */
  public changePassword(){
    this.newItemEvent.emit();
  }


}
