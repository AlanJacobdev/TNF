import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AtelierInfo } from 'src/structureData/Atelier';
import { typeObjet } from 'src/structureData/Item';
import { NUetOR } from 'src/structureData/ObjetRepere';
import { createTypeObject, TypeObjetInfo, TypeObjetRepereInfo, TypeObjetRepereTableau } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchCreateObjectService } from './service/fetch-create-object.service';

@Component({
  selector: 'app-create-object',
  templateUrl: './create-object.component.html',
  styleUrls: ['./create-object.component.css']
})
export class CreateObjectComponent implements OnChanges {

  @Input() public radio : typeObjet = typeObjet.Aucun;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public listeAtelier: AtelierInfo[] = [];
  public listeNUetOr : NUetOR[] = [];
  public typeNow: string = "";
  public objectNow : typeObjet = typeObjet.OR;
  public objectTypeNow: any;
  public TypeObject = typeObjet;
  
  constructor(private fetchCreateTypeObject : FetchcreateTypeObjectService, private fetchVisuService : FetchVisuService, private fetchCreateObjectService: FetchCreateObjectService) {
    this.getListType();
    this.getAteliers();
   }

  
  ngOnChanges(changements: SimpleChanges) {
    //Insérez votre code de détection du changement ici
    console.log(changements); //Valeur actuelle du libellé (après le changement)
    console.log(changements['radio'].previousValue); //Ancienne valeur du libellé (avant le changement)
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

  public selectType(Type: any ) {
    this.objectTypeNow = typeObjet.Aucun;
    this.typeNow = Type.target.value; 
  }

  public selectAtelier (Atelier : any) {
    let atelier = Atelier.target.value;
    if(this.objectNow === this.TypeObject.OR) {
      this.afficherNUOR(atelier)
    } else {
      
    }
  }

  public selectObject (object : typeObjet) {
    this.objectNow = object;
    console.log(this.objectNow)
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

}


