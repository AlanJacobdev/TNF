import { Component, Input, OnInit } from '@angular/core';
import {  createTypeObject, modificationTypeObject, TypeObjetInfo, TypeObjetRepereInfo, TypeObjetRepereTableau } from 'src/structureData/TypeObject';
import { FetchcreateTypeObjectService } from './service/fetchcreate-type-object.service';
import { faXmark, faCalendar, faUser, faClock, faInfo, faPen, faTrashCan, faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-type-object',
  templateUrl: './create-type-object.component.html',
  styleUrls: ['./create-type-object.component.css']
})
export class CreateTypeObjectComponent implements OnInit {
  @Input() public searchText: string = "";
  public faXmark = faXmark;
  public faClock = faClock;
  public faCalendar = faCalendar;
  public faUser = faUser;
  public faInfo = faInfo;
  public faPen = faPen;
  public faTrashCan = faTrashCan;
  public faPlus = faPlus;
  public listeTypeOR: TypeObjetRepereTableau[] = [];
  public listeTypeO: TypeObjetInfo[] = [];
  public selectedType : createTypeObject = createTypeObject.OR;
  public TypeObject = createTypeObject;
  public changesNow : boolean = false;
  public suppresion : boolean = false;
  public information : boolean = false;
  public idSelected : string = "";
  @Input() public radio : string = "";
  public objectSelect : modificationTypeObject = {
    idTypeObjet: '',
    libelleTypeObjet: ''
  };

  public infoTORSelect : TypeObjetRepereTableau = {
    idType: '',
    libelleTypeOR: '',
    profilCreation: '',
    posteCreation: '',
    dateCreation: '',
    profilModification: '',
    posteModification: '',
    dateModification: ''
  }

  public infoTOSelect : TypeObjetInfo = {
    idType: '',
    libelleType: '',
    profilCreation: '',
    posteCreation: '',
    dateCreation: '',
    profilModification: '',
    posteModification: '',
    dateModification: ''
  }
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";
  public formValidate : boolean = false;

  constructor(private fetchCreateTypeObject : FetchcreateTypeObjectService) { 
    this.refreshListes();
  }


  ngOnInit(): void {
  }

  refreshListes(){

    this.listeTypeOR.splice(0);
    this.fetchCreateTypeObject.getTypeObjetRepere().then((list: TypeObjetRepereInfo[]) => {
      list.forEach((e : TypeObjetRepereInfo) => {
        let typeOr : TypeObjetRepereTableau = {
          idType: e.idTypeOR ,
          libelleTypeOR: e.libelleTypeOR ,
          profilCreation: e.profilCreation ,
          posteCreation: e.posteCreation ,
          dateCreation: e.dateCreation ,
          profilModification: e.profilModification ,
          posteModification: e.posteModification ,
          dateModification: e.dateModification 
        };
        this.listeTypeOR.push(typeOr)
      })
    }).catch((e) => {
    })

    this.fetchCreateTypeObject.getTypeObjet().then((list: TypeObjetInfo[]) => {
      this.listeTypeO = list
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

  selectType (type: createTypeObject) {
    this.selectedType = type;
    this.idSelected = "";
    this.changesNow = false;
  }

  selectObject (id : string) {
    this.idSelected = id;
    this.changesNow = false;
  }

  close(){
    this.changesNow = false;
    this.suppresion = false;
    this.information = false;
    this.refreshValidationForm();
  }

  closeToast(){
    this.ToastAffiche = false;
  }

  refreshValidationForm(){
    this.formValidate = false;
  }

  selectCreateType(){
    this.changesNow = true;
    this.idSelected = "";
  }

  selectModifyType(){
    this.changesNow = true;
    let res;
    if(this.selectedType === this.TypeObject.OR) {
      res = this.listeTypeOR.find(element => element.idType === this.idSelected);  
      if (res != undefined){
        this.objectSelect.idTypeObjet = res.idType;
        this.objectSelect.libelleTypeObjet = res.libelleTypeOR;
      }
    } else {
      res = this.listeTypeO.find(element => element.idType === this.idSelected);  
      if (res != undefined){
        this.objectSelect.idTypeObjet = res.idType;
        this.objectSelect.libelleTypeObjet = res.libelleType;
      }
    }
  }

  selectDeleteType(){
    this.suppresion = true;
    this.changesNow = true;
    
  }


  selectInformation(){
    this.information = true;
    this.changesNow = true;
    let res;
    if(this.selectedType === this.TypeObject.OR) {
      res = this.listeTypeOR.find(element => element.idType === this.idSelected);  
      if (res != undefined){
        this.infoTORSelect= res;
      }
    } else {
      res = this.listeTypeO.find(element => element.idType === this.idSelected);  
      if (res != undefined){
        this.infoTOSelect = res;
      }
    }    
  }

  createTypeObjet(identifiant : string, libelle : string) {

    
    if ( identifiant != '' && libelle != '') {
      if(this.radio === "OR") {
        this.fetchCreateTypeObject.createTypeOR(identifiant,libelle).then((res: TypeObjetRepereInfo) => {
          if(res === undefined) {
            this.manageToast("Erreur de création", "Le type d'objet repère existe déjà", "red")
          } else {  
            this.manageToast("Création", "L'objet repère " + identifiant.toUpperCase() + " a été crée", "#006400")
            this.refreshListes();
            this.close();         
          }
        }).catch((e) => {
        })
      } else if ( this.radio === "O" ){
        this.fetchCreateTypeObject.createTypeO(identifiant,libelle).then((res: TypeObjetRepereInfo) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de création", res, "red")
          } else {
            this.manageToast("Création", "L'objet " + identifiant.toUpperCase() + " a été crée", "#006400")
            this.refreshListes();
            this.close();
          }
        }).catch((e) => {
        })
      }
    } else {
      this.formValidate = true;
    }
  }


  updateTypeObjet(identifiant : string, libelle : string) {
    console.log(identifiant +" " +libelle)
    if ( identifiant != '' && libelle != '') {
      if ( this.selectedType == this.TypeObject.OR){
        this.fetchCreateTypeObject.updateTypeOR(identifiant,libelle).then((res: TypeObjetRepereInfo) => {
          console.log(res);
          if (res === undefined) {
            this.manageToast("Erreur de modification", "Identificateur inconnu", "red")
          } else {
            this.manageToast("Modification", "L'objet repère " + identifiant.toUpperCase() + " a été modifié", "#ff8c00")
            this.refreshListes();
            this.close();
          }
        }).catch((e) => {
        })
      } else if ( this.selectedType === this.TypeObject.O ){
        this.fetchCreateTypeObject.updateTypeO(identifiant,libelle).then((res: TypeObjetRepereInfo) => {
          console.log(res);
          if (typeof res === 'string') {
            this.manageToast("Erreur de modification", res, "red")
          } else {
            this.manageToast("Modification", "L'objet " + identifiant.toUpperCase() + " a été modifié", "#ff8c00")
            this.refreshListes();
            this.close();
          }
        }).catch((e) => {
        })
      }
    } else {
      this.formValidate = true;
    }
  }

  deleteTypeObjet() {
    console.log (this.selectedType)
    if ( this.selectedType == this.TypeObject.OR){
      this.fetchCreateTypeObject.deleteTypeOR(this.idSelected).then((res: any) => {
        console.log(res);
        if (res === undefined) {
          this.manageToast("Erreur de suppression", "Identificateur inconnu ou objets liés", "red")
        } else {
          this.manageToast("Supprimer", "L'objet repère " + this.idSelected + " a été supprimé", "#cd5c5c")
          this.idSelected = "";
          this.refreshListes();
          this.close();
        }
      }).catch((e) => {
      })
    } else if ( this.selectedType === this.TypeObject.O ){
      this.fetchCreateTypeObject.deleteTypeO(this.idSelected).then((res: any) => {
        if (res === undefined) {
          this.manageToast("Erreur de suppression", "Identificateur inconnu ou objets liés", "red")
        } else {
          this.manageToast("Supprimer", "L'objet " + this.idSelected + " a été supprimé", "#cd5c5c")
          this.idSelected = "";
          this.refreshListes();
          this.close();
        }
      }).catch((e) => {
      })
    }
  }

}
