import { Component, OnInit } from '@angular/core';
import { AtelierInfo } from 'src/structureData/Atelier';
import { etat, ItemAffichage, ItemInfo, ItemSave, typeObjet } from 'src/structureData/Item';
import { ObjetRepereAffichage, ObjetRepereInfo, ObjetRepereSave, valide } from 'src/structureData/ObjetRepere';
import { SousItemAffichage, SousItemInfo, SousItemSave } from 'src/structureData/SousItem';
import { FetchVisuService } from './service/fetch-visu.service';
import { faHistory, faCalendar, faUser, faClock, faEye } from '@fortawesome/free-solid-svg-icons';
import { Description } from 'src/structureData/Description';
import { TypeObjetInfo, TypeObjetRepereInfo } from 'src/structureData/TypeObject';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
    /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
export class VisualisationComponent implements OnInit {
  
  public faClock = faClock;
  public faHistory = faHistory;
  public faCalendar = faCalendar;
  public faUser = faUser;
  public faEye = faEye;
  public listeAtelier: AtelierInfo[] = [];
  public listeObjetRepere : ObjetRepereInfo[] = [];
  public listeItem : ItemInfo[] = [];
  public listeSousItem : SousItemInfo[] = [];
  public listeTypeOr : TypeObjetRepereInfo[] = [];
  public listeTypeObjet : TypeObjetInfo[] = [];
  public selectTypeOr : number = -1;
  public selectTypeItem : number = -1;
  public selectTypeSousItem : number = -1;
  public ORHistory : ObjetRepereSave[] = [];
  public ItemHistory : ItemSave[] = [];
  public SIHistory : SousItemSave[] = [];
  public selectedOr: string = "";
  public selectedItem: string = "";
  public selectedSousItem: string = "";
  public selectedNow : string = "";
  public searchText : string = "";
  public objectTypeNow: typeObjet = typeObjet.Aucun;
  public TypeObjet = typeObjet;
  public etatItem : etat = etat.Aucun;
  public etatSI : etat = etat.Aucun;
  public etatOR : valide = valide.Aucun;
  public etatOrNow = valide;
  public etatNow =etat;
  public descriptionFromHistory : boolean = false;
  public descriptionHistory : Description[] = [];
  public Ornow : ObjetRepereAffichage = {
    idObjetRepere: '',
    libelleObjetRepere: '',
    etat: '',
    profilCreation: '',
    dateCreation: '',
    profilModification: '',
    dateModification: '',
    description: [],
    securite: false
  };

  public ItemNow : ItemAffichage = {
    idItem: '',
    libelleItem: '',
    etat: '',
    profilCreation: '',
    dateCreation: '',
    profilModification: '',
    dateModification: '',
    description: []
  }
  
  public SousItemNow : SousItemAffichage = {
    idSousItem: '',
    libelleSousItem: '',
    etat: '',
    profilCreation: '',
    dateCreation: '',
    profilModification: '',
    dateModification: '',
    description: []
  }

  /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private fetchVisuService : FetchVisuService) { 
    this.getType();
    this.fetchVisuService.getAteliersVisu().then((list: AtelierInfo[]) => {
      this.listeAtelier = list
    }).catch((e) => {
    })
  }

  /**
  * Méthode appellée à l'initialisation du composant
  */
  ngOnInit(): void {
  }

  /**
   * Récupère les types d'objet 
   */
  getType (){
    this.listeTypeObjet.splice(0);
    this.fetchVisuService.getTypeObjetRepere().then((list: TypeObjetRepereInfo[]) => {
      if( list != undefined){
        this.listeTypeOr = list;
      } else {
        console.log("Problème import liste OR")
      }
    }).catch((e) => {
    })

    this.fetchVisuService.getTypeObjet().then((list: TypeObjetInfo[]) => {
      if( list != undefined){
        this.listeTypeObjet = list
      } else {
        console.log("Problème import liste Objet")
      }
    }).catch((e) => {
    })

  }

  /**
   * Sélection de l'atelier courant 
   * @param Atelier : Identifiant de l'atelier
   */
  public selectAtelier(Atelier: any ) {
    this.selectedNow = "";
    this.selectedOr = "";
    this.objectTypeNow = typeObjet.Aucun;
    let value = Atelier.target.value; 
    this.fetchVisuService.getObjetRepereByAteliers(value).then((list: ObjetRepereInfo[]) => {
      if(list == undefined) {
        this.listeObjetRepere = [];
        this.listeItem = [];
        this.listeSousItem = [];
      } else {
        this.listeObjetRepere = list;
        this.listeItem = [];
        this.listeSousItem = [];
      }
    }).catch((e) => {
    })
  }

  /**
   * Sélection d'un objet repère
   * @param idOr : Identifiant de l'objet repère
   */
  public selectOR(idOr : string) {
    this.selectedOr = idOr;
    this.objectTypeNow = this.TypeObjet.OR;
    let res = this.listeObjetRepere.find(element => element.idObjetRepere === idOr);
    
    if ( res != undefined){
      this.Ornow.idObjetRepere = res.idObjetRepere ;
      this.Ornow.libelleObjetRepere = res.libelleObjetRepere ;
      this.Ornow.profilCreation = res.profilCreation ;
      const datec = new Date(res.dateCreation).toLocaleDateString("fr") + " " + new Date(res.dateCreation).toTimeString().split(' ')[0]
      this.Ornow.dateCreation = datec ; 
      this.Ornow.profilModification = (res.profilModification) ? res.profilModification : "Inconnu" ;
      const datem = new Date(res.dateModification).toLocaleDateString("fr") + " " + new Date(res.dateModification).toTimeString().split(' ')[0]
      this.Ornow.dateModification = (res.dateModification != null) ? datem : "Inconnue"; 
      this.Ornow.description = res.description ;
      this.Ornow.etat = res.etat == 'A' ? "Actif" : 'Reservé';
    }
    this.selectedNow = idOr;
    this.selectedItem = "";
    this.selectedSousItem = "";
    this.fetchVisuService.getItemByObjetRepere(idOr).then((list: ItemInfo[]) => {
      if(list == undefined) {
        this.listeItem = [];
        this.listeSousItem = [];
      } else {
        this.listeItem = list;
        this.listeSousItem = [];
      }
    }).catch((e) => {
    })
  }

  /**
   * Sélection d'un item
   * @param idItem : Identifiant de l'item
   */
  public selectItem(idItem : string) {
    this.selectedItem = idItem;
    this.objectTypeNow = this.TypeObjet.Item;
    let res = this.listeItem.find(element => element.idItem === idItem);
    if ( res != undefined){
      this.ItemNow.idItem = res.idItem ;
      this.ItemNow.libelleItem = res.libelleItem ;
      this.ItemNow.profilCreation = res.profilCreation ;

      const datec = new Date(res.dateCreation).toLocaleDateString("fr") + " " + new Date(res.dateCreation).toTimeString().split(' ')[0]
      this.ItemNow.dateCreation = datec ; 
      this.ItemNow.profilModification = (res.profilModification) ? res.profilModification : "Inconnu" ;
      const datem = new Date(res.dateModification).toLocaleDateString("fr") + " " + new Date(res.dateModification).toTimeString().split(' ')[0]
      this.ItemNow.dateModification = (res.dateModification != null) ? datem : "Inconnue"; 
      this.ItemNow.description = res.description ;
      this.ItemNow.etat = res.etat == 'A' ? "Actif" : res.etat == 'EA' ? 'En attente' : res.etat == 'HS' ? 'Hors Service' : 'Non défini';

    }
    this.selectedNow = idItem;
    this.selectedSousItem = "";
    this.fetchVisuService.getSousItemByItem(idItem).then((list: SousItemInfo[]) => {
      if(list == undefined) {
        this.listeSousItem = [];
      } else {
        this.listeSousItem = list;
      }
    }).catch((e) => {
    })
  }

  /**
   * Sélection d'un sous item
   * @param idSousItem : Identifiant du sous item
   */
  public selectSO(idSousItem : string) {
    this.selectedSousItem = idSousItem;
    this.objectTypeNow = this.TypeObjet.SI;
    let res = this.listeSousItem.find(element => element.idSousItem === idSousItem);
    if ( res != undefined){
      this.SousItemNow.idSousItem = res.idSousItem ;
      this.SousItemNow.libelleSousItem = res.libelleSousItem ;
      this.SousItemNow.profilCreation = res.profilCreation ;
      const datec = new Date(res.dateCreation).toLocaleDateString("fr") + " " + new Date(res.dateCreation).toTimeString().split(' ')[0]
      this.SousItemNow.dateCreation = datec ; 
      this.SousItemNow.profilModification = (res.profilModification) ? res.profilModification : "Inconnu" ;
      const datem = new Date(res.dateModification).toLocaleDateString("fr") + " " + new Date(res.dateModification).toTimeString().split(' ')[0]
      this.SousItemNow.dateModification = (res.dateModification != null) ? datem : "Inconnue"; 
      this.SousItemNow.description = res.description ;
      this.SousItemNow.etat = res.etat = 'A' ? "Actif" : res.etat == 'EA' ? 'En attente' : res.etat == 'HS' ? 'Hors Service' : 'Non défini';

    }
    this.selectedNow = idSousItem;
  }


  /**
   * Sélection de l'etat des items
   * @param etat : Valeur issue de l'enum etatNow
   */
  selectEtatItem(etat : etat){
    this.etatItem = etat;
  }

  /**
   * Sélection de l'etat des sous items
   * @param etat : Valeur issue de l'enum etatNow
   */
  selectEtatSI(etat : etat){
    this.etatSI = etat;
  }

  /**
   * Sélection de l'etat des objets repère
   * @param valide : Valeur issue de l'enum etatOrNow 
   */
  selectEtatOR(valide : valide){
    this.etatOR = valide
  }


  /**
   * Recupère l'historique d'un objet
   */
  public getHistory(){
    if(this.objectTypeNow == typeObjet.OR) {
      this.getHistoryOR();
    } else if (this.objectTypeNow == typeObjet.Item) {
      this.getHistoryItem();
    } else if (this.objectTypeNow == typeObjet.SI) {
      this.getHistorySI();
    }
  }

  /**
   * Recupère l'historique d'un objet repère
   */
  public getHistoryOR() {
    this.fetchVisuService.getHistoryObjetRepere(this.selectedNow).then((list: ObjetRepereSave[]) => {
      if(list == undefined) {
        this.ORHistory = [];
      } else {
        this.ORHistory.splice(0);
        for (const or of list) {
          let newOr : ObjetRepereSave = or;
          newOr.etat = or.etat == 'A' ? "Actif" : 'Reservé';
          this.ORHistory.push(newOr);
        }
      }
    }).catch((e) => {
    })
  }
  
  /**
   * Recupère l'historique d'un item
   */
  public getHistoryItem() {
    this.fetchVisuService.getHistoryItem(this.selectedNow).then((list: ItemSave[]) => {
      if(list == undefined) {
        this.ItemHistory = [];
      } else {
        this.ItemHistory.splice(0)
        for (const item of list) {
          let newItem : ItemSave = item;
          newItem.etat = item.etat == 'A' ? "Actif" : item.etat == 'EA' ? 'En attente' : item.etat == 'HS' ? 'Hors Service' : 'Non défini';
          this.ItemHistory.push(newItem);
        }
      }
    }).catch((e) => {
    })
  }

  /**
   * Recupère l'historique d'un sous item
   */
  public getHistorySI() {
    this.fetchVisuService.getHistorySousItem(this.selectedNow).then((list: SousItemSave[]) => {
      if(list == undefined) {
        this.SIHistory = [];
      } else {
        this.SIHistory.splice(0);
        for (const si of list) {
          let newSI : SousItemSave = si;
          si.etat = si.etat == 'A' ? "Actif" : si.etat == 'EA' ? 'En attente' : si.etat == 'HS' ? 'Hors Service' : 'Non défini';
          this.SIHistory.push(newSI);
        }
      }
    }).catch((e) => {
    })
  }

  /**
   * Consultation de description depuis l'historique
   * @param bool 
   */
  public setdescriptionFromHistory(bool :boolean) {
    this.descriptionFromHistory = bool;
  }

  /**
   * Recupères les description d'un objet sur un historique
   * @param id : Identifiant de l'objet 
   * @param date : Date de la modification
   */
  public setDescriptionHistory(id : string, date : string) {
    if(this.objectTypeNow == typeObjet.OR) {
      let res = this.ORHistory.find(element => element.idObjetRepere === id && element.date === date);
      if(res !== undefined){
        this.descriptionHistory = res.description;
      }      
    } else if (this.objectTypeNow == typeObjet.Item) {
      let res = this.ItemHistory.find(element => element.idItem === id && element.date === date);
      if(res !== undefined){
        this.descriptionHistory = res.description;
      } 
    } else if (this.objectTypeNow == typeObjet.SI) {
      let res = this.SIHistory.find(element => element.idSousItem === id && element.date === date);
      if(res !== undefined){
        this.descriptionHistory = res.description;
      } 
    }
  }

  

}



