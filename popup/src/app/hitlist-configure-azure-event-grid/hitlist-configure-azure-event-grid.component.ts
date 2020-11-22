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
  selector: 'app-hitlist-configure-azure-event-grid',
  templateUrl: './hitlist-configure-azure-event-grid.component.html',
  styleUrls: ['./hitlist-configure-azure-event-grid.component.scss']
})
export class HitlistConfigureAzureEventGridComponent implements OnInit {
  outputTarget: string;
  navButtonText: string;
  saveButtonText: string;

  constructor(
    public addEditService: AddEditService,
    private appService: AppService,
    private hitlistService: HitlistService,
    private location: Location,
    public router: Router,
    private route: ActivatedRoute) {
    this.navButtonText = 'Back';
    this.saveButtonText = 'Save';
  }

  ngOnInit() {
    console.trace('HitlistConfigureAzureEventGridComponent init');
  }

  back = () => {
    this.router.navigate(['/upsert-to-hitlist']);
  }

  save = () => {
    this.addEditService.inEditTarget$
        .pipe(
          tap(target => this.hitlistService.upsertToHitList(target))
        );
    this.router.navigate(['']);
  }
}
