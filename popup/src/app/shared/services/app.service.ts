import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppService {
    private currentUrl$$ = new BehaviorSubject<string>('neverland');
    public currentUrl$ = this.currentUrl$$.asObservable();

    public domain$ = new Observable<string>();

    constructor(private ngZone: NgZone, private router: Router) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            this.ngZone.run(() => {
                this.currentUrl$$.next(tabs[0].url || null);

                this.domain$ = this.currentUrl$.pipe(
                    filter(url => url !== undefined && url !== null),
                    map(url => {
                        if (url === '')
                        {
                            return url;
                        }

                        url = url.replace(/(https?:\/\/)?(www.)?/i, '');

                        if (url.indexOf('/') !== -1) {
                            return url.split('/')[0];
                        }

                        return url;
                    })
                );
            });
        });
    }

    public hiyaCode = (s) => {
        return s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }
}
