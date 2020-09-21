import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SiteHeaderComponent } from './shared/site-header.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HitlistAddEditComponent } from './hitlist-add-edit/hitlist-add-edit.component';
import { CurrentComponent } from './current/current.component';
import { ViewAllComponent } from './view-all/view-all.component';
import { AppService } from './shared/services/app.service';
import { HitlistService } from './shared/services/hitlist.service';
import { MessageCenterService } from './shared/services/message-center.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SiteHeaderComponent,
    HitlistAddEditComponent,
    CurrentComponent,
    ViewAllComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [AppService, HitlistService, MessageCenterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
