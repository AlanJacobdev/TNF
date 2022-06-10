import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DemandeAdmin } from 'src/structureData/DemandeAdmin';
import { FetchDemandeAdminService } from './service/fetch-demande-admin.service';
import { faComment, faCalendar, faUser, faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  public faRightLong = faArrowRightFromBracket;
  public faComment = faComment;
  public faCalendar = faCalendar;
  public faUser = faUser;
  public isAdmin : boolean = false
  public listeDemandeAdmin : DemandeAdmin[] = []
  
  constructor(private cookieService: CookieService, private fetchDemandeAdminService : FetchDemandeAdminService) { 
    let Admin = this.cookieService.get('Admin');
    if (Admin == "true"){
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.getAllDemandeAdmin();
  }

  ngOnInit(): void {
   
  }

  getAllDemandeAdmin(){
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

}
