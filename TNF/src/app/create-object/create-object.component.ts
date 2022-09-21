import { Component, Input, OnInit } from '@angular/core';
import { AtelierInfo } from 'src/structureData/Atelier';
import { etat, ItemInfo, typeObjet } from 'src/structureData/Item';
import { NUetOR, ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { modificationTypeObject, TypeObjet, TypeObjetInfo, TypeObjetRepereInfo, TypeObjetRepereTableau } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchCreateObjectService } from './service/fetch-create-object.service';
import { faXmark, faChevronRight, faMagicWandSparkles, faCheck, faChevronLeft, faInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import { SousItemInfo } from 'src/structureData/SousItem';
import { FetchRecopieService } from '../recopie-object/service/fetch-recopie.service';

@Component({
  selector: 'app-create-object',
  templateUrl: './create-object.component.html',
  styleUrls: ['./create-object.component.css']
})

/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class CreateObjectComponent implements OnInit {
  public faPlus = faPlus;
  public faInfo = faInfo;
  public faCheck = faCheck;
  public faMagicWandSparkles = faMagicWandSparkles;
  public faChevronRight = faChevronRight;
  public faChevronLeft = faChevronLeft;
  public faXmark = faXmark;
  @Input() public radio : typeObjet = typeObjet.Aucun;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public listeTypeOAvailableSI : TypeObjetInfo[] = [];
  public listeAtelier: AtelierInfo[] = [];
  public listeNUetOr : NUetOR[] = [];
  public listeOR : ObjetRepereInfo[] = [];
  public listeItem : ItemInfo[] = [];
  public listeSousItem : SousItemInfo[] = [];
  public listeTypeItemOfOR : modificationTypeObject[] = [];
  public rangeSurbrillance : string[] = [];
  public lastIndex = 0;
  public typeOfItemOR : string = "";
  public typeNow: string = "";
  public objectNow : typeObjet = typeObjet.OR;
  public TypeObject = typeObjet;
  public searchText : string = "";
  public etat : etat = etat.Aucun;
  public etatNow = etat;
  public etatError : boolean = false;
  public atelierSelect : string = "";
  public nuSelect : string = "";
  public itemSelect: string = "";
  public formValidate : boolean = false;
  public checkValide : boolean = false;
  public checkSecurite : boolean = false;
  public checkPrefixe : boolean = false;
  public selectNow : string = "";
  public siSelect : string = "";
  public orSelect : string ="";
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";
  public description : any = [];
  public errorLibelle : boolean = false;
  public LibelleItem : string = "";
  public LibelleSousItem : string = "";
  public orSelectedForItem : boolean = false;
  public errorReservation : boolean = false;
  public nuSelectedRange : string = "";
  public intervalValidate : boolean = true;
  public libelleObjetRepere : string = "";
  public secuOR : boolean = false;
  public secuItem : boolean = false;

  /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private fetchCreateTypeObject : FetchcreateTypeObjectService, private fetchVisuService : FetchVisuService, private fetchCreateObjectService: FetchCreateObjectService, private fetchRecopieService : FetchRecopieService) {
    this.getListType();
    this.getAteliers();
   }

  /**
   * Méthode appelée automatiquement à l'initialisation du composant
   */
  ngOnInit(): void {

  }

  /**
   * Recupère l'ensemble des ateliers 
   */
  getAteliers(){
    this.fetchVisuService.getAllAteliers().then((list: AtelierInfo[]) => {
      if (list != undefined) {
        this.listeAtelier = list
      } else {
        console.log("Atelier : Connexion impossible")
      }
    }).catch((e) => {
    })
  }

  /**
   * Recupère les types d'objet et types d'objet repère
   */
  getListType(){

    this.listeTypeOR.splice(0);
    this.fetchCreateTypeObject.getTypeObjetRepere().then((list: TypeObjetRepereInfo[]) => {
      list.forEach((e : TypeObjetRepereInfo) => {
        let typeOr : TypeObjetRepereTableau = {
          idType: e.idTypeOR ,
          libelleTypeOR: e.libelleTypeOR ,
          profilCreation: e.profilCreation ,
          posteCreation: e.posteCreation ,
          dateCreation: e.posteCreation ,
          profilModification: e.profilCreation ,
          posteModification: e.posteModification ,
          dateModification: e.dateModification,
          actif : e.actif,

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
   * Récupère la liste des type d'objet pour sous item
   */
  getAllTypeAvailable(){
    this.fetchCreateObjectService.getAllTypeAvailable(this.itemSelect).then((list : TypeObjetInfo[]) => {
      if( list != undefined){
        
        this.listeTypeOAvailableSI = list;
      } else {
        console.log("Problème pour récupérer les types d'objets pour les SI ");
        
      }
    }).catch((e) =>{
      
    })
  }


  /**
   * Vérifie la possibilité de réserver un intervalle lors de la création d'objet repère 
   * @param reserveNumber : Nombre d'objet a réserver
   */
  reservationIsPossible( reserveNumber : string){
    let number = Number(+reserveNumber);
    if(isNaN(number) || reserveNumber == ""){
      this.manageToast("Erreur de création", "Veuillez renseigner un nombre" , "red")
    } else {
      this.fetchCreateObjectService.reservationIsPossible(this.atelierSelect,this.nuSelect, +reserveNumber).then((res : any) => {
        if( res == undefined) {
          this.errorReservation = true;
          this.rangeSurbrillance.splice(0);
          this.nuSelectedRange = this.nuSelect;
          this.intervalValidate = false;
        } else {  
          this.manageToast("Création", "La création est possible dans l'intervalle en surbrillance", "#006400")
          this.fetchCreateObjectService.getRangeToCreateOR(this.atelierSelect, +this.nuSelect.substring(1,4), +reserveNumber).then((res : any) => {
            this.rangeSurbrillance = res.range;
            this.scrollToRangeOR(this.nuSelect)
            this.nuSelectedRange = this.rangeSurbrillance[0];
            this.intervalValidate = true;
            this.errorReservation = false;
          })

          
        }
      }).catch((e) =>{
        
      })
    }
  }

  /**
   * Permet de déplacer l'intervalle de sélection visuellement
   * @param reserveNumber : Nombre de place a reserver
   * @param isForward : Déplacement positif : True / Déplacement négatif : false
   */
  getRangeToCreateOR(reserveNumber : string, isForward : boolean){
    
    let number = Number(+reserveNumber);
      if(isNaN(number) || reserveNumber == ""){
        this.manageToast("Erreur de création", "Veuillez renseigner un nombre" , "red")
      } else {
      this.fetchCreateObjectService.getRangeToCreateOR(this.atelierSelect, +this.nuSelectedRange.substring(1,4), +reserveNumber, isForward).then((res : any) => {
        if (res == undefined){
          this.rangeSurbrillance.splice(0);
        } else if (typeof res === 'string') {
          if (isForward){
            this.manageToast("Erreur de création", "Il n'existe plus d'emplacements possible après " , "red")
          } else {
            this.manageToast("Erreur de création", "Il n'existe plus d'emplacements possible avant " , "red")
          }
        } else {
          this.rangeSurbrillance.splice(0);
          this.rangeSurbrillance = res.range;
          this.nuSelectedRange = this.rangeSurbrillance[0];
          this.scrollToRangeOR(this.rangeSurbrillance[0])
        }
      })
    }
  }

  /**
   * Validation de l'intervalle de réservation
   */
  changeNU() {
    this.nuSelect = this.rangeSurbrillance[0];
    // this.manageToast("Selection de création", "Le nouvel objet repère créé sera " + this.nuSelect + ". L(es) autre(s) objet(s) repère(s) seront reservés" , "#006400");
    this.intervalValidate = true;
  }



  /**
   * Recupère l'ensemble des objets repères lié à un atelier 
   */
  getObjetRepereByAteliers(){
    this.fetchCreateObjectService.getObjetRepereByAtelierForOneUser(this.atelierSelect).then((list: ObjetRepereInfo[]) => {
      if (list != undefined) {
        this.listeOR = list;
      } else {
        this.listeOR.splice(0);
        console.log("Liste Objet repère : Connexion impossible ou aucun OR")
      }
    }).catch((e) => {
    })
  }

  /**
   * Recupère les item d'un type et lié à un objet repère
   * La liste est complétée automatiquement pour éviter les trous d'identification
   */
  getItemFromOrAndDispo() {

    if (this.typeNow != '' && this.orSelect != ''){
      this.fetchCreateObjectService.getItemFromOrAndDispo(this.orSelect, this.typeNow).then((list: ItemInfo[]) => {  
        if (list != undefined) {
          this.listeItem = list;
          this.itemSelect="";
        } else {
          this.listeItem.splice(0);
          console.log("Liste Objet repère : Connexion impossible ou aucun OR")
        }
      }).catch((e) => {
      })
    } else {
      console.log("Type ou Objet repère non renseigné");
    }
  }

  /**
   * Recupère la liste des types d'objet pour un objet repère donné
   */
  getListTypeItemsByOR(){
    this.fetchRecopieService.getTypeOfItemsOfOR(this.orSelect).then((list: TypeObjet[]) => {
      this.listeTypeItemOfOR.splice(0);

      for (const type of list) {
              
        const libelle = this.listeTypeO.find((element) => element.idType == type.idtypeobjet);
        if (libelle != undefined) {
          let item : modificationTypeObject = {
            idTypeObjet: type.idtypeobjet,
            libelleTypeObjet: libelle.libelleType,
            actif : true
          };
          this.listeTypeItemOfOR.push(item)
        }
      }
      
    }).catch((e) => {
    })
  }


  /**
   * Recupère la liste des items liés à un objet repère
   */
  getItemByObjetRepere(){
    if ( this.orSelect != ''){
      this.fetchVisuService.getItemByObjetRepere(this.orSelect).then((list: ItemInfo[]) => {
        if(list == undefined) {
          this.listeItem = [];
        } else {
          this.listeItem = list;
          }
      }).catch((e) => {
      })
    }
  }

  /**
   * Recupère la liste des sous item liés à un item
   */
  getSousItemByItem(){
    this.fetchVisuService.getSousItemByItem(this.itemSelect).then((list: SousItemInfo[]) => {
      if(list == undefined) {
        this.listeSousItem = [];
      } else {
        this.listeSousItem = list;
      }
    }).catch((e) => {
    })
  }

  /**
   * Reservation d'un intervalle (bouton radio)
   */
  setcheckValide() {
    this.checkValide = !this.checkValide;
    if(!this.checkValide) {
      this.rangeSurbrillance = []
    }
    if(this.checkValide == true){
      this.intervalValidate = false;
    } else {
      this.intervalValidate = true;
    }
  }

  /**
   * Action d'associé un objet à une sécurité
   */
  setcheckSecurite(){
    this.checkSecurite =!this.checkSecurite;
  }

  /**
   * Action de fixer le type d'objet en préfixe ou suffixe du sous item
   */
  setPrefixe(){
    this.checkPrefixe =!this.checkPrefixe;
  }

  /**
   * Ferme le toast (bas droite)
   */
  closeToast(){
    this.ToastAffiche = false;
  }
      
  /**
   * Sélection du type d'objet
   * @param Type : Evenement du changement de valeur
   */
  public selectType(Type: any ) {
    this.typeNow = Type.target.value;   
    this.rangeSurbrillance.splice(0); 
    if (this.objectNow === this.TypeObject.Item) {
      this.getItemFromOrAndDispo();
    }
  }

  /**
   * Supprime les informations affichés au sein du formulaire de création
   */
  deleteDataForm() {
    this.nuSelect = ""
    this.checkValide = false;
    this.description.splice(0);
    this.etat = etat.Aucun;
    this.checkPrefixe = false;
  }

  /**
   * Sélection de l'atelier
   * @param Atelier : Evenement du changement de valeur
   */
  public selectAtelier (Atelier : any) {
    let atelier;
    try {
      atelier = Atelier.target.value;
    } catch  {
      atelier = Atelier;
    }
    this.selectNow = "";
    this.orSelect = "";
    this.itemSelect = "";
    this.siSelect = "";
    this.description.splice(0);
    this.listeItem.splice(0);
    this.errorLibelle = false;
    this.deleteDataForm();
    this.rangeSurbrillance.splice(0);
    this.errorReservation = false;
    if( atelier == '') {   
      this.listeNUetOr.splice(0);
      this.listeOR.splice(0);
      this.atelierSelect = '';
    } else {
      this.atelierSelect = atelier;
      if(this.objectNow === this.TypeObject.OR ) {
        this.afficherNUOR(atelier)
      } else {
        this.getObjetRepereByAteliers();
        
      }
    }
  }

  /**
   * Sélection de l'objet repère courant
   * @param idOR : Identifiant de l'objet repère
   */
  public selectOR(idOR : string) {
    this.orSelect = idOR;
    if (this.objectNow === this.TypeObject.Item) {
      let OR = this.listeOR.find((element) => element.idObjetRepere == idOR)
      if(OR != undefined){
        this.secuOR = OR.securite
        if (this.secuOR) {
          this.checkSecurite = true;
        } else {
          this.checkSecurite = false;
        }
      } else {
        this.secuOR = false;
      }
      this.getItemFromOrAndDispo();
      this.LibelleItem = ''
      this.errorLibelle = false;
      this.refreshValidationForm()
    }
    if(this.objectNow === this.TypeObject.SI){
      this.orSelectedForItem = true;
      this.getItemByObjetRepere();
      this.selectNow = idOR;
      this.getListTypeItemsByOR();
      this.LibelleSousItem = ''
      this.errorLibelle = false;
      this.refreshValidationForm()
      this.checkSecurite = false;
    }    
  }

  /**
   * Sélection de l'item courant
   * @param idItem : identifiant de l'item
   */
  public selectItem(idItem : string){
    this.itemSelect = idItem;
    this.selectNow = idItem;
    this.siSelect = "";
    this.getSousItemByItem();
      if (this.orSelectedForItem == false) {
        this.setOrSelectedForItem(true);
      }
    this.deleteDataForm();
    this.LibelleSousItem = "";

    if(this.objectNow === this.TypeObject.SI){
      this.getAllTypeAvailable();
      this.LibelleSousItem = ''
      this.errorLibelle = false;
      this.refreshValidationForm()
      let item = this.listeItem.find((element) => element.idItem == idItem)
      if(item != undefined){
        this.secuItem = item.securite
        if (this.secuItem) {
          this.checkSecurite = true;
        } else {
          this.checkSecurite = false;
        }
      } else {
        this.secuItem = false;
      }
    }
    
    
  }

  /**
   * Sélection du sous item courant
   * @param idSI : Identifiant du sous item
   */
  public selectSI(idSI : string) {
    this.siSelect = idSI;
  }

  /**
   * Sélection du type d'objet repère courant
   * @param TypeObjet : identifiant du type d'objet repère // Evenement du changement de valeur
   */
  public selectTypeObjet (TypeObjet : any) {
    try {
      this.typeOfItemOR = TypeObjet.target.value;
    } catch  {
      this.typeOfItemOR = TypeObjet;
    }
  }

  /**
   * Choix du type d'objet (Objet repere, Item, Sous item)
   * @param object : Valeur issue de l'énum this.TypeObject
   */
  public selectObject (object : typeObjet) {
    this.objectNow = object;
    this.typeNow = "";
    this.selectAtelier(this.atelierSelect)
    this.orSelect = "";
    this.orSelectedForItem = false;
    
  }

  /**
   * Sélection de l'état de l'objet lors de la création (En attente, actif ou hors service)
   * @param etat : Valeur issue de l'enum this.etatNow
   */
  selectEtat(etat : etat){
    this.etat = etat;
    this.etatError = false;
  }

  /**
   * Permet l'affiche des sous-items en réduisant la table des objet repères
   * @param value : True or false 
   */
  setOrSelectedForItem (value : boolean){
    this.orSelectedForItem = value;
    if(!value){
      if(this.selectNow == this.siSelect || this.selectNow == this.itemSelect){
        this.selectNow = this.orSelect;
      }
      this.siSelect = "";
      this.LibelleSousItem = ""
    }
  }

  /**
   * Selection d'un numéro unique (non reservé)
   * @param nu : Numéro unique
   */
  public selectNU (nu : string) {
    this.nuSelect = nu;
    this.description.splice(0);
    this.checkSecurite = false;
    this.checkValide = false;
    this.rangeSurbrillance.splice(0);
    this.errorReservation = false;
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
   * Recupère la liste des NU et OR 
   * @param atelier 
   */
  afficherNUOR(atelier : string ){
    this.fetchCreateObjectService.getAllNUandORByAtelier(atelier).then((list: NUetOR[]) => {
      if (list != undefined) {
        this.listeNUetOr = list
      } else {
        console.log("Atelier : Connexion impossible")
      }
    }).catch((e) => {
    })
  }

  /**
   * Valeur par défaut de la validation de formulaire (affichage des erreurs)
   */
  refreshValidationForm(){
    this.formValidate = false;
  }

  /**
   * Fonction de création des objet repères
   * @param libelle : Libelle de l'objet repère
   */
  createObjet(libelle : string) {
    if ( this.nuSelect != '' && this.typeNow != '' && libelle != '') {
        let tabDesc = [];
        for ( const d of this.description){
          if (d.value !== ""){
            tabDesc.push({"lien": d.value})
          }
        }
        this.refreshValidationForm();
        if ( this.checkValide === false ) {
          this.fetchCreateObjectService.createObject(libelle, this.typeNow, this.nuSelect,this.checkSecurite, tabDesc).then((res: any) => {
            if(typeof res === 'string') {
              this.manageToast("Erreur de création", res , "red")
            } else {  
              this.manageToast("Création", "L'objet repère " + this.typeNow + this.nuSelect + ((this.checkSecurite) ? 'Z' : '') +" a été crée", "#006400")
              this.afficherNUOR(this.atelierSelect);        
            }
          }).catch((e) => {
          })
        } else {
          this.fetchCreateObjectService.createMultipleObject(libelle, this.typeNow, this.nuSelect, this.rangeSurbrillance, this.checkSecurite,this.checkValide, tabDesc).then((res: any) => {
            if(typeof res === 'string') {
              this.manageToast("Erreur de création", res , "red")
            } else {  
              this.manageToast("Création", res.message, "#006400")
              this.afficherNUOR(this.atelierSelect);    
              this.setcheckValide();              
            }
          }).catch((e) => {
          })
        }
        
    } else {
      this.formValidate = true;
    }
  }


  /**
   * Création d'un item
   * @param digit : Digit lié à l'item 
   */
  createItem( digit : string){
    if (this.LibelleItem != '' && digit != '' && this.etat != this.etatNow.Aucun ) {
      
        let tabDesc = [];
          for ( const d of this.description){
            if (d.value !== ""){
              tabDesc.push({"lien": d.value})
            }
          }
        let digitNumber = parseInt(digit);
        this.refreshValidationForm();
        let libelle = this.orSelect +" : "+this.LibelleItem;
        this.fetchCreateObjectService.createItem( libelle, this.orSelect, this.typeNow, digitNumber, this.checkSecurite, this.orSelect.substring(2,6), this.etat, tabDesc).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de création", res , "red")
          } else {  
            this.manageToast("Création", "L'item " + this.typeNow + this.orSelect.substring(2,6)+ digitNumber+ ((this.checkSecurite)? 'Z' : '')+ " a été crée", "#006400")
            this.getItemFromOrAndDispo();   
            this.deleteDataForm(); 
          }
        }).catch((e) => {
        })
      
    } else {
      if(this.etat == this.etatNow.Aucun){
        this.etatError = true;
      }
      this.formValidate = true;
    }
  }

  /**
   * Création d'un sous item
   */
  createSI(){

    if (this.LibelleSousItem != '' && this.typeNow != '' && this.etat != this.etatNow.Aucun ) {
        let tabDesc = [];
          for ( const d of this.description){
            if (d.value !== ""){
              tabDesc.push({"lien": d.value})
            }
          }
       
        this.refreshValidationForm();
        let libelle = this.itemSelect +" : "+this.LibelleSousItem;
        this.fetchCreateObjectService.createSousItem(libelle, this.itemSelect, this.typeNow, this.checkPrefixe, this.checkSecurite, this.etat, tabDesc).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de création", res , "red")
          } else {  
            this.manageToast("Création", "L'item " + res.idSousItem + " a été crée", "#006400")
            this.getSousItemByItem();   
            this.typeNow = "";
            this.deleteDataForm(); 
            this.getAllTypeAvailable();
          }
        }).catch((e) => {
        })
    } else {
      if(this.etat == this.etatNow.Aucun){
        this.etatError = true;
      }
      this.formValidate = true;
    }
  }
  
  /**
   * Ajout d'une description 
   */
  public addDescription(){
    this.description.push({value : ""});
  }

  /**
   * Retire une description lié à un objet
   * @param indice : Numéro de la description dans la liste de description de l'objet courant
   */
  public removeDescription(indice : number){
    this.description.splice(indice,1)
  
  }

  /**
   * Non utilisée
   */
  focusOutLibelle(){
    if (this.objectNow === this.TypeObject.Item) {
      if(!this.LibelleItem.toUpperCase().includes(this.orSelect)){
        this.errorLibelle = true;
      } else {
        this.errorLibelle = false;
      }
    }
    if (this.objectNow === this.TypeObject.SI) {
      if(!this.LibelleSousItem.toUpperCase().includes(this.itemSelect)){
        this.errorLibelle = true;
      } else {
        this.errorLibelle = false;
      }
    }
  }


  /**
   * Non utilisée
   */
  addingParentIdToCurrentLibelle(){
    if (this.objectNow === this.TypeObject.Item) {
      if(!this.LibelleItem.toUpperCase().includes(this.orSelect)){
        this.LibelleItem += " "+ this.orSelect;
        this.focusOutLibelle();
      }
    } else if (this.objectNow === this.TypeObject.SI) {
      if(!this.LibelleSousItem.toUpperCase().includes(this.itemSelect)){
        this.LibelleSousItem += " "+ this.itemSelect;
        this.focusOutLibelle();
      }
    }

  }
 

  /**
   * Scroll dans la table jusqu'au numéro unique 
   * @param nu : Numéro unique
   */
  scrollToRangeOR(nu : string){
    let scrollElement : string = nu;
    const element = document.getElementById(scrollElement);
    if (element != null){
      element.scrollIntoView({block: 'center'});
    }
  }

}


