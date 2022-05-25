import { Component, OnInit } from '@angular/core';
import { Atelier, AtelierInfo } from 'src/structureData/Atelier';
import { FetchAtelierService } from './service/fetch-atelier.service';

@Component({
  selector: 'app-gestion-ateliers',
  templateUrl: './gestion-ateliers.component.html',
  styleUrls: ['./gestion-ateliers.component.css']
})
export class GestionAteliersComponent implements OnInit {

  public listeAtelier : AtelierInfo[] = [];
  public searchText : string = "";
  public atelierSelected : string = "";
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

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
      console.log(this.listeAtelier);
      
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


  selectAtelier(idAtelier : string) {

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

}
