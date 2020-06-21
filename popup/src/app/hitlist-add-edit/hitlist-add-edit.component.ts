import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { ITarget } from '../shared/models/ITarget';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hitlist-add-edit',
  templateUrl: './hitlist-add-edit.component.html',
  styleUrls: ['./hitlist-add-edit.component.scss']
})
export class HitlistAddEditComponent implements OnInit {
  @Input() inputTarget:Observable<ITarget>;
  @Input() onRemoveFromHitlist: (target: ITarget) => void;

  currentTarget:ITarget = null;

  ngOnInit() {
    this.inputTarget.subscribe(val => {
      this.currentTarget = val;
    })
  }
  upsertToHitlist = () => {

  }

  removeFromHitlist = () => {
    if (!!this.onRemoveFromHitlist) this.onRemoveFromHitlist(this.currentTarget);
  }
}
