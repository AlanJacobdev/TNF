import { Component, Input, OnInit } from '@angular/core';
import {  createTypeObject, modificationTypeObject, TypeObjetInfo, TypeObjetRepereInfo, TypeObjetRepereTableau } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from './service/fetchcreate-type-object.service';
import { faXmark, faCalendar, faUser, faClock, faInfo, faPen, faTrashCan, faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-type-object',
  templateUrl: './create-type-object.component.html',
  styleUrls: ['./create-type-object.component.css']
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class CreateTypeObjectComponent implements OnInit {
  @Input() public searchText: string = "";
  public faXmark = faXmark;
  public faClock = faClock;
  public faCalendar = faCalendar;
  public faUser = faUser;
  public faInfo = faInfo;
  public faPen = faPen;
  public faTrashCan = faTrashCan;
  public faPlus = faPlus;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public selectedType : createTypeObject = createTypeObject.OR;
  public TypeObject = createTypeObject;
  public changesNow : boolean = false;
  public suppresion : boolean = false;
  public information : boolean = false;
  public idSelected : string = "";
  @Input() public radio : string = "";
  public objectSelect : modificationTypeObject = {
    idTypeObjet: '',
    libelleTypeObjet: '',
    actif : false
  };

  public infoTORSelect : TypeObjetRepereTableau = {
    idType: '',
    libelleTypeOR: '',
    profilCreation: '',
    posteCreation: '',
    dateCreation: '',
    profilModification: '',
    posteModification: '',
    dateModification: '',
    actif: false
  }

  public infoTOSelect : TypeObjetInfo = {
    idType: '',
    libelleType: '',
    profilCreation: '',
    posteCreation: '',
    dateCreation: '',
    profilModification: '',
    posteModification: '',
    dateModification: '',
    actif : false
  }

  @Input() public checkValide : boolean = false;
  public type : createTypeObject = createTypeObject.Aucun;
  public typeNow = createTypeObject;
  public typeError : boolean = false;

  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";
  public formValidate : boolean = false;

  /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private fetchCreateTypeObject : FetchcreateTypeObjectService) { 
    this.refreshListes();
  }

  /**
   * Méthode appelée à l'initialisation du composant
   */
  ngOnInit(): void {
  }


  /**
   * Le type d'objet est actif/inactif (création)
   */
  setcheckValide() {
    this.checkValide = !this.checkValide;
  }

  /**
   * Le type d'objet est actif/inactif (modification)
   */
  putCheckActif(){
    this.objectSelect.actif = !this.objectSelect.actif;
    
  }

  /**
   * Sélectionne du type d'objet (formulaire de création) 
   * @param type : Identifiant du type d'objet 
   */
  selectTypeObject(type : createTypeObject){
    this.type = type;
    this.typeError = false;
  }

  /**
   * Modifie le statut actif d'un type d'objet via la liste
   * @param idType : Identifiant du type d'objet
   */
  selectCheckType(idType : string){
    const targetO = this.listeTypeO.find((element) => element.idType === idType)

    if ( targetO != undefined) {  
      this.fetchCreateTypeObject.updateActifTypeO(idType, !targetO.actif).then((res : TypeObjetInfo) =>{
        if (res != undefined) {
          const targetO = this.listeTypeO.findIndex((element) => element.idType === idType);
          this.listeTypeO[targetO].actif = !this.listeTypeO[targetO].actif;
          this.manageToast("Changement d'état", res.actif ? "Le type d'objet " + idType + " est actif" : "Le type d'objet " + idType  + " est inactif", "#006400" );
        } else {
          this.manageToast("Changement d'état", "Problème dû au changement d'état", "red" );
        }
      }).catch((e : any)=>{

      })
    }
  }

  /**
   * Modifie le statut actif d'un type d'objet repère via la liste
   * @param idTypeOR : Identifiant du type d'objet repère
   */
  selectCheckTypeOR(idTypeOR : string){
    const targetOr = this.listeTypeOR.find((element) => element.idType === idTypeOR)

    if ( targetOr != undefined) {  
      this.fetchCreateTypeObject.updateActifTypeOr(idTypeOR, !targetOr.actif).then((res : TypeObjetRepereInfo) =>{
        if (res != undefined) {
          const targetOrIndex = this.listeTypeOR.findIndex((element) => element.idType === idTypeOR);
          this.listeTypeOR[targetOrIndex].actif = !this.listeTypeOR[targetOrIndex].actif;
          this.manageToast("Changement d'état", res.actif ? "Le type d'objet repère" + idTypeOR + " est actif" : "Le type d'objet repère " + idTypeOR  + " est inactif", "#006400" );
        } else {
          this.manageToast("Changement d'état", "Problème dû au changement d'état", "red" );
        }
      }).catch((e : any)=>{

      })
    }
  }

  /**
   * Rafraîchit les listes de type d'objet
   */
  refreshListes(){

    this.listeTypeOR.splice(0);
    this.fetchCreateTypeObject.getTypeObjetRepere().then((list: TypeObjetRepereInfo[]) => {
      list.forEach((e : TypeObjetRepereInfo) => {
        let typeOr : TypeObjetRepereTableau = {
          idType: e.idTypeOR ,
          libelleTypeOR: e.libelleTypeOR ,
          profilCreation: e.profilCreation ,
          posteCreation: e.posteCreation ,
          dateCreation: e.dateCreation ,
          profilModification: e.profilModification ,
          posteModification: e.posteModification ,
          dateModification: e.dateModification,
          actif : e.actif
        };
        this.listeTypeOR.push(typeOr)
      })
    }).catch((e) => {
    })

    this.fetchCreateTypeObject.getTypeObjet().then((list: TypeObjetInfo[]) => {
      this.listeTypeO = list
    }).catch((e) => {
    })

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
   * Sélectionne le type d'objet (objet ou objet repère)
   * @param type : Valeur issue de TypeObject
   */
  selectType (type: createTypeObject) {
    this.selectedType = type;
    this.idSelected = "";
    this.changesNow = false;
  }

  /**
   * Sélection d'un type d'objet 
   * @param id : Identifiant du type d'objet 
   */
  selectObject (id : string) {
    this.idSelected = id;
    this.changesNow = false;
  }

  /**
   * Fermeture du formulaire
   */
  close(){
    this.changesNow = false;
    this.suppresion = false;
    this.information = false;
    this.refreshValidationForm();
    this.type = this.typeNow.Aucun;
  }

  /**
   * Fermeture du toast
   */
  closeToast(){
    this.ToastAffiche = false;
  }

  /**
   * Valeur par défaut de la validation de formulaire (affichage des erreurs)
   */
  refreshValidationForm(){
    this.formValidate = false;
  }

  /**
   * Selection du bouton pour créer un nouveau type
   */
  selectCreateType(){
    this.changesNow = true;
    this.idSelected = "";
  }

    /**
   * Selection du bouton pour modifier un nouveau type
   */
  selectModifyType(){
    this.changesNow = true;
    let res;
    if(this.selectedType === this.TypeObject.OR) {
      res = this.listeTypeOR.find(element => element.idType === this.idSelected);  
      if (res != undefined){
        this.objectSelect.idTypeObjet = res.idType;
        this.objectSelect.libelleTypeObjet = res.libelleTypeOR;
        this.objectSelect.actif = res.actif;
      }
    } else {
      res = this.listeTypeO.find(element => element.idType === this.idSelected);  
      if (res != undefined){
        this.objectSelect.idTypeObjet = res.idType;
        this.objectSelect.libelleTypeObjet = res.libelleType;
        this.objectSelect.actif = res.actif
      }
    }
  }

    /**
   * Selection du bouton pour supprimer un nouveau type
   */
  selectDeleteType(){
    this.suppresion = true;
    this.changesNow = true;
    
  }

  /**
   * Selection du bouton pour avoir des informations complémentaires sur le type d'objet sélectionné
   */
  selectInformation(){
    this.information = true;
    this.changesNow = true;
    let res;
    if(this.selectedType === this.TypeObject.OR) {
      res = this.listeTypeOR.find(element => element.idType === this.idSelected);  
      if (res != undefined){
        this.infoTORSelect= res;
      }
    } else {
      res = this.listeTypeO.find(element => element.idType === this.idSelected);  
      if (res != undefined){
        this.infoTOSelect = res;
      }
    }    
  }

  /**
   * Création d'un type d'objet
   * @param identifiant : Identifiant du type d'objet
   * @param libelle : Libelle du type d'objet
   */
  createTypeObjet(identifiant : string, libelle : string) {

    
    if ( identifiant != '' && libelle != '' && this.type != this.typeNow.Aucun) {
      if(this.type == this.typeNow.OR) {      
        this.fetchCreateTypeObject.createTypeOR(identifiant,libelle, this.checkValide).then((res: TypeObjetRepereInfo) => {
          if(res === undefined) {
            this.manageToast("Erreur de création", "Le type d'objet repère existe déjà", "red")
          } else {  
            this.manageToast("Création", "L'objet repère " + identifiant.toUpperCase() + " a été crée", "#006400")
            this.refreshListes();
            this.checkValide = false;
            this.close();  
            this.type = this.typeNow.Aucun;       
          }
        }).catch((e) => {
        })
      } else if ( this.type == this.typeNow.O){
        this.fetchCreateTypeObject.createTypeO(identifiant,libelle, this.checkValide).then((res: TypeObjetRepereInfo) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de création", res, "red")
          } else {
            this.manageToast("Création", "L'objet " + identifiant.toUpperCase() + " a été crée", "#006400")
            this.refreshListes();
            this.checkValide = false;
            this.close();
            this.type = this.typeNow.Aucun;       
          }
        }).catch((e) => {
        })
      }
    } else {
      this.formValidate = true;
    }
    
    
  }

  /**
   * Modification du type d'objet
   * @param identifiant : Identifiant du type d'objet
   * @param libelle : libelle du type d'objet
   */
  updateTypeObjet(identifiant : string, libelle : string) {
    
    if ( identifiant != '' && libelle != '') {
      if ( this.selectedType == this.TypeObject.OR){
        this.fetchCreateTypeObject.updateTypeOR(identifiant,libelle, this.objectSelect.actif).then((res: TypeObjetRepereInfo) => {
          if (res === undefined) {
            this.manageToast("Erreur de modification", "Identificateur inconnu", "red")
          } else {
            this.manageToast("Modification", "L'objet repère " + identifiant.toUpperCase() + " a été modifié", "#ff8c00")
            this.refreshListes();
            this.close();
          }
        }).catch((e) => {
        })
      } else if ( this.selectedType === this.TypeObject.O ){
        this.fetchCreateTypeObject.updateTypeO(identifiant,libelle, this.objectSelect.actif).then((res: TypeObjetRepereInfo) => {
          if (typeof res === 'string') {
            this.manageToast("Erreur de modification", res, "red")
          } else {
            this.manageToast("Modification", "L'objet " + identifiant.toUpperCase() + " a été modifié", "#ff8c00")
            this.refreshListes();
            this.close();
          }
        }).catch((e) => {
        })
      }
    } else {
      this.formValidate = true;
    }
  }

  /**
   * Suppression du type d'objet selectionné
   */
  deleteTypeObjet() {
    if ( this.selectedType == this.TypeObject.OR){
      this.fetchCreateTypeObject.deleteTypeOR(this.idSelected).then((res: any) => {
        if (res === undefined) {
          this.manageToast("Erreur de suppression", "Identificateur inconnu ou objets liés", "red")
        } else {
          this.manageToast("Supprimer", "L'objet repère " + this.idSelected + " a été supprimé", "#cd5c5c")
          this.idSelected = "";
          this.refreshListes();
          this.close();
        }
      }).catch((e) => {
      })
    } else if ( this.selectedType === this.TypeObject.O ){
      this.fetchCreateTypeObject.deleteTypeO(this.idSelected).then((res: any) => {
        if (res === undefined) {
          this.manageToast("Erreur de suppression", "Identificateur inconnu ou objets liés", "red")
        } else {
          this.manageToast("Supprimer", "L'objet " + this.idSelected + " a été supprimé", "#cd5c5c")
          this.idSelected = "";
          this.refreshListes();
          this.close();
        }
      }).catch((e) => {
      })
    }
  }


  

}
