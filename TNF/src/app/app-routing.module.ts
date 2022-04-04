import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthGuard } from './auth/auth.guard';
import { ConnexionComponent } from './connexion/connexion.component';
import { CreateObjectComponent } from './create-object/create-object.component';
import { CreateTypeObjectComponent } from './create-type-object/create-type-object.component';
import { VisualisationComponent } from './visualisation/visualisation.component';

const routes: Routes = [
  { path: 'connexion', component : ConnexionComponent},
  { path: '', component : AccueilComponent, canActivate: [ AuthGuard ]},
  { path: 'visualisation', component : VisualisationComponent, canActivate: [ AuthGuard ]},
  { path: 'gestionTypeObjet', component : CreateTypeObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'creationObjet', component : CreateObjectComponent, canActivate: [ AuthGuard ]},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
