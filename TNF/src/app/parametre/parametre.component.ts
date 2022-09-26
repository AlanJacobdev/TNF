import { Component, OnInit } from '@angular/core';
import { faPen, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import { ParamInfo } from 'src/structureData/Parametre';
import { FetchParametreService } from './service/fetch-parametre.service';


@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css']
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class ParametreComponent implements OnInit {

  public faPen = faPen;
  public faCheck = faCheck;
  public faXmark = faXmark;
  public modifyEmail = false;
  public modifyHeure = false;
  public email : string = "email"
  public emailBeforeEdit : string = "";
  public heure : number = 4
  public heureBeforeEdit : number = -1

  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

      /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private fetchParamService: FetchParametreService) {
    
    this.fetchParamService.getEmail().then((res:ParamInfo ) =>{
      if(res != undefined){
        this.email = res.valeur;
      }
    }).catch((e) => {
    })

    this.fetchParamService.getnbHeure().then((res:ParamInfo ) =>{
      if(res != undefined){
        this.heure = Number(res.valeur)
      }
    }).catch((e) => {
    })

   }
  
       /**
  * Méthode appellée à l'initialisation du composant
  */
  ngOnInit(): void {
  }

  /**
   * Fermer le toast 
   */
  closeToast(){
    this.ToastAffiche = false;
  }

    /**
   * Gestion de l'affichage du toast 
   * @param title : Titre du toast
   * @param text : Texte du toast
   * @param color : couleur associé au toast
   */
  manageToast (title : string, text : string, color : string ){
    this.typeToast = title;
    this.colorToast = color;
    this.messageToast = text;
    this.ToastAffiche = true;
    setTimeout(() => 
    {
      this.ToastAffiche = false;
    },
    10000);
  }

  /**
   * Permet la modification de l'email 
   * Sauvegarde de l'ancien en cas d'annulation
   */
  editEmail(){
    this.modifyEmail = true;
    this.emailBeforeEdit = this.email;
  }

  /**
   * Annule la modification de l'email
   */
  cancelEditEmail () {
    this.modifyEmail = false;
    this.email = this.emailBeforeEdit;
  }

  /**
   * Modifie la valeur de l'email
   */
  sendConfirmationEditEmail() {
    this.fetchParamService.updateEmail(this.email).then((res:ParamInfo) =>{
     
      if(typeof res === 'string') {
        this.email = this.emailBeforeEdit;
        this.manageToast("Erreur de modification", res , "red")
      } else {  
        this.manageToast("Modification", " L'email a été modifié", "#ff8c00");
      }
      this.modifyEmail = false;
    }).catch((e) => {

    })
  }


  /**
   * Permet la modification du nombre d'heure
   * Sauvegarde la valeur de l'heure en cas d'annulation
   */
  editHeure(){
    this.modifyHeure = true;
    this.heureBeforeEdit = this.heure
  }

  /**
   * Annule la modification de l'heure
   */
  cancelEditheure() {
    this.modifyHeure = false;
    this.heure = this.heureBeforeEdit
  }

  /**
   * Modifie la valeur du nombre d'heure
   */
  sendConfirmationEditHeure(){
    this.fetchParamService.updateNbHeure(this.heure).then((res:ParamInfo) =>{
     
      if(typeof res === 'string') {
        this.heure = this.heureBeforeEdit
        this.manageToast("Erreur de modification", res , "red")
      } else {  
        this.manageToast("Modification", " Le nombre d'heure a été modifié", "#ff8c00");
      }
      this.modifyHeure = false;
    }).catch((e) => {

    })
  }
}
