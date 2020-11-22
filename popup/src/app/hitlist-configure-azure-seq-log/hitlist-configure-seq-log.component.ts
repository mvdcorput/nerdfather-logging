import { Component, OnInit, enableProdMode } from '@angular/core';
import { IOutputConfig, ITarget } from '../shared/models/ITarget';
import { MatRadioChange } from '@angular/material/radio';
import { HitlistService } from '../shared/services/hitlist.service';
import { Location } from '@angular/common';
import { map, tap, first, filter } from 'rxjs/operators';
import { AppService } from '../shared/services/app.service';
import { Observable, combineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AddEditService } from '../shared/services/addEditService';
import { AuthType } from '../shared/models/AuthType';
import { OutputType } from '../shared/models/OutputConfigTarget';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-hitlist-configure-seq-log',
  templateUrl: './hitlist-configure-seq-log.component.html',
  styleUrls: ['./hitlist-configure-seq-log.component.scss']
})
export class HitlistConfigureSeqLogComponent implements OnInit {
  outputTarget: string;
  navButtonText: string;
  saveButtonText: string;

  public AuthType = AuthType;

  public outputConfig$: Observable<IOutputConfig> = of({
    type: OutputType.azureEventGrid,
    authType: AuthType.anonymous,
    url: ''
  });

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
    this.outputConfig$ = this.addEditService.inEditTarget$.
      pipe(
        map(t => {
          return t.outputConfigs.find(x => x.type === OutputType.seqLog);
        })
      );
  }

  back = () => {
    this.router.navigate(['/upsert-to-hitlist']);
  }

  save = () => {
    let target: ITarget;

    combineLatest([this.addEditService.inEditTarget$, this.outputConfig$])
      .subscribe(([inEditTarget, outputConfig]) => {
        target = inEditTarget;

        const index = target.outputConfigs.findIndex(c => c.type === outputConfig.type);

        target.outputConfigs[index] = outputConfig;
      });

    this.hitlistService.upsertToHitList(target);

    this.router.navigate(['']);
  }
}
