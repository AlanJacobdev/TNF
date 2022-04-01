import { Component, Input, OnInit } from '@angular/core';
import {  createTypeObject, modificationTypeObject, TypeObjetInfo, TypeObjetRepereInfo } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from './service/fetchcreate-type-object.service';

@Component({
  selector: 'app-create-type-object',
  templateUrl: './create-type-object.component.html',
  styleUrls: ['./create-type-object.component.css']
})
export class CreateTypeObjectComponent implements OnInit {

  public listeTypeOR: TypeObjetRepereInfo[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public selectedType : createTypeObject = createTypeObject.OR;
  public TypeObject = createTypeObject;
  public changesNow : boolean = false;
  public idSelected : string = "";
  @Input() public radio : string = "ee";
  public objectSelect : modificationTypeObject = {
    idTypeObjet: '',
    libelleTypeObjet: ''
  };

  public ToastAffiche : boolean = false; 

  constructor(private fetchCreateTypeObject : FetchcreateTypeObjectService) { 
    this.refreshListes();
  }


  ngOnInit(): void {
  }

  refreshListes(){
    this.fetchCreateTypeObject.getTypeObjetRepere().then((list: TypeObjetRepereInfo[]) => {
      this.listeTypeOR = list
    }).catch((e) => {
    })

    this.fetchCreateTypeObject.getTypeObjet().then((list: TypeObjetInfo[]) => {
      this.listeTypeO = list
    }).catch((e) => {
    })

  }

  selectType (type: createTypeObject) {
    this.selectedType = type;
    this.idSelected = "";
    this.changesNow = false;
  }

  selectObject (id : string) {
    this.idSelected = id;
    this.changesNow = false;
  }


  selectCreateType(){
    this.changesNow = true;
    this.idSelected = "";
  }

  selectModifyType(){
    this.changesNow = true;
    let res;
    if(this.selectedType === this.TypeObject.OR) {
      res = this.listeTypeOR.find(element => element.idTypeOR === this.idSelected);  
      if (res != undefined){
        this.objectSelect.idTypeObjet = res.idTypeOR;
        this.objectSelect.libelleTypeObjet = res.libelleTypeOR;
      }
    } else {
      res = this.listeTypeO.find(element => element.idType === this.idSelected);  
      if (res != undefined){
        this.objectSelect.idTypeObjet = res.idType;
        this.objectSelect.libelleTypeObjet = res.libelleType;
      }
    }
  }


  createTypeObjet(identifiant : string, libelle : string) {
    if(this.radio === "OR") {
      this.fetchCreateTypeObject.createTypeOR(identifiant,libelle).then((res: TypeObjetRepereInfo) => {
        console.log(res);
        
        if(res === undefined) {

        } else {
         this.ToastAffiche = true;
         this.refreshListes();
         //TODO
         setTimeout(() => 
         {
          this.ToastAffiche = false;
         },
         10000);
         
        }
      }).catch((e) => {
      })

    } else if ( this.radio === "O" ){

      this.fetchCreateTypeObject.createTypeO(identifiant,libelle).then((res: TypeObjetRepereInfo) => {
        console.log(res);
        
        if(res === undefined) {

        } else {
         this.ToastAffiche = true;
         this.refreshListes();
         //TODO
         setTimeout(() => 
         {
          this.ToastAffiche = false;
         },
         10000);
         
        }
      }).catch((e) => {
      })
    }
  }


  updateTypeObjet(identifiant : string, libelle : string) {
    if ( this.selectedType == this.TypeObject.OR){
      this.fetchCreateTypeObject.updateTypeOR(identifiant,libelle).then((res: TypeObjetRepereInfo) => {
        console.log(res);
        if (res === undefined) {

        } else {
          this.ToastAffiche = true;
          this.refreshListes();
          //TODO
          setTimeout(() => 
          {
          this.ToastAffiche = false;
          },
          10000);
        }

      }).catch((e) => {
      })
    } else if ( this.selectedType === this.TypeObject.O ){
      this.fetchCreateTypeObject.updateTypeO(identifiant,libelle).then((res: TypeObjetRepereInfo) => {
        console.log(res);
        if (res === undefined) {

        } else {
          this.ToastAffiche = true;
          this.refreshListes();
          //TODO
          setTimeout(() => 
          {
          this.ToastAffiche = false;
          },
          10000);
        }

      }).catch((e) => {
      })
    }

  }

  deleteTypeObjet() {
    console.log (this.selectedType)
    if ( this.selectedType == this.TypeObject.OR){
      this.fetchCreateTypeObject.deleteTypeOR(this.idSelected).then((res: any) => {
        console.log(res);
        if (res === undefined) {

        } else {
          this.ToastAffiche = true;
          this.refreshListes();
          //TODO
          setTimeout(() => 
          {
          this.ToastAffiche = false;
          },
          10000);
        }

      }).catch((e) => {
      })
    }else if ( this.selectedType === this.TypeObject.O ){
      this.fetchCreateTypeObject.deleteTypeO(this.idSelected).then((res: any) => {
        if (res === undefined) {

        } else {
          this.ToastAffiche = true;
          this.refreshListes();
          //TODO
          setTimeout(() => 
          {
          this.ToastAffiche = false;
          },
          10000);
        }

      }).catch((e) => {
      })
    
    
    }

  }

}
