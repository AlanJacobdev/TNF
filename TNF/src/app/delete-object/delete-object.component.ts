/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { AtelierInfo } from 'src/structureData/Atelier';
import { typeObjet, ItemInfo, ItemModification } from 'src/structureData/Item';
import { ObjetRepereInfo, ObjetRepereModification } from 'src/structureData/ObjetRepere';
import { TypeObjetRepereTableau, TypeObjetInfo } from 'src/structureData/TypeObject';
import { FetchCreateObjectService } from '../create-object/service/fetch-create-object.service';
import { FetchModifyObjectService } from '../modify-object/service/fetch-modify-object.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchDeleteObjectService } from './service/fetch-delete-object.service';

@Component({
  selector: 'app-delete-object',
  templateUrl: './delete-object.component.html',
  styleUrls: ['./delete-object.component.css']
})
export class DeleteObjectComponent implements OnInit {

  public faXmark = faXmark;
  @Input() public radio : typeObjet = typeObjet.Aucun;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
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
 
  public formValidate : boolean = false;
  @Input() public checkValide : boolean = false;
  public idORSelect : string = "";
 
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

  public searchText : string = "";
  
  constructor( private fetchVisuService : FetchVisuService, private fetchDeleteObjectService :FetchDeleteObjectService) {
    // this.getListType();
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
    if( atelier == '') {
      this.listeOR.splice(0);
      this.listeItem.splice(0);
      this.atelierSelect = '';
      
    } else {
      this.listeItem.splice(0);
      this.atelierSelect = atelier;
      if(this.objectNow === this.TypeObject.OR ) {
        this.getObjetRepereByAtelier();
      } else if (this.objectNow === this.TypeObject.Item){
        this.getObjetRepereByAtelier();
      }
    }
  }


  public selectOR(idOR : string) {
    if (this.objectNow === this.TypeObject.OR ) {
      this.idORSelect = idOR;
    } else if (this.objectNow === this.TypeObject.Item) {
        this.idORSelect = idOR;
        this.getItemFromOR();
    }
  }


  public selectItem(idItem : string){
    this.idItemSelect = idItem;   
  }

  public selectObject (object : typeObjet) {
    this.objectNow = object;
    this.selectAtelier(this.atelierSelect)
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
}
