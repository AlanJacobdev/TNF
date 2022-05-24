import { Component, Input, OnInit } from '@angular/core';
import { AtelierInfo } from 'src/structureData/Atelier';
import { etat, ItemEtDispo, ItemInfo, typeObjet } from 'src/structureData/Item';
import { NUetOR, ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { modificationTypeObject, TypeObjetInfo, TypeObjetRepereInfo, TypeObjetRepereTableau } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchCreateObjectService } from './service/fetch-create-object.service';
import { faXmark, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { SousItemInfo } from 'src/structureData/SousItem';
import { FetchRecopieService } from '../recopie-object/service/fetch-recopie.service';


@Component({
  selector: 'app-create-object',
  templateUrl: './create-object.component.html',
  styleUrls: ['./create-object.component.css']
})
export class CreateObjectComponent implements OnInit {

  public faChevronRight = faChevronRight;
  public faXmark = faXmark;
  @Input() public radio : typeObjet = typeObjet.Aucun;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public listeAtelier: AtelierInfo[] = [];
  public listeNUetOr : NUetOR[] = [];
  public listeOR : ObjetRepereInfo[] = [];
  public listeItem : ItemEtDispo[] = [];
  public listeSousItem : SousItemInfo[] = [];
  public listeTypeItemOfOR : modificationTypeObject[] = [];

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

  constructor(private fetchCreateTypeObject : FetchcreateTypeObjectService, private fetchVisuService : FetchVisuService, private fetchCreateObjectService: FetchCreateObjectService, private fetchRecopieService : FetchRecopieService) {
    this.getListType();
    this.getAteliers();
   }
  ngOnInit(): void {
   
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

  getObjetRepereByAteliers(){
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

  getItemFromOrAndDispo() {

    if (this.typeNow != '' && this.orSelect != ''){
      this.fetchCreateObjectService.getItemFromOrAndDispo(this.orSelect, this.typeNow).then((list: ItemEtDispo[]) => {  
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

  getListTypeItemsByOR(){
    this.fetchRecopieService.getTypeOfItemsOfOR(this.orSelect).then((list: modificationTypeObject[]) => {
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


  getItemByObjetRepere(){
    if ( this.orSelect != ''){
      this.fetchVisuService.getItemByObjetRepere(this.orSelect).then((list: ItemEtDispo[]) => {
        if(list == undefined) {
          this.listeItem = [];
        } else {
          this.listeItem = list;
        }
      }).catch((e) => {
      })
    }
  }

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

  setcheckValide() {
    this.checkValide = !this.checkValide;
  }

  setcheckSecurite(){
    this.checkSecurite =!this.checkSecurite;
  }
  setPrefixe(){
    this.checkPrefixe =!this.checkPrefixe;
  }

  closeToast(){
    this.ToastAffiche = false;
  }
      
  public selectType(Type: any ) {
    this.typeNow = Type.target.value;    
    if (this.objectNow === this.TypeObject.Item) {
      this.getItemFromOrAndDispo();
    }
  }

  deleteDataForm() {
    this.nuSelect = ""
    this.checkSecurite = false;
    this.checkValide = false;
    this.description.splice(0);
    this.etat = etat.Aucun;
    this.checkPrefixe = false;
  }

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

  public selectOR(idOR : string) {
    this.orSelect = idOR;
    if (this.objectNow === this.TypeObject.Item) {
      this.getItemFromOrAndDispo();
      if(this.LibelleItem != ''){
        this.focusOutLibelle();
      }
    }
    if(this.objectNow === this.TypeObject.SI){
      this.orSelectedForItem = true;
      this.getItemByObjetRepere();
      this.selectNow = idOR;
      this.getListTypeItemsByOR();
    }
    console.log(this.listeItem);
    
  }

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
    
    
  }

  public selectSI(idSI : string) {
    this.siSelect = idSI;
    this.selectNow = idSI;
  }

  public selectTypeObjet (TypeObjet : any) {
    try {
      this.typeOfItemOR = TypeObjet.target.value;
    } catch  {
      this.typeOfItemOR = TypeObjet;
    }
  }

  public selectObject (object : typeObjet) {
    this.objectNow = object;
    this.typeNow = "";
    this.selectAtelier(this.atelierSelect)
    this.orSelect = "";
    this.orSelectedForItem = false;
    
  }

  selectEtat(etat : etat){
    this.etat = etat;
    this.etatError = false;
  }

 
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

  public selectNU (nu : string) {
    this.nuSelect = nu;
    this.description.splice(0);
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

  refreshValidationForm(){
    this.formValidate = false;
  }

  createObjet(libelle : string) {
    if ( this.nuSelect != '' && this.typeNow != '' && libelle != '') {
        let tabDesc = [];
        for ( const d of this.description){
          if (d.value !== ""){
            tabDesc.push({"lien": d.value})
          }
        }
        this.refreshValidationForm();
        this.fetchCreateObjectService.createObject(libelle, this.typeNow, this.nuSelect, this.checkValide, tabDesc).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de création", res , "red")
          } else {  
            this.manageToast("Création", "L'objet repère " + this.typeNow + this.nuSelect + " a été crée", "#006400")
            this.afficherNUOR(this.atelierSelect);        
          }
        }).catch((e) => {
        })
    } else {
      this.formValidate = true;
    }
  }

  createItem( digit : string){
    if (this.LibelleItem != '' && digit != '' && this.etat != this.etatNow.Aucun ) {
      if(!this.LibelleItem.toUpperCase().includes(this.orSelect)){
        this.manageToast("Erreur de création", "Le libellé ne contient pas l'identifiant de l'objet repère " , "red")
      } else {
        let tabDesc = [];
          for ( const d of this.description){
            if (d.value !== ""){
              tabDesc.push({"lien": d.value})
            }
          }
        let digitNumber = parseInt(digit);
        this.refreshValidationForm();
        
        this.fetchCreateObjectService.createItem(this.LibelleItem.replace(this.orSelect.toLowerCase(), this.orSelect.toUpperCase()), this.orSelect, this.typeNow, digitNumber, this.checkSecurite, this.orSelect.substring(2,6), this.etat, tabDesc).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de création", res , "red")
          } else {  
            this.manageToast("Création", "L'item " + this.typeNow + this.orSelect.substring(2,6)+ digitNumber+ ((this.checkSecurite)? 'Z' : '')+ " a été crée", "#006400")
            this.getItemFromOrAndDispo();   
            this.deleteDataForm(); 
          }
        }).catch((e) => {
        })
      }
    } else {
      if(this.etat == this.etatNow.Aucun){
        this.etatError = true;
      }
      this.formValidate = true;
    }
  }

  createSI(){

    if (this.LibelleSousItem != '' && this.typeNow != '' && this.etat != this.etatNow.Aucun ) {
      if(!this.LibelleSousItem.toUpperCase().includes(this.itemSelect)){
        this.manageToast("Erreur de création", "Le libellé ne contient pas l'identifiant de l'item dont il dépend " , "red")
      } else {
        let tabDesc = [];
          for ( const d of this.description){
            if (d.value !== ""){
              tabDesc.push({"lien": d.value})
            }
          }
       
        this.refreshValidationForm();
        this.fetchCreateObjectService.createSousItem(this.LibelleSousItem.replace(this.itemSelect.toLowerCase(), this.itemSelect.toUpperCase()), this.itemSelect, this.typeNow, this.checkPrefixe, this.checkSecurite, this.etat, tabDesc).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de création", res , "red")
          } else {  
            this.manageToast("Création", "L'item " + res.idSousItem + " a été crée", "#006400")
            this.getSousItemByItem();   
            this.deleteDataForm(); 
          }
        }).catch((e) => {
        })
      }
    } else {
      if(this.etat == this.etatNow.Aucun){
        this.etatError = true;
      }
      this.formValidate = true;
    }
  }
  

  public addDescription(){
    this.description.push({value : ""});
  }

  public removeDescription(indice : number){
    this.description.splice(indice,1)
  
  }

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

 




}


