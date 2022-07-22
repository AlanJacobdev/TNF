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
export class DemandeAdminComponent implements OnInit {

  
  public faMinus = faMinus
  public faCaretDown = faCaretDown
  public faCaretRight = faCaretRight
  public orArboSelect: boolean = false; 
  public CaretItem = new Map();
  public itemArboSelect: boolean = false; 
  public Loading: boolean = false;
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
    isDelete: false,
    etat: false,
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
  
  

  constructor(private fetchDemandeAdminService : FetchDemandeAdminService) { 
    this.getAllDemandeAdmin();
    this.getAllDemandeAdminTraitee();
    if(history.state.id != undefined) {
      this.selectedDemande = history.state.id; 
      this.selectDemande(this.selectedDemande);
    }
    
  }

  ngOnInit(): void {
    if(history.state.id != undefined) {
      this.selectedDemande = history.state.id; 
      this.selectDemande(this.selectedDemande);
    }
  }

  ngAfterViewInit(): void {
      this.demandes.changes.subscribe(() => this.scrollToDemande());
  }


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

  getAllObjetFromDemandeAdmin(idDmd: number){
    this.fetchDemandeAdminService.getAllObjetFromDemandeAdmin(idDmd).then((res: DemandeAdminInfo) => {
      if (res != undefined) {
        this.resetDescriptifNow();
        this.DescriptifDemandeNow = res;
        console.log(this.DescriptifDemandeNow);
        
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

  getAllObjetFromDemandeAdminTraitee(idDmd: number){
    this.fetchDemandeAdminService.getAllObjetFromDemandeAdminTraitee(idDmd).then((res: DemandeAdminTraiteeInfo) => {
      if (res != undefined) {
        this.resetDescriptifTraiteeNow();
        this.DescriptifDemandeTraiteeNow = res;
        console.log(this.DescriptifDemandeTraiteeNow);
        
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

  resetArbo(){
    setTimeout(() => 
    {
      this.resetArboItem();
      this.resetArboOr();
    },
    1000);
 
  }
  
  selectDemande(idDemande: number) {
    this.selectedDemande = idDemande;
    this.getAllObjetFromDemandeAdmin(idDemande);
  }
  selectDemandeTraitee(idDemandeTraitee: number){
    this.selectedDemandeTraitee = idDemandeTraitee;
    this.getAllObjetFromDemandeAdminTraitee(idDemandeTraitee);
  }


  selectOrArbo(){
    this.orArboSelect = !this.orArboSelect;
  }

  selectItemArbo(){
    this.itemArboSelect = !this.itemArboSelect;
  }

  selectItemInOrArbo(idItem : string ) {
    let value = this.CaretItem.get(idItem)
    if (value != undefined){
      this.CaretItem.set(idItem, !value)
    }
  }


  selectTableDemande(type : typeTableauDemande){
    this.DemandeType = type;
    this.resetDescriptifNow();
  }

  public selectObject (object : typeObjet) {
    this.objectType = object;
    
  }

  public selectObjetOnDemand(idObjet : string ) {
    this.objectSelect = idObjet;
    console.log(this.objectType);

    if ( this.objectType == this.objectTypeNow.OR){
      this.getArborescenceOfOR(idObjet);
    } else if ( this.objectType == this.objectTypeNow.Item) {
      this.getArborescenceOfItem(idObjet);
    }
  }

  public selectObjetOnDemandTraitee (idObjet : string ) {
    this.objectTraiteSelect = idObjet;
    if ( this.objectType == this.objectTypeNow.OR){
      this.getArborescenceOfORTraite(idObjet);
    } else if ( this.objectType == this.objectTypeNow.Item) {
      this.getArborescenceOfItemTraite(idObjet);
    }


  }

  async acceptDeleteAdmin(){
    if(!this.DescriptifDemandeNow.etat){
      this.fetchDemandeAdminService.updateDemandeAdmin(this.DescriptifDemandeNow.idDemande, true).then( async (res:DemandeAdminInfo) => {
        console.log(res);
        if (typeof res == 'string'){
          this.manageToast("Demande de suppression", "Problème lié à la suppression", "red")
        } else {
          
          await this.getAllDemandeAdmin();
          await this.getAllDemandeAdminTraitee();
          this.resetDescriptifNow();
          this.manageToast("Demande de suppression", "La suppression a été effectuée", "#006400")
        }
        
      }).catch ((e) => {

      })
    } else {
      this.manageToast("Demande de suppression", "Impossible d'accepter une demande déjà traitée", "red")
    }
  }
  
  
  async refuseDeleteAdmin(){
    if(!this.DescriptifDemandeNow.etat){
      this.fetchDemandeAdminService.updateDemandeAdmin(this.DescriptifDemandeNow.idDemande, false).then( async (res:DemandeAdminInfo) => {
        console.log(res);
        if (typeof res == 'string'){
          this.manageToast("Demande de suppression", "Problème lié à la suppression", "red")
        } else {
          await this.getAllDemandeAdmin();
          this.resetDescriptifNow();
          this.manageToast("Demande de suppression", "La suppression a été effectuée", "#006400")
        }
      }).catch ((e) => {

      })
    } else {
      this.manageToast("Demande de suppression", "Impossible de refuser une demande déjà traitée", "red")
    }
  }

  getArborescenceOfOR (idOR : string) {
    this.Loading = true;
    this.fetchDemandeAdminService.getArborescenceOfOR(idOR).then((list: ArborescenceOR) => {
      if (list != undefined) {
        this.arborescenceOR = list
        console.log(this.arborescenceOR);
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

  getArborescenceOfORTraite (idOR : string) {
    this.Loading = true;
    this.fetchDemandeAdminService.getArborescenceOfORTraite(idOR).then((list: ArborescenceOR) => {
      if (list != undefined) {
        this.arborescenceOR = list
        console.log(this.arborescenceOR);
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


  getArborescenceOfItem(idItem : string) {
    this.Loading = true;
    this.fetchDemandeAdminService.getArborescenceOfItem(idItem).then((list: ArborescenceItem) => {
      if (list != undefined) {
        this.arborescenceItem = list
        console.log(this.arborescenceItem);
        
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


  getArborescenceOfItemTraite(idItem : string){
    this.Loading = true;
    this.fetchDemandeAdminService.getArborescenceOfItemTraite(idItem).then((list: ArborescenceItem) => {
      if (list != undefined) {
        this.arborescenceItem = list
        console.log(this.arborescenceItem);
        
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

  resetArboOr(){
    this.arborescenceOR = {
      OR: {
        idObjetRepere : '',
        libelleObjetRepere  : ''
      },
      Item: []
    }
  }

  resetArboItem(){
    this.arborescenceItem = {
      Item: {
        idItem: '',
        libelle: ''
      },
      SI: []
    }
  }

  resetDescriptifNow(){
    this.DescriptifDemandeNow = {
      idDemande: -1,
      motif: '',
      etat: false,
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

  scrollToDemande(){

    let id = this.selectedDemande.toString()
    const element = document.getElementById(id);
    if (element != null){
      element.scrollIntoView({block: 'center'});
    }
    
  }

}
