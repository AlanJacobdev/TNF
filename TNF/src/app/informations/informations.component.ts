import { Component, Input, OnInit } from '@angular/core';
import { faInfo, faPen, faTrashCan, faPlus, faXmark, faBook, faImage, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { InformationCreate, InformationInfo } from 'src/structureData/Informations';
import { FetchInformationService } from './service/fetch-information.service';


@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
export class InformationsComponent implements OnInit {
  
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
    dateModification: new Date(0)
  };

  constructor(private fetchInformationService : FetchInformationService) { }

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
      console.log(list)
      console.log(this.listeInformations);
      ;
      
    }).catch((e) => {
    })
  }


  public addDocument(){
    this.documents.push({value : ""});
  }

  public removeDocument(indice : number){
    this.documents.splice(indice,1)
  
  }

  selectCreateType(){
    this.changesNow = true;
    this.idSelected = -1;
  }

  selectModifyType(){
    this.changesNow = true;
    let res = this.listeInformations.find(element => element.idInfo === this.idSelected);  
    if (res != undefined){
      this.infoSelect = res
    }
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
            this.getInformation();
            this.text = "";
            this.titre = "";
            this.documents.splice(0);

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

  updateInformations(){

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

  readInformations(){

  }

  handleFileInput(i: any, event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.documents[i].doc = element;
  }

  async appendFormDataList(){
    try {   
      this.formDataList = new FormData();
      for(const document of this.documents){
        let fileList: FileList | null = document.doc.files;
        if (fileList) {
          this.formDataList.append('document', fileList[0], document.nom);
        }
      }
      return true
    }  catch (e :any){
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
