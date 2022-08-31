import { Component, OnInit } from '@angular/core';
import { Atelier, AtelierInfo } from 'src/structureData/Atelier';
import { FetchAtelierService } from './service/fetch-atelier.service';
import { faXmark, faPen} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-gestion-ateliers',
  templateUrl: './gestion-ateliers.component.html',
  styleUrls: ['./gestion-ateliers.component.css']
})
export class GestionAteliersComponent implements OnInit {

  public faPen = faPen;
  public faXmark = faXmark;
  public listeAtelier : AtelierInfo[] = [];
  public searchText : string = "";
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";
  public formValidate : boolean = false;
  public changesNow : boolean = false;
  public atelierSelect : string ="";
  public libelleAtelier = "";

  constructor(private fetchGestionAtelier : FetchAtelierService) {
    this.getAllAteliers();

   }


  ngOnInit(): void {
  }

  getAllAteliers() {
    this.fetchGestionAtelier.getAllAteliers().then((list:AtelierInfo[] ) =>{
      if(list != undefined){
        this.listeAtelier = list;
      }else{
        console.log("Impossible de récupérer les ateliers");
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

  refreshValidationForm(){
    this.formValidate = false;
  }
  
  close(){
    this.changesNow = false;
    this.refreshValidationForm();
  }

  selectCreateType(){
    this.changesNow = true;
  }

  selectAtelier(idAtelier : string) {
    this.atelierSelect = idAtelier;
    const atelier= this.listeAtelier.find((element)=> element.idAtelier === idAtelier);
    if (atelier != undefined){
      this.libelleAtelier = atelier.libelleAtelier;
    }
  }

  selectCheckAtelier(idAtelier : string) {
    const targetAtelier = this.listeAtelier.find((element) => element.idAtelier === idAtelier)

    if ( targetAtelier != undefined) {  
      this.fetchGestionAtelier.updateActifAtelier(idAtelier, !targetAtelier.actif).then((res : Atelier) =>{
        if (res != undefined) {
          const targetAtelierIndex = this.listeAtelier.findIndex((element) => element.idAtelier === idAtelier);
          this.listeAtelier[targetAtelierIndex].actif = !this.listeAtelier[targetAtelierIndex].actif;
          this.manageToast("Changement d'état", res.actif ? "L'Atelier " + idAtelier + " est actif" : "L'Atelier " + idAtelier + " est inactif", "#006400" );
        } else {
          this.manageToast("Changement d'état", "Problème dû au changement d'état", "red" );
        }
      }).catch((e)=>{

      })
    }
  }


  async updateAtelier(identifiant : string, libelle : string) {
    
    if ( identifiant != '' && libelle != '') {
        this.fetchGestionAtelier.updateAtelier(identifiant,libelle).then((res: Atelier) => {
          if (res === undefined) {
            this.manageToast("Erreur de modification", "Identificateur inconnu", "red")
          } else {
            this.manageToast("Modification", "L'objet repère " + identifiant.toUpperCase() + " a été modifié", "#ff8c00")
            this.close();
            this.getAllAteliers();
            this.libelleAtelier = libelle;
          }
        }).catch((e) => {
        })
      
    } else {
      this.formValidate = true;
    }
  }

}
