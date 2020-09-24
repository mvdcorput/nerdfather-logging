import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MessageCenterService {
    public messages$$ = new BehaviorSubject<Array<IMessage>>([]);
    public readonly messages$ = this.messages$$.asObservable();

    constructor(private ngZone: NgZone) {
        chrome.runtime.sendMessage({ method: 'initializePopup', data: null }, (response) => {
            console.log('initializePopup callback', response);
            if (response) {
                this.ngZone.run(() => {
                    this.messages$$.next(response.messages);
                });
            }
        });

        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
            if (msg) {

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
                            this.ngZone.run(() => {
                                this.messages$$.next(msgs);
                            });
                        }).unsubscribe();
                        break;
                }
            }

            sendResponse({ response: 'ok' });
        });
    }
}

export interface IMessage {
    date: Date;
    data?: IMessageData;
    method: 'say' | 'log' | 'initializePopup';
}

export interface IMessageData {
    message?: IMessageLogging;
    error?: IMessageError;
    warning?: IMessageWarning;
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

export interface IMessageWarning {
    is404?: boolean;
    url?: string;
    stack?: string;
    line?: string;
    col?: string;
    text?: string;
}

