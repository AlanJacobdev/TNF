import { Component, OnInit } from '@angular/core';
import { faClock, faCalendar, faUser, faInfo, faPen, faTrashCan, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { roleInfo } from 'src/structureData/Role';
import { UtilisateurInfo } from 'src/structureData/Utilisateur';
import { FetchRoleService } from '../role/service/fetch-role.service';
import { FecthUtilisateurService } from './service/fecth-utilisateur.service';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {

  constructor(private utilisateurService : FecthUtilisateurService, private fetchRoleService : FetchRoleService) { }

  public faClock = faClock;
  public faCalendar = faCalendar;
  public faUser = faUser;
  public faInfo = faInfo;
  public faPen = faPen;
  public faTrashCan = faTrashCan;
  public faPlus = faPlus;
  public faXmark = faXmark;
  
  public listeRole : roleInfo[] = [];
  public listeUtilisateur : UtilisateurInfo[] = [];
  public selectedUser : number = -1;

  public changesNow : boolean = false;
  public suppresion: boolean = false;
  public read: boolean = false;
  public formValidate : boolean = false;

  public nom : string = "";
  public prenom : string = "";
  public login : string = "";
  public pwd : string = "";
  public email : string = "";
  public role : number = -1;
  public estAdministrateur : boolean = false;

  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

  ngOnInit(): void {
    this.getAllUtilisateurs();
    this.getAllRole();
  }

  getAllUtilisateurs () {
    this.listeUtilisateur.splice(0)
    this.utilisateurService.getUtilisateurs().then((list: UtilisateurInfo[]) => {
      if (list != undefined){
        this.listeUtilisateur = list;
      }
    }).catch((e) => {
    })
  }

  getAllRole(){
    this.listeRole.splice(0)
    this.fetchRoleService.getRole().then((list: roleInfo[]) => {
      if (list != undefined){
        this.listeRole = list;
      }
    }).catch((e) => {
    })
  }

  

  selectUtilisateur(idUser : number){
    this.selectedUser = idUser;
  }


  selectCreateUtilisateur(){
    this.selectedUser = -1;
    this.changesNow = true;
    
  }

  selectModifyUtilisateur(){
    this.changesNow = true;
  }

  selectDeleteUtilisateur(){
    this.suppresion = true;
    this.changesNow = true;
  }

  selectInfoUtilisateur(){
    this.read = true;
    this.changesNow = true;
  }


  selectRole( event : any){
    let role = event.target.value;
    if (role != undefined){
      this.role = role;
    }
    
    
  }

  createUtilisateur(){
    console.log(this.role);
    if(this.nom == "" || this.prenom == "" || this.login == "" || this.pwd == "" || this.email == "" || this.role == -1) {
      this.formValidate = true;
    } else {
      
    }
   
  }


  selectCheckAdmin(idUser : number){

  }

  close(){
    this.changesNow = false;
    this.suppresion = false;
    this.read = false;
    this.refreshValidationForm();
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

  refreshValidationForm() {
    this.formValidate = false;
  }


}
