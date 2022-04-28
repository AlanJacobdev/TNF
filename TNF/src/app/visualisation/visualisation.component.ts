import { Component, OnInit } from '@angular/core';
import { AtelierInfo } from 'src/structureData/Atelier';
import { ItemAffichage, ItemInfo, ItemSave, typeObjet } from 'src/structureData/Item';
import { ObjetRepereAffichage, ObjetRepereInfo, ObjetRepereSave } from 'src/structureData/ObjetRepere';
import { SousItemAffichage, SousItemInfo, SousItemSave } from 'src/structureData/SousItem';
import { FetchVisuService } from './service/fetch-visu.service';
import { faHistory, faCalendar, faUser, faClock, faEye } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
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
  public descriptionFromHistory : boolean = false;
  public Ornow : ObjetRepereAffichage = {
    idObjetRepere: '',
    libelleObjetRepere: '',
    valide: "",
    profilCreation: '',
    dateCreation: '',
    profilModification: '',
    dateModification: '',
    description: []
  };

  public ItemNow : ItemAffichage = {
    idItem: '',
    libelleItem: '',
    actif: '',
    profilCreation: '',
    dateCreation: '',
    profilModification: '',
    dateModification: '',
    description: []
  }
  
  public SousItemNow : SousItemAffichage = {
    idSousItem: '',
    libelleSousItem: '',
    actif: '',
    profilCreation: '',
    dateCreation: '',
    profilModification: '',
    dateModification: '',
    description: ''
  }

  constructor(private fetchVisuService : FetchVisuService, private cookieService : CookieService) { 
    this.fetchVisuService.getAllAteliers().then((list: AtelierInfo[]) => {
      this.listeAtelier = list
      console.log(this.listeAtelier)
    }).catch((e) => {
    })
  }


  ngOnInit(): void {
  }

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

  public selectOR(idOr : string) {
    this.selectedOr = idOr;
    this.objectTypeNow = this.TypeObjet.OR;
    let res = this.listeObjetRepere.find(element => element.idObjetRepere === idOr);
    if ( res != undefined){
      this.Ornow.idObjetRepere = res.idObjetRepere ;
      this.Ornow.libelleObjetRepere = res.libelleObjetRepere ;
      this.Ornow.profilCreation = res.profilCreation ;
      const datec = new Date(res.dateCreation).toISOString().split('T')[0] + " " + new Date(res.dateCreation).toTimeString().split(' ')[0]
      this.Ornow.dateCreation = datec ; 
      this.Ornow.profilModification = (res.profilModification) ? res.profilModification : "Inconnu" ;
      const datem = new Date(res.dateModification).toISOString().split('T')[0] + " " + new Date(res.dateModification).toTimeString().split(' ')[0]
      this.Ornow.dateModification = (res.dateModification != null) ? datem : "Inconnue"; 
      this.Ornow.description = res.description ;
      this.Ornow.valide = (res.valide) ? "Oui" : "Non";

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
      console.log(this.listeItem)
    }).catch((e) => {
    })
  }

  public selectItem(idItem : string) {
    this.selectedItem = idItem;
    this.objectTypeNow = this.TypeObjet.Item;
    let res = this.listeItem.find(element => element.idItem === idItem);
    console.log(res);
    if ( res != undefined){
      this.ItemNow.idItem = res.idItem ;
      this.ItemNow.libelleItem = res.libelleItem ;
      this.ItemNow.profilCreation = res.profilCreation ;
      const datec = new Date(res.dateCreation).toISOString().split('T')[0] + " " + new Date(res.dateCreation).toTimeString().split(' ')[0]
      this.ItemNow.dateCreation = datec ; 
      this.ItemNow.profilModification = (res.profilModification) ? res.profilModification : "Inconnu" ;
      const datem = new Date(res.dateModification).toISOString().split('T')[0] + " " + new Date(res.dateModification).toTimeString().split(' ')[0]
      this.ItemNow.dateModification = (res.dateModification != null) ? datem : "Inconnue"; 
      this.ItemNow.description = res.description ;
      this.ItemNow.actif = (res.actif) ? "Oui" : "Non";

    }
    this.selectedNow = idItem;
    this.selectedSousItem = "";
    this.fetchVisuService.getSousItemByItem(idItem).then((list: SousItemInfo[]) => {
      if(list == undefined) {
        this.listeSousItem = [];
      } else {
        this.listeSousItem = list;
      }
      console.log(this.listeItem)
    }).catch((e) => {
    })
  }

  public selectSO(idSousItem : string) {
    this.selectedSousItem = idSousItem;
    this.objectTypeNow = this.TypeObjet.SI;
    let res = this.listeSousItem.find(element => element.idSousItem === idSousItem);
    console.log(res);
    if ( res != undefined){
      this.SousItemNow.idSousItem = res.idItem ;
      this.SousItemNow.libelleSousItem = res.libelleSousItem ;
      this.SousItemNow.profilCreation = res.profilCreation ;
      const datec = new Date(res.dateCreation).toISOString().split('T')[0] + " " + new Date(res.dateCreation).toTimeString().split(' ')[0]
      this.SousItemNow.dateCreation = datec ; 
      this.SousItemNow.profilModification = (res.profilModification) ? res.profilModification : "Inconnu" ;
      const datem = new Date(res.dateModification).toISOString().split('T')[0] + " " + new Date(res.dateModification).toTimeString().split(' ')[0]
      this.SousItemNow.dateModification = (res.dateModification != null) ? datem : "Inconnue"; 
      this.SousItemNow.description = res.description ;
      this.SousItemNow.actif = (res.actif) ? "Oui" : "Non";

    }
    this.selectedNow = idSousItem;
  }


  public getHistory(){
    if(this.objectTypeNow == typeObjet.OR) {
      this.getHistoryOR();
    } else if (this.objectTypeNow == typeObjet.Item) {
      this.getHistoryItem();
    } else if (this.objectTypeNow == typeObjet.SI) {
      this.getHistorySI();
    }
  }

  public getHistoryOR() {
    this.fetchVisuService.getHistoryObjetRepere(this.selectedNow).then((list: ObjetRepereSave[]) => {
      if(list == undefined) {
        this.ORHistory = [];
      } else {
        this.ORHistory = list;
      }
      console.log(this.listeItem)
    }).catch((e) => {
    })
  }
  
  public getHistoryItem() {
    this.fetchVisuService.getHistoryItem(this.selectedNow).then((list: ItemSave[]) => {
      if(list == undefined) {
        this.ItemHistory = [];
      } else {
        this.ItemHistory = list;
      }
      console.log(this.listeItem)
    }).catch((e) => {
    })
  }

  public getHistorySI() {
    this.fetchVisuService.getHistorySousItem(this.selectedNow).then((list: SousItemSave[]) => {
      if(list == undefined) {
        this.SIHistory = [];
      } else {
        this.SIHistory = list;
      }
      console.log(this.listeItem)
    }).catch((e) => {
    })
  }

  public setdescriptionFromHistory(bool :boolean) {
    this.descriptionFromHistory = bool;
  }


}



