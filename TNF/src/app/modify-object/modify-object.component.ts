import { Component, Input, OnInit } from '@angular/core';
import { faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AtelierInfo } from 'src/structureData/Atelier';
import { Description } from 'src/structureData/Description';
import { typeObjet, ItemInfo, ItemModification, etat } from 'src/structureData/Item';
import { ObjetRepereInfo, ObjetRepereModification } from 'src/structureData/ObjetRepere';
import { SousItemInfo, SousItemModification } from 'src/structureData/SousItem';
import { TypeObjetRepereTableau, TypeObjetInfo, TypeObjetRepereInfo, modificationTypeObject } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchRecopieService } from '../recopie-object/service/fetch-recopie.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchModifyObjectService } from './service/fetch-modify-object.service';

@Component({
  selector: 'app-modify-object',
  templateUrl: './modify-object.component.html',
  styleUrls: ['./modify-object.component.css']
})
export class ModifyObjectComponent implements OnInit {

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
    valide: false,
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


  constructor(private fetchModifyTypeObject : FetchModifyObjectService, private fetchCreateTypeObject : FetchcreateTypeObjectService,private fetchVisuService : FetchVisuService, private fetchRecopieService : FetchRecopieService) {

    this.getAteliers();
    this.getListType();
   }
  ngOnInit(): void {
  
  }

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
          dateModification: e.dateModification 
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

  getListTypeItemsByOR(){
    this.fetchRecopieService.getTypeOfItemsOfOR(this.idORSelect).then((list: modificationTypeObject[]) => {
      this.listeTypeItemOfOR.splice(0);
      list.forEach((e : modificationTypeObject) => {
        const libelle = this.listeTypeO.find(element => element.idType === e.idTypeObjet);
        if (libelle != undefined) {
          let item : modificationTypeObject = {
            idTypeObjet: e.idTypeObjet,
            libelleTypeObjet: libelle.libelleType
          };
          this.listeTypeItemOfOR.push(item)
        }
      })
    }).catch((e) => {
    })
  }



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


  getObjetRepereByAtelier(){
    this.fetchVisuService.getObjetRepereByAteliers(this.atelierSelect).then((list: ObjetRepereInfo[]) => {
      if (list != undefined) {
        this.listeOR = list;
      } else {
        this.listeOR.splice(0);
        console.log("Liste Objet repère : Connexion impossible ou aucun OR")
      }
    }).catch((e) => {
    })
  }

  getItemFromOR() {
      this.fetchVisuService.getItemByObjetRepere(this.idORSelect).then((list: ItemInfo[]) => {
        if (list != undefined) {
          console.log(list);
          
          this.listeItem = list;        
        } else {
          this.listeItem.splice(0);
          console.log("Liste Objet repère : Connexion impossible ou aucun Item")
        }
      }).catch((e) => {
      })
  }

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

  setcheckValide() {
    this.checkValide = !this.checkValide;
  }

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


  closeToast(){
    this.ToastAffiche = false;
  }
      
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
      valide : false,
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
  }
  public selectTypeObjet (TypeObjet : any) {
    try {
      this.typeNow = TypeObjet.target.value;
    } catch  {
      this.typeNow = TypeObjet;
    }
  }
  

  public selectOR(idOR : string) {
    let lastID = this.idORSelect
    this.idORSelect = idOR;
    this.selectedNow = idOR;
    
    if (this.objectNow === this.TypeObject.OR ) {
      let orInfo = this.listeOR.find((element) => element.idObjetRepere === idOR);
      if (orInfo != undefined) {
        this.orSelect.idObjetRepere = orInfo.idObjetRepere ;
        this.orSelect.libelleObjetRepere = orInfo.libelleObjetRepere;
        this.orSelect.valide = orInfo.valide;
        this.orSelect.description = orInfo.description;
        this.checkValide = orInfo.valide;
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


  public selectItem(idItem : string){
    this.idItemSelect = idItem;
    this.selectedNow = idItem
    if (this.objectNow === this.TypeObject.Item ) {
      let itemInfo = this.listeItem.find((element) => element.idItem === idItem)
      if (itemInfo != undefined) {
        this.itemSelect.idItem = itemInfo.idItem;
        this.itemSelect.libelleItem = itemInfo.libelleItem;
        this.LibelleItem = itemInfo.libelleItem;
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

  selectSI(idSousItem : string){
    this.idSISelect = idSousItem;
    this.selectedNow = idSousItem;
    let siInfo = this.listeSousItem.find((element) => element.idSousItem === idSousItem);
    if (siInfo != undefined) {
      this.siSelect.idSousItem = siInfo.idSousItem;
      this.siSelect.libelleSousItem = siInfo.libelleSousItem;
      this.siSelect.description = siInfo.description;
      this.siSelect.etat = siInfo.etat;
      this.descriptionObjectSelect.splice(0);
      this.etat= siInfo.etat == 'A' ? etat.A : siInfo.etat == 'EA' ? etat.EA : siInfo.etat == 'HS' ? etat.HS : etat.Aucun;
        for (const d of this.siSelect.description){
          this.descriptionObjectSelect.push(d)
        }
    }
    
  }

  public selectObject (object : typeObjet) {
    this.objectNow = object;
    this.descriptionObjectSelect.splice(0);
    this.selectAtelier(this.atelierSelect);
    this.typeNow = "";
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



  refreshValidationForm(){
    this.formValidate = false;
  }


  modifyObjet(libelle : string) {
   
    if (libelle != '') {
        this.fetchModifyTypeObject.modifyObject(this.orSelect.idObjetRepere, libelle, this.checkValide, this.descriptionObjectSelect).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de modification", res , "red")
          } else {  
            let selectedOR = this.orSelect;
            this.manageToast("Modification", "L'objet repère " + this.orSelect.idObjetRepere+ " a été modifié", "#006400");
            this.refreshValidationForm();
            this.getObjetRepereByAtelier();
            this.orSelect = selectedOR;
            this.idORSelect = selectedOR.idObjetRepere;
          }
        }).catch((e) => {
        })
    } else {
      this.formValidate = true;
    }
  }

  modifyItem(){
    if (this.LibelleItem != '' ) {
      if(!this.LibelleItem.toUpperCase().includes(this.idORSelect)){
        this.manageToast("Erreur de modification", "Le libellé ne contient pas l'identifiant de l'objet repère " , "red")
      } else {
        let idORUpf = this.LibelleItem.toUpperCase().indexOf(this.idORSelect)
        let idORGetUpper = this.LibelleItem.substring(idORUpf,this.idORSelect.length).toUpperCase();
        let idORGet = this.LibelleItem.substring(idORUpf,this.idORSelect.length);
        this.fetchModifyTypeObject.modifyitem(this.itemSelect.idItem, this.LibelleItem.replace(idORGet, idORGetUpper), this.etat, this.descriptionObjectSelect).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de modification", res , "red")
          } else {  
            this.refreshValidationForm();
            this.manageToast("Création", "L'item " + this.itemSelect.idItem+ " a été modifié", "#006400");
            this.getItemFromOR();
          }
        }).catch((e) => {
        })
      }
    } else {
      this.formValidate = true;
    }
  }

  modifySI(){
    
    if (this.LibelleSousItem != '' ) {
      if(!this.LibelleSousItem.toUpperCase().includes(this.idItemSelect)){
        this.manageToast("Erreur de modification", "Le libellé ne contient pas l'identifiant de l'item dont il dépend" , "red")
      } else {
        let idItemUpf = this.LibelleItem.toUpperCase().indexOf(this.idORSelect)
        let idItemGetUpper = this.LibelleItem.substring(idItemUpf,this.idORSelect.length).toUpperCase();
        let idItemGet = this.LibelleItem.substring(idItemUpf,this.idORSelect.length);
        this.fetchModifyTypeObject.modifySI(this.siSelect.idSousItem,  this.LibelleSousItem.replace(idItemGet, idItemGetUpper), this.etat, this.descriptionObjectSelect).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de modification", res , "red")
          } else {  
            this.refreshValidationForm();
            this.manageToast("Création", "Le sous-item " + this.itemSelect.idItem+ " a été modifié", "#006400");
            this.getSousItemByItem();
          }
        }).catch((e) => {
        })
      }
    } else {
      this.formValidate = true;
    }

  }

  public addDescription(){
    this.descriptionObjectSelect.push({lien : ""});
  }

  public removeDescription(indice : number){
    this.descriptionObjectSelect.splice(indice,1);
  }

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

  

  selectEtat(etat : etat){
    this.etat = etat;
    this.etatError = false;
  }

}
