import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { AtelierInfo } from 'src/structureData/Atelier';
import { TypeObjetInfo } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchExportationService } from './service/fetch-exportation.service';

@Component({
  selector: 'app-exportation',
  templateUrl: './exportation.component.html',
  styleUrls: ['./exportation.component.css']
})
export class ExportationComponent implements OnInit {

  exportData : any[] = [];
  public listeAtelier: AtelierInfo[] = [];
  public atelier: string = "";
  public typeObjet: string = "";
  public listeTypeO: TypeObjetInfo[] = [];
  public checkValide : boolean = false;
  public checkSecurite : boolean = false;
  public objetRepere : string = "";
  public dateDebut : string = "";
  public dateFin : string = "";
  public actif : number = -1;
  public securite : number = -1;

  constructor(private fetchExportationService : FetchExportationService,private fetchVisuService : FetchVisuService, private fetchCreateTypeObject : FetchcreateTypeObjectService) { 
    this.dummyData();
    this.getAteliers();
    this.getListType();
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

 
    this.fetchCreateTypeObject.getTypeObjet().then((list: TypeObjetInfo[]) => {
      this.listeTypeO = list
    }).catch((e) => {
    })
  }



  public selectAtelier (Atelier : any) {
    try {
      this.atelier = Atelier.target.value;
    } catch  {
      this.atelier = Atelier;
    }
  }

  public selectTypeObjet (TypeObjet : any) {
    try {
      this.typeObjet = TypeObjet.target.value;
    } catch  {
      this.typeObjet = TypeObjet;
    }
  }

  public selectActif(value : number){
      this.actif = value;
  }

  public selectSecurite(value : number){
      this.securite = value;
  }

  setcheckValide() {
    this.checkValide = !this.checkValide;
  }

  setcheckSecurite(){
    this.checkSecurite =!this.checkSecurite;
  }

  setDateDebut(date : any){
    let testDate = Date.parse(date.target.value);
    if(isNaN(testDate)){
      this.dateDebut = "";
    } else {
      this.dateDebut = date.target.value;
    }
  }

  setDateFin(date : any){
    let testDate = Date.parse(date.target.value);
    if(isNaN(testDate)){
      this.dateFin = "";
    } else {
      this.dateFin = date.target.value;
    }
   
  }


  valideForm(){
    this.fetchExportationService.getExportItem(this.atelier, this.typeObjet, this.objetRepere, this.dateDebut, this.dateFin, this.actif, +this.securite).then((list: TypeObjetInfo[]) => {
      this.listeTypeO = list
    }).catch((e) => {
    })
  }

  dummyData() {
    this.exportData = [
      { id: 1, Company: 'Alfreds Futterkiste', Contact: 'Maria Anders', Country: 'Germany' },
      { id: 2, Company: 'Centro comercial Moctezuma', Contact: 'Francisco Chang', Country: 'Mexico' },
      { id: 3, Company: 'Ernst Handel', Contact: 'Roland Mendel', Country: 'Austria' },
      { id: 4, Company: 'Island Trading', Contact: 'Helen Bennett', Country: 'UK' },
      { id: 5, Company: 'Laughing Bacchus Winecellars', Contact: 'Yoshi Tannamuri', Country: 'Canada' },
      { id: 6, Company: 'Magazzini Alimentari Riuniti', Contact: 'Giovanni Rovelli', Country: 'Italy' },
    ]
  }


  public exportExcel() {
    if (this.exportData.length > 0){
      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.exportData);

        //xlsx.utils.sheet_add_aoa(worksheet, [['NEW VALUE from NODE']], {origin: 'F4'});        
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveExcel(excelBuffer, "ExportExcel");

      })
    } else {

    }
  }

  public saveExcel (buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }



}


