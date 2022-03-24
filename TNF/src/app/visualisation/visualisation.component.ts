import { Component, OnInit } from '@angular/core';
import { AtelierInfo } from 'src/structureData/Atelier';
import { ItemInfo } from 'src/structureData/Item';
import { ObjetRepereInfo } from 'src/structureData/objetRepere';
import { SousItemInfo } from 'src/structureData/SousItem';
import { FetchVisuService } from './service/fetch-visu.service';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
export class VisualisationComponent implements OnInit {
  
  public listeAtelier: AtelierInfo[] = [];
  public listeObjetRepere : ObjetRepereInfo[] = [];
  public listeItem : ItemInfo[] = [];
  public listeSousItem : SousItemInfo[] = [];

  public selectedOr: string = "";
  public selectedItem: string = "";
  public selectedSousItem: string = "";
  public selectedNow : string = "";

  constructor(private fetchVisuService : FetchVisuService) { 
    this.fetchVisuService.getAllAteliers().then((list: AtelierInfo[]) => {
      this.listeAtelier = list
      console.log(this.listeAtelier)
    }).catch((e) => {
    })
  }


  ngOnInit(): void {
  }

  public selectAtelier(Atelier: any ) {
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
      console.log(this.listeObjetRepere)
    }).catch((e) => {
    })
  }

  public selectOR(idOr : string) {
    this.selectedOr = idOr;
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
    this.selectedNow = idSousItem;
    // for (const so of this.listeSousItem){
    //   if ( so.)
    // }
  }
  
}
