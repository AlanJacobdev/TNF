import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ArborescenceItem, ArborescenceOR, DemandeAdmin, DemandeAdminInfo , DemandeAdminTraiteeInfo, typeTableauDemande } from 'src/structureData/DemandeAdmin';
import { typeObjet } from 'src/structureData/Item';
import { FetchDemandeAdminService } from './service/fetch-demande-admin.service';
import { faInfoCircle, faEye, faCaretDown, faCaretRight, faMinus} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-demande-admin',
  templateUrl: './demande-admin.component.html',
  styleUrls: ['./demande-admin.component.css']
})

/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class DemandeAdminComponent implements OnInit {

  
  public faMinus = faMinus
  public faCaretDown = faCaretDown
  public faCaretRight = faCaretRight
  public orArboSelect: boolean = false; 
  public CaretItem = new Map();
  public itemArboSelect: boolean = false; 
  public Loading: boolean = false;
  public recopieEnCours : boolean = false;
  public faEye = faEye
  public faCircleInfo = faInfoCircle
  public listeDemandeAdmin : DemandeAdmin[] = []
  public listeDemandeAdminTraitee : DemandeAdmin[] = []
  public arborescenceOR : ArborescenceOR = {
    OR: {
      idObjetRepere : '',
      libelleObjetRepere  : ''
    },
    Item: []
  }
  public arborescenceItem : ArborescenceItem = {
    Item: {
      idItem: '',
      libelle: ''
    },
    SI: []
  }
  
  public searchText : string = "";
  public selectedDemande : number = -1;
  public selectedDemandeTraitee : number = -1;
  public DemandeType: typeTableauDemande = typeTableauDemande.A;
  public DemandeTypeNow = typeTableauDemande;
  public objectType: typeObjet = typeObjet.Aucun;
  public objectTypeNow = typeObjet;
  
  public objectSelect : string ="";
  public objectTraiteSelect : string ="";
  
  public DescriptifDemandeNow : DemandeAdminInfo = {
    idDemande: -1,
    motif: '',
    profilCreation: '',
    dateCreation: new Date(0),
    profilModification: '',
    dateModification: new Date(0),
    itemDelete: [],
    sousItemDelete: [],
    orDelete: []
  } ;
 
  public DescriptifDemandeTraiteeNow : DemandeAdminTraiteeInfo = {
    idDemandeTraitee: -1,
    motif: '',
    isDelete: false,
    profilCreation: '',
    dateCreation: new Date(0),
    profilModification: '',
    dateModification: new Date(0),
    itemDelete: [],
    sousItemDelete: [],
    orDelete: []
  } ;

  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";
  @ViewChildren("demandes")
  private demandes!: QueryList<ElementRef>;
  
  
  /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private fetchDemandeAdminService : FetchDemandeAdminService) { 
    this.getAllDemandeAdmin();
    this.getAllDemandeAdminTraitee();
    if(history.state.id != undefined) {
      this.selectedDemande = history.state.id; 
      this.selectDemande(this.selectedDemande);
    }
    
  }

  
   /**
    * Méthode appellée à l'initialisation du composant
    */
  ngOnInit(): void {
    if(history.state.id != undefined) {
      this.selectedDemande = history.state.id; 
      this.selectDemande(this.selectedDemande);
    }
  }

   /**
    * Méthode appellée à l'initialisation du composant
    */
  ngAfterViewInit(): void {
      this.demandes.changes.subscribe(() => this.scrollToDemande());
  }


  /**
   * Recupère l'ensemble des demandes de suppression en attente
   */
  async getAllDemandeAdmin(){
    this.fetchDemandeAdminService.getAllDemandeAdmin().then((list: DemandeAdmin[]) => {
      if (list != undefined) {
        this.listeDemandeAdmin = list
        
      } else {
        console.log("Demande Admin : aucune ")
        this.listeDemandeAdmin.splice(0);
      }
    }).catch((e) => {
    })
  }


  /**
   * Recupère l'ensemble des demandes de suppression traitée
   */
  async getAllDemandeAdminTraitee(){
    this.fetchDemandeAdminService.getAllDemandeAdminTraitee().then((list: DemandeAdmin[]) => {
      if (list != undefined) {
        this.listeDemandeAdminTraitee = list
        
      } else {
        console.log("Demande Admin : aucune ")
        this.listeDemandeAdminTraitee.splice(0);
      }
    }).catch((e) => {
    })
  }

  /**
   * Recupère les objets d'une demande de suppression 
   * @param idDmd : Identifiant de la demande de suppression
   */
  getAllObjetFromDemandeAdmin(idDmd: number){
    this.fetchDemandeAdminService.getAllObjetFromDemandeAdmin(idDmd).then((res: DemandeAdminInfo) => {
      if (res != undefined) {
        this.resetDescriptifNow();
        this.DescriptifDemandeNow = res;
        
        if (this.DescriptifDemandeNow.orDelete.length != 0 ){
          this.selectObject(this.objectTypeNow.OR);
        } else if (this.DescriptifDemandeNow.itemDelete.length != 0 ){
          this.selectObject(this.objectTypeNow.Item);
        } else {
          this.selectObject(this.objectTypeNow.SI);
        }     
        

      } else {
        this.resetDescriptifNow();
        this.manageToast("Erreur de récupération", "La demande n'existe pas", "red")
      }
    }).catch((e) => {
    })
  }

  /**
   * Recupère l'ensemble des demandes de suppression traitées
   * @param idDmd 
   */
  getAllObjetFromDemandeAdminTraitee(idDmd: number){
    this.fetchDemandeAdminService.getAllObjetFromDemandeAdminTraitee(idDmd).then((res: DemandeAdminTraiteeInfo) => {
      if (res != undefined) {
        this.resetDescriptifTraiteeNow();
        this.DescriptifDemandeTraiteeNow = res;
        
        if (this.DescriptifDemandeTraiteeNow.orDelete.length != 0 ){
          this.selectObject(this.objectTypeNow.OR);
        } else if (this.DescriptifDemandeTraiteeNow.itemDelete.length != 0 ){
          this.selectObject(this.objectTypeNow.Item);
        } else {
          this.selectObject(this.objectTypeNow.SI);
        }     
        

      } else {
        this.resetDescriptifTraiteeNow();
        this.manageToast("Erreur de récupération", "La demande n'existe pas", "red")
      }
    }).catch((e) => {
    })
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
   * Fermeture du toast
   */
  closeToast(){
    this.ToastAffiche = false;
  }

  /**
   * Remet à 0 l'arborescence (vide les listes)
   */
  resetArbo(){
    setTimeout(() => 
    {
      this.resetArboItem();
      this.resetArboOr();
    },
    1000);
 
  }
  
  /**
   * Sélection d'une demande de suppression en attente
   * @param idDemande : Identifiant de la demande de suppression en attente 
   */
  selectDemande(idDemande: number) {
    this.selectedDemande = idDemande;
    this.getAllObjetFromDemandeAdmin(idDemande);
  }

  /**
   * Sélection d'une demande de suppression traitée
   * @param idDemande : Identifiant de la demande de suppression traitée
   */
  selectDemandeTraitee(idDemandeTraitee: number){
    this.selectedDemandeTraitee = idDemandeTraitee;
    this.getAllObjetFromDemandeAdminTraitee(idDemandeTraitee);
  }


  /**
   * Selection de l'arborescence d'un objet repère (ou fermeture de l'arborescence)
   */
  selectOrArbo(){
    this.orArboSelect = !this.orArboSelect;
  }

  /**
   * Selection de l'arborescence d'un item (ou fermeture de l'arborescence)
   */
  selectItemArbo(){
    this.itemArboSelect = !this.itemArboSelect;
  }

  /**
   * Sélection d'un item sur l'arborescence d'un objet repère (depli ou non ses sous items)
   * @param idItem 
   */
  selectItemInOrArbo(idItem : string ) {
    let value = this.CaretItem.get(idItem)
    if (value != undefined){
      this.CaretItem.set(idItem, !value)
    }
  }

  /**
   * Sélectionne le type de demande (traitée ou en attente)
   * @param type : Valeur issue de l'enum DemandeTypeNow
   */
  selectTableDemande(type : typeTableauDemande){
    this.DemandeType = type;
    this.resetDescriptifNow();
  }

  /**
   * Sélectionne le type d'objet (Objet repère, item, sous item)
   * @param object : Valeur issue de 'enum objectTypeNow
   */
  public selectObject (object : typeObjet) {
    this.objectType = object;
  }

  /**
   * Sélection d'un objet repère dans le tableau d'une demande de suppression en attente
   * @param idObjet : Identifiant de l'objet 
   */
  public selectObjetOnDemand(idObjet : string ) {
    this.objectSelect = idObjet;

    if ( this.objectType == this.objectTypeNow.OR){
      this.getArborescenceOfOR(idObjet);
    } else if ( this.objectType == this.objectTypeNow.Item) {
      this.getArborescenceOfItem(idObjet);
    }
  }

    /**
   * Sélection d'un objet repère dans le tableau d'une demande de suppression traitée
   * @param idObjet : Identifiant de l'objet 
   */
  public selectObjetOnDemandTraitee (idObjet : string ) {
    this.objectTraiteSelect = idObjet;
    if ( this.objectType == this.objectTypeNow.OR){
      this.getArborescenceOfORTraite(idObjet);
    } else if ( this.objectType == this.objectTypeNow.Item) {
      this.getArborescenceOfItemTraite(idObjet);
    }


  }

  /**
   * Accepte la demande de suppression
   */
  async acceptDeleteAdmin(){
    this.recopieEnCours = true;
      this.fetchDemandeAdminService.updateDemandeAdmin(this.DescriptifDemandeNow.idDemande, true).then( async (res:DemandeAdminInfo) => {
        if (typeof res == 'string'){
          this.manageToast("Demande de suppression", "Problème lié à la suppression", "red")
        } else {
          
          await this.getAllDemandeAdmin();
          await this.getAllDemandeAdminTraitee();
          this.resetDescriptifNow();
          this.manageToast("Demande de suppression", "La suppression a été effectuée", "#006400")
          this.fetchDemandeAdminService.refreshDemande();
        }
        this.recopieEnCours = false;
        
      }).catch ((e) => {
        this.recopieEnCours = false;
      })
  }
  
  /**
   * Refuse la demande de suppression
   */
  async refuseDeleteAdmin(){
    this.recopieEnCours = true;
      this.fetchDemandeAdminService.updateDemandeAdmin(this.DescriptifDemandeNow.idDemande, false).then( async (res:DemandeAdminInfo) => {
        if (typeof res == 'string'){
          this.manageToast("Demande de suppression", "Problème lié à la suppression", "red")
        } else {
          await this.getAllDemandeAdmin();
          await this.getAllDemandeAdminTraitee();
          this.resetDescriptifNow();
          this.manageToast("Demande de suppression", "La suppression a été effectuée", "#006400")
          this.fetchDemandeAdminService.refreshDemande();
        }
        this.recopieEnCours = false;
      }).catch ((e) => {
        this.recopieEnCours = false;
      })
  }

  /**
   * Recupère l'arborescence d'un objet repère dans une demande en attente
   * @param idOR : Identifiant de l'objet repère
   */
  getArborescenceOfOR (idOR : string) {
    this.Loading = true;
    this.fetchDemandeAdminService.getArborescenceOfOR(idOR).then((list: ArborescenceOR) => {
      if (list != undefined) {
        this.arborescenceOR = list
        for( const item of this.arborescenceOR.Item){
          this.CaretItem.set(item.Item.idItem ,false)
        }
      } else {
        console.log("Problème")
        this.resetArboOr();
      }
    }).catch((e) => {
    })
    setTimeout(() => 
    {
      this.Loading = false;
    },
    500);
    
  }

    /**
   * Recupère l'arborescence d'un objet repère dans une demande traitée
   * @param idOR : Identifiant de l'objet repère
   */
  getArborescenceOfORTraite (idOR : string) {
    this.Loading = true;
    
    let date = new Date(this.DescriptifDemandeTraiteeNow.dateModification);
    this.fetchDemandeAdminService.getArborescenceOfORTraite(idOR, date).then((list: ArborescenceOR) => {
      if (list != undefined) {
        this.arborescenceOR = list
        for( const item of this.arborescenceOR.Item){
          this.CaretItem.set(item.Item.idItem ,false)
        }
      } else {
        console.log("Problème")
        this.resetArboOr();
      }
    }).catch((e) => {
    })
    setTimeout(() => 
    {
      this.Loading = false;
    },
    500);
    
  }


    /**
   * Recupère l'arborescence d'un item dans une demande en attente
   * @param idOR : Identifiant de l'item
   */
  getArborescenceOfItem(idItem : string) {
    this.Loading = true;
    this.fetchDemandeAdminService.getArborescenceOfItem(idItem).then((list: ArborescenceItem) => {
      if (list != undefined) {
        this.arborescenceItem = list
        
      } else {
        this.resetArboItem();
      }
    }).catch((e) => {
    })
    setTimeout(() => 
    {
      this.Loading = false;
    },
    500);
  }

  /**
   * Recupère l'arborescence d'un item dans une demande traitée
   * @param idOR : Identifiant de l'item
   */
  getArborescenceOfItemTraite(idItem : string){
    this.Loading = true;
    let date = new Date(this.DescriptifDemandeTraiteeNow.dateModification);
    this.fetchDemandeAdminService.getArborescenceOfItemTraite(idItem, date).then((list: ArborescenceItem) => {
      if (list != undefined) {
        this.arborescenceItem = list
        
      } else {
        this.resetArboItem();
      }
    }).catch((e) => {
    })
    setTimeout(() => 
    {
      this.Loading = false;
    },
    500);
  }

  /**
   * Vide les listes de l'arborescence d'objet repère
   */
  resetArboOr(){
    this.arborescenceOR = {
      OR: {
        idObjetRepere : '',
        libelleObjetRepere  : ''
      },
      Item: []
    }
  }

    /**
   * Vide les listes de l'arborescence d'item
   */
  resetArboItem(){
    this.arborescenceItem = {
      Item: {
        idItem: '',
        libelle: ''
      },
      SI: []
    }
  }

  /**
   * Rafraichit le descriptif d'une demande en attente 
   */
  resetDescriptifNow(){
    this.DescriptifDemandeNow = {
      idDemande: -1,
      motif: '',
      profilCreation: '',
      dateCreation: new Date(0),
      profilModification: '',
      dateModification: new Date(0),
      itemDelete: [],
      sousItemDelete: [],
      orDelete: []
    };
  }

  /**
  * Rafraichit le descriptif d'une demande traitée
  */
  resetDescriptifTraiteeNow(){
    this.DescriptifDemandeTraiteeNow = {
      idDemandeTraitee: -1,
      motif: '',
      isDelete: false,
      profilCreation: '',
      dateCreation: new Date(0),
      profilModification: '',
      dateModification: new Date(0),
      itemDelete: [],
      sousItemDelete: [],
      orDelete: []
    };
  }

  /**
   * Scroll dans la table jusqu'a la demande sélectionnée
   * Utiliser lorsqu'on utilise le lien sur la page d'accueil
   */
  scrollToDemande(){

    let id = this.selectedDemande.toString()
    const element = document.getElementById(id);
    if (element != null){
      element.scrollIntoView({block: 'center'});
    }
    
  }

}
