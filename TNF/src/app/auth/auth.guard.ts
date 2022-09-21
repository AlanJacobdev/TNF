import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavBarService } from '../navbar/service/nav-bar.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Classe permettant de limiter l'accès à des ressources (utilisé au sein du router : app-routing.module.ts)
 */
export class AuthGuard implements CanActivate {

  /**
   * Constructeur de la classe 
   * Instancié à la création du composant
   * Injection de services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private navBarService: NavBarService,private authService: AuthService, private router : Router){}


  /**
   * Vérifie si l'utilisateur est bien connecté.
   * S'il n'est pas connecté il est redirigé vers la page de connexion
   * Sinon le guard laisse passer la demande
   * @returns 
   */
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
