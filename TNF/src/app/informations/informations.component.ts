import { Component, Input, OnInit } from '@angular/core';
import { faInfo, faPen, faTrashCan, faPlus, faXmark, faBook, faImage, faCaretRight, faEye, faRotateLeft, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import { DocName, DocumentInfo, documentInfoModify, InformationCreate, InformationInfo, InformationModify } from 'src/structureData/Informations';
import { FetchInformationService } from './service/fetch-information.service';


@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
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

  constructor(private fetchInformationService : FetchInformationService) { this.getInformation(); }

  ngOnInit(): void {
    this.getInformation();
  }


  selectInformation(id : number){
    if(id != this.idSelected){
      this.idSelected = id;
      this.close()
    }
    console.log(this.read);
  }

  
  closeToast(){
    this.ToastAffiche = false;
  }

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

  refreshValidationForm(){
    this.formValidate = false;
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

  getInformation(){
    this.listeInformations.splice(0)
    this.fetchInformationService.getInformations().then((list: InformationInfo[]) => {
      this.listeInformations = list
    }).catch((e) => {
    })
  }

  async readFile(idDoc : number){
    (await this.fetchInformationService.readFile(idDoc)).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  public addDocument(){
    this.documents.push({value : ""});
  }
  public addDocumentModify(id : number, nom : string){
    this.documentsModify.push({id: id, nom : nom});
  }

  public removeDocument(indice : number){
    this.documents.splice(indice,1)
  }

  public removeDocumentOfModification(indice : number){  
    this.descriptionObjectSelect.splice(indice,1)
  }

  public modifyDocument(indice : number){
    this.descriptionObjectSelect[indice].edited=true;
  }
  public notModifyDocument(indice : number){
    this.descriptionObjectSelect[indice].edited=false;

  }

  public modifyLibelleDocument(indice : number){
    this.descriptionObjectSelect[indice].editedLibelle=true;
  }

  selectCreateType(){
    this.changesNow = true;
    this.idSelected = -1;
  }

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
    console.log( this.descriptionObjectSelect);
    
  }
  

  selectDeleteType(){
    this.suppresion = true;
    this.changesNow = true;
    let res = this.listeInformations.find(element => element.idInfo === this.idSelected);  
    if (res != undefined){
      this.infoSelect = res
    }
  }


  selectRead(){
    this.read = true;
    this.changesNow = true;
    let res;
      res = this.listeInformations.find(element => element.idInfo === this.idSelected);  
      if (res != undefined){
        this.infoSelect = res
      }
  }


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

  refreshAfterOperation(){
    this.getInformation();
    this.text = "";
    this.titre = "";
    this.documents.splice(0);
    this.documentsModify.splice(0);
  }

  async updateInformations(){
    let tabIdDoc = [];
    let tabLibelleModify : documentInfoModify[] = [];
    if (this.descriptionObjectSelect.length != 0 ) {
      for (const d of this.descriptionObjectSelect) {
        if (d.edited == false) {
          tabIdDoc.push(d.idDoc);
        }
        if(d.editedLibelle == true && d.edited == false) {
          let newLibelle = this.documentsModify.find((element: any) => element.id == d.idDoc)
          tabLibelleModify.push({
            idDocument : newLibelle.id,
            libelleDocument : newLibelle.nom
          })
        }
      }
    }
    for ( const doc of this.documentsModify){
      console.log(doc);
      
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
        console.log(this.listeDocuments);
        
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
        this.manageToast("Erreur de suppression", res , "red")
      } else {  
        this.manageToast("Création", "L'information a bien été modifiée", "#006400")    
        this.getInformation();
        this.idSelected = -1;
        this.close();
      }
    }).catch((e) => {
    })




  }

  deleteInformation(){
    this.fetchInformationService.deleteInformation(this.idSelected).then((res: any) => {
      if(typeof res === 'string') {
        this.manageToast("Erreur de suppression", res , "red")
      } else {  
        this.manageToast("Création", "L'information a bien été supprimée", "#006400")    
        this.getInformation();
        this.idSelected = -1;
        this.close();
      }
    }).catch((e) => {
    })
  }

  handleFileInput(i: any, event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.documents[i].doc = element.files;
  }

  handleFileInputModify(i: any, event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.documentsModify[i].doc = element.files;
   
    
  }

  

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
      console.log(e);
      
      return false
    }
  }

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
      console.log(e);
      
      return false
    }
  }

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
