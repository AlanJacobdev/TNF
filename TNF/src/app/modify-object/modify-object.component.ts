import { Component, Input, OnInit } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { AtelierInfo } from 'src/structureData/Atelier';
import { Description } from 'src/structureData/Description';
import { typeObjet, ItemInfo, ItemModification, etat } from 'src/structureData/Item';
import { ObjetRepereInfo, ObjetRepereModification } from 'src/structureData/ObjetRepere';
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

  public faXmark = faXmark;
  @Input() public radio : typeObjet = typeObjet.Aucun;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
  public listeTypeItemOfOR : modificationTypeObject[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public listeAtelier: AtelierInfo[] = [];
  public listeOR : ObjetRepereInfo[] = [];
  public listeItem : ItemInfo[] = [];
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
          this.listeItem = list;        
        } else {
          this.listeItem.splice(0);
          console.log("Liste Objet repère : Connexion impossible ou aucun Item")
        }
      }).catch((e) => {
      })
  }

  setcheckValide() {
    this.checkValide = !this.checkValide;
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
    this.listeItem.splice(0);
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
    if( atelier == '') {
      this.listeOR.splice(0);
      this.atelierSelect = '';

    } else {
      this.atelierSelect = atelier;
      if(this.objectNow === this.TypeObject.OR ) {
        this.getObjetRepereByAtelier();
      } else if (this.objectNow === this.TypeObject.Item){
        this.getObjetRepereByAtelier();
      }
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
      this.idORSelect = idOR;
      this.selectedNow = idOR
      
    } else if (this.objectNow === this.TypeObject.Item) {
        this.idORSelect = idOR;
        this.selectedNow = idOR;
        this.getItemFromOR();
        this.getListTypeItemsByOR();
        this.itemSelect = {
          idItem: '',
          libelleItem: '',
          etat: '',
          description: []
        }
        this.idItemSelect ="";
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
        this.fetchModifyTypeObject.modifyitem(this.itemSelect.idItem, this.LibelleItem.toUpperCase(), this.etat, this.descriptionObjectSelect).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de modification", res , "red")
          } else {  
            this.refreshValidationForm();
            let selectedOR = this.idORSelect;
            this.manageToast("Création", "L'item " + this.itemSelect.idItem+ " a été modifié", "#006400");
            this.idORSelect = selectedOR;
            this.getItemFromOR();
            console.log(selectedOR + " " + this.idORSelect + " " + this.itemSelect )
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
    
    if (this.objectNow === this.TypeObject.Item) {
      if(!this.LibelleItem.toUpperCase().includes(this.idORSelect)){
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
