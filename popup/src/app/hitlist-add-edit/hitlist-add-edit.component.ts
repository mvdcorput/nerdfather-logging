import { Component, OnInit } from '@angular/core';
import { IOutputConfig, ITarget } from '../shared/models/ITarget';
import { MatRadioChange } from '@angular/material/radio';
import { HitlistService } from '../shared/services/hitlist.service';
import { map } from 'rxjs/operators';
import { AppService } from '../shared/services/app.service';
import { combineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AddEditService } from '../shared/services/addEditService';
import { AuthType } from '../shared/models/AuthType';
import { OutputType } from '../shared/models/OutputConfigTarget';
import { Observable } from 'rxjs/internal/Observable';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
    this.addEditService.inEditTarget$.subscribe(
      addEditTarget => {
        if (addEditTarget === null) {
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
              const target = currentTarget ? currentTarget : hitlist.filter(t =>
                this.appService.hiyaCode(t.url) === parseInt(queryParams.id, 0)
              )[0];

              this.addEditService.reset((target || this.newTarget(url, domain)) as ITarget);
            })
            .unsubscribe();
        }
      }
    ).unsubscribe();
  }

  back = () => {
    this.router.navigate(['']);
  }

  checked = (outputType: OutputType): Observable<boolean> => {
    return this.addEditService.inEditTarget$.pipe(
      map(inEditTarget =>
        inEditTarget.outputConfigTypes.indexOf(outputType) > -1
      )
    );
  }

  getConfigTypeName = (configType: OutputType) => {
    let result = 'Onbekend';

    switch (configType) {
      case OutputType.applicationInsights:
        result = 'Application insights';
        break;
      case OutputType.azureEventGrid:
        result = 'Azure event grid';
        break;
      case OutputType.seqLog:
        result = 'Seq log';
        break;
    }

    return result;
  }

  nav = (type: OutputType) => {
    switch (type) {
      case OutputType.applicationInsights:
        this.router.navigate([`/configure-application-insights`]);
        break;
      case OutputType.azureEventGrid:
        this.router.navigate([`/configure-azure-event-grid`]);
        break;
      case OutputType.seqLog:
        this.router.navigate([`/configure-seq-log`]);
        break;
    }
  }

  onCheckboxChangeEventFunc(type: OutputType, event: MatCheckboxChange) {
    this.addEditService.updateActiveConfigurations(type, event.checked);
  }

  removeFromHitlist = () => {
    this.addEditService.inEditTarget$
      .subscribe(target => this.hitlistService.removeFromHitlist(target))
      .unsubscribe();

    this.router.navigate(['']);
  }

  upsertToHitlist = () => {
    this.addEditService.inEditTarget$
      .subscribe(target => {
        this.hitlistService.upsertToHitList(target);
      })
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
