import { Component, OnInit } from '@angular/core';
import { faCalendar, faClock, faInfo, faPen, faPlus, faTrashCan, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
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

  public faClock = faClock;
  public faCalendar = faCalendar;
  public faUser = faUser;
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
    this.fetchRoleService.getRole().then((list: roleInfo[]) => {
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
    for ( const tor of this.listeTypeOR){
      tor.isPaste = false;
    }
    for ( const atelier of this.listeAtelier){
      atelier.isPaste = false;
    }
    this.checkAllAtelier = false;
    this.checkAllTypeOR = false;
    this.listOfSelectedAtelier.splice(0),
    this.listOfSelectedTypeOR.splice(0);


  }

  selectModifyRole(){
    for ( const tor of this.listeTypeOR){
      tor.isPaste = false;
    }
    for ( const atelier of this.listeAtelier){
      atelier.isPaste = false;
    }
    this.listOfSelectedAtelier.splice(0),
    this.listOfSelectedTypeOR.splice(0);

    this.changesNow = true;
    let res = this.listeRole.find(element => element.idRole === this.selectedRole);  
    if (res != undefined){
      this.roleSelected = res;
      this.libelle = res.libelleRole;

      console.log(res);
      
      for (const atelier of res.atelier){
        this.listOfSelectedAtelier.push(atelier.idAtelier)
        let index = this.listeAtelier.findIndex((element) => element.idAtelier == atelier.idAtelier)
        if (index != -1){
          this.listeAtelier[index].isPaste = true;
        }
      }
      this.verifyCheckAllAtelier();

      for (const typeor of res.typeObjet){
        this.listOfSelectedTypeOR.push(typeor.idTypeOR)
        let index = this.listeTypeOR.findIndex((element) => element.idTypeOR == typeor.idTypeOR)
        if (index != -1){
          this.listeTypeOR[index].isPaste = true;
        }
      }
      this.verifyCheckAllTypeOr();
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

    for ( const tor of this.listeTypeOR){
      tor.isPaste = false;
    }
    for ( const atelier of this.listeAtelier){
      atelier.isPaste = false;
    }
    this.listOfSelectedAtelier.splice(0),
    this.listOfSelectedTypeOR.splice(0);
    
    let res = this.listeRole.find(element => element.idRole === this.selectedRole);  
    if (res != undefined){
      this.roleSelected = res;
      this.libelle = res.libelleRole;

      console.log(res);
      
      for (const atelier of res.atelier){
        this.listOfSelectedAtelier.push(atelier.idAtelier)
        let index = this.listeAtelier.findIndex((element) => element.idAtelier == atelier.idAtelier)
        if (index != -1){
          this.listeAtelier[index].isPaste = true;
        }
      }
      this.verifyCheckAllAtelier();

      for (const typeor of res.typeObjet){
        this.listOfSelectedTypeOR.push(typeor.idTypeOR)
        let index = this.listeTypeOR.findIndex((element) => element.idTypeOR == typeor.idTypeOR)
        if (index != -1){
          this.listeTypeOR[index].isPaste = true;
        }
      }
      this.verifyCheckAllTypeOr();
    }

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
    const targetAtelier = this.listeAtelier.findIndex((element) => element.idAtelier === idAtelier)
    if (targetAtelier != -1) {  
      this.listeAtelier[targetAtelier].isPaste = !this.listeAtelier[targetAtelier].isPaste;
      const stateAtelier = this.listOfSelectedAtelier.findIndex((element) => element === idAtelier);
      if(stateAtelier != -1) {
        this.listOfSelectedAtelier.splice(stateAtelier , 1)
      } else {
        this.listOfSelectedAtelier.push(idAtelier);
      }
    }   
    this.verifyCheckAllAtelier();
  }

  public allSelectAtelier() {
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

  verifyCheckAllAtelier(){
    let allCheck = true;
    if (this.listeAtelier.length != 0){
      for (const atelier of this.listeAtelier) {
        if(atelier.isPaste === false) {
          allCheck = false;
        }
      }
      if (allCheck) {
        this.checkAllAtelier = true;
      } else {
        this.checkAllAtelier = false;
      }
    } else {
      this.checkAllAtelier = false;
    }
  }


  selectCheckTypeOR(idTypeOR : string){
    const targetTypeOR = this.listeTypeOR.findIndex((element) => element.idTypeOR === idTypeOR)
    if (targetTypeOR != -1) {  
      this.listeTypeOR[targetTypeOR].isPaste = !this.listeTypeOR[targetTypeOR].isPaste;
      const stateTypeOR = this.listOfSelectedTypeOR.findIndex((element) => element === idTypeOR);
      if(stateTypeOR != -1) {
        this.listOfSelectedTypeOR.splice(stateTypeOR , 1)
      } else {
        this.listOfSelectedTypeOR.push(idTypeOR);
      }
    }  
    this.verifyCheckAllTypeOr();
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

  verifyCheckAllTypeOr(){
    let allCheck = true;
    if (this.listeTypeOR.length != 0){
      for (const typeor of this.listeTypeOR) {
        if(typeor.isPaste === false) {
          allCheck = false;
        }
      }
      if (allCheck) {
        this.checkAllTypeOR = true;
      } else {
        this.checkAllTypeOR = false;
      }
    } else {
      this.checkAllTypeOR = false;
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

      this.fetchRoleService.createRole(payload).then((res: roleInfo) => {
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

  updateRole(){
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

      this.fetchRoleService.updateRole(this.selectedRole,payload).then((res: roleInfo) => {
        if(typeof res === 'string') {
          this.manageToast("Erreur de Modification", res , "red")
        } else {  
          this.getAllRole()
          this.manageToast("Création", "Le rôle " + this.libelle+ " a été modifié", "#006400");
          this.close();
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
