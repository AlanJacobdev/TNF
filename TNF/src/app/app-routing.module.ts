import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthGuard } from './auth/auth.guard';
import { ConnexionComponent } from './connexion/connexion.component';
import { CreateObjectComponent } from './create-object/create-object.component';
import { CreateTypeObjectComponent } from './create-type-object/create-type-object.component';
import { DeleteObjectComponent } from './delete-object/delete-object.component';
import { DemandeAdminComponent } from './demande-admin/demande-admin.component';
import { ExportationGmaoComponent } from './exportation-gmao/exportation-gmao.component';
import { ExportationComponent } from './exportation/exportation.component';
import { GestionAteliersComponent } from './gestion-ateliers/gestion-ateliers.component';
import { InformationsComponent } from './informations/informations.component';
import { ModifyObjectComponent } from './modify-object/modify-object.component';
import { ParametreComponent } from './parametre/parametre.component';
import { RecopieObjectComponent } from './recopie-object/recopie-object.component';
import { RoleComponent } from './role/role.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { VisualisationComponent } from './visualisation/visualisation.component';


/**
 * Routes de l'application
 */
const routes: Routes = [
  { path: 'connexion', component : ConnexionComponent},
  { path: '', component : AccueilComponent, canActivate: [ AuthGuard ]},
  { path: 'visualisation', component : VisualisationComponent, canActivate: [ AuthGuard ]},
  { path: 'gestionTypeObjet', component : CreateTypeObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'gestionAtelier', component : GestionAteliersComponent, canActivate: [ AuthGuard ]},
  { path: 'creationObjet', component : CreateObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'modificationObjet', component : ModifyObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'suppressionObjet', component : DeleteObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'recopieObjet', component : RecopieObjectComponent, canActivate: [ AuthGuard ]},
  { path: 'exportation', component : ExportationComponent, canActivate: [ AuthGuard ]},
  { path: 'exportationGmao', component : ExportationGmaoComponent, canActivate: [ AuthGuard ]},
  { path: 'demandeAdmin', component : DemandeAdminComponent, canActivate: [ AuthGuard ]},
  { path: 'parametres', component : ParametreComponent, canActivate: [ AuthGuard ]},
  { path: 'information', component : InformationsComponent, canActivate: [ AuthGuard ]},
  { path: 'role', component : RoleComponent, canActivate: [ AuthGuard ]},
  { path: 'utilisateur', component : UtilisateurComponent, canActivate: [ AuthGuard ]},

  { path: '**', redirectTo: ''}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
/**
 * Classe définissant les routes de l'application
 */
export class AppRoutingModule { }
