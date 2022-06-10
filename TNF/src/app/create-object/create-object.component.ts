import { Component, Input, OnInit } from '@angular/core';
import { AtelierInfo } from 'src/structureData/Atelier';
import { etat, ItemInfo, typeObjet } from 'src/structureData/Item';
import { NUetOR, ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { modificationTypeObject, TypeObjetInfo, TypeObjetRepereInfo, TypeObjetRepereTableau } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchCreateObjectService } from './service/fetch-create-object.service';
import { faXmark, faChevronRight, faMagicWandSparkles, faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { SousItemInfo } from 'src/structureData/SousItem';
import { FetchRecopieService } from '../recopie-object/service/fetch-recopie.service';


@Component({
  selector: 'app-create-object',
  templateUrl: './create-object.component.html',
  styleUrls: ['./create-object.component.css']
})
export class CreateObjectComponent implements OnInit {
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
          this.manageToast("Erreur de création", "Il n'y a pas la place nécessaire à la création" , "red")
        } else {  
          this.manageToast("Création", "La création est possible dans l'intervalle en surbrillance", "#006400")
          this.fetchCreateObjectService.getRangeToCreateOR(this.atelierSelect, +this.nuSelect.substring(1,4), +reserveNumber).then((res : any) => {
            this.rangeSurbrillance = res.range;
            this.scrollToRangeOR(this.nuSelect)
            this.nuSelectedRange = this.rangeSurbrillance[0];
            this.intervalValidate = true;
          })

          
        }
      }).catch((e) =>{
        
      })
    }
  }

  getRangeToCreateOR(reserveNumber : string, isForward : boolean){
    console.log(isForward);
    
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

  changeNU() {
    this.nuSelect = this.rangeSurbrillance[0];
    this.manageToast("Selection de création", "Le nouvel objet repère créé sera " + this.nuSelect + ". L(es) autre(s) objet(s) repère(s) seront reservés" , "#006400");
    this.intervalValidate = true;
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

  getListTypeItemsByOR(){
    this.fetchRecopieService.getTypeOfItemsOfOR(this.orSelect).then((list: modificationTypeObject[]) => {
      this.listeTypeItemOfOR.splice(0);
      list.forEach((e : modificationTypeObject) => {
        const libelle = this.listeTypeO.find(element => element.idType === e.idTypeObjet);
        if (libelle != undefined) {
          let item : modificationTypeObject = {
            idTypeObjet: e.idTypeObjet,
            libelleTypeObjet: libelle.libelleType,
            actif : e.actif
          };
          this.listeTypeItemOfOR.push(item)
        }
      })
    }).catch((e) => {
    })
  }


  getItemByObjetRepere(){
    if ( this.orSelect != ''){
      this.fetchVisuService.getItemByObjetRepere(this.orSelect).then((list: ItemInfo[]) => {
        console.log(list);
        
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
    if(!this.checkValide) {
      this.rangeSurbrillance = []
    }
    if(this.checkValide == true){
      this.intervalValidate = false;
    } else {
      this.intervalValidate = true;
    }
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
    this.rangeSurbrillance.splice(0); 
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

    if(this.objectNow === this.TypeObject.SI){
      this.getAllTypeAvailable();
    }
    
    
  }

  public selectSI(idSI : string) {
    this.siSelect = idSI;
  }

  public selectTypeObjet (TypeObjet : any) {
    try {
      this.typeOfItemOR = TypeObjet.target.value;
      console.log(this.typeOfItemOR)
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
    this.checkValide = false;
    this.rangeSurbrillance.splice(0);
    this.errorReservation = false;
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
        if ( this.checkValide === false ) {
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
          this.fetchCreateObjectService.createMultipleObject(libelle, this.typeNow, this.nuSelect, this.rangeSurbrillance, this.checkValide, tabDesc).then((res: any) => {
            if(typeof res === 'string') {
              this.manageToast("Erreur de création", res , "red")
            } else {  
              this.manageToast("Création", res.message, "#006400")
              this.afficherNUOR(this.atelierSelect);        
            }
          }).catch((e) => {
          })
        }
        
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
 

  scrollToRangeOR(nu : string){
    let scrollElement : string = nu;
    const element = document.getElementById(scrollElement);
    if (element != null){
      element.scrollIntoView({block: 'center'});
    }
  }

}


