import { Component, OnInit } from '@angular/core';
import {  createTypeObject, TypeObjetInfo, TypeObjetRepereInfo } from 'src/structureData/TypeObject';
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

  constructor(private fetchCreateTypeObject : FetchcreateTypeObjectService) { 

    this.fetchCreateTypeObject.getTypeObjetRepere().then((list: TypeObjetRepereInfo[]) => {
      this.listeTypeOR = list
    }).catch((e) => {
    })

    this.fetchCreateTypeObject.getTypeObjet().then((list: TypeObjetInfo[]) => {
      this.listeTypeO = list
    }).catch((e) => {
    })

  }


  ngOnInit(): void {
  }

  selectType (type: createTypeObject) {
    this.selectedType = type;
    this.idSelected = "";
    this.changesNow = false;
  }

  selectObject (id : string) {
    this.idSelected = id;
  }


  selectCreateType(){
    this.changesNow = true;
  }

  selectModifyType(){
    this.changesNow = true;
  }

}
