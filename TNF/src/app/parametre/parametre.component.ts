import { Component, OnInit } from '@angular/core';
import { faPen, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import { ParamInfo } from 'src/structureData/Parametre';
import { FetchParametreService } from './service/fetch-parametre.service';


@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css']
})
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
  
  ngOnInit(): void {
  }

  closeToast(){
    this.ToastAffiche = false;
  }

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

  editEmail(){
    this.modifyEmail = true;
    this.emailBeforeEdit = this.email;
  }

  cancelEditEmail () {
    this.modifyEmail = false;
    this.email = this.emailBeforeEdit;
  }

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


  editHeure(){
    this.modifyHeure = true;
    this.heureBeforeEdit = this.heure
  }

  cancelEditheure() {
    this.modifyHeure = false;
    this.heure = this.heureBeforeEdit
  }

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
