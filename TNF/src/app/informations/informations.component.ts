import { Component, Input, OnInit } from '@angular/core';
import { faInfo, faPen, faTrashCan, faPlus, faXmark, faBook, faImage, faCaretRight, faEye, faRotateLeft, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import { DocName, DocumentInfo, documentInfoModify, InformationCreate, InformationInfo, InformationModify } from 'src/structureData/Informations';
import { FetchInformationService } from './service/fetch-information.service';


@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
/**
 * Classe permettant de déterminer comment le composant sera instancié et utilisé
 */
export class InformationsComponent implements OnInit {
  
  public faCalendar = faCalendar;
  public faUser = faUser;
  public faRotateLeft = faRotateLeft
  public faEye = faEye;
  public faCaretRight = faCaretRight
  public faImage = faImage;
  public faBook = faBook;
  public faXmark = faXmark;
  public faInfo = faInfo;
  public faPen = faPen;
  public faTrashCan = faTrashCan;
  public faPlus = faPlus;
  

  public listeInformations : InformationInfo[] = [];
  fileToUpload: File[] | null = null;
  formDataList : FormData = new FormData()
  private listeDocuments : number[] =[]
  @Input() public searchText: string = "";
  public ToastAffiche : boolean = false; 
  public messageToast : string = "";
  public typeToast : string = ""
  public colorToast : string = "";
  public formValidate : boolean = false;
  public changesNow : boolean = false;
  public suppresion : boolean = false;
  public read : boolean = false;
  public idSelected : number = -1;
  public documents : any = [];
  public documentsModify : any = [];
  public text : string ="";
  public titre : string ="";
  public infoSelect : InformationInfo = {
    idInfo: -1,
    titre: '',
    text: '',
    document: [],
    profilCreation: '',
    dateCreation: new Date(0),
    profilModification: '',
    dateModification: new Date(0),
  };

  public descriptionObjectSelect : DocumentInfo[] = [];
  public tabDocName : DocName[] = [];

    /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private fetchInformationService : FetchInformationService) { this.getInformation(); }

    /**
  * Méthode appellée à l'initialisation du composant
  */
  ngOnInit(): void {
    this.getInformation();
  }

/**
 * Selection de l'information courante
 * @param id : Identifiant de l'information
 */
  selectInformation(id : number){
    if(id != this.idSelected){
      this.idSelected = id;
      this.close()
    }
  }

  /**
   * Fermer le toast
   */
  closeToast(){
    this.ToastAffiche = false;
  }

  /**
   * Fermer les fenêtres de formulaire lié aux informations
   */
  close(){
    this.changesNow = false;
    this.suppresion = false;
    this.read = false;
    this.refreshValidationForm();
    this.documents.splice(0);
    this.documentsModify.splice(0);
    this.text = "";
    this.titre = "";
  }

  /**
   * Valeur par défaut de la validation de formulaire (affichage des erreurs)
   */
  refreshValidationForm(){
    this.formValidate = false;
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
   * Recupère la liste de toutes les informations
   */
  getInformation(){
    this.listeInformations.splice(0)
    this.fetchInformationService.getInformations().then((list: InformationInfo[]) => {
      this.listeInformations = list
    }).catch((e) => {
    })
  }

  /**
   * Lire un document
   * @param idDoc : Identifiant du document
   */
  async readFile(idDoc : number){
    (await this.fetchInformationService.readFile(idDoc)).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  /**
   * Ajout d'un document à une information 
   */
  public addDocument(){
    this.documents.push({value : ""});
  }

  /**
   * Ajout d'un document à une information en cours de modification
   * @param id : Identifiant du document
   * @param nom : Nom du document
   */
  public addDocumentModify(id : number, nom : string){
    this.documentsModify.push({id: id, nom : nom});
  }

  /**
   * Supprime un document d'un information
   * @param indice : Indice du documents dans la liste des documents de l'information
   */
  public removeDocument(indice : number){
    this.documents.splice(indice,1)
  }

    /**
   * Supprime un document d'un information en cours de modification
   * @param indice : Indice du documents dans la liste des documents de l'information
   */
  public removeDocumentOfModification(indice : number){  
    this.descriptionObjectSelect.splice(indice,1)
  }

  /**
   * Passe le status de la modification à vrai pour un document
   * @param indice :  Indice du documents dans la liste des documents de l'information
   */
  public modifyDocument(indice : number){
    this.descriptionObjectSelect[indice].edited=true;
  }

    /**
   * Passe le status de la modification à faux pour un document
   * @param indice :  Indice du documents dans la liste des documents de l'information
   */
  public notModifyDocument(indice : number){
    this.descriptionObjectSelect[indice].edited=false;

  }

  /**
   * Modifie le libelle d'un document pour une information en cours de modification
   * @param indice :  Indice du documents dans la liste des documents de l'information
   */
  public modifyLibelleDocument(indice : number){
    this.descriptionObjectSelect[indice].editedLibelle=true;
  }

  /**
   * Selection du bouton de création d'information
   */
  selectCreateType(){
    this.changesNow = true;
    this.idSelected = -1;
  }

  /**
   * Selection du bouton de modification d'information
   */
  selectModifyType(){
    
    this.documents.splice(0);
    this.documentsModify.splice(0);
    this.changesNow = true;
    let res = this.listeInformations.find(element => element.idInfo === this.idSelected);  
    if (res != undefined){
      this.infoSelect=res;
      this.descriptionObjectSelect.splice(0);
      for (const d of this.infoSelect.document){
        let index = this.descriptionObjectSelect.push(d);
        this.descriptionObjectSelect[index-1].edited = false;
        this.descriptionObjectSelect[index-1].editedLibelle = false;
      }
      this.text = this.infoSelect.text;
    }
    for( const doc of this.descriptionObjectSelect) {
      this.addDocumentModify(doc.idDoc, doc.libelleDocument);
    }    
    
  }
  
  /**
   * Selection de suppression de l'information
   */
  selectDeleteType(){
    this.suppresion = true;
    this.changesNow = true;
    let res = this.listeInformations.find(element => element.idInfo === this.idSelected);  
    if (res != undefined){
      this.infoSelect = res
    }
  }


  /**
   * Selection du bouton d'informations de l'information
   */
  selectRead(){
    this.read = true;
    this.changesNow = true;
    let res;
      res = this.listeInformations.find(element => element.idInfo === this.idSelected);  
      if (res != undefined){
        this.infoSelect = res
      }
  }


  /**
   * Creation d'une information
   */
  async createInformations(){
    let storeDoc = await this.appendFormDataList();
    if (storeDoc) {
      let getIdDocument = await this.sendInformations();
      if (getIdDocument){
        let createInfo : InformationCreate = {
          titre: this.titre,
          text: this.text,
          idDocument: this.listeDocuments,
          profilCreation: ''
        }


        this.fetchInformationService.createInformations(createInfo).then((res: any) => {
          if(typeof res === 'string') {
            this.manageToast("Erreur de création", res , "red")
          } else {  
            this.manageToast("Création", "L'information a bien été créée", "#006400")    
            
            let tabLibelleModify : documentInfoModify[] = [];
            let i =0;
            for(const doc of this.listeDocuments) {
              
              tabLibelleModify.push({
                idDocument : doc,
                libelleDocument : this.documents[i].nom
              })
              i++;
            }

            for (const lib of tabLibelleModify) {
              this.fetchInformationService.updateLibelleFromDoc(lib).then((res: any) => {
                if(typeof res === 'string') {
                  this.manageToast("Erreur de Création", res , "red")
                }
                this.refreshAfterOperation();
              }).catch((e) => {
              })
            }


          }
        }).catch((e) => {
        })

      } else {
        this.manageToast("Erreur de fichier", "Fichier manquant ou corrompu" , "red")
      }
    } else {
      this.manageToast("Erreur de fichier", "Fichier manquant ou corrompu" , "red")
    }

  }

  /**
   * Rafrachit les champs du formulaire après une opération sur une information
   */
  refreshAfterOperation(){
    this.getInformation();
    this.text = "";
    this.titre = "";
    this.documents.splice(0);
    this.documentsModify.splice(0);
  }

  /**
   * Modifie une information
   */
  async updateInformations(){
    let tabIdDoc = [];
    let tabLibelleModify : documentInfoModify[] = [];
    
    if (this.descriptionObjectSelect.length != 0 ) {
      for (const d of this.descriptionObjectSelect) {
        if (d.edited == false) {
          tabIdDoc.push(d.idDoc);
        }
        if(d.editedLibelle == true && d.edited == false) {
          let newLibelle = this.descriptionObjectSelect.find((element) => element.idDoc == d.idDoc)
          if (newLibelle != undefined){
            tabLibelleModify.push({
              idDocument : newLibelle.idDoc,
              libelleDocument : newLibelle.libelleDocument
            })
          }
        }
      }
    }
    for ( const doc of tabLibelleModify){
      
    }
    for (const lib of tabLibelleModify) {
      this.fetchInformationService.updateLibelleFromDoc(lib).then((res: any) => {
        if(typeof res === 'string') {
          
          this.manageToast("Erreur de modification", res , "red")
        }
      }).catch((e) => {
      })
    }

    let storeDocModify = await this.appendFormDataListModify();

    if (storeDocModify) {
      let getIdDocument = await this.sendInformations();
      if (getIdDocument){
        for (const d of this.listeDocuments) {
          tabIdDoc.push(d);
        }
        let tabNewLibelle : documentInfoModify[] = [];
        let i = 0 ;
        for(const doc of this.listeDocuments) {
            tabNewLibelle.push({
              idDocument : doc,
              libelleDocument : this.documentsModify[i].nom
            })
          i++;
        }
        for (const lib of tabNewLibelle) {
          this.fetchInformationService.updateLibelleFromDoc(lib).then((res: any) => {
            if(typeof res === 'string') {
              
              this.manageToast("Erreur de modification", res , "red")
            }
          }).catch((e) => {
          })
        }

      } else {
        this.manageToast("Erreur de fichier", "Fichier manquant ou corrompu" , "red")
      }
    }


    let storeDoc = await this.appendFormDataList();
    
    if (storeDoc) {
      let getIdDocument = await this.sendInformations();
      if (getIdDocument){
        for (const d of this.listeDocuments) {
          tabIdDoc.push(d);
        }
        
        let tabNewLibelle : documentInfoModify[] = [];
        let i =0;
        for(const doc of this.listeDocuments) {
            tabNewLibelle.push({
              idDocument : doc,
              libelleDocument : this.documents[i].nom
            })
          i++;
        }

        for (const lib of tabNewLibelle) {
          this.fetchInformationService.updateLibelleFromDoc(lib).then((res: any) => {
            if(typeof res === 'string') {
              
              this.manageToast("Erreur de modification", res , "red")
            }
          }).catch((e) => {
          })
        }

      } else {
        console.log("Fichier manquant ou corrompu");
        this.manageToast("Erreur de fichier", "Fichier manquant ou corrompu" , "red")
      }
    }

    
    const infoModify : InformationModify ={
      text: this.text,
      idDocument: tabIdDoc,
      profilModification: ''
    }

    
    this.fetchInformationService.updateInformation(this.idSelected, infoModify).then((res: any) => {
      if(typeof res === 'string') {
        this.manageToast("Erreur de modification", res , "red")
      } else {  
        this.manageToast("Modification", "L'information a bien été modifiée", "#ff8c00")    
        this.getInformation();
        this.idSelected = -1;
        this.close();
      }
    }).catch((e) => {
    })

  }

  /**
   * Supprime une information
   */
  deleteInformation(){
    this.fetchInformationService.deleteInformation(this.idSelected).then((res: any) => {
      if(typeof res === 'string') {
        this.manageToast("Erreur de suppression", res , "red")
      } else {  
        this.manageToast("Suppression", "L'information a bien été supprimée", "#006400")    
        this.getInformation();
        this.idSelected = -1;
        this.close();
      }
    }).catch((e) => {
    })
  }

  /**
   * Detecte l'ajout d'un document via l'explorateur windows sur une information
   * @param i : indice du document 
   * @param event : fichier 
   */
  handleFileInput(i: any, event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.documents[i].doc = element.files;
  }

    /**
   * Detecte l'ajout d'un document via l'explorateur windows sur une information en cours de modification
   * @param i : indice du document 
   * @param event : fichier 
   */
  handleFileInputModify(i: any, event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.documentsModify[i].doc = element.files;
   
    
  }

  
  /**
   * Ajout des document modifiés au formdata utile à la création des fichiers sur le serveur
   * @returns True or false
   */
  async appendFormDataListModify(){
    try {   

      for (const document of this.documentsModify) {
        let fileList: FileList | null = document.doc;
        if (fileList) {
          this.tabDocName.push({
            nameDisplay:document.nom,
            originalName: fileList[0].name
          })
          this.formDataList.append('document', fileList[0]);
        }
      }
      return true
    }  catch (e: any){
      
      return false
    }
  }

  /**
   * Ajout des document modifiés au formdata utile à la création des fichiers sur le serveur
   * @returns True or false
   */
  async appendFormDataList(){
    try {   
      this.formDataList = new FormData();
      for(const document of this.documents){
        let fileList: FileList | null = document.doc;
        if (fileList) {
          this.tabDocName.push({
            nameDisplay:document.nom,
            originalName: fileList[0].name
          })
          this.formDataList.append('document', fileList[0]);
        }
      }      
      return true
    }  catch (e: any){
      return false
    }
  }

  /**
   * Envoie la liste de documents a creer au serveur
   * @returns 
   */
  async sendInformations(){
    this.listeDocuments.splice(0);
    try {
      let result = await this.fetchInformationService.exportFiles(this.formDataList)
      this.listeDocuments = result.value
      this.formDataList = new FormData();
      return true;
    } catch (e : any){
      return false
    }
  }

}
