import { Component, Input, OnInit } from '@angular/core';
import { faXmark, faCircleCheck, faCircleXmark, faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { AtelierInfo } from 'src/structureData/Atelier';
import { typeObjet, ItemInfo, ItemSuppresion, etat } from 'src/structureData/Item';
import { ObjetRepereInfo, ObjetRepereSuppression, valide } from 'src/structureData/ObjetRepere';
import { SousItemInfo, SousItemSuppression } from 'src/structureData/SousItem';
import { deleteObject, demandeAdmin, returnDeleteObject } from 'src/structureData/Suppression';
import { TypeObjetRepereTableau, TypeObjetInfo, TypeObjetRepereInfo, modificationTypeObject } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchRecopieService } from '../recopie-object/service/fetch-recopie.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchDeleteObjectService } from './service/fetch-delete-object.service';

@Component({
  selector: 'app-delete-object',
  templateUrl: './delete-object.component.html',
  styleUrls: ['./delete-object.component.css']
})
export class DeleteObjectComponent implements OnInit {

  public faXmark = faXmark;
  public faCircleCheck = faCircleCheck;
  public faCircleXmark = faCircleXmark;
  public faCircleInfo = faCircleInfo;
  @Input() public radio : typeObjet = typeObjet.Aucun;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public listeAtelier: AtelierInfo[] = [];
  public listeOR : ObjetRepereSuppression[] = [];
  public listeItem : ItemSuppresion[] = [];
  public listeSousItem : SousItemSuppression[] = [];
  public typeNow: string = "";
  public objectNow : typeObjet = typeObjet.OR;
  public objectTypeNow: any;
  public TypeObject = typeObjet;
  public atelierSelect : string = "";
  public nuSelect : string = "";
  public idORSelect : string = "";
  public idItemSelect: string = "";
  public idSousItemSelect: string = "";
  public Ornow : ObjetRepereSuppression = {
    idObjetRepere: '',
    libelleObjetRepere: '',
    codeType: '',
    valide: '',
    isPaste: false
  };

  public ItemNow : ItemSuppresion = {
    idItem: '',
    libelleItem: '',
    idOR: '',
    codeObjet: '',
    etat: '',
    isPaste: false
  }
  
  public SousItemNow : SousItemSuppression = {
    idSousItem: '',
    libelleSousItem: '',
    idItem: '',
    codeSousItem: '',
    etat: '',
    isPaste: false
  }
  public isPasteSaveItem : ItemSuppresion[] = [];
  public isPasteSaveSI  : SousItemSuppression[] = [];
  public listeTypeItemOfOR : modificationTypeObject[] = [];
  public checkAllItem : boolean = false;
  public checkAllSi : boolean = false;
  public ORDeleted : string[]= [];
  public ItemDeleted : string[] = [];
  public SiDeleted : string[] = [];
  public returnOfDeleted : returnDeleteObject = {
    listeOR: [],
    listeItem: [],
    listeSI: []
  };
  public suppressionEnCours : boolean = false;
  public suppExecEnd : boolean = false;
  public suppWithDmdAdmin : boolean = false;
  public demandeAdmin : boolean = false;
  public motifDemande : string = ""; 
  public etatItem : etat = etat.Aucun;
  public etatSI : etat = etat.Aucun;
  public valideOR : valide = valide.Aucun;
  public valideNow =valide;
  public etatNow =etat;
  
  
  public selectedNow : string = "";
  public formValidate : boolean = false;
  @Input() public checkValide : boolean = false;
  
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

  public searchText : string = "";
  public isValide : boolean = false;
  public selectMultiple : boolean = false;
  constructor( private fetchVisuService : FetchVisuService, private fetchDeleteObjectService :FetchDeleteObjectService, private fetchCreateTypeObject: FetchcreateTypeObjectService, private fetchRecopieService : FetchRecopieService,private cookieService : CookieService) {
    this.getListType();
    this.getAteliers();
   }
     

  ngOnInit(): void {
    var exampleModal = document.getElementById('Suppression')
    if(exampleModal != null){
      exampleModal.addEventListener('keydown', (evt) => {
      if(evt.key ==="Escape" && this.suppExecEnd){
        this.endOfDelete();
      }
      })
      exampleModal.addEventListener('click', (evt) => {
        const target = evt.target as HTMLTextAreaElement;
        if(target.classList.contains('show') && this.suppExecEnd){
          this.endOfDelete();
        }
      }
    )
  }  
  
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


  getObjetRepereByAtelier(){
    this.fetchVisuService.getObjetRepereByAteliers(this.atelierSelect).then((list: ObjetRepereInfo[]) => {
      if (list != undefined) {
        this.listeOR.splice(0);
        list.forEach((e : ObjetRepereSuppression) => {
          let OR : ObjetRepereSuppression = {
            idObjetRepere : e.idObjetRepere,
            libelleObjetRepere : e.libelleObjetRepere,
            valide : e.valide,
            codeType : e.codeType,
            isPaste: false
          };
          this.listeOR.push(OR)
        })   
      } else {
        this.listeOR.splice(0);
        console.log("Liste Objet repère : Connexion impossible ou aucun OR")
      }
    }).catch((e) => {
    })
  }

  async getItemFromOR() {
      this.fetchVisuService.getItemByObjetRepere(this.idORSelect).then((list: ItemInfo[]) => {
        if (list != undefined) {
          this.listeItem.splice(0);
          list.forEach((e : ItemSuppresion) => {
            let item : ItemSuppresion = {
              idItem : e.idItem,
              libelleItem : e.libelleItem,
              codeObjet : e.codeObjet,
              etat : e.etat,
              idOR : e.idOR,
              isPaste: false
            };
            let index = this.isPasteSaveItem.findIndex((element) => element.idItem === e.idItem)
            if (index != -1){
              item.isPaste = true;
            }
            this.listeItem.push(item);
          })
          this.verifyCheckAllItem();
        } else {
          this.listeItem.splice(0);
          console.log("Liste Objet repère : Connexion impossible ou aucun Item")
        }

        if(this.Ornow.isPaste){
            for ( const item of this.listeItem) {
              if(item.idOR == this.idORSelect) {
                this.selectCheckItem(item.idItem,true);
              }
            }
        }
        
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
            libelleTypeObjet: libelle.libelleType,
            actif : e.actif
          };
          this.listeTypeItemOfOR.push(item)
        }
      })
    }).catch((e) => {
    })
  }


  getSIfromItem(){
    this.fetchVisuService.getSousItemByItem(this.idItemSelect).then((list: SousItemInfo[]) => {
      if(list == undefined) {
        this.listeSousItem.splice(0);
      } else {
        this.listeSousItem.splice(0);
        list.forEach((e : SousItemSuppression) => {
          let Si : SousItemSuppression = {
            idSousItem : e.idSousItem,
            libelleSousItem : e.libelleSousItem,
            codeSousItem : e.codeSousItem,        
            etat : e.etat,
            idItem : e.idItem,
            isPaste: false
          };
          let index = this.isPasteSaveSI.findIndex((element) => element.idSousItem === e.idSousItem)
          if (index != -1){
            Si.isPaste = true;
          }
          this.listeSousItem.push(Si);
      })
      this.verifyCheckAllSI();
      if(this.ItemNow.isPaste){
        for ( const si of this.listeSousItem) {
          if(si.idItem == this.ItemNow.idItem) {
            this.selectCheckSi(si.idSousItem,true);
          }
        }
      }
      } 
    }).catch((e) => {
    })
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
    this.selectedNow =""
    this.listeSousItem.splice(0);
    this.listeItem.splice(0);
    if( atelier == '') {
      this.listeOR.splice(0);
      this.atelierSelect = '';
      
    } else {
      this.atelierSelect = atelier;
      this.getObjetRepereByAtelier();
    }
  }

  public async selectOR(idOR : string) {
    if (idOR != this.idORSelect){
      this.idORSelect = idOR;
      let res = this.listeOR.find(element => element.idObjetRepere === idOR);
      if (res != undefined){
        this.Ornow = res;
      }
      this.getListTypeItemsByOR();
      await this.getItemFromOR();
    }
    this.listeSousItem = [];
    this.idItemSelect = "";
    this.idSousItemSelect = "";
    this.selectedNow = idOR;
  }


  public selectItem(idItem : string){
    if (idItem != this.idItemSelect){
      this.idItemSelect = idItem;   
      let res = this.listeItem.find(element => element.idItem === idItem);
      if (res != undefined){
        this.ItemNow = res;
      }
      this.getSIfromItem();
    }
    this.idSousItemSelect ="";
    this.selectedNow = idItem;
  }

  selectEtatItem(etat : etat){
    this.etatItem = etat;
  }

  selectEtatSI(etat : etat){
    this.etatSI = etat;
  }

  selectValideOR(valide : valide){
    this.valideOR = valide
  }

  
  public selectSO(idSousItem : string) {
    this.idSousItemSelect = idSousItem;
    this.selectedNow = idSousItem;
  }

  public selectObject (object : typeObjet) {
    this.objectNow = object;
    this.selectAtelier(this.atelierSelect)
  }

  public selectTypeObjet (TypeObjet : any) {
    try {
      this.typeNow = TypeObjet.target.value;
    } catch  {
      this.typeNow = TypeObjet;
    }
  }
  
  public CheckIfORSelectedValide(){
    if(this.isValide = true) {
      if(!this.Ornow.valide) {
        this.idORSelect = "";
        this.selectedNow = "";
        this.listeItem.splice(0);
        this.listeSousItem.splice(0);
      }

    }
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


  deleteObject(){
    if (this.objectNow === this.TypeObject.OR) {
      this.fetchDeleteObjectService.supprimerObject(this.idORSelect).then((res: any) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de suppression", res , "red")
        } else {  
          this.manageToast("Suppression", res.message, "#006400");
          this.selectAtelier(this.atelierSelect);
        }
      }).catch((e) => {
      })
    } else if (this.objectNow === this.TypeObject.Item) {
      this.fetchDeleteObjectService.supprimerItem(this.idItemSelect).then((res: any) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de suppresion", res , "red")
        } else {  
          this.manageToast("Suppresion", res.message, "#006400");
          this.getItemFromOR();
        }
      }).catch((e) => {
      })
    } else {

        ////            ////
       // TODO SOUS ITEM //
      ////            ////

    }
  }

  public async selectCheckOr( id : string){
      let index = this.listeOR.findIndex((element) => element.idObjetRepere === id)
      this.listeOR[index].isPaste = !this.listeOR[index].isPaste;
      
      for ( const item of this.listeItem) {
        if(item.idOR == id) {
          await this.selectCheckItem(item.idItem, this.listeOR[index].isPaste)
        }
      }       
  }

  public async selectCheckItem(id : string, value?:boolean){
    let index = this.listeItem.findIndex((element) => element.idItem === id)
    if (value != undefined){
      this.listeItem[index].isPaste = value;
    } else {
       
      this.listeItem[index].isPaste = !this.listeItem[index].isPaste;
      if (this.listeItem[index].isPaste){
        this.isPasteSaveItem.push(this.listeItem[index])
      } else {
        let index = this.isPasteSaveItem.findIndex((element) => element.idItem === id)
        this.isPasteSaveItem.splice(index,1);
      }
    }
  
    this.verifyCheckAllItem();
    
    for ( const si of this.listeSousItem) {
      if(si.idItem == id) {
        await this.selectCheckSi(si.idSousItem, this.listeItem[index].isPaste)
      }
    }
    
  }

  public async selectCheckSi(id : string, value?:boolean){
    let index = this.listeSousItem.findIndex((element) => element.idSousItem === id)
    if(value != undefined) {
      this.listeSousItem[index].isPaste = value;
    } else {
      this.listeSousItem[index].isPaste = !this.listeSousItem[index].isPaste;
      if (this.listeSousItem[index].isPaste){
        this.isPasteSaveSI.push(this.listeSousItem[index]);
      } else {
        let index = this.isPasteSaveSI.findIndex((element) => element.idSousItem === id)
        this.isPasteSaveSI.splice(index,1);
      }

    }
    this.verifyCheckAllSI();
  
  }

  public allSelectItem() {
    this.checkAllItem = !this.checkAllItem;
    for (const item of this.listeItem) {
      if (item.codeObjet === this.typeNow || this.typeNow === "") {
        item.isPaste = this.checkAllItem;
        
        let index = this.listeItem.findIndex((element) => element.idItem === item.idItem)
        if (this.listeItem[index].isPaste){
          this.isPasteSaveItem.push(this.listeItem[index])
        } else {
          let index = this.isPasteSaveItem.findIndex((element) => element.idItem === item.idItem)
          this.isPasteSaveItem.splice(index,1);
        }

      } 
    }
  }

  verifyCheckAllItem(){
    let allCheckByType = true;
    if (this.listeItem.length != 0){
      for (const item of this.listeItem) {
        if (item.codeObjet === this.typeNow || this.typeNow === "") {
          if(item.isPaste === false) {
            allCheckByType = false;
          }
        } 
      }
      if (allCheckByType) {
        this.checkAllItem = true;
      } else {
        this.checkAllItem = false;
      }
    } else {
      this.checkAllItem = false;
    }
  }

  public allSelectSI() {
    this.checkAllSi = !this.checkAllSi;
    for (const si of this.listeSousItem) {
      if (si.codeSousItem === this.typeNow || this.typeNow === "") {
        si.isPaste = this.checkAllSi;
        let index = this.listeSousItem.findIndex((element) => element.idSousItem === si.idSousItem)
        
        if (this.listeSousItem[index].isPaste){
          this.isPasteSaveSI.push(this.listeSousItem[index]);
        } else {
          let index = this.isPasteSaveSI.findIndex((element) => element.idSousItem === si.idSousItem)
          this.isPasteSaveSI.splice(index,1);
        }

      } 
    }
  }

  verifyCheckAllSI(){
    let allCheckByType = true;
    if (this.listeItem.length != 0){
      for (const si of this.listeSousItem) {
        if (si.codeSousItem === this.typeNow || this.typeNow === "") {
          if(si.isPaste === false) {
            allCheckByType = false;
          }
        } 
      }
      if (allCheckByType) {
        this.checkAllSi = true;
      } else {
        this.checkAllSi = false;
      }
    } else {
      this.checkAllSi = false;
    }
  }

  delete(){
    this.suppExecEnd = false;
    this.resetDeleted();
    for(const or of this.listeOR){
      if (or.isPaste){
        this.ORDeleted.push(or.idObjetRepere);
      }
    }

    for(const item of this.isPasteSaveItem){
      if (item.isPaste){
        let index = this.ORDeleted.findIndex((element) => element === item.idOR)
        if (index == -1) {
          this.ItemDeleted.push(item.idItem);
        }
      }
    }

    for(const si of this.isPasteSaveSI){
      if (si.isPaste){
        let index = this.ItemDeleted.findIndex((element) => element === si.idItem)
        if (index == -1) {
          this.SiDeleted.push(si.idSousItem);
        }
      }
    }
  }

  async closeRecap(){
    this.returnOfDeleted = {
      listeOR: [],
      listeItem: [],
      listeSI: []
    }

    if(this.suppExecEnd){
      this.endOfDelete();
    }
  }

  async resetPasteList(){
    this.isPasteSaveSI.splice(0);
    this.isPasteSaveItem.splice(0);
  }

  async resetDeleted(){
    this.ORDeleted.splice(0);
    this.ItemDeleted.splice(0);
    this.SiDeleted.splice(0);
  }

  async deleteConfirmation(){
    this.suppressionEnCours = true;
    const res : deleteObject = {
      listeOR : this.ORDeleted,
      listeItem : this.ItemDeleted,
      listeSI : this.SiDeleted
    }

    const isAdmin = this.cookieService.get('Admin')
    if (isAdmin === 'true' ){
      await this.fetchDeleteObjectService.deleteObjectsAsAdmin(res).then((res: any) => {
        if(res == undefined) {
          this.setDemandeAdmin(true);
        } else {  
          this.returnOfDeleted = res;
        }
        this.suppExecEnd = true;
        this.suppressionEnCours = false;
        this.selectAtelier(this.atelierSelect);
      }).catch((e) => {
        
      })
    } else {
      await this.fetchDeleteObjectService.deleteObjects(res).then(async (res: any) => {
        if(res == undefined) {
          this.suppExecEnd = true;
          this.suppressionEnCours = false;
        } else {  
          this.returnOfDeleted = res;
          await this.verifyIfDmdAdmin();
          this.suppExecEnd = true;
          this.suppressionEnCours = false;
          this.selectAtelier(this.atelierSelect);
        }
        
      }).catch((e) => {

      })
    }
   
  }

  async verifyIfDmdAdmin(){
    this.setDemandeAdmin(false);
    if(this.returnOfDeleted != undefined){
      if (this.returnOfDeleted.listeOR.length != 0)
      for ( const objet of this.returnOfDeleted.listeOR ){
        if(objet.value == false && this.suppWithDmdAdmin == false){
          this.setDemandeAdmin(true);
        }
      }
      for ( const objet of this.returnOfDeleted.listeItem ){
        if(objet.value == false && this.suppWithDmdAdmin == false){
          this.setDemandeAdmin(true);
        }
      }
      for ( const objet of this.returnOfDeleted.listeSI ){
        if(objet.value == false && this.suppWithDmdAdmin == false){
          this.setDemandeAdmin(true);
        }
      }
    }
  }

  returnDeleteOrNot(typeObjet : typeObjet , idObjet : string){
    let res;
    if(typeObjet == this.TypeObject.OR){
      res = this.returnOfDeleted.listeOR.find(element => element.objet === idObjet)
      return res?.value
    } else if (typeObjet == this.TypeObject.Item) {
      res = this.returnOfDeleted.listeItem.find(element => element.objet === idObjet)
      return res?.value
    } else if (typeObjet == this.TypeObject.SI) {
      res = this.returnOfDeleted.listeSI.find(element => element.objet === idObjet)
      return res?.value
    }
    return undefined;
  }

  setDemandeAdmin(value : boolean ){
    this.suppWithDmdAdmin = value;
  }

  demandeSuppAdmin(){
    this.demandeAdmin = true;
  }

  async sendDemande(){
    let demande : demandeAdmin = {
      motif: this.motifDemande,
      orDelete: [],
      itemDelete: [],
      sousItemDelete: [],
      profilCreation: this.cookieService.get('login')
    };

    if (this.returnOfDeleted.listeOR.length != 0){
      for ( const or of this.returnOfDeleted.listeOR){
        if(!or.value){
          demande.orDelete.push({
            idObjetRepere : or.objet
          });
        }
      }
    }

    if (this.returnOfDeleted.listeItem.length != 0){
      for ( const item of this.returnOfDeleted.listeItem){
        if(!item.value){
          demande.itemDelete.push({
            idItem : item.objet
          });
        }
      }
    }

    if (this.returnOfDeleted.listeSI.length != 0){
      for ( const si of this.returnOfDeleted.listeSI){
        if(!si.value){
          demande.sousItemDelete.push({
            idSousItem : si.objet
          });
        }
      }
    }
      
      await this.fetchDeleteObjectService.demandeAdmin(demande).then(async (res: any) => {
    
      if(res == undefined) {
        
      } else {  
        this.manageToast("Demande de suppression", "La demande a été transmises aux administrateurs", "#006400");
        this.demandeAdmin = false;
        await this.endOfDelete();
      }
      
    }).catch((e) => {

    })
 
  }

  async endOfDelete(){
    await this.resetPasteList();
    await this.resetDeleted();
    await this.closeRecap();
    this.suppExecEnd = false;
    this.demandeAdmin = false;
    this.motifDemande = "";
  }


  

}
