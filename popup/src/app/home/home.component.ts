import * as $ from 'jquery';
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HitlistService } from '../shared/services/hitlist.service';
import { filter, map, tap } from 'rxjs/operators';
import { MessageCenterService, IMessage } from '../shared/services/message-center.service';
import { FileService } from '../shared/services/file.service';

@Component({
  selector: 'app-site-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private errors$$: BehaviorSubject<Array<IError>> = new BehaviorSubject<Array<IError>>([]);
  public readonly errors$: Observable<Array<IError>> = this.errors$$.asObservable();

  private messageCounts$$: BehaviorSubject<IMessageCounts> = new BehaviorSubject<IMessageCounts>(null);
  public readonly messageCounts$: Observable<IMessageCounts> = this.messageCounts$$.asObservable();

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

  constructor(
    private fileService: FileService,
    public hitlistService: HitlistService,
    private messageCenterService: MessageCenterService,
    private router: Router) {

    const self = this;

    this.errors$$.next([{
      message: 'Test',
      time: new Date()
    }]);

    // Initialize observables
    this.messageCounts$$.next(
      {
        userMessages: 0,
        errors: 0,
        warnings: 0,
        info: 0
      }
    );
  }

  ngOnInit() {
    this.hitlistService.currentTarget$.pipe(
      filter(t => t !== undefined && t !== null)
    ).subscribe(e => {
      this.router.navigate(['/current']);
    });

    this.messageCenterService.messages$.pipe(
      filter(t => t !== undefined && t !== null),
      map(msgs => {
        return {
          userMessages: 0,
          errors: msgs.filter && msgs.filter(m => m.method === 'log' && m.data && m.data.error).length || 0,
          warnings: msgs.filter && msgs.filter(m => m.method === 'log' && m.data && m.data.warning).length || 0,
          info: 0
        };
      })
    ).subscribe(messageCounts => {
      this.messageCounts$$.next(messageCounts);
    });
  }


  download = () => {
    this.messageCenterService.messages$.subscribe(msgs => this.fileService.downloadMessages(msgs));
  }

  messagesToTab = () => {
    this.messageCenterService.messages$.subscribe(msgs => this.fileService.messagesToTab(msgs));
  }


  viewHitlist = () => {
    this.router.navigate(['/view-all']);
  }
}

export interface IError {
  message: string;
  time: Date;
}

export interface IMessageCounts
{
  userMessages: number;
  errors: number;
  warnings: number;
  info: number;
}

export enum MessageType {
  userMessages = 2,
  errors = 3,
  warnings = 4,
  info = 5
}

export type MessageCount = {
  type: MessageType;
  count: number;
};
