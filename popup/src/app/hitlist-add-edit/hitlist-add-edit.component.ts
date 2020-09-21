import { Component, OnInit, enableProdMode } from '@angular/core';
import { ITarget } from '../shared/models/ITarget';
import { MatRadioChange } from '@angular/material/radio';
import { HitlistService } from '../shared/services/hitlist.service';
import { Location } from '@angular/common';
import { map, tap, first, filter } from 'rxjs/operators';
import { AppService } from '../shared/services/app.service';
import { Observable, combineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

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

  target$ = new Observable<ITarget>();

  constructor(
    private appService: AppService,
    private hitlistService: HitlistService,
    private location: Location,
    public router: Router,
    private route: ActivatedRoute) {

    this.navButtonText = 'Back';
    this.addButtonText = 'Add';
    this.updateButtonText = 'Update';
  }

  ngOnInit() {
    this.target$ = combineLatest(
      [
        this.hitlistService.currentTarget$,
        this.appService.currentUrl$,
        this.appService.domain$,
        this.hitlistService.hitlist$,
        this.route.queryParams
      ]
    ).pipe(
      filter(([currentTarget, url, domain, hitlist, queryParams]) => hitlist !== null),
      map(([currentTarget, url, domain, hitlist, queryParams]) => {
        const target = currentTarget ?
          currentTarget :
          hitlist.filter(t => this.appService.hashCode(t.url) === parseInt(queryParams['id'], 0))[0];

        return (target || this.newTarget(url, domain)) as ITarget;
      })
    );
  }

  nav = () => {
    this.location.back();
  }

  onOutputTargetChange = ($event: MatRadioChange) => {
    this.outputTarget = $event.value;
  }

  removeFromHitlist = () => {
    this.target$
      .subscribe(target => this.hitlistService.removeFromHitlist(target))
      .unsubscribe();

    this.router.navigate(['']);
  }

  upsertToHitlist = () => {
    this.target$
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
      isNew: true
    };
  }
}
