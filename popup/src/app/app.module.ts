import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SiteHeaderComponent } from './shared/site-header.component';
import { HomeComponent } from './home/home.component';
import { HomeService } from './home/home.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { StorageService } from './shared/services/storage.service';
import { HitlistAddEditComponent } from './hitlist-add-edit/hitlist-add-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SiteHeaderComponent,
    HitlistAddEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [HomeService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
