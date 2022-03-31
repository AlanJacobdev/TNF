import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { NavbarComponent } from './navbar/navbar.component';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { CreateTypeObjectComponent } from './create-type-object/create-type-object.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    ConnexionComponent,
    NavbarComponent,
    VisualisationComponent,
    CreateTypeObjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
