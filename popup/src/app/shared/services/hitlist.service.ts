import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { ITarget } from '../models/ITarget';
import { map, tap, first } from 'rxjs/operators';
import { AppService } from './app.service';
import { AddEditService } from './addEditService';
import { OutputType } from '../models/OutputConfigTarget';
import { AuthType } from '../models/AuthType';

@Injectable({ providedIn: 'root' })
export class HitlistService {
    private hitlist$$ = new BehaviorSubject<Array<ITarget>>([]);
    public hitlist$ = this.hitlist$$.asObservable();

    public currentTarget$ = new Observable<ITarget>();

    constructor(private addEditService: AddEditService, private appService: AppService, private ngZone: NgZone) {
        this.getPersistedHitList();

        this.ngZone.run(() => {
            this.currentTarget$ = combineLatest([this.hitlist$, appService.currentUrl$]).pipe(
                map(([hitlist, currentUrl]) => {
                    if (!currentUrl) {
                        return null;
                    }
                    if (!hitlist) {
                        return null;
                    }

                    const matches =
                        hitlist
                            .filter(t => currentUrl.indexOf(t.url) > -1)
                            .sort((a, b) => {
                                return b.url.length - a.url.length;
                            });

                    return matches && matches.length && matches.length > 0 ? matches[0] : null;
                })
            );
        });
    }

    public hitEmUp = () => {
        combineLatest([this.appService.currentUrl$, this.appService.domain$]).pipe(
            map(([url, domain]) => {
                return {
                    url,
                    application: domain,
                    enabled: true,
                    environment: '',
                    isNew: true,
                    outputConfigTypes: [],
                    outputConfigs: [
                      { type: OutputType.applicationInsights, authType: AuthType.anonymous },
                      { type: OutputType.azureEventGrid, authType: AuthType.anonymous },
                      { type: OutputType.seqLog, authType: AuthType.anonymous }
                    ]
                };
            })
        )
        .subscribe(target => this.addEditService.reset(target))
        .unsubscribe();
    }

    public async removeFromHitlist(targetToRemove: ITarget) {
        this.hitlist$.pipe(
            map(t => t.filter(tt => tt.url !== targetToRemove.url))
        )
        .subscribe(list => {
            this.persistHitList(list);

            setTimeout(() => { this.getPersistedHitList(); });
        });
    }

    public upsertToHitList(targetToUpsert: ITarget) {
        this.hitlist$.pipe(
            map(list => {
                if (list == null)
                {
                    return [];
                }

                if (list.filter((target) => target.url === targetToUpsert.url).length === 0) {
                    list.push(targetToUpsert);
                }
                else {
                    list[list.findIndex(target => target.url === targetToUpsert.url)] = targetToUpsert;
                }

                return list;
            })
        ).subscribe(list => {
            list.forEach(t => t.isNew = false);

            this.persistHitList(list);

            setTimeout(() => { this.getPersistedHitList(); });
        });
    }

    // Persisted hitlist
    private async getPersistedHitList() {
        const hitlist = JSON.parse(await localStorage.getItem('hitList'));

        if (hitlist === undefined || hitlist === null) {
            this.hitlist$$.next([]);
            return;
        }

        this.hitlist$$.next(hitlist);
    }

    private async persistHitList(hitList: Array<ITarget>) {
        await localStorage.setItem('hitList', JSON.stringify(hitList));
    }
}
