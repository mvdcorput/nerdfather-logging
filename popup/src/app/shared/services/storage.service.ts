import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITarget } from '../models/ITarget';

@Injectable({ providedIn: 'root' })
export class StorageService
{
    private _hitList$ = new BehaviorSubject<Array<ITarget>>([]);
    public hitList$ = this._hitList$.asObservable();

    constructor() {
        this.getHitList();
    }

    public getHitList(): Array<ITarget> {
        let hitList = JSON.parse(localStorage.getItem('hitList'));

        if (!hitList || !hitList.length)
        {
            this.setHitList([]);

            hitList = [];
        }   

        return hitList;
    }

    public isOnHitList(url: string): boolean {
        const markedUrls = this.getHitList();

        return !!markedUrls.find((target) => target.url === url);
    }

    public hitup(url: string, application: string, environment: string) {
        const hitList = this.getHitList();

        if (hitList.filter((target) => { return target.url === url}).length === 0)
        {
            hitList.push({
                url : url,
                application : application,
                environment : environment,
                enabled : true
            });

            this.setHitList(hitList);
        }
    }

    public purge() {
        this.setHitList([]);
    }

    public revokeHit(url: string) {
        let hitList = this.getHitList();

        if (hitList.filter((target) => target.url === url).length > 0)
        {
            hitList = hitList.filter((target) => { return target.url !== url });

            this.setHitList(hitList);
        }
    }

    private setHitList(hitList: Array<ITarget>)
    {
        localStorage.setItem('hitList', JSON.stringify(hitList));
    }
}