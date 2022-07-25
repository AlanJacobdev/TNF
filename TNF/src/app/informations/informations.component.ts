import { Component, OnInit } from '@angular/core';
import { FetchInformationService } from './service/fetch-information.service';


@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
export class InformationsComponent implements OnInit {

  fileToUpload: File[] | null = null;
  formDataList : FormData = new FormData()
  
  constructor(private fetchInformationService : FetchInformationService) { }

  ngOnInit(): void {
  }

  handleFileInput(name :string, event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.formDataList.append('document', fileList[0], name);
    }

  }

  sendInformations(){

    this.fetchInformationService.exportFiles(this.formDataList).then((res: any) => {

      this.formDataList = new FormData();
    }).catch((e) => {
    })
  }
  

}
