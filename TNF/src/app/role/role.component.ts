import { Component, OnInit } from '@angular/core';
import { faInfo, faPen, faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AtelierInfo } from 'src/structureData/Atelier';
import { roleInfo } from 'src/structureData/Role';
import { TypeObjetRepere, TypeObjetRepereInfo } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from '../create-type-object/service/fetchcreate-type-object.service';
import { FetchAtelierService } from '../gestion-ateliers/service/fetch-atelier.service';
import { FetchRoleService } from './service/fetch-role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {


  constructor(private fetchRoleService : FetchRoleService, private fetchGestionAtelier: FetchAtelierService, private fetchCreateTypeObject : FetchcreateTypeObjectService) { }

  public faInfo = faInfo;
  public faPen = faPen;
  public faTrashCan = faTrashCan;
  public faPlus = faPlus;
  public faXmark = faXmark;
  
  public listeTypeOR : TypeObjetRepereInfo[] = [];
  public listeAtelier : AtelierInfo[] = [];
  public listeRole : roleInfo[] = [];
  public listOfSelectedAtelier : string[]= [];
  public listOfSelectedTypeOR : string[]= [];
  public selectedRole : number = -1;
  public roleSelected : roleInfo = {
    idRole: 0,
    libelleRole: '',
    dateCreation: new Date(0),
    profilCreation: '',
    dateModification: new Date(0),
    profilModification: '',
    atelier: [],
    typeObjet: []
  };
  public changesNow : boolean = false;
  public suppresion: boolean = false;
  public read: boolean = false;
  public formValidate : boolean = false;
  public checkAllAtelier : boolean = false;
  public checkAllTypeOR : boolean = false;
  public libelle : string = "";

  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";

  ngOnInit(): void {
    this.getAllRole();
    this.getAllAteliers();
    this.getAllTypeOR();
  }


  getAllRole(){
    this.listeRole.splice(0)
    this.fetchRoleService.getInformations().then((list: roleInfo[]) => {
      if (list != undefined){
        this.listeRole = list;
      }
    }).catch((e) => {
    })
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


  getAllTypeOR(){
    this.listeTypeOR.splice(0);
    this.fetchCreateTypeObject.getTypeObjetRepere().then((list: TypeObjetRepereInfo[]) => {
      if(list != undefined){
        this.listeTypeOR = list;
      }else{
        console.log("Impossible de récupérer les types d'objets");
      }
    }).catch((e) => {
    })
  }


  selectRole(id :number){
    if(id != this.selectedRole){
      this.selectedRole = id;
      this.close()
      this.changesNow = false;
    }
  }

  selectCreateRole() {
    this.selectedRole = -1;
    this.changesNow = true;

  }

  selectModifyRole(){
    this.changesNow = true;
    let res = this.listeRole.find(element => element.idRole === this.selectedRole);  
    if (res != undefined){
      this.roleSelected = res;
      this.libelle = res.libelleRole;
    }
  }

  selectDeleteRole(){
    this.suppresion = true;
    this.changesNow = true;
    let res = this.listeRole.find(element => element.idRole === this.selectedRole);  
    if (res != undefined){
      this.roleSelected = res
    }
  }

  selectInfoRole(){
    this.read = true;
    this.changesNow = true;
  }

  close(){
    this.changesNow = false;
    this.suppresion = false;
    this.read = false;
    this.refreshValidationForm();
    this.libelle = "";
  }

  closeToast(){
    this.ToastAffiche = false;
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


  refreshValidationForm() {
    this.formValidate = false;
  }

  selectCheckAtelier(idAtelier : string) {
    const targetAtelier = this.listeAtelier.find((element) => element.idAtelier === idAtelier)
    if (targetAtelier != undefined) {  
      const stateAtelier = this.listOfSelectedAtelier.findIndex((element) => element === idAtelier);
      if(stateAtelier != -1) {
        this.listOfSelectedAtelier.splice(stateAtelier , 1)
      } else {
        this.listOfSelectedAtelier.push(idAtelier);
      }
    }   
  }

  public allSelectItem() {
    this.checkAllAtelier = !this.checkAllAtelier;
    for (const atelier of this.listeAtelier) {
      atelier.isPaste = this.checkAllAtelier;
      let index = this.listeAtelier.findIndex((element) => element.idAtelier === atelier.idAtelier)
      let indexPaste = this.listOfSelectedAtelier.findIndex((element) => element == atelier.idAtelier)       
      if (this.listeAtelier[index].isPaste){
        if(indexPaste == -1){
          this.listOfSelectedAtelier.push(this.listeAtelier[index].idAtelier)
        }
      } else {
        let index = this.listOfSelectedAtelier.findIndex((element) => element === atelier.idAtelier)
        this.listOfSelectedAtelier.splice(index,1);
      }
    }
  }

  selectCheckTypeOR(idTypeOR : string){
    const targetTypeOR = this.listeTypeOR.find((element) => element.idTypeOR === idTypeOR)
    if (targetTypeOR != undefined) {  
      const stateTypeOR = this.listOfSelectedTypeOR.findIndex((element) => element === idTypeOR);
      if(stateTypeOR != -1) {
        this.listOfSelectedTypeOR.splice(stateTypeOR , 1)
      } else {
        this.listOfSelectedTypeOR.push(idTypeOR);
      }
    }  
  }

  allSelectTypeOR(){
    this.checkAllTypeOR = !this.checkAllTypeOR;
    for (const typeor of this.listeTypeOR) {
      typeor.isPaste = this.checkAllTypeOR;
      let index = this.listeTypeOR.findIndex((element) => element.idTypeOR === typeor.idTypeOR)
      let indexPaste = this.listOfSelectedTypeOR.findIndex((element) => element == typeor.idTypeOR)       
      if (this.listeTypeOR[index].isPaste){
        if(indexPaste == -1){
          this.listOfSelectedTypeOR.push(this.listeTypeOR[index].idTypeOR)
        }
      } else {
        let index = this.listOfSelectedTypeOR.findIndex((element) => element === typeor.idTypeOR)
        this.listOfSelectedTypeOR.splice(index,1);
      }
    }    
  }



  createRole(){
    if (this.libelle != '' ) {
      let payload: any = {};
      payload.libelleRole = this.libelle;
      let atelier : any[] = [];
      let typeOR : any[] = [];

      for ( const a of this.listOfSelectedAtelier){
        atelier.push({"idAtelier" : a })
      }
      
      for ( const t of this.listOfSelectedTypeOR){
        typeOR.push({"idTypeOR" : t})
      }

      payload.atelier = atelier;
      payload.typeObjet = typeOR;

      this.fetchRoleService.createRole(payload).then((res: TypeObjetRepereInfo) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de création", res , "red")
        } else {  
          this.refreshValidationForm();
          this.manageToast("Création", "Le rôle " + this.libelle+ " a été créé", "#006400");
          this.getAllRole()
        }
      }).catch((e) => {
      })
    } else {
      this.formValidate = true;
    }

  }

  deleteRole(){
    this.fetchRoleService.deleteRole(this.selectedRole).then((res: any) => {
      if(typeof res === 'string') {
        this.manageToast("Erreur de suppression", res , "red")
      } else {  
        this.manageToast("Suppression", "Le rôle a bien été supprimée", "#006400")    
        this.getAllRole();
        this.selectedRole = -1;
        this.close();
      }
    }).catch((e) => {
    })
  }


  refreshAfterOperation(){
    this.getAllRole();
    this.libelle = "";
    for ( const tor of this.listeTypeOR){
      tor.isPaste = false;
    }
    for ( const atelier of this.listeAtelier){
      atelier.isPaste = false;
    }
    this.listOfSelectedAtelier.splice(0),
    this.listOfSelectedTypeOR.splice(0);
  }  
}
