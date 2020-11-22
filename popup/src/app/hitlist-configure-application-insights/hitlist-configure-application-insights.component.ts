import { Component, OnInit, enableProdMode } from '@angular/core';
import { ITarget } from '../shared/models/ITarget';
import { MatRadioChange } from '@angular/material/radio';
import { HitlistService } from '../shared/services/hitlist.service';
import { Location } from '@angular/common';
import { map, tap, first, filter } from 'rxjs/operators';
import { AppService } from '../shared/services/app.service';
import { Observable, combineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AddEditService } from '../shared/services/addEditService';

@Component({
  selector: 'app-hitlist-configure-application-insights',
  templateUrl: './hitlist-configure-application-insights.component.html',
  styleUrls: ['./hitlist-configure-application-insights.component.scss']
})
export class HitlistConfigureApplicationInsightsComponent implements OnInit {
  outputTarget: string;
  navButtonText: string;
  saveButtonText: string;

  target$ = new Observable<ITarget>();

  constructor(
    public addEditService: AddEditService,
    private hitlistService: HitlistService,
    private location: Location,
    public router: Router,
    private route: ActivatedRoute) {
    this.navButtonText = 'Back';
    this.saveButtonText = 'Save';
  }

  ngOnInit() {
    console.trace('HitlistConfigureApplicationInsightsComponent init');
  }

  back = () => {
    this.router.navigate(['/upsert-to-hitlist']);
  }

  save = () => {
    this.target$
        .subscribe(target => this.hitlistService.upsertToHitList(target))
        .unsubscribe();

    this.router.navigate(['']);
  }
}
