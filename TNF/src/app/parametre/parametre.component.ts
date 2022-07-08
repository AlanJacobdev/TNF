import { Component, OnInit } from '@angular/core';
import { faPen, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css']
})
export class ParametreComponent implements OnInit {

  public faPen = faPen;
  public faCheck = faCheck;
  public faXmark = faXmark;
  public modifyEmail = false;
  public modifyHeure = false;
  public email : string = "email"
  public emailBeforeEdit : string = "";
  public heure : number = 4
  public heureBeforeEdit : number = -1
  constructor() { }
  
  ngOnInit(): void {
  }


  editEmail(){
    this.modifyEmail = true;
    this.emailBeforeEdit = this.email;
  }

  cancelEditEmail () {
    this.modifyEmail = false;
    this.email = this.emailBeforeEdit;
  }

  sendConfirmationEditEmail() {

  }


  editHeure(){
    this.modifyHeure = true;
    this.heureBeforeEdit = this.heure
  }

  cancelEditheure() {
    this.modifyHeure = false;
    this.heure = this.heureBeforeEdit
  }

  sendConfirmationEditHeure(){

  }
}
