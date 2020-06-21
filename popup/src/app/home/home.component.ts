import * as $ from 'jquery';
import { map } from 'rxjs/operators';
import { Component } from '@angular/core';
import { HomeService } from './home.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { StorageService } from '../shared/services/storage.service';
import { ITarget } from '../shared/models/ITarget';

@Component({
  selector: 'app-site-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  _errors$: BehaviorSubject<Array<IError>> = new BehaviorSubject<Array<IError>>([]);
  errors$: Observable<Array<IError>> = this._errors$.asObservable();

  _currentTarget$: BehaviorSubject<ITarget> = new BehaviorSubject<ITarget>(null);
  currentTarget$: Observable<ITarget> = this._currentTarget$.asObservable();

  currentUrl: string = null;

  private doYo = (method, data, callback) => {
    chrome.runtime.sendMessage({ method: method, data: data }, function (response) {
        if(typeof callback === "function") callback(response);
    });
  }

  private doYoTab = (tabId, method, data, callback) => {
    chrome.tabs.sendMessage(tabId, {method: method, data: data}, function(response){
        if(typeof callback === "function") callback(response);
    });
  }

  constructor(private service: HomeService, public storage: StorageService)
  {
    this._errors$.next([{
      message: 'Test',
      time: new Date()
    }]);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      this.currentUrl = tabs[0].url;
    });
  }

  addToHitlist = () => {
    this._currentTarget$.next({
      url: this.currentUrl,
      environment: 'string',
      application: '',
      enabled: true
     });
  }

  onRemoveFromHitlist(target: ITarget) {
    this._currentTarget$.next(null);
  }
}

export interface IError {
  message: string;
  time: Date;
}