import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IError } from 'src/app/home/home.component';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

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
            console.log('received -> ', msg);
            if (msg) {
                this.ngZone.run(() => {
                    switch (msg.method)
                    {
                        case 'say':
                            console.log('say --> ', msg.data);
                            break;
                        case 'log':
                            console.log('log --> ', msg);
                            this.messages$.pipe(
                                map(msgs => {
                                    if (msgs && msgs.push)
                                    {
                                        msgs.push(msg);
                                    }
                                    return msgs;
                                })
                            ).subscribe(msgs => {
                                this.messages$$.next(msg);
                            });
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
    method: 'say' | 'log' | 'initializePopup';
}

export interface IMessageData {
    error?: IError;
    warning?: IError;
}

export interface IMessageError {
    is404?: boolean;
    url?: string;
}
