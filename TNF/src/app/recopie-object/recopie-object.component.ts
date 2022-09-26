import { Component, OnInit } from '@angular/core';
import { AtelierInfo } from 'src/structureData/Atelier';
import {  ItemRecopie } from 'src/structureData/Item';
import { ObjetRepereInfo, ObjetRepereUtile } from 'src/structureData/ObjetRepere';
import { modificationTypeObject, TypeObjet, TypeObjetInfo } from 'src/structureData/TypeObject';
import { FetchCreateObjectService } from '../create-object/service/fetch-create-object.service';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { NavBarService } from '../navbar/service/nav-bar.service';
import { FetchVisuService } from '../visualisation/service/fetch-visu.service';
import { FetchRecopieService } from './service/fetch-recopie.service';

@Component({
  selector: 'app-recopie-object',
  templateUrl: './recopie-object.component.html',
  styleUrls: ['./recopie-object.component.css']
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
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
  public estAdmin : boolean = false;
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

  public recopieEnCours : boolean = false;

  /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private fetchRecopieService : FetchRecopieService, private fetchVisuService : FetchVisuService, private fetchCreateTypeObject : FetchcreateTypeObjectService,
    private fetchCreateObjectService :FetchCreateObjectService, private navbarService : NavBarService) { 
    this.getListObject();
    this.getListAtelier();

  }

      /**
  * Méthode appellée à l'initialisation du composant
  */
  ngOnInit(): void {
    this.estAdmin =this.navbarService.getEstAdmin();
  }

  /**
   * Recupère la liste des types d'objets 
   */
  getListObject(){
    this.fetchCreateTypeObject.getTypeObjet().then((list: TypeObjetInfo[]) => {
      this.listeTypeO = list
    }).catch((e) => {
    })
  }

  /**
   * Recupère les ateliers 
   */
  getListAtelier(){
    this.fetchVisuService.getAllAteliers().then((list: AtelierInfo[]) => {
      this.listeAtelier = list
    }).catch((e) => {
    })
  }
  
  /**
   * Recupère la liste des types d'objet (item) lié à un objet repère
   */
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
 

  /**
   * Sélection de l'atelier courant
   * @param Atelier : Identifiant de l'atelier
   */
  public selectAtelier(Atelier: any ) {
    this.selectedOr = "";
    this.listeItem.splice(0);
    this.listeTypeOOfOR.splice(0);
    let value = Atelier.target.value; 
    this.atelier = value;
    this.selectAtelierCible(Atelier);
    if (value == '') {
      this.listeObjetRepere.splice(0);
    } else {
      this.fetchCreateObjectService.getObjetRepereByAtelierForOneUser(value).then((list: ObjetRepereInfo[]) => {
        if(list == undefined) {
          this.listeObjetRepere.splice(0);
        } else {
          this.listeObjetRepere = list;
        }
      }).catch((e) => {
      })
    }
  }

  /**
   * Sélection de l'objet repère source
   * @param idOr : Identifiant de l'objet repère source 
   */
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

  /**
   * Filtre les items par le type sélectionné
   * @param Type : Identifiant du type d'objet sélectionné
   */
  public selectType(Type: any ) {
    this.typeNow = Type.target.value;
    this.verifyCheckAll();
  }

  /**
   * Vérifie que tout les items soient sélectionné 
   */
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

  /**
   * Sélectionne un item pour le recopier
   * @param idItem : Identifiant de l'item
   */
  public checkItem(idItem : string) {
    let index = this.listeItem.findIndex((element) => element.idItem === idItem)
    this.listeItem[index].isPaste = !this.listeItem[index].isPaste;
    this.verifyCheckAll();
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
   * Fermer le  toast
   */
  closeToast(){
    this.ToastAffiche = false;
  }


  /**
   * Recopie les items d'un objet repère source à un objet rapère cible
   * @param atelier : Identifiant de l'atelier courant
   * @param nu : Numéro unique cible
   */
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
        this.manageToast("Erreur de recopie", "Objet repère cible inexistant" , "red")
      }
    } else {
      this.manageToast("Erreur de recopie", "Veuillez sélectionner des items à recopier" , "red")
    }
  }

  /**
   * Sélectionne l'ensemble des items
   */
  public allSelect() {
    this.checkAll = !this.checkAll;
    for (const item of this.listeItem) {
      if (item.codeObjet === this.typeNow || this.typeNow === "") {
        item.isPaste = this.checkAll;
      } 
    }
  }

  /**
   * NON UTILISEE sauf administrateur
   * Sélectionne un atelier cible
   * @param Atelier : Identifiant de l'atelier cible
   */
  public selectAtelierCible(Atelier: any ) {
    this.atelierCible = Atelier.target.value; 
    if(this.atelierCible != '' && this.nuCible.length == 3) {
      this.getORByNU();
    } else {
      this.ORCible = ""
      this.ORCibleExist = -1
    }
  }


  /**
   * Selection du numéro unique cible
   * Modification à faire pour les doublons
   * @param NU 
   */
  public selectNUCible (NU : any) {
    this.nuCible = NU.target.value;
    if(this.atelierCible != '' && this.nuCible.length == 3) {
      this.getORByNU();
    } else {
      this.ORCible = ""
      this.ORCibleExist = -1
    }
  }

  /**
   * Recupère l'identifiatn et le libellé de l'objet repère correspondant au numéro unique
   * Si inexistant : erreur
   */
  public getORByNU (){
    this.fetchRecopieService.getORByNU(this.atelierCible+this.nuCible).then((res: ObjetRepereUtile) => {
      if(typeof res == "undefined" ) {
        this.ORCible = "Aucun objet repère correspondant";
        this.ORCibleExist = 0;
      } else {  
        if(this.selectedOr.substring(0,2) != res.idObjetRepere.substring(0,2)){
          this.ORCible = "Impossible de recopier des items d'objets repères de types différents";
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
