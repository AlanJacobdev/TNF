import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { AtelierInfo } from 'src/structureData/Atelier';
import { etat, ItemAffichage } from 'src/structureData/Item';
import { ObjetRepereUtile } from 'src/structureData/ObjetRepere';
import { TypeObjetInfo } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchExportationService } from './service/fetch-exportation.service';

@Component({
  selector: 'app-exportation',
  templateUrl: './exportation.component.html',
  styleUrls: ['./exportation.component.css']
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class ExportationComponent implements OnInit {

  public exportData : ItemAffichage[] = [];
  public listeAtelier: AtelierInfo[] = [];
  public atelier: string = "";
  public typeObjet: string = "";
  public listeTypeO: TypeObjetInfo[] = [];
  public checkValide : boolean = false;
  public checkSecurite : boolean = false;
  public objetRepere : string = "";
  public dateDebut : string = "";
  public dateFin : string = "";;
  public securite : number = -1;
  public nomExport : string = "";
  public etat: etat = etat.Aucun;
  public etatNow =etat;


  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

  public orExisted : number = -1;
  public orExistedData : string = "";

   /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */

  constructor(private fetchExportationService : FetchExportationService,private fetchVisuService : FetchVisuService, private fetchCreateTypeObject : FetchcreateTypeObjectService) { 
    this.getAteliers();
    this.getListType();
  }

  
   /**
    * Méthode appellée à l'initialisation du composant
    */
  ngOnInit(): void {
    
  }

  /**
   * Recupère les ateliers
   */
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

  /**
   * Recupère les différents typoes d'objet existant (pour item)
   */
  getListType(){

 
    this.fetchCreateTypeObject.getTypeObjet().then((list: TypeObjetInfo[]) => {
      this.listeTypeO = list
    }).catch((e) => {
    })
  }

  /**
   * Ferme le toast 
   */
  closeToast(){
    this.ToastAffiche = false;
  }

    /**
   * Gestion de l'affichage du toast 
   * @param title : Titre du toast
   * @param text : Texte du toast
   * @param color : couleur associé au toast
   */
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


  /**
   * Selection de l'atelier courant
   * @param Atelier : Identifiant de l'atelier
   */
  public selectAtelier (Atelier : any) {
    try {
      this.atelier = Atelier.target.value;
    } catch  {
      this.atelier = Atelier;
    }
  }

  /**
   * Selection du type d'objet (item) courant 
   * @param TypeObjet : Identifiant du type d'objet courant 
   */
  public selectTypeObjet (TypeObjet : any) {
    try {
      this.typeObjet = TypeObjet.target.value;
    } catch  {
      this.typeObjet = TypeObjet;
    }
  }

  /**
   * Sélection de l'état de l'objet (actif, en attente ou hors service)
   * @param value : Valeur issue de l'enum etatNow
   */
  public selectEtat(value : etat){
      this.etat = value;
  }

  /**
   * Change le statut de la sécurité (-1 0 1)
   * @param value 
   */
  public selectSecurite(value : number){
      this.securite = value;
  }

/**
 * NON UTILISEE
 */  
  setcheckValide() {
    this.checkValide = !this.checkValide;
  }

  /**
   * NON UTILISEE
   */
  setcheckSecurite(){
    this.checkSecurite =!this.checkSecurite;
  }

  /**
   * Modifie la valeur du début d'intervalle de dernière modification
   * @param date : Date format dd/mm/yyyy
   */
  setDateDebut(date : any){
    let testDate = Date.parse(date.target.value);
    if(isNaN(testDate)){
      this.dateDebut = "";
    } else {
      this.dateDebut = date.target.value;
    }
  }

    /**
   * Modifie la valeur de la fin d'intervalle de dernière modification
   * @param date : Date format dd/mm/yyyy
   */
  setDateFin(date : any){
    let testDate = Date.parse(date.target.value);
    if(isNaN(testDate)){
      this.dateFin = "";
    } else {
      this.dateFin = date.target.value;
      
    }
   
  }

  /**
   * Vérifie l'existence d'un objet repère
   * @param idOr : Identifiant d'un objet repère 
   */
  public orExist (idOr : any){
    const id = idOr.target.value;
    if (id.length == 6){
      this.fetchExportationService.getORbyId(id).then((res: ObjetRepereUtile) => {
      if (res == undefined) {
        this.orExisted = 0;
        this.orExistedData = "Objet repère inconnu";
      } else {
        this.orExisted = 1;
        this.orExistedData = res.idObjetRepere +" - "+ res.libelleObjetRepere;
      }
      }).catch((e) => {
      })
    } else {
      this.orExisted = -1;
      this.orExistedData = "";
    }

   
  }
  

/**
 * Validation du formulaire 
 * Recupère les informations correspondant aux filtres
 */
  valideForm(){
    if(this.atelier == '' && this.typeObjet == '' && this.objetRepere == '' && this.dateDebut == '' && this.dateFin == '' && this.etat == this.etatNow.Aucun && this.securite == -1) {
      this.manageToast("Erreur recherche d'item", "Veuillez sélectionner un filtre" , "red")
    } else {
      this.fetchExportationService.getExportItem((this.atelier == '' ? '-1' : this.atelier), (this.typeObjet == '' ? '-1' : this.typeObjet), (this.objetRepere == '' ? '-1' : this.objetRepere),
      (this.dateDebut == '' ? '-1' : this.dateDebut), (this.dateFin == '' ? '-1' : this.dateFin), this.etat, this.securite).then((list: ItemAffichage[]) => {

        if(list == undefined) {
          this.exportData.splice(0)
          this.manageToast("Erreur recherche d'item", "Aucune donnée ne correspond à votre recherche" , "red")
        } else if(typeof list === 'string') {
          this.exportData.splice(0)
          this.manageToast("Erreur recherche d'item", list , "red")
        } else {
          this.exportData = list
        }
      }).catch((e) => {
      })
    }
  }


  /**
   * Exporte les données reçu sous un fichier excel
   */
  public exportExcel() {
    
      if (this.exportData.length > 0){
        if (this.nomExport != ""){
        import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(this.exportData);

                  
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          
          
          this.saveExcel(excelBuffer, this.nomExport);

        })
      } else {
        this.manageToast("Erreur d'export", "Nom de fichier non renseigné" , "red")
      }
    } else {
      this.manageToast("Erreur d'export", "Aucune données à exporter" , "red")
    }
  }

  /**
   * Télecharge le fichier excel
   * @param buffer : Buffer excel
   * @param fileName : Nom du fichier a créer
   */
  public saveExcel (buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }



}


