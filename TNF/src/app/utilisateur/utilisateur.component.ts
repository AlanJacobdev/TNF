import { Component, OnInit } from '@angular/core';
import { faClock, faCalendar, faUser, faInfo, faPen, faTrashCan, faPlus, faXmark, faKey } from '@fortawesome/free-solid-svg-icons';
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

  public faKey = faKey;
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
  public changePwd : boolean = false;
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
  public nameRole : string = "";
  public UserSelect : UtilisateurInfo ={
    idUtilisateur: 0,
    nom: '',
    prenom: '',
    login: '',
    email: '',
    idRole: 0,
    estAdministrateur: false,
    profilCreation: '',
    posteCreation: '',
    dateCreation: new Date(0),
    profilModification: '',
    posteModification: '',
    dateModification: new Date(0)
  }

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
    if (this.selectedUser != idUser) {
      this.selectedUser = idUser;
      this.close()
      this.changesNow = false;
      this.clearData();
    }
  }


  selectCreateUtilisateur(){
    this.selectedUser = -1;
    this.changesNow = true;
    this.estAdministrateur = false;
    this.clearData();
  }

  selectModifyUtilisateur(){
    this.changesNow = true;
    let res = this.listeUtilisateur.find(element => element.idUtilisateur === this.selectedUser);  
    if (res != undefined){
      this.nom = res.nom;
      this.prenom = res.prenom;
      this.login = res.login;
      this.email = res.email;
      this.role = res.idRole;
      this.estAdministrateur = res.estAdministrateur;
    }
  }

  selectModifyPassword(){
    this.changesNow = true;
    this.changePwd = true;
  }

  selectDeleteUtilisateur(){
    this.suppresion = true;
    this.changesNow = true;
    let res = this.listeUtilisateur.find(element => element.idUtilisateur === this.selectedUser);  
    if (res != undefined){
      this.login = res.login;
    }

  }

  selectInfoUtilisateur(){
    this.read = true;
    this.changesNow = true;
    let res = this.listeUtilisateur.find(element => element.idUtilisateur === this.selectedUser);  
    if (res != undefined){
      this.UserSelect = res;
      this.nom = res.nom;
      this.prenom = res.prenom;
      this.login = res.login;
      this.email = res.email;
      this.role = res.idRole;
      this.estAdministrateur = res.estAdministrateur;
      let nameOfRole = this.listeRole.find((element) => element.idRole == res?.idRole);
      if ( nameOfRole != undefined){
        this.nameRole = nameOfRole.libelleRole;
      }
    }

  }

  createUtilisateur(){
    if(this.nom == "" || this.prenom == "" || this.login == "" || this.pwd == "" || this.email == "" || this.role == -1) {
      this.formValidate = true;
    } else {
      let payload : any = {};
      payload.nom = this.nom;
      payload.prenom = this.prenom;
      payload.password = this.pwd;
      payload.login = this.login;
      payload.email = this.email;
      payload.idRole = this.role;
      payload.estAdministrateur = this.estAdministrateur;
   
      this.utilisateurService.createUtilisateur(payload).then((res: roleInfo) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de création", res , "red")
        } else {  
          this.refreshValidationForm();
          this.manageToast("Création", "L'utilisateur "+ payload.login+" a été créé", "#006400");
          this.getAllUtilisateurs();
          this.clearData();
          this.close();
        }
      }).catch((e) => {
      })
    }
  }


  updateUtilisateur(){
    if(this.nom == "" || this.prenom == "" || this.email == "" || this.role == -1) {
      this.formValidate = true;
    } else {
      let payload : any = {};
      payload.nom = this.nom;
      payload.prenom = this.prenom;
      payload.email = this.email;
      payload.idRole = this.role;
      payload.estAdministrateur = this.estAdministrateur;
   
      this.utilisateurService.updateUtilisateur(this.selectedUser, payload).then((res: roleInfo) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de modification", res , "red")
        } else {  
          this.refreshValidationForm();
          this.manageToast("Modification", "L'utilisateur "+ payload.nom +" "+ payload.prenom +" a été modifié", "#ff8c00");
          this.getAllUtilisateurs();
          this.clearData();
          this.close();
        }
      }).catch((e) => {
      })
    }
  }


  updatePwdUtilisateur(newPwdOne : string, newPwdTwo : string){
    if(newPwdOne == "" || newPwdTwo == "") {
      this.formValidate = true;
    } else {
      if (newPwdOne !== newPwdTwo) {
        this.manageToast("Erreur de modification", "Les mots de passes ne sont pas identiques" , "red")
      } else {

        let payload : any = {};
        payload.password = newPwdOne;
    
        this.utilisateurService.updatePwdUtilisateur(this.selectedUser, payload).then((res: roleInfo) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de modification", res , "red")
          } else {  
            this.refreshValidationForm();
            this.manageToast("Modification", "Le mot de passe de l'utilisateur a été modifié", "#ff8c00");
            this.getAllUtilisateurs();
            this.clearData();
            this.close();
          }
        }).catch((e) => {
        })
      }
    }
  }
  deleteUtilisateur(){
    this.utilisateurService.deleteUtilisateur(this.selectedUser).then((res: any) => {
      if(typeof res === 'string') {
        this.manageToast("Erreur de suppression", res , "red")
      } else {  
        this.manageToast("Suppression", "L'utilisateur a bien été supprimé", "#006400")    
        this.getAllUtilisateurs();
        this.selectedUser = -1;
        this.close();
      }
    }).catch((e) => {
    })
  }



  clearData(){
   this.nom = "";
   this.prenom = "";
   this.login = "";
   this.pwd = "";
   this.email = "";
   this.role = -1;
   this.estAdministrateur = false;
   this.nameRole = "";
  }

  selectCheckAdmin(idUser : number){

  }

  close(){
    this.changesNow = false;
    this.suppresion = false;
    this.read = false;
    this.changePwd = false;
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
