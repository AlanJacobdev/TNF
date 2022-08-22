import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {tap} from 'rxjs/operators';
import { NavBarService } from './navbar/service/nav-bar.service';
import { AuthService } from './auth/auth.service';


@Injectable()
export class HttpResErrInterceptor implements HttpInterceptor {

  constructor(private route : Router, private navBarService : NavBarService, private authService :AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe( tap(() => {},
    async (err: any) => {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 400) {
        this.navBarService.setDeconnecteTimeOut(true);
        await this.authService.deconnexion();
        this.navBarService.setEstConnecte(false);
        this.navBarService.setEstAdmin(false);  
        this.navBarService.setLogin("");
        localStorage.setItem('page', "Accueil");
        return;
      } else if (err.status === 401){
        await this.authService.refresh();
        return next.handle(req);
      }
    } 
    return;
  }));
  }
}
