import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { NavbarComponent } from './navbar/navbar.component';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { CreateTypeObjectComponent } from './create-type-object/create-type-object.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchTablePipe } from './create-type-object/pipe/search-table.pipe';
import { CreateObjectComponent } from './create-object/create-object.component';
import { FilterVisualisationPipe } from './visualisation/pipe/filter-visualisation.pipe';
import { ModifyObjectComponent } from './modify-object/modify-object.component';
import { DeleteObjectComponent } from './delete-object/delete-object.component';
import { RecopieObjectComponent } from './recopie-object/recopie-object.component';
import { FilterRecopiePipe } from './recopie-object/pipe/filter-recopie.pipe';
import { FilterItemByTypePipe } from './recopie-object/pipe/filter-item-by-type.pipe';
import { ExportationComponent } from './exportation/exportation.component';
import { FilterModificationPipe } from './modify-object/pipe/filter-modification.pipe';
import { FilterSuppressionPipe } from './delete-object/pipe/filter-suppression.pipe';
import { ActifVisualisationPipe } from './visualisation/pipe/actif-visualisation.pipe';
import { FilterTypePipe } from './modify-object/pipe/filter-type.pipe';
import { FilterNUPipe } from './create-object/pipe/filter-nu.pipe';
import { GestionAteliersComponent } from './gestion-ateliers/gestion-ateliers.component';
import { FilterAtelierPipe } from './gestion-ateliers/pipe/filter-atelier.pipe';
import { DemandeAdminComponent } from './demande-admin/demande-admin.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { ParametreComponent } from './parametre/parametre.component';
import { FilterDmdAdminPipe } from './demande-admin/pipe/filter-dmd-admin.pipe';
import { InformationsComponent } from './informations/informations.component';
import { FilterInfoPipe } from './informations/pipe/filter-info.pipe';
import { AutosizeModule } from 'ngx-autosize';
import { RoleComponent } from './role/role.component';
import { FilterActifPipe } from './role/pipe/filter-actif.pipe';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { FilterByTypePipe } from './visualisation/pipe/filter-by-type.pipe';
import { ExportationGmaoComponent } from './exportation-gmao/exportation-gmao.component';
import { FilterExportationTypePipe } from './exportation-gmao/pipe/filter-exportation-type.pipe';
import { FilterExportationAtelierPipe } from './exportation-gmao/pipe/filter-exportation-atelier.pipe';
import { FilterExportationEtatPipe } from './exportation-gmao/pipe/filter-exportation-etat.pipe';
import { HttpResErrInterceptor } from './http-res-err.interceptor';
import { AuthService } from './auth/auth.service';
import { NavBarService } from './navbar/service/nav-bar.service';



const config: SocketIoConfig = { url: 'http://'+environment.API_URL, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    ConnexionComponent,
    NavbarComponent,
    VisualisationComponent,
    CreateTypeObjectComponent,
    SearchTablePipe,
    CreateObjectComponent,
    FilterVisualisationPipe,
    ModifyObjectComponent,
    DeleteObjectComponent,
    RecopieObjectComponent,
    FilterRecopiePipe,
    FilterItemByTypePipe,
    ExportationComponent,
    FilterModificationPipe,
    FilterSuppressionPipe,
    ActifVisualisationPipe,
    FilterTypePipe,
    FilterNUPipe,
    GestionAteliersComponent,
    FilterAtelierPipe,
    DemandeAdminComponent,
    ParametreComponent,
    FilterDmdAdminPipe,
    InformationsComponent,
    FilterInfoPipe,
    RoleComponent,
    FilterActifPipe,
    UtilisateurComponent,
    FilterByTypePipe,
    ExportationGmaoComponent,
    FilterExportationTypePipe,
    FilterExportationAtelierPipe,
    FilterExportationEtatPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    SocketIoModule.forRoot(config),
    AutosizeModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpResErrInterceptor, multi: true }, NavBarService, AuthService],
  bootstrap: [AppComponent], 
  
})
export class AppModule { 

  
}
