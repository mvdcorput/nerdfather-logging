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
import { ViewAllComponent } from './view-all/view-all.component';
import { AppService } from './shared/services/app.service';
import { HitlistService } from './shared/services/hitlist.service';
import { MessageCenterService } from './shared/services/message-center.service';
import { FileService } from './shared/services/file.service';
import { HitlistConfigureApplicationInsightsComponent } from './hitlist-configure-application-insights/hitlist-configure-application-insights.component';
import { HitlistConfigureAzureEventGridComponent } from './hitlist-configure-azure-event-grid/hitlist-configure-azure-event-grid.component';
import { HitlistConfigureSeqLogComponent } from './hitlist-configure-azure-seq-log/hitlist-configure-seq-log.component';
import { AddEditService } from './shared/services/addEditService';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SiteHeaderComponent,
    HitlistAddEditComponent,
    HitlistConfigureApplicationInsightsComponent,
    HitlistConfigureAzureEventGridComponent,
    HitlistConfigureSeqLogComponent,
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
  providers: [AppService, AddEditService, FileService, HitlistService, MessageCenterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
