import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { faChevronRight, faMagicWandSparkles, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AtelierInfo } from 'src/structureData/Atelier';
import { Description } from 'src/structureData/Description';
import { typeObjet, ItemInfo, ItemModification, etat } from 'src/structureData/Item';
import { infoORBeingChanged, ObjetRepereInfo, ObjetRepereModification, valide } from 'src/structureData/ObjetRepere';
import { SousItemInfo, SousItemModification } from 'src/structureData/SousItem';
import { TypeObjetRepereTableau, TypeObjetInfo, TypeObjetRepereInfo, modificationTypeObject, TypeObjet, TypeObjetRepere } from 'src/structureData/TypeObject';
import { FetchCreateObjectService } from '../create-object/service/fetch-create-object.service';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { NavBarService } from '../navbar/service/nav-bar.service';
import { FetchRecopieService } from '../recopie-object/service/fetch-recopie.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchModifyObjectService } from './service/fetch-modify-object.service';

@Component({
  selector: 'app-modify-object',
  templateUrl: './modify-object.component.html',
  styleUrls: ['./modify-object.component.css']
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class ModifyObjectComponent implements OnInit, OnDestroy {

  public faPlus = faPlus;
  public faMagicWandSparkles = faMagicWandSparkles;
  public faChevronRight = faChevronRight;
  public faXmark = faXmark;
  @Input() public radio : typeObjet = typeObjet.Aucun;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
  public listeTypeItemOfOR : modificationTypeObject[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public listeAtelier: AtelierInfo[] = [];
  public listeOR : ObjetRepereInfo[] = [];
  public listeItem : ItemInfo[] = [];
  public listeSousItem : SousItemInfo[] = [];
  public typeNow: string = "";
  public objectNow : typeObjet = typeObjet.OR;
  public objectTypeNow: any;
  public TypeObject = typeObjet;
  public atelierSelect : string = "";
  public nuSelect : string = "";
  public idItemSelect: string = "";
  public itemSelect : ItemModification = {
    idItem: '',
    libelleItem: '',
    etat: '',
    description: []
  }
  public etat : etat = etat.Aucun;
  public etatNow =etat;
  public valide : valide = valide.Aucun;
  public valideNow =valide;
  public valideError : boolean = false;
  public etatError : boolean = false;
  public idSISelect : string = "";
  public siSelect : SousItemModification = {
    idSousItem: '',
    libelleSousItem: '',
    etat: '',
    description: []
  }
  public LibelleSousItem : string = "";
  public orSelectedForItem : boolean = false;

  public description : any = [];
  public formValidate : boolean = false;
  @Input() public checkValide : boolean = false;
  public idORSelect : string = "";
  public orSelect : ObjetRepereModification = {
    idObjetRepere: '',
    libelleObjetRepere: '',
    etat: '',
    description: []
  } ;

  public selectedNow : string = "";
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";
  public LibelleItem : string = "";
  public errorLibelle : boolean = false;
  public descriptionObjectSelect : Description[] = [];
  public searchText : string = "";
  public infoObjetBeingModified : infoORBeingChanged[] = []
  public ObjetBeingModified : string[] = []
  public hiddenSi : boolean = false;

  /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private fetchModifyTypeObject : FetchModifyObjectService, private fetchCreateTypeObject : FetchcreateTypeObjectService,private fetchVisuService : FetchVisuService, private fetchRecopieService : FetchRecopieService,
    private navbarService : NavBarService, private fetchCreateObjectService : FetchCreateObjectService) {

    this.getAteliers();
    this.getListType();
    this.fetchModifyTypeObject.connexionSocket().subscribe( (payload: any) => {
      const objects = payload as infoORBeingChanged[];
      
      for (const or of objects){
        this.ObjetBeingModified.push(or.id);
        this.infoObjetBeingModified.push({
          id : or.id,
          login  : or.login,
          profil : or.profil
        })
      }
      
    }); 
    
    this.fetchModifyTypeObject.receiveChange().subscribe( (payload: any) => {
      const objects = payload as infoORBeingChanged[];
      this.ObjetBeingModified.splice(0);
      this.infoObjetBeingModified.splice(0);
      for (const or of objects){
        
        this.ObjetBeingModified.push(or.id);
        this.infoObjetBeingModified.push({
          id : or.id,
          login  : or.login,
          profil : or.profil
        })        
      }      
    }); 

    this.fetchModifyTypeObject.receiveUpdate().subscribe( ( payload: any ) => {
      if (payload.hasOwnProperty('error')){
        console.log(payload.error);
        
      } else {
        let index;
        let indexOBM : number;
        let indexIOBM : number ;
        if (payload.type == 'OR'){
          index = this.listeOR.findIndex((element) => element.idObjetRepere === payload.returnObject.idObjetRepere);
          this.listeOR[index] = payload.returnObject;
          indexOBM = this.ObjetBeingModified.findIndex((element) => element == payload.returnObject.idObjetRepere);
          indexIOBM = this.infoObjetBeingModified.findIndex((element) => element.id == payload.returnObject.idObjetRepere);
        } else if (payload.type == 'Item'){
          index = this.listeItem.findIndex((element) => element.idItem === payload.returnObject.idItem);
          this.listeItem[index] = payload.returnObject;
          indexOBM = this.ObjetBeingModified.findIndex((element) => element == payload.returnObject.idItem);
          indexIOBM = this.infoObjetBeingModified.findIndex((element) => element.id == payload.returnObject.idItem);
        } else if (payload.type == 'SI') {
          index = this.listeSousItem.findIndex((element) => element.idSousItem === payload.returnObject.idSousItem);
          this.listeSousItem[index] = payload.returnObject;
          indexOBM = this.ObjetBeingModified.findIndex((element) => element == payload.returnObject.idSousItem);
          indexIOBM = this.infoObjetBeingModified.findIndex((element) => element.id == payload.returnObject.idSousItem);
        } else {
          indexOBM = -1
          indexIOBM = -1
        }
        if(indexIOBM != -1 && indexOBM != -1) {
          this.ObjetBeingModified.splice(indexOBM, 1)
          this.infoObjetBeingModified.splice(indexIOBM, 1);
        }
      }
    }); 

    
    
   }

  /**
  * Méthode appellée à la destruction du composant
  */
  ngOnDestroy(): void {
    this.fetchModifyTypeObject.leaveWS();
  }

  /**
  * Méthode appellée à l'initialisation du composant
  */
  ngOnInit(): void {
    
  }


  /**
   * Recupère la liste des types d'objet
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
   * Recupère les types d'objet d'item lié à un objet repère
   */
  getListTypeItemsByOR(){
    this.fetchRecopieService.getTypeOfItemsOfOR(this.idORSelect).then((list: TypeObjet[]) => {
      this.listeTypeItemOfOR.splice(0);
      list.forEach((e : TypeObjet) => {
        const libelle = this.listeTypeO.find(element => element.idType === e.idtypeobjet);
        if (libelle != undefined) {
          let item : modificationTypeObject = {
            idTypeObjet: e.idtypeobjet,
            libelleTypeObjet: libelle.libelleType,
            actif : true
          };
          this.listeTypeItemOfOR.push(item)
        }
      })
    }).catch((e) => {
    })
  }


  /**
   * Recupère les types d'objet pour un atelier
   */
  getListTypeItemsForOR(){
    this.fetchModifyTypeObject.getTypeOfItemsOfOR(this.atelierSelect).then((list: TypeObjetRepere[]) => {
      
      this.listeTypeItemOfOR.splice(0);
      list.forEach((e : TypeObjetRepere) => {
        const libelle = this.listeTypeOR.find(element => element.idType === e.idtypeobjet);
        if (libelle != undefined) {
          let item : modificationTypeObject = {
            idTypeObjet: e.idtypeobjet,
            libelleTypeObjet: libelle.libelleTypeOR,
            actif : true
          };
          this.listeTypeItemOfOR.push(item)
        }
      })
    }).catch((e) => {
    })
    
    
  }

  /**
   * Recupère les ateliers
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
   * Recupère les objets repère d'un ateleier
   */
  getObjetRepereByAtelier(){
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
   * Recupère les item lié à un objet repère
   */
  getItemFromOR() {
      this.fetchVisuService.getItemByObjetRepere(this.idORSelect).then((list: ItemInfo[]) => {
        if (list != undefined) {
          this.listeItem = list;        
        } else {
          this.listeItem.splice(0);
          console.log("Liste Objet repère : Connexion impossible ou aucun Item")
        }
      }).catch((e) => {
      })
  }

  /**
   * Recumère les sous items liés à un item
   */
  getSousItemByItem(){
    this.fetchVisuService.getSousItemByItem(this.idItemSelect).then((list: SousItemInfo[]) => {
      if(list == undefined) {
        this.listeSousItem = [];
      } else {
        this.listeSousItem = list;
      }
    }).catch((e) => {
    })
  }

  /**
   * NON UTILISEE
   */
  setcheckValide() {
    this.checkValide = !this.checkValide;
  }

  /**
   * Selection d'item ou OR dans le cas de l'affichage d'un sous item
   * Supprime les données lié au sous item si item ou or supprimé
   * @param value 
   */
  setOrSelectedForItem (value : boolean){
    this.orSelectedForItem = value;
    if(!value){
      if(this.selectedNow == this.idSISelect || this.selectedNow == this.idItemSelect){
        this.selectedNow = this.idORSelect;
      }
      this.idSISelect = "";
      this.siSelect = {
        idSousItem: '',
        libelleSousItem: '',
        etat: '',
        description: []
      }
    }
  }

  /**
   * Fermer le toast
   */
  closeToast(){
    this.ToastAffiche = false;
  }
      
  /**
   * Selection de l'atelier courant
   * @param Atelier: Evenement récupérant le changement d'atelier 
   */
  public selectAtelier (Atelier : any) {
    let atelier;
    
    try {
      atelier = Atelier.target.value;
    } catch  {
      atelier = Atelier;
    }
    this.idORSelect = "";
    this.idItemSelect = "";
    this.idSISelect = "";
    this.selectedNow = "";
    this.listeItem.splice(0);
    this.listeSousItem.splice(0);
    this.setOrSelectedForItem(false);
    this.errorLibelle = false;
    this.orSelect = {
      idObjetRepere : '',
      libelleObjetRepere : '',
      etat : '',
      description : []
    }
    this.itemSelect = {
      idItem: '',
      libelleItem: '',
      etat: '',
      description: []
    }
    this.siSelect = {
      idSousItem: '',
      libelleSousItem: '',
      etat: '',
      description: []
    }
    if( atelier == '') {
      this.listeOR.splice(0);
      this.atelierSelect = '';

    } else {
      this.atelierSelect = atelier;
      this.getObjetRepereByAtelier();
    }

    if (this.objectNow == this.TypeObject.OR){
      this.getListTypeItemsForOR();
    } else {
      this.getListTypeItemsByOR();
    }

  }

  /**
   * Sélection du type d'objet
   * @param TypeObjet : Type d'objet 
   */
  public selectTypeObjet (TypeObjet : any) {
    try {
      this.typeNow = TypeObjet.target.value;
    } catch  {
      this.typeNow = TypeObjet;
    }
  }
  

  /**
   * Sélection d'un objet repère
   * @param idOR : Identifiant de l'objet repère
   */
  public selectOR(idOR : string) {
    this.idORSelect = idOR;
    this.selectedNow = idOR;
    if (this.objectNow === this.TypeObject.OR ) {
      this.fetchModifyTypeObject.sendChange(idOR);
      let orInfo = this.listeOR.find((element) => element.idObjetRepere === idOR);
      if (orInfo != undefined) {
        this.orSelect.idObjetRepere = orInfo.idObjetRepere ;
        this.orSelect.libelleObjetRepere = orInfo.libelleObjetRepere;
        this.orSelect.etat = orInfo.etat;
        this.orSelect.description = orInfo.description;
        this.valide = orInfo.etat == 'A' ? valide.A : valide.R;
        this.descriptionObjectSelect.splice(0);
        for (const d of this.orSelect.description){
          this.descriptionObjectSelect.push(d)
        }
      }
      this.siSelect = {
        idSousItem: '',
        libelleSousItem: '',
        etat: '',
        description: []
      }
    } else if (this.objectNow === this.TypeObject.Item) {
       
        this.getItemFromOR();
        this.getListTypeItemsByOR();
        this.itemSelect = {
          idItem: '',
          libelleItem: '',
          etat: '',
          description: []
        }
        this.idItemSelect ="";
        this.descriptionObjectSelect.splice(0);
        this.etat = etat.Aucun
        
    } else if (this.objectNow === this.TypeObject.SI){
      this.hiddenSi = false;
        this.orSelectedForItem = true;
        this.getItemFromOR();
        this.selectedNow = idOR;
        this.getListTypeItemsByOR();
        this.siSelect = {
          idSousItem: '',
          libelleSousItem: '',
          etat: '',
          description: []
        }
        this.idItemSelect = "";
        this.idSISelect = "";
        this.listeSousItem.splice(0);
        this.descriptionObjectSelect.splice(0);
    }


  }

  /**
   * Selection d'un item
   * @param idItem : Identifiant de l'item
   */
  public selectItem(idItem : string){
    this.idItemSelect = idItem;
    this.selectedNow = idItem
    if (this.objectNow === this.TypeObject.Item ) {
      this.fetchModifyTypeObject.sendChange(idItem);
      let itemInfo = this.listeItem.find((element) => element.idItem === idItem)
      if (itemInfo != undefined) {
        this.itemSelect.idItem = itemInfo.idItem;
        let orExistInLibelle = itemInfo.libelleItem.toUpperCase().includes(itemInfo.idOR)
        if (orExistInLibelle ) {
          let [libelle, ...restOflibelle]= itemInfo.libelleItem.split(':')
          restOflibelle.join(':')
          if (libelle != undefined){
            libelle = libelle.trim();
            this.LibelleItem = restOflibelle.toString().trim();
            
          } else {
            let orExistInLibelle = itemInfo.libelleItem.toUpperCase().includes(itemInfo.idOR)
            if (orExistInLibelle){
              let newLibelle = itemInfo.libelleItem.replace(itemInfo.idOR, '')
              this.LibelleItem =  newLibelle.trim();
            } else {
              this.LibelleItem =  itemInfo.libelleItem.trim();
            }
          }
        } else {
          this.LibelleItem =  itemInfo.libelleItem.trim();
        }
        this.itemSelect.etat = itemInfo.etat;
        this.itemSelect.description = itemInfo.description;
        this.etat = itemInfo.etat == 'A' ? etat.A : itemInfo.etat == 'EA' ? etat.EA : itemInfo.etat == 'HS' ? etat.HS : etat.Aucun; 
        this.descriptionObjectSelect.splice(0);
        for (const d of this.itemSelect.description){
          this.descriptionObjectSelect.push(d)
        }
         
      }    
    } else if (this.objectNow === this.TypeObject.SI) {
      this.idSISelect = "";
      this.getSousItemByItem();
      this.siSelect = {
        idSousItem: '',
        libelleSousItem: '',
        etat: '',
        description: []
      }
      this.etat = etat.Aucun
      if (this.orSelectedForItem == false) {
        this.setOrSelectedForItem(true);
      }
      this.descriptionObjectSelect.splice(0);
    }
  }

  /**
   * Selection du sous item
   * @param idSousItem : identifiant sous item
   */
  selectSI(idSousItem : string){
    this.idSISelect = idSousItem;
    this.selectedNow = idSousItem;
    this.fetchModifyTypeObject.sendChange(idSousItem);
    let siInfo = this.listeSousItem.find((element) => element.idSousItem === idSousItem);
    if (siInfo != undefined) {
      this.siSelect.idSousItem = siInfo.idSousItem;
      
      let siExistInLibelle = siInfo.libelleSousItem.toUpperCase().includes(siInfo.idItem)
      if (siExistInLibelle ) {
        let [libelle, ...restOflibelle]= siInfo.libelleSousItem.split(':')
        if (libelle != undefined){

          this.LibelleSousItem = restOflibelle.join(':').toString().trim();
          
        } else {
          let orExistInLibelle = siInfo.libelleSousItem.toUpperCase().includes(siInfo.idItem)
          if (orExistInLibelle){
            let newLibelle = siInfo.libelleSousItem.replace(siInfo.idItem, '')
            this.LibelleSousItem =  newLibelle.trim();
          } else {
            this.LibelleSousItem =  siInfo.libelleSousItem.trim();
          }
        }
      } else {
        this.LibelleSousItem =  siInfo.libelleSousItem.trim();
      }


      this.siSelect.description = siInfo.description;
      this.siSelect.etat = siInfo.etat;
      this.descriptionObjectSelect.splice(0);
      this.etat= siInfo.etat == 'A' ? etat.A : siInfo.etat == 'EA' ? etat.EA : siInfo.etat == 'HS' ? etat.HS : etat.Aucun;
        for (const d of this.siSelect.description){
          this.descriptionObjectSelect.push(d)
        }
    }
  }

  /**
   * Selection du type d'objet (Objet repère, item ou sous item)
   * @param object : Valeur issue de l'enum TypeObject
   */
  public selectObject (object : typeObjet) {
    if( this.objectNow != object) {
      if (object == this.TypeObject.SI){
        this.hiddenSi = true;
      }
      this.objectNow = object;
      this.descriptionObjectSelect.splice(0);
      this.selectAtelier(this.atelierSelect);
      this.typeNow = "";
      this.listeTypeItemOfOR.splice(0)
      
    }
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
  refreshValidationForm(){
    this.formValidate = false;
  }


  /**
   * Modification d'un objet repère
   * @param libelle : Libelle de l'objet repère
   */
  modifyObjet(libelle : string) {
   
    if (libelle != '') {
        this.fetchModifyTypeObject.modifyObject(this.orSelect.idObjetRepere, libelle, this.valide, this.descriptionObjectSelect).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de modification", res , "red")
          } else {  
            this.fetchModifyTypeObject.freeObject('OR');
            this.manageToast("Modification", "L'objet repère " + this.orSelect.idObjetRepere+ " a été modifié", "#ff8c00");
            this.refreshValidationForm();
            this.getObjetRepereByAtelier();
            this.idORSelect = "";
          }
        }).catch((e) => {
        })
    } else {
      this.formValidate = true;
    }
  }

  /**
   * Modification d'un item
   */
  modifyItem(){
    if (this.LibelleItem != '' ) {
        let libelle = this.idORSelect + ' : '+ this.LibelleItem.trim();
        this.fetchModifyTypeObject.modifyitem(this.itemSelect.idItem, libelle, this.etat, this.descriptionObjectSelect).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de modification", res , "red")
          } else {  
            this.fetchModifyTypeObject.freeObject('Item');
            this.refreshValidationForm();
            this.manageToast("Modification", "L'item " + this.itemSelect.idItem+ " a été modifié", "#ff8c00");
            this.getItemFromOR();
            this.idItemSelect= "";
          }
        }).catch((e) => {
        })
    } else {
      this.formValidate = true;
    }
  }

  /**
   * Modification d'un sous item
   */
  modifySI(){
     
    if (this.LibelleSousItem != '' ) {
      let libelle = this.idItemSelect + ' : '+ this.LibelleSousItem.trim(); 
      this.fetchModifyTypeObject.modifySI(this.siSelect.idSousItem, libelle, this.etat, this.descriptionObjectSelect).then((res: any) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de modification", res , "red")
        } else {  
          this.fetchModifyTypeObject.freeObject('SI');
          this.refreshValidationForm();
          this.manageToast("Modification", "Le sous-item " + this.itemSelect.idItem+ " a été modifié", "#ff8c00");
          this.getSousItemByItem();
          this.idSISelect = "";
        }
      }).catch((e) => {
      })
    } else {
      this.formValidate = true;
    }

  }

  /**
   * Ajout d'une description
   */
  public addDescription(){
    this.descriptionObjectSelect.push({lien : ""});
  }

  /**
   * Suppression d'une description sur l'objet modifié
   * @param indice : Indice de la description 
   */
  public removeDescription(indice : number){
    this.descriptionObjectSelect.splice(indice,1);
  }

  /**
   * NON UTILISEE
   */
  focusOutLibelle(){
    if (this.objectNow === this.TypeObject.Item && this.idItemSelect != '') {
      if(!this.LibelleItem.toUpperCase().includes(this.idORSelect)){
        this.errorLibelle = true;
      } else {
        this.errorLibelle = false;
      }
    } else if (this.objectNow === this.TypeObject.SI && this.idSISelect != ''){
      if(!this.LibelleSousItem.toUpperCase().includes(this.idItemSelect)){
        this.errorLibelle = true;
      } else {
        this.errorLibelle = false;
      }
    }
  }

  /**
   * NON UTILISEE
   */
  addingParentIdToCurrentLibelle(){
    if (this.objectNow === this.TypeObject.Item) {
      if(!this.LibelleItem.toUpperCase().includes(this.idORSelect)){
        this.LibelleItem += " "+ this.idORSelect;
        this.focusOutLibelle();
      }
    } else if (this.objectNow === this.TypeObject.SI) {
      if(!this.LibelleSousItem.toUpperCase().includes(this.idItemSelect)){
        this.LibelleSousItem += " "+ this.idItemSelect;
        this.focusOutLibelle();
      }
    }
  }  

  /**
   * Selection de l'etat (Actif, en attente ou hors service) => Item et sous item
   * @param etat : Valeur issue de l'enum etatNow
   */
  selectEtat(etat : etat){
    this.etat = etat;
    this.etatError = false;
  }

  /**
   * Selection de l'état (Actif ou reservé) => Objet repère
   * @param valide : Valeur issue de l'enum valideNow
   */
  selectValide(valide : valide){
    this.valide = valide;
    this.valideError = false;
  }


  /**
   * Verifie si l'objet est sélectionné par l'utilisateur à l'origine de la requete
   * @param id : Identifiant de l'objet
   * @returns True or false
   */
  objetSelectByYou(id : string) {
    let login = this.navbarService.getLogin()
    let objetSelect = this.infoObjetBeingModified.find((element) => element.id == id);
    
    if (objetSelect != undefined) {
      if (objetSelect.login == login){
        return 1;
      } else {
        return 0;
      }
    } 
    return -1
  }

  /**
   * Recupère le profil de l'utilisateur modifiant un objet (hors utilisateur à l'origine de la requête)
   * @param id : Identifiant de l'objet
   * @returns True or false
   */
  objetSelectByWho(id : string) {
    let objetSelect = this.infoObjetBeingModified.find((element) => element.id == id);
    if (objetSelect != undefined) {
     return objetSelect.profil
    } 
    return "erreur" 
  }
}
