import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewAllComponent } from './view-all/view-all.component';
import { HitlistAddEditComponent } from './hitlist-add-edit/hitlist-add-edit.component';
import { HitlistConfigureSeqLogComponent } from './hitlist-configure-azure-seq-log/hitlist-configure-seq-log.component';
import { HitlistConfigureAzureEventGridComponent } from './hitlist-configure-azure-event-grid/hitlist-configure-azure-event-grid.component';
import { HitlistConfigureApplicationInsightsComponent } from './hitlist-configure-application-insights/hitlist-configure-application-insights.component';


const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'upsert-to-hitlist', component: HitlistAddEditComponent },
  { path: 'configure-application-insights', component: HitlistConfigureApplicationInsightsComponent, pathMatch: 'full' },
  { path: 'configure-azure-event-grid', component: HitlistConfigureAzureEventGridComponent, pathMatch: 'full' },
  { path: 'configure-seq-log', component: HitlistConfigureSeqLogComponent, pathMatch: 'full' },
  { path: 'view-all', component: ViewAllComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
