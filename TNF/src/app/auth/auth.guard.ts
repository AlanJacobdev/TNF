import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavBarService } from '../navbar/service/nav-bar.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private navBarService: NavBarService,private authService :AuthService, private router : Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const auth = this.authService.estAuthentifie();
      if (!auth) {
        this.router.navigate(['/connexion']);
        return false;
      } else {
        this.navBarService.setEstConnecte(true);
        return true
    }
      

  }
  
}
