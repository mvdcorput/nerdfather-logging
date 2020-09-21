import { Component, OnInit } from '@angular/core';
import { HitlistService } from '../shared/services/hitlist.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ITarget } from '../shared/models/ITarget';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppService } from '../shared/services/app.service';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss']
})
export class ViewAllComponent implements OnInit {
  navButtonText: string;
  selectedTarget: ITarget;

  hitlist$ = new Observable<ITarget[]>();

  constructor(public hitlistService: HitlistService, private appService: AppService, private location: Location, private router: Router) {
    this.navButtonText = 'Back';
  }

  ngOnInit() {
    this.hitlist$ = this.hitlistService.hitlist$.pipe(
      map(hitlist => {
        return hitlist ? hitlist.sort((a, b) => a.url > b.url ? 1 : -1) : [];
      })
    );
  }

  nav = () => {
    this.location.back();
  }

  edit = (target: ITarget) => {
    this.router.navigate(['/upsert-to-hitlist'], { queryParams: { id: this.appService.hashCode(target.url) } });
  }

  toggleSelected = (target: ITarget) => {
    this.selectedTarget = this.selectedTarget === target ? null : target;
  }
}
