import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ItemInfo, typeObjet } from 'src/structureData/Item';
import { exportGMAO, ObjectToExportGmao, ObjetRepereInfo } from 'src/structureData/ObjetRepere';
import { SousItemInfo } from 'src/structureData/SousItem';
import { FetchExportationGmaoService } from './service/fetch-exportation-gmao.service';


@Component({
  selector: 'app-exportation-gmao',
  templateUrl: './exportation-gmao.component.html',
  styleUrls: ['./exportation-gmao.component.css']
})
export class ExportationGmaoComponent implements OnInit {

  constructor(private fetchExportationGmaoService : FetchExportationGmaoService) { }

  public listeOr : ObjetRepereInfo[] = [];
  public listeItem : ItemInfo[] = [];
  public listeSi : SousItemInfo[] = [];
  public objectType: typeObjet = typeObjet.Aucun;
  public objectTypeNow = typeObjet;

  public listOfSelectedOr : string[]= [];
  public listOfSelectedItem : string[]= [];
  public listOfSelectedSI : string[]= [];

  public OrExport : ObjetRepereInfo[] = [];
  public ItemExport : ItemInfo[] = [];
  public SiExport : SousItemInfo[] = [];

  public checkAllOr : boolean = false;
  public checkAllItem : boolean = false;
  public checkAllSi : boolean = false;

  public formValidate : boolean = false;

  public nomDocument : string = "";
  public exportEnCours : boolean = false;

  ngOnInit(): void {
    this.getObjetToExport();
  }


  getObjetToExport(){
    this.exportEnCours = true
    this.fetchExportationGmaoService.getAllObjetToExportGmao().then((list: ObjectToExportGmao) => {
      if (list != undefined) {
        this.listeOr = list.listeOR;
        this.listeItem = list.listeItem;
        this.listeSi =  list.listeSI;
        
        if (this.listeOr.length != 0 ){
          this.selectObject(this.objectTypeNow.OR);
        } else if (this.listeItem.length != 0 ){
          this.selectObject(this.objectTypeNow.Item);
        } else {
          this.selectObject(this.objectTypeNow.SI);
        } 


      } else {
        console.log("Exportation : Problème de récupération des objet à exporter ")
        this.listeOr.splice(0);
        this.listeItem.splice(0);
        this.listeSi.splice(0);

      }
      this.exportEnCours = false;
    }).catch((e) => {
      this.exportEnCours = false;
    })

    

  }

  public selectObject (object : typeObjet) {
    this.objectType = object;
  }

  selectCheckOR(idOR : string){
    const targetOR = this.listeOr.findIndex((element) => element.idObjetRepere === idOR)
    if (targetOR != -1) {  
      this.listeOr[targetOR].isPaste = !this.listeOr[targetOR].isPaste;
      const stateTypeOR = this.listOfSelectedOr.findIndex((element) => element === idOR);
      if(stateTypeOR != -1) {
        this.listOfSelectedOr.splice(stateTypeOR , 1)
      } else {
        this.listOfSelectedOr.push(idOR);
      }
    }  
    this.verifyCheckAllOr();
  }

  allSelectOR(){    
    this.checkAllOr = !this.checkAllOr;
    for (const typeor of this.listeOr) {
      typeor.isPaste = this.checkAllOr;
      let index = this.listeOr.findIndex((element) => element.idObjetRepere === typeor.idObjetRepere)
      let indexPaste = this.listOfSelectedOr.findIndex((element) => element == typeor.idObjetRepere)       
      if (this.listeOr[index].isPaste){
        if(indexPaste == -1){
          this.listOfSelectedOr.push(this.listeOr[index].idObjetRepere)
        }
      } else {
        let index = this.listOfSelectedOr.findIndex((element) => element === typeor.idObjetRepere)
        this.listOfSelectedOr.splice(index,1);
      }
    }    
  }

  verifyCheckAllOr(){
    let allCheck = true;
    if (this.listeOr.length != 0){
      for (const typeor of this.listeOr) {
        if(typeor.isPaste === false) {
          allCheck = false;
        }
      }
      if (allCheck) {
        this.checkAllOr = true;
      } else {
        this.checkAllOr = false;
      }
    } else {
      this.checkAllOr = false;
    }
  }

  selectCheckItem(idItem : string){
    const targetItem = this.listeItem.findIndex((element) => element.idItem === idItem)
    if (targetItem != -1) {  
      this.listeItem[targetItem].isPaste = !this.listeItem[targetItem].isPaste;
      const stateitem= this.listOfSelectedItem.findIndex((element) => element === idItem);
      if(stateitem != -1) {
        this.listOfSelectedItem.splice(stateitem , 1)
      } else {
        this.listOfSelectedItem.push(idItem);
      }
    }  
    this.verifyCheckAllItem();
  }

  allSelectItem(){    
    this.checkAllItem = !this.checkAllItem;
    for (const item of this.listeItem) {
      item.isPaste = this.checkAllItem;
      let index = this.listeItem.findIndex((element) => element.idItem === item.idItem)
      let indexPaste = this.listOfSelectedItem.findIndex((element) => element == item.idItem)       
      if (this.listeItem[index].isPaste){
        if(indexPaste == -1){
          this.listOfSelectedItem.push(this.listeItem[index].idItem)
        }
      } else {
        let index = this.listOfSelectedItem.findIndex((element) => element === item.idItem)
        this.listOfSelectedItem.splice(index,1);
      }
    }    
  }

  verifyCheckAllItem(){
    let allCheck = true;
    if (this.listeItem.length != 0){
      for (const item of this.listeItem) {
        if(item.isPaste === false) {
          allCheck = false;
        }
      }
      if (allCheck) {
        this.checkAllItem = true;
      } else {
        this.checkAllItem = false;
      }
    } else {
      this.checkAllItem = false;
    }
  }

  selectCheckSi(idSi : string){
    const targetSi = this.listeSi.findIndex((element) => element.idSousItem === idSi)
    if (targetSi != -1) {  
      this.listeSi[targetSi].isPaste = !this.listeSi[targetSi].isPaste;
      const stateSi = this.listOfSelectedSI.findIndex((element) => element === idSi);
      if(stateSi != -1) {
        this.listOfSelectedSI.splice(stateSi , 1)
      } else {
        this.listOfSelectedSI.push(idSi);
      }
    }  
    this.verifyCheckAllSi();
  }

  allSelectSi(){    
    this.checkAllSi = !this.checkAllSi;
    for (const si of this.listeSi) {
      si.isPaste = this.checkAllSi;
      let index = this.listeSi.findIndex((element) => element.idSousItem === si.idSousItem)
      let indexPaste = this.listOfSelectedSI.findIndex((element) => element == si.idSousItem)       
      if (this.listeSi[index].isPaste){
        if(indexPaste == -1){
          this.listOfSelectedSI.push(this.listeSi[index].idSousItem)
        }
      } else {
        let index = this.listOfSelectedSI.findIndex((element) => element === si.idSousItem)
        this.listOfSelectedSI.splice(index,1);
      }
    }    
  }

  verifyCheckAllSi(){
    let allCheck = true;
    if (this.listeSi.length != 0){
      for (const si of this.listeSi) {
        if(si.isPaste === false) {
          allCheck = false;
        }
      }
      if (allCheck) {
        this.checkAllSi = true;
      } else {
        this.checkAllSi = false;
      }
    } else {
      this.checkAllSi = false;
    }
  }

  export(){
    this.formValidate = false;
    this.exportEnCours = true
    this.nomDocument = "";
    this.OrExport.splice(0); 
    this.ItemExport.splice(0); 
    this.SiExport.splice(0); 

    for (const or of this.listOfSelectedOr) {
      let orExist = this.listeOr.find( (element) => element.idObjetRepere == or);
      if (orExist != undefined){
        this.OrExport.push(orExist);
      }
    }

    for (const item of this.listOfSelectedItem) {
      let itemExist = this.listeItem.find( (element) => element.idItem == item);
      if (itemExist != undefined){
        this.ItemExport.push(itemExist);
      }
    }

    for (const si of this.listOfSelectedSI) {
      let siExist = this.listeSi.find( (element) => element.idSousItem == si);
      if (siExist != undefined){
        this.SiExport.push(siExist);
      }
    }

    this.exportEnCours = false;

  }


  async sendExport(){
    if (this.nomDocument !== ""){
      let payload : exportGMAO ={
        listeOR: this.OrExport,
        listeItem: this.ItemExport,
        listeSI: this.SiExport,
        user: '',
        nomDocument : this.nomDocument
      };

      let sub =(await this.fetchExportationGmaoService.exportData(payload)).subscribe(res => {
        if (res == undefined || typeof res == 'string') {
          console.log("Impossible de récupérer le document");
        } else {
          const file = new File([res], payload.nomDocument+'_export_' + new Date().getTime() +'.xlsx',
        { type: 'application/vnd.ms-excel' });

          FileSaver.saveAs(file)
          
          sub.unsubscribe();
          
      }})      
    } else {
      this.formValidate = true;
    }

  }

}


