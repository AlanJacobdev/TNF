import { Component, OnInit } from '@angular/core';
import { NavBarService } from './service/nav-bar.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private navbarService : NavBarService) { }
  public estAdmin : boolean = false;
  public estConnecte : boolean = false;

  ngOnInit(): void {
    this.estAdmin = this.navbarService.getEstAdmin();
    this.estConnecte = this.navbarService.getEstConnecte();
  }

  printMenu() {
    this.estConnecte = this.navbarService.getEstConnecte();
    return this.estConnecte;
  }

}
