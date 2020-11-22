import * as $ from 'jquery';
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { Router } from '@angular/router';
import { HitlistService } from '../shared/services/hitlist.service';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { MessageCenterService, IMessage } from '../shared/services/message-center.service';
import { FileService } from '../shared/services/file.service';
import { AppService } from '../shared/services/app.service';

@Component({
  selector: 'app-site-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private errors$$: BehaviorSubject<Array<IError>> = new BehaviorSubject<Array<IError>>([]);
  public readonly errors$: Observable<Array<IError>> = this.errors$$.asObservable();

  public messageCounters$ = new Observable<IMessageCounts>();

  constructor(
    public appService: AppService,
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
    this.messageCounters$ = of(
      {
        userMessages: 0,
        errors: 0,
        warnings: 0,
        info: 0
      }
    );
  }

  ngOnInit() {
    console.trace('HomeComponent init');

    this.messageCounters$ = combineLatest([this.appService.currentUrl$, this.messageCenterService.messages$]).pipe(
      filter(([, msgs]) => msgs !== undefined && msgs !== null),
      map(([url, msgs]) => {
        return {
          userMessages: 0,
          errors: this.filterMessagesByUrl(msgs, url).filter(m => m.data && m.data.error).length || 0,
          warnings: this.filterMessagesByUrl(msgs, url).filter(m => m.data && m.data.warning).length || 0,
          info: this.filterMessagesByUrl(msgs, url).filter(m => m.data && m.data.message).length || 0,
        };
      })
    );
  }

  download = () => {
    this.messageCenterService.messages$.subscribe(msgs => this.fileService.downloadMessages(msgs));
  }

  messagesToTab = () => {
    combineLatest([this.appService.currentUrl$, this.messageCenterService.messages$]).pipe(
      filter(([, msgs]) => msgs !== undefined && msgs !== null),
      map(([url, msgs]) => {
        return this.filterMessagesByUrl(msgs, url);
      })
    ).subscribe(msgs => this.fileService.messagesToTab(msgs));
  }

  upsertToHitlist = () => {
    this.router.navigate(['/upsert-to-hitlist']);
  }

  viewHitlist = () => {
    this.router.navigate(['/view-all']);
  }

  private filterMessagesByUrl = (msgs: IMessage[], url: string) => {
    const result: IMessage[] = [];

    if (msgs.length) {
      result.push(...msgs.filter(m => m.method === 'log' && m.url === url));
    }

    return result;
  }
}

export interface IError {
  message: string;
  time: Date;
}

export interface IMessageCounts {
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
