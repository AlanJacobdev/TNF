import { Component, OnInit } from '@angular/core';
import { DemandeAdmin, DemandeAdminInfo, typeTableauDemande } from 'src/structureData/DemandeAdmin';
import { typeObjet } from 'src/structureData/Item';
import { FetchDemandeAdminService } from './service/fetch-demande-admin.service';
import { faInfoCircle} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-demande-admin',
  templateUrl: './demande-admin.component.html',
  styleUrls: ['./demande-admin.component.css']
})
export class DemandeAdminComponent implements OnInit {

  public faCircleInfo = faInfoCircle
  public listeDemandeAdmin : DemandeAdmin[] = []
  public listeDemandeAdminTraitee : DemandeAdmin[] = []
  public searchText : string = "";
  public selectedDemande : number = -1;
  public DemandeType: typeTableauDemande = typeTableauDemande.A;
  public DemandeTypeNow = typeTableauDemande;
  public objectType: typeObjet = typeObjet.Aucun;
  public objectTypeNow = typeObjet;
  
  
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
 
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

  constructor(private fetchDemandeAdminService : FetchDemandeAdminService) { 
    this.getAllDemandeAdmin();
    this.getAllDemandeAdminTraitee();
  }

  ngOnInit(): void {
  }


  async getAllDemandeAdmin(){
    this.fetchDemandeAdminService.getAllDemandeAdmin().then((list: DemandeAdmin[]) => {
      if (list != undefined) {
        this.listeDemandeAdmin = list
        console.log(this.listeDemandeAdmin);
        
      } else {
        console.log("Demande Admin : aucune ")
        this.listeDemandeAdmin.splice(0);
      }
    }).catch((e) => {
    })
  }


  getAllDemandeAdminTraitee(){
    this.fetchDemandeAdminService.getAllDemandeAdminTraitee().then((list: DemandeAdmin[]) => {
      if (list != undefined) {
        this.listeDemandeAdminTraitee = list
        console.log(this.listeDemandeAdmin);
        
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
        this.DescriptifDemandeNow = {
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
        };
        this.DescriptifDemandeNow = res;
        if (this.DescriptifDemandeNow.orDelete.length != 0 ){
          this.selectObject(this.objectTypeNow.OR);
        } else if (this.DescriptifDemandeNow.itemDelete.length != 0 ){
          this.selectObject(this.objectTypeNow.Item);
        } else {
          this.selectObject(this.objectTypeNow.SI);
        }     
        console.log(this.DescriptifDemandeNow)
      } else {
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

  selectDemande(idDemande: number) {
    this.selectedDemande = idDemande;
    this.getAllObjetFromDemandeAdmin(idDemande);
  }

  selectTableDemande(type : typeTableauDemande){
    this.DemandeType = type;
  }

  public selectObject (object : typeObjet) {
    this.objectType = object;
  }

  async acceptDeleteAdmin(){
    if(!this.DescriptifDemandeNow.etat){
      this.fetchDemandeAdminService.updateDemandeAdmin(this.DescriptifDemandeNow.idDemande, true).then( async (res:DemandeAdminInfo) => {
        console.log(res);
        if (typeof res == 'string'){
          this.manageToast("Demande de suppression", "Problème lié à la suppression", "red")
        } else {
          await this.getAllDemandeAdmin();
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
          this.manageToast("Demande de suppression", "La suppression a été effectuée", "#006400")
        }
      }).catch ((e) => {

      })
    } else {
      this.manageToast("Demande de suppression", "Impossible de refuser une demande déjà traitée", "red")
    }
  }
}
