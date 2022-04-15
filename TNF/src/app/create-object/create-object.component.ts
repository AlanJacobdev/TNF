import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AtelierInfo } from 'src/structureData/Atelier';
import { ItemEtDispo, typeObjet } from 'src/structureData/Item';
import { NUetOR, ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { TypeObjetInfo, TypeObjetRepereInfo, TypeObjetRepereTableau } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchCreateObjectService } from './service/fetch-create-object.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-create-object',
  templateUrl: './create-object.component.html',
  styleUrls: ['./create-object.component.css']
})
export class CreateObjectComponent implements OnInit {

  public faXmark = faXmark;
  @Input() public radio : typeObjet = typeObjet.Aucun;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public listeAtelier: AtelierInfo[] = [];
  public listeNUetOr : NUetOR[] = [];
  public listeOR : ObjetRepereInfo[] = [];
  public listeItem : ItemEtDispo[] = [];
  public typeNow: string = "";
  public objectNow : typeObjet = typeObjet.OR;
  public objectTypeNow: any;
  public TypeObject = typeObjet;
  public atelierSelect : string = "";
  public nuSelect : string = "";
  public itemSelect: string = "";
  public formValidate : boolean = false;
  public checkValide : boolean = false;
  public checkSecurite : boolean = false;
  public orSelect : string ="";
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";


  constructor(private fetchCreateTypeObject : FetchcreateTypeObjectService, private fetchVisuService : FetchVisuService, private fetchCreateObjectService: FetchCreateObjectService) {
    this.getListType();
    this.getAteliers();
   }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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

  getSIfromORandDispo() {

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
      console.log("erreur")
    }
  }

  setcheckValide() {
    this.checkValide = !this.checkValide;
  }

  setcheckSecurite(){
    this.checkSecurite =!this.checkSecurite;
  }

  closeToast(){
    this.ToastAffiche = false;
  }
      
  public selectType(Type: any ) {
    this.objectTypeNow = typeObjet.Aucun;
    this.typeNow = Type.target.value;    
    if (this.objectNow === this.TypeObject.Item) {
      this.getSIfromORandDispo();
    }
  }

  deleteDataForm() {
    this.nuSelect = ""
    this.checkSecurite = false;
    this.checkValide = false;
  }

  public selectAtelier (Atelier : any) {
    let atelier;
    try {
      atelier = Atelier.target.value;
    } catch  {
      atelier = Atelier;
    }

    this.listeItem.splice(0);
    this.deleteDataForm();
    if( atelier == '') {   
      this.listeNUetOr.splice(0);
      this.listeOR.splice(0);
      this.atelierSelect = '';
    } else {
      this.atelierSelect = atelier;
      if(this.objectNow === this.TypeObject.OR ) {
        this.afficherNUOR(atelier)
      } else if (this.objectNow === this.TypeObject.Item){
        this.getObjetRepereByAteliers();
        
      }
    }
  }

  public selectOR(idOR : string) {
    this.orSelect = idOR;
    this.getSIfromORandDispo();
  }


  public selectItem(idItem : string){
    this.itemSelect = idItem;
  }

  public selectObject (object : typeObjet) {
    this.objectNow = object;
    this.selectAtelier(this.atelierSelect)
  }

  public selectNU (nu : string) {
    this.nuSelect = nu;
    console.log(nu)
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

  createObjet(libelle : string, description : string) {
   
    if ( this.nuSelect != '' && this.typeNow != '' && libelle != '') {
        this.refreshValidationForm();
        this.fetchCreateObjectService.createObject(libelle, this.typeNow, this.nuSelect, this.checkValide, description).then((res: any) => {
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

  createItem(libelle : string, digit : string, description : string){
    if (libelle != '' && digit != '' ) {
      let digitNumber = parseInt(digit);
      this.refreshValidationForm();
      this.fetchCreateObjectService.createItem(libelle, this.orSelect, this.typeNow, digitNumber, this.checkSecurite, this.orSelect.substring(2,6), this.checkValide, description).then((res: any) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de création", res , "red")
        } else {  
          this.manageToast("Création", "L'item " + this.typeNow + this.orSelect.substring(2,6)+ digitNumber+ ((this.checkSecurite)? 'Z' : '')+ " a été crée", "#006400")
          this.getSIfromORandDispo();   
          this.deleteDataForm();   
        }
      }).catch((e) => {
      })
    } else {
      this.formValidate = true;
    }
  }



}


