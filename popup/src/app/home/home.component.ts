import * as $ from 'jquery';
import { Component, NgZone, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { HitlistService } from '../shared/services/hitlist.service';
import { first, map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-site-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  errors$$: BehaviorSubject<Array<IError>> = new BehaviorSubject<Array<IError>>([]);
  errors$: Observable<Array<IError>> = this.errors$$.asObservable();

  // private doYo = (method, data, callback) => {
  //   chrome.runtime.sendMessage({ method: method, data: data }, function (response) {
  //       if(typeof callback === "function") callback(response);
  //   });
  // }

  // private doYoTab = (tabId, method, data, callback) => {
  //   chrome.tabs.sendMessage(tabId, {method: method, data: data}, function(response){
  //       if(typeof callback === "function") callback(response);
  //   });
  // }

  constructor(public hitlistService: HitlistService, private router: Router) {
    const self = this;

    this.errors$$.next([{
      message: 'Test',
      time: new Date()
    }]);
  }

  ngOnInit() {
    this.hitlistService.currentTarget$.pipe(
      filter(t => t !== undefined && t !== null)
    )
    .subscribe(e => {
      this.router.navigate(['/current']);
    });
  }

  viewHitlist = () => {
    this.router.navigate(['/view-all']);
  }
}

export interface IError {
  message: string;
  time: Date;
}
