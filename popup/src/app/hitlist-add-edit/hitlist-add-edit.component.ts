import { Component, OnInit } from '@angular/core';
import { ITarget } from '../shared/models/ITarget';
import { MatRadioChange } from '@angular/material/radio';
import { HitlistService } from '../shared/services/hitlist.service';
import { filter, tap, isEmpty, map } from 'rxjs/operators';
import { AppService } from '../shared/services/app.service';
import { combineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AddEditService } from '../shared/services/addEditService';
import { AuthType } from '../shared/models/AuthType';
import { OutputType } from '../shared/models/OutputConfigTarget';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-hitlist-add-edit',
  templateUrl: './hitlist-add-edit.component.html',
  styleUrls: ['./hitlist-add-edit.component.scss']
})
export class HitlistAddEditComponent implements OnInit {
  outputTarget: string;
  navButtonText: string;
  addButtonText: string;
  updateButtonText: string;

  constructor(
    public addEditService: AddEditService,
    private appService: AppService,
    private hitlistService: HitlistService,
    public router: Router,
    private route: ActivatedRoute) {

    this.navButtonText = 'Back';
    this.addButtonText = 'Add';
    this.updateButtonText = 'Update';
  }

  ngOnInit() {
    console.trace('HitlistAddEditComponent init');

    this.addEditService.inEditTarget$.subscribe(
      addEditTarget => {
        if (addEditTarget === null) {
          console.trace('Initializing update of this.addEditService.inEditTarget$', addEditTarget);

          combineLatest(
            [
              this.appService.currentUrl$,
              this.appService.domain$,
              this.hitlistService.currentTarget$,
              this.hitlistService.hitlist$,
              this.route.queryParams
            ]
          )
          .subscribe(([url, domain, currentTarget, hitlist, queryParams]) => {
            console.trace('Updating this.addEditService.inEditTarget$', url, domain, currentTarget, hitlist, queryParams);

            const target = currentTarget ? currentTarget : hitlist.filter(t => 
              this.appService.hiyaCode(t.url) === parseInt(queryParams.id, 0)
            )[0];

            this.addEditService.reset((target || this.newTarget(url, domain)) as ITarget);
          })
          .unsubscribe();
        }
      }
    );
  }

  back = () => {
    this.router.navigate(['']);
  }

  nav = (path: string) => {
    this.router.navigate([`/${path}`]);
  }

  checked = (outputType: OutputType): Observable<boolean> => {
    return this.addEditService.inEditTarget$.pipe(
      map(inEditTarget =>
        inEditTarget.outputConfigTypes.indexOf(outputType) > -1
      )
    );
  }

  getConfigTypeName(configType: OutputType) {
    let result = 'Onbekend';

    switch (configType) {
      case OutputType.applicationInsights:
        result = 'Applicaiton insights';
        break;
      case OutputType.azureEventGrid:
        result = 'Azure event grid';
        break;
      case OutputType.applicationInsights:
        result = 'Seq log';
        break;
    }

    return result;
  }

  onOutputTargetChange = ($event: MatRadioChange) => {
    this.outputTarget = $event.value;
  }

  removeFromHitlist = () => {
    this.addEditService.inEditTarget$
      .subscribe(target => this.hitlistService.removeFromHitlist(target))
      .unsubscribe();

    this.router.navigate(['']);
  }

  upsertToHitlist = () => {
    this.addEditService.inEditTarget$
      .subscribe(target => this.hitlistService.upsertToHitList(target))
      .unsubscribe();

    this.router.navigate(['']);
  }

  private newTarget = (url: string, domain: string): ITarget => {
    return {
      url,
      environment: '',
      application: domain,
      enabled: true,
      isNew: true,
      outputConfigTypes: [],
      outputConfigs: [
        { type: OutputType.applicationInsights, authType: AuthType.anonymous },
        { type: OutputType.azureEventGrid, authType: AuthType.anonymous },
        { type: OutputType.seqLog, authType: AuthType.anonymous }
      ]
    };
  }
}
