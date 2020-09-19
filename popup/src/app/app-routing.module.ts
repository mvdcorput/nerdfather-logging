import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CurrentComponent } from './current/current.component';
import { ViewAllComponent } from './view-all/view-all.component';
import { HitlistAddEditComponent } from './hitlist-add-edit/hitlist-add-edit.component';


const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'current', component: CurrentComponent, pathMatch: 'full' },
  { path: 'upsert-to-hitlist', component: HitlistAddEditComponent },
  { path: 'view-all', component: ViewAllComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
