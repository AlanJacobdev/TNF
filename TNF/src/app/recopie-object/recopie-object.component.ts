import { Component, OnInit } from '@angular/core';
import { elementAt } from 'rxjs';
import { AtelierInfo } from 'src/structureData/Atelier';
import { ItemInfo, ItemRecopie } from 'src/structureData/Item';
import { ObjetRepereInfo, ObjetRepereUtile } from 'src/structureData/ObjetRepere';
import { modificationTypeObject, TypeObjet, TypeObjetInfo } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchRecopieService } from './service/fetch-recopie.service';

@Component({
  selector: 'app-recopie-object',
  templateUrl: './recopie-object.component.html',
  styleUrls: ['./recopie-object.component.css']
})
export class RecopieObjectComponent implements OnInit {

  public listeAtelier: AtelierInfo[] = [];
  public listeObjetRepere : ObjetRepereInfo[] = [];
  public listeItem : ItemRecopie[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public listeTypeOOfOR: modificationTypeObject[] = [];
  public searchText : string = "";
  public selectedOr: string = "";
  public typeNow: string = "";
  public checkAll : boolean = false;
  public atelier : string = "";
  public atelierCible : string = "";
  public nuCible : string = "";
  public ORCible : string = "";
  public ORCibleExist : number = -1;

  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

  public recopieEnCours : boolean = false;

  constructor(private fetchRecopieService : FetchRecopieService, private fetchVisuService : FetchVisuService, private fetchCreateTypeObject : FetchcreateTypeObjectService) { 
    this.getListObject();
    this.getListAtelier();
  }

  ngOnInit(): void {
  }

  getListObject(){
    this.fetchCreateTypeObject.getTypeObjet().then((list: TypeObjetInfo[]) => {
      this.listeTypeO = list
    }).catch((e) => {
    })
  }

  getListAtelier(){
    this.fetchVisuService.getAllAteliers().then((list: AtelierInfo[]) => {
      this.listeAtelier = list
    }).catch((e) => {
    })
  }
  
  getListTypeObject(){
    this.fetchRecopieService.getTypeOfItemsOfOR(this.selectedOr).then((list: TypeObjet[]) => {
      this.listeTypeOOfOR.splice(0);
      list.forEach((e : TypeObjet) => {
        const libelle = this.listeTypeO.find(element => element.idType === e.idtypeobjet);
        if (libelle != undefined) {
          let item : modificationTypeObject = {
            idTypeObjet: e.idtypeobjet,
            libelleTypeObjet: libelle.libelleType,
            actif : true
          };
          this.listeTypeOOfOR.push(item)
        }
      })
    }).catch((e) => {
    })
  }
 

  public selectAtelier(Atelier: any ) {
    this.selectedOr = "";
    let value = Atelier.target.value; 
    this.atelier = value;
    this.selectAtelierCible(Atelier);
    if (value == '') {
      this.listeObjetRepere.splice(0);
    } else {
      this.fetchVisuService.getObjetRepereByAteliers(value).then((list: ObjetRepereInfo[]) => {
        if(list == undefined) {
          this.listeObjetRepere.splice(0);
        } else {
          this.listeObjetRepere = list;
        }
      }).catch((e) => {
      })
    }
  }

  public selectOR(idOr : string) {
    this.selectedOr = idOr;
    this.listeItem.splice(0);
    this.ORCibleExist = -1
    if(this.atelierCible != '' && this.nuCible.length == 3){
      this.getORByNU();
    }
    this.checkAll = false;
    this.fetchVisuService.getItemByObjetRepere(idOr).then((list: ItemRecopie[]) => {
      if(list == undefined) {
        this.listeItem = [];
      } else {
        this.getListTypeObject();
        list.forEach((e : ItemRecopie) => {
          let item : ItemRecopie = {
            idItem: e.idItem,
            libelleItem: e.libelleItem,
            idOR: e.idOR,
            codeObjet: e.codeObjet,
            etat: e.etat,
            isPaste: false
          };
          this.listeItem.push(item)
        })    
      }
    }).catch((e) => {
    })
  }

  public selectType(Type: any ) {
    this.typeNow = Type.target.value;
    this.verifyCheckAll();
  }

  verifyCheckAll(){
    let allCheckByType = true;
    for (const item of this.listeItem) {
      if (item.codeObjet === this.typeNow || this.typeNow === "") {
        if(item.isPaste === false) {
          allCheckByType = false;
        }
      } 
    }
    if (allCheckByType) {
      this.checkAll = true;
    } else {
      this.checkAll = false;
    }
  }

  public checkItem(idItem : string) {
    let index = this.listeItem.findIndex((element) => element.idItem === idItem)
    this.listeItem[index].isPaste = !this.listeItem[index].isPaste;
    this.verifyCheckAll();
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

  closeToast(){
    this.ToastAffiche = false;
  }


  recopieItem(atelier : string, nu : string){
    
    let tabItem = this.listeItem.filter(element => element.isPaste === true);
    if (tabItem.length !== 0) {
      if(this.ORCibleExist == 1){
        this.recopieEnCours = true;
        this.fetchRecopieService.recopySpecificItemFromOR(tabItem,this.selectedOr, atelier+nu).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de recopie", res , "red")
            this.recopieEnCours = false;
          } else {  
            this.manageToast("Recopie", res.message, "#006400");
            this.recopieEnCours = false;
          }
        }).catch((e) => {
        })
      } else {
        this.manageToast("Erreur de recopie", "Objet rep??re cible inexistant" , "red")
      }
    } else {
      this.manageToast("Erreur de recopie", "Veuillez s??lectionner des items ?? recopier" , "red")
    }
  }

  public allSelect() {
    this.checkAll = !this.checkAll;
    for (const item of this.listeItem) {
      if (item.codeObjet === this.typeNow || this.typeNow === "") {
        item.isPaste = this.checkAll;
      } 
    }
  }

  public selectAtelierCible(Atelier: any ) {
    this.atelierCible = Atelier.target.value; 
    if(this.atelierCible != '' && this.nuCible.length == 3) {
      this.getORByNU();
    } else {
      this.ORCible = ""
      this.ORCibleExist = -1
    }
  }


  public selectNUCible (NU : any) {
    this.nuCible = NU.target.value;
    if(this.atelierCible != '' && this.nuCible.length == 3) {
      this.getORByNU();
    } else {
      this.ORCible = ""
      this.ORCibleExist = -1
    }
  }

  public getORByNU (){
    this.fetchRecopieService.getORByNU(this.atelierCible+this.nuCible).then((res: ObjetRepereUtile) => {
      if(typeof res == "undefined" ) {
        this.ORCible = "Aucun objet rep??re correspondant";
        this.ORCibleExist = 0;
      } else {  
        if(this.selectedOr.substring(0,2) != res.idObjetRepere.substring(0,2)){
          this.ORCible = "Impossible de recopier des items d'objets rep??res de types diff??rents";
          this.ORCibleExist = 0;
        } else {
          this.ORCible = res.idObjetRepere + " - " + res.libelleObjetRepere;
          this.ORCibleExist = 1;
        }

      }
    }).catch((e) => {
    })
  }
  
}
