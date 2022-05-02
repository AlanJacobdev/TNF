import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthGuard } from './auth/auth.guard';
import { ConnexionComponent } from './connexion/connexion.component';
import { CreateObjectComponent } from './create-object/create-object.component';
import { CreateTypeObjectComponent } from './create-type-object/create-type-object.component';
import { DeleteObjectComponent } from './delete-object/delete-object.component';
import { ExportationComponent } from './exportation/exportation.component';
import { ModifyObjectComponent } from './modify-object/modify-object.component';
import { RecopieObjectComponent } from './recopie-object/recopie-object.component';
import { VisualisationComponent } from './visualisation/visualisation.component';

const routes: Routes = [
  { path: 'connexion', component : ConnexionComponent},
  { path: '', component : AccueilComponent, canActivate: [ AuthGuard ]},
  { path: 'visualisation', component : VisualisationComponent, canActivate: [ AuthGuard ]},
  { path: 'gestionTypeObjet', component : CreateTypeObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'creationObjet', component : CreateObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'modificationObjet', component : ModifyObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'suppressionObjet', component : DeleteObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'recopieObjet', component : RecopieObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'exportation', component : ExportationComponent, canActivate: [ AuthGuard ]},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
