import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MessageCenterService {
  public messages$$ = new BehaviorSubject<Array<IMessage>>([]);
  public readonly messages$ = this.messages$$.asObservable();

  constructor(private ngZone: NgZone) {
    console.trace('InitializePopup call');
    chrome.runtime.sendMessage({ method: 'initializePopup', data: null }, (response) => {
      console.trace('InitializePopup callback');

      this.ngZone.run(() => {
        if (response) {
          this.messages$$.next(response.messages);
        }
      });
    });

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg) {
        this.ngZone.run(() => {
          switch (msg.method) {
            case 'say':
              console.log('say --> ', msg.data);
              break;
            case 'log':
              this.messages$.pipe(
                map(msgs => {
                  if (msgs) {
                    msgs.push(msg);
                  }

                  return msgs || [];
                })
              ).subscribe(msgs => {

                this.messages$$.next(msgs);
              }).unsubscribe();
              break;
          }
        });
      }

      sendResponse({ response: 'ok' });
    });
  }
}

export interface IMessage {
  data?: IMessageData;
  date: Date;
  method: MessageMethod;
  occurenceEndDate: Date;
  occurenceCount: number;
  url: string;
}

export interface IMessageData {
  error?: IMessageError;
  warning?: IMessageWarning;
  message?: IMessageLogging;
  code?: string;
}

export interface IMessageError {
  is404?: boolean;
  url?: string;
  stack?: string;
  line?: string;
  col?: string;
  text?: string;
}

export interface IMessageLogging {
  url?: string;
  text?: string;
}

export type MessageMethod = 'say' | 'log' | 'initializePopup' | 'getMessages';

export interface IMessageWarning {
  is404?: boolean;
  url?: string;
  stack?: string;
  line?: string;
  col?: string;
  text?: string;
}
