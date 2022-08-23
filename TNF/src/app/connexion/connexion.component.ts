import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/auth.service';
import { NavBarService } from '../navbar/service/nav-bar.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  errorMessage : string = "";
  cannotConnect : boolean = false;
  deconnexionTO : boolean = false;
  public faXmark = faXmark;

  constructor( private NavBarService :NavBarService, private router : Router, private authService : AuthService) { }

  ngOnInit(): void {
    if (this.authService.estAuthentifie()){
      this.router.navigate(['']);
    }
    this.deconnexionTO = this.NavBarService.getDeconnecteTimeOut();
    

  }


  public async connect(id : string, pwd: string) {
    const co = await this.authService.connexion(id,pwd);
    

    if (typeof co === 'string') {
      this.cannotConnect = true;
      this.errorMessage = co
    } else {
      if ( co != undefined) {
        this.NavBarService.setEstConnecte(true);
        this.NavBarService.isUserLoggedIn.next(true);
        this.router.navigate(['']);
      } else {
        this.cannotConnect = true;
        this.errorMessage = "Identifiant ou mot de passe incorrect"
      }
    }
  }

  close(){
    this.NavBarService.setDeconnecteTimeOut(false);
    this.deconnexionTO = false;
  }
}
