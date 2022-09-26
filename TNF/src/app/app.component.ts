import { Component} from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { roleInfo } from 'src/structureData/Role';
import { NavBarService } from './navbar/service/nav-bar.service';
import { FecthUtilisateurService } from './utilisateur/service/fecth-utilisateur.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class AppComponent {
  
  public faXmark = faXmark;
  title = 'Itemisation';
  public formValidate = false;
  changePWD: boolean = false;
  public message : string = "";
  
  /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private utilisateurService : FecthUtilisateurService, private navbarService : NavBarService){}
  
 /**
  * Appeler si l'utilisateur souhaite modifier son mot de passe
  */
  changePassword(){
    this.changePWD = true
    
  }

  /**
   * Ferme le modal de déconnexion pour inactivité
   */
  public close(){
    this.changePWD = false
    this.formValidate = false;
    this.message = ""
  }

  /**
   * Met à jour le mot de passe utilisateur
   * @param newPwdOne : Nouveau mot de passe 
   * @param newPwdTwo  : Confirmation du mot de passe
   */
  updatePwdUtilisateur(newPwdOne : string, newPwdTwo : string){
    if(newPwdOne == "" || newPwdTwo == "") {
      this.formValidate = true;
      this.message = "Données incomplètes"
    } else {
      if (newPwdOne !== newPwdTwo) {
        this.formValidate = true;
        this.message = " Les mots de passe saisis ne sont pas identiques"
      } else {

        let payload : any = {};
        payload.password = newPwdOne;
        let user = this.navbarService.getIdentifiant();
        this.utilisateurService.updatePwdUtilisateur(user, payload).then((res: roleInfo) => {
          if(typeof res === 'string') {
            this.message = "Problème rencontrés. Contactez votre administrateur"
          } else {  
            this.close();
          }
        }).catch((e) => {
        })
      }
    }
  }

}

    




