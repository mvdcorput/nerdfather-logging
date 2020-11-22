import { Component, OnInit } from '@angular/core';
import { IOutputConfig, ITarget } from '../shared/models/ITarget';
import { HitlistService } from '../shared/services/hitlist.service';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { AppService } from '../shared/services/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AddEditService } from '../shared/services/addEditService';
import { Observable, of } from 'rxjs';
import { AuthType } from '../shared/models/AuthType';
import { OutputType } from '../shared/models/OutputConfigTarget';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-hitlist-configure-azure-event-grid',
  templateUrl: './hitlist-configure-azure-event-grid.component.html',
  styleUrls: ['./hitlist-configure-azure-event-grid.component.scss']
})
export class HitlistConfigureAzureEventGridComponent implements OnInit {
  outputTarget: string;
  navButtonText: string;
  testButtonText: string;
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
    this.testButtonText = 'Test';
    this.saveButtonText = 'Save';
  }

  ngOnInit() {
      this.outputConfig$ = this.addEditService.inEditTarget$.
        pipe(
          map(t => {
            return t.outputConfigs.find(x => x.type === OutputType.azureEventGrid);
          })
        );
  }

  back = () => {
    this.router.navigate(['/upsert-to-hitlist']);
  }

  onCheckboxChangeEventFunc(type: OutputType, event: MatRadioChange) {
    this.addEditService.updateActiveConfigurations(type, event.value);
  }

  test = () => {
  }

  save = () => {
    let target: ITarget;

    this.addEditService.inEditTarget$.subscribe(t => target = t);
    debugger;
    this.hitlistService.upsertToHitList(target);

    this.router.navigate(['']);
  }
}
