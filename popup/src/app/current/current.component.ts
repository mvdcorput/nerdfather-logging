import { Component, OnInit, Input } from '@angular/core';
import { ITarget } from '../shared/models/ITarget';
import { Router } from '@angular/router';
import { HitlistService } from '../shared/services/hitlist.service';
import { tap, throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss']
})
export class CurrentComponent implements OnInit {
  @Input() target: ITarget;

  editing = false;
  viewAll = false;

  constructor(private hitlistService: HitlistService, private router: Router) {

  }

  ngOnInit() {
  }

  upsertToHitlist = () => {
    this.router.navigate(['/upsert-to-hitlist']);
  }

  viewHitlist = () => {
    this.router.navigate(['/view-all']);
  }
}
