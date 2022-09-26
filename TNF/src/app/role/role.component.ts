import { Component, OnInit } from '@angular/core';
import { faCalendar, faClock, faInfo, faPen, faPlus, faTrashCan, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AtelierInfo } from 'src/structureData/Atelier';
import { roleInfo } from 'src/structureData/Role';
import { TypeObjetRepere, TypeObjetRepereInfo } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchAtelierService } from '../gestion-ateliers/service/fetch-atelier.service';
import { FetchRoleService } from './service/fetch-role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class RoleComponent implements OnInit {

    /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private fetchRoleService : FetchRoleService, private fetchGestionAtelier: FetchAtelierService, private fetchCreateTypeObject : FetchcreateTypeObjectService) { }

  public faClock = faClock;
  public faCalendar = faCalendar;
  public faUser = faUser;
  public faInfo = faInfo;
  public faPen = faPen;
  public faTrashCan = faTrashCan;
  public faPlus = faPlus;
  public faXmark = faXmark;
  
  public listeTypeOR : TypeObjetRepereInfo[] = [];
  public listeAtelier : AtelierInfo[] = [];
  public listeRole : roleInfo[] = [];
  public listOfSelectedAtelier : string[]= [];
  public listOfSelectedTypeOR : string[]= [];
  public selectedRole : number = -1;
  public roleSelected : roleInfo = {
    idRole: 0,
    libelleRole: '',
    dateCreation: new Date(0),
    profilCreation: '',
    dateModification: new Date(0),
    profilModification: '',
    atelier: [],
    typeObjet: []
  };
  public changesNow : boolean = false;
  public suppresion: boolean = false;
  public read: boolean = false;
  public formValidate : boolean = false;
  public checkAllAtelier : boolean = false;
  public checkAllTypeOR : boolean = false;
  public libelle : string = "";

  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

      /**
  * Méthode appellée à l'initialisation du composant
  */
  ngOnInit(): void {
    this.getAllRole();
    this.getAllAteliers();
    this.getAllTypeOR();
  }

  /**
   * Recupère l'ensemble des rôles
   */
  getAllRole(){
    this.listeRole.splice(0)
    this.fetchRoleService.getRole().then((list: roleInfo[]) => {
      if (list != undefined){
        this.listeRole = list;
      }
    }).catch((e) => {
    })
  }

  /**
   * Recupère l'ensemble des ateliers 
   */
  getAllAteliers() {
    this.fetchGestionAtelier.getAllAteliers().then((list:AtelierInfo[] ) =>{
      if(list != undefined){
        this.listeAtelier = list;
      }else{
        console.log("Impossible de récupérer les ateliers");
      }
    }).catch((e) => {

    })
  }


  /**
   * Recupère la liste de tout les types d'objet repères
   */
  getAllTypeOR(){
    this.listeTypeOR.splice(0);
    this.fetchCreateTypeObject.getTypeObjetRepere().then((list: TypeObjetRepereInfo[]) => {
      if(list != undefined){
        this.listeTypeOR = list;
      }else{
        console.log("Impossible de récupérer les types d'objets");
      }
    }).catch((e) => {
    })
  }


  /**
   * Sélectionne un rôle
   * @param id : Identifiant du rôle
   */
  selectRole(id :number){
    if(id != this.selectedRole){
      this.selectedRole = id;
      this.close()
      this.changesNow = false;
    }
  }

  /**
   * Sélection du bouton de création
   */
  selectCreateRole() {
    this.selectedRole = -1;
    this.changesNow = true;
    for ( const tor of this.listeTypeOR){
      tor.isPaste = false;
    }
    for ( const atelier of this.listeAtelier){
      atelier.isPaste = false;
    }
    this.checkAllAtelier = false;
    this.checkAllTypeOR = false;
    this.listOfSelectedAtelier.splice(0),
    this.listOfSelectedTypeOR.splice(0);


  }

  /**
   * Sélection du bouton de modification
   */
  selectModifyRole(){
    for ( const tor of this.listeTypeOR){
      tor.isPaste = false;
    }
    for ( const atelier of this.listeAtelier){
      atelier.isPaste = false;
    }
    this.listOfSelectedAtelier.splice(0),
    this.listOfSelectedTypeOR.splice(0);

    this.changesNow = true;
    let res = this.listeRole.find(element => element.idRole === this.selectedRole);  
    if (res != undefined){
      this.roleSelected = res;
      this.libelle = res.libelleRole;

      
      for (const atelier of res.atelier){
        this.listOfSelectedAtelier.push(atelier.idAtelier)
        let index = this.listeAtelier.findIndex((element) => element.idAtelier == atelier.idAtelier)
        if (index != -1){
          this.listeAtelier[index].isPaste = true;
        }
      }
      this.verifyCheckAllAtelier();

      for (const typeor of res.typeObjet){
        this.listOfSelectedTypeOR.push(typeor.idTypeOR)
        let index = this.listeTypeOR.findIndex((element) => element.idTypeOR == typeor.idTypeOR)
        if (index != -1){
          this.listeTypeOR[index].isPaste = true;
        }
      }
      this.verifyCheckAllTypeOr();
    }
  }

  /**
   * Sélection du bouton de suppression
   */
  selectDeleteRole(){
    this.suppresion = true;
    this.changesNow = true;
    let res = this.listeRole.find(element => element.idRole === this.selectedRole);  
    if (res != undefined){
      this.roleSelected = res
    }
  }

  /**
   * Sélection du bouton d'information
   */
  selectInfoRole(){
    this.read = true;
    this.changesNow = true;

    for ( const tor of this.listeTypeOR){
      tor.isPaste = false;
    }
    for ( const atelier of this.listeAtelier){
      atelier.isPaste = false;
    }
    this.listOfSelectedAtelier.splice(0),
    this.listOfSelectedTypeOR.splice(0);
    
    let res = this.listeRole.find(element => element.idRole === this.selectedRole);  
    if (res != undefined){
      this.roleSelected = res;
      this.libelle = res.libelleRole;

      
      for (const atelier of res.atelier){
        this.listOfSelectedAtelier.push(atelier.idAtelier)
        let index = this.listeAtelier.findIndex((element) => element.idAtelier == atelier.idAtelier)
        if (index != -1){
          this.listeAtelier[index].isPaste = true;
        }
      }
      this.verifyCheckAllAtelier();

      for (const typeor of res.typeObjet){
        this.listOfSelectedTypeOR.push(typeor.idTypeOR)
        let index = this.listeTypeOR.findIndex((element) => element.idTypeOR == typeor.idTypeOR)
        if (index != -1){
          this.listeTypeOR[index].isPaste = true;
        }
      }
      this.verifyCheckAllTypeOr();
    }

  }

  /**
   * Ferme les formulaire lié aux rôles
   */
  close(){
    this.changesNow = false;
    this.suppresion = false;
    this.read = false;
    this.refreshValidationForm();
    this.libelle = "";
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
   * Valeur par défaut de la validation de formulaire (affichage des erreurs)
   */
  refreshValidationForm() {
    this.formValidate = false;
  }

  /**
   * Sélectionne un atelier pour attribuer ou retirer le droit sur ce dernier
   * @param idAtelier : Identifiant de l'atelier
   */
  selectCheckAtelier(idAtelier : string) {
    const targetAtelier = this.listeAtelier.findIndex((element) => element.idAtelier === idAtelier)
    if (targetAtelier != -1) {  
      this.listeAtelier[targetAtelier].isPaste = !this.listeAtelier[targetAtelier].isPaste;
      const stateAtelier = this.listOfSelectedAtelier.findIndex((element) => element === idAtelier);
      if(stateAtelier != -1) {
        this.listOfSelectedAtelier.splice(stateAtelier , 1)
      } else {
        this.listOfSelectedAtelier.push(idAtelier);
      }
    }   
    this.verifyCheckAllAtelier();
  }

  /**
   * Sélectionne l'ensemble des ateliers
   */
  public allSelectAtelier() {
    this.checkAllAtelier = !this.checkAllAtelier;
    for (const atelier of this.listeAtelier) {
      atelier.isPaste = this.checkAllAtelier;
      let index = this.listeAtelier.findIndex((element) => element.idAtelier === atelier.idAtelier)
      let indexPaste = this.listOfSelectedAtelier.findIndex((element) => element == atelier.idAtelier)       
      if (this.listeAtelier[index].isPaste){
        if(indexPaste == -1){
          this.listOfSelectedAtelier.push(this.listeAtelier[index].idAtelier)
        }
      } else {
        let index = this.listOfSelectedAtelier.findIndex((element) => element === atelier.idAtelier)
        this.listOfSelectedAtelier.splice(index,1);
      }
    }
  }

  /**
   * Vérifie si l'ensemble des atelier est sélectionné
   */
  verifyCheckAllAtelier(){
    let allCheck = true;
    if (this.listeAtelier.length != 0){
      for (const atelier of this.listeAtelier) {
        if(atelier.isPaste === false) {
          allCheck = false;
        }
      }
      if (allCheck) {
        this.checkAllAtelier = true;
      } else {
        this.checkAllAtelier = false;
      }
    } else {
      this.checkAllAtelier = false;
    }
  }


  /**
   * Sélectionne un type d'objet repère pour attribuer ou retirer le droit sur ce dernier
   * @param idTypeOR : Identifiant du type d'objet repère
   */
  selectCheckTypeOR(idTypeOR : string){
    const targetTypeOR = this.listeTypeOR.findIndex((element) => element.idTypeOR === idTypeOR)
    if (targetTypeOR != -1) {  
      this.listeTypeOR[targetTypeOR].isPaste = !this.listeTypeOR[targetTypeOR].isPaste;
      const stateTypeOR = this.listOfSelectedTypeOR.findIndex((element) => element === idTypeOR);
      if(stateTypeOR != -1) {
        this.listOfSelectedTypeOR.splice(stateTypeOR , 1)
      } else {
        this.listOfSelectedTypeOR.push(idTypeOR);
      }
    }  
    this.verifyCheckAllTypeOr();
  }

  /**
   * Sélectionne l'ensemble des type d'objet repère
   */
  allSelectTypeOR(){
    this.checkAllTypeOR = !this.checkAllTypeOR;
    for (const typeor of this.listeTypeOR) {
      typeor.isPaste = this.checkAllTypeOR;
      let index = this.listeTypeOR.findIndex((element) => element.idTypeOR === typeor.idTypeOR)
      let indexPaste = this.listOfSelectedTypeOR.findIndex((element) => element == typeor.idTypeOR)       
      if (this.listeTypeOR[index].isPaste){
        if(indexPaste == -1){
          this.listOfSelectedTypeOR.push(this.listeTypeOR[index].idTypeOR)
        }
      } else {
        let index = this.listOfSelectedTypeOR.findIndex((element) => element === typeor.idTypeOR)
        this.listOfSelectedTypeOR.splice(index,1);
      }
    }    
  }

  /**
   * Vérifie si l'ensemble des types d'objet repère est sélectionné
   */
  verifyCheckAllTypeOr(){
    let allCheck = true;
    if (this.listeTypeOR.length != 0){
      for (const typeor of this.listeTypeOR) {
        if(typeor.isPaste === false) {
          allCheck = false;
        }
      }
      if (allCheck) {
        this.checkAllTypeOR = true;
      } else {
        this.checkAllTypeOR = false;
      }
    } else {
      this.checkAllTypeOR = false;
    }
  }


  /**
   * Création d'un rôle
   */
  createRole(){
    if (this.libelle != '' ) {
      let payload: any = {};
      payload.libelleRole = this.libelle;
      let atelier : any[] = [];
      let typeOR : any[] = [];

      for ( const a of this.listOfSelectedAtelier){
        atelier.push({"idAtelier" : a })
      }
      
      for ( const t of this.listOfSelectedTypeOR){
        typeOR.push({"idTypeOR" : t})
      }

      payload.atelier = atelier;
      payload.typeObjet = typeOR;

      this.fetchRoleService.createRole(payload).then((res: roleInfo) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de création", res , "red")
        } else {  
          this.refreshValidationForm();
          this.manageToast("Création", "Le rôle " + this.libelle+ " a été créé", "#006400");
          this.getAllRole()
        }
      }).catch((e) => {
      })
    } else {
      this.formValidate = true;
    }

  }

  /**
   * Modification d'un rôle
   */
  updateRole(){
    if (this.libelle != '' ) {
      let payload: any = {};
      payload.libelleRole = this.libelle;
      let atelier : any[] = [];
      let typeOR : any[] = [];

      for ( const a of this.listOfSelectedAtelier){
        atelier.push({"idAtelier" : a })
      }
      
      for ( const t of this.listOfSelectedTypeOR){
        typeOR.push({"idTypeOR" : t})
      }

      payload.atelier = atelier;
      payload.typeObjet = typeOR;

      this.fetchRoleService.updateRole(this.selectedRole,payload).then((res: roleInfo) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de Modification", res , "red")
        } else {  
          this.getAllRole()
          this.manageToast("Création", "Le rôle " + this.libelle+ " a été modifié", "#ff8c00");
          this.close();
        }
      }).catch((e) => {
      })
    } else {
      this.formValidate = true;
    }
  }

  /**
   * Suppression d'un rôle
   */
  deleteRole(){
    this.fetchRoleService.deleteRole(this.selectedRole).then((res: any) => {
      if(typeof res === 'string') {
        this.manageToast("Erreur de suppression", res , "red")
      } else {  
        this.manageToast("Suppression", "Le rôle a bien été supprimée", "#006400")    
        this.getAllRole();
        this.selectedRole = -1;
        this.close();
      }
    }).catch((e) => {
    })
  }


  /**
   * Remet à zero les valeur du formulaire à la fin d'une opération
   */
  refreshAfterOperation(){
    this.getAllRole();
    this.libelle = "";
    for ( const tor of this.listeTypeOR){
      tor.isPaste = false;
    }
    for ( const atelier of this.listeAtelier){
      atelier.isPaste = false;
    }
    this.listOfSelectedAtelier.splice(0),
    this.listOfSelectedTypeOR.splice(0);
  }  
}
