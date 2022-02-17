import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  
  constructor(private NavBarService :NavBarService, private router : Router, private authService : AuthService) { }

  ngOnInit(): void {
    if (this.authService.estAuthentifie()){
      this.router.navigate(['']);
    }
  }


  public async connect(id : string, pwd: string) {
    const co = await this.authService.connexion(id,pwd);
    if ( co != undefined) {
      this.NavBarService.setEstConnecte(true);
      this.router.navigate(['']);
    } else {
      this.cannotConnect = true;
      this.errorMessage = "Identifiant ou mot de passe incorrect"
    }
  }
}
