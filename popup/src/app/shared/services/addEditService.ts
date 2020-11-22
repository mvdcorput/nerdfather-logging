import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITarget } from '../models/ITarget';

@Injectable({ providedIn: 'root' })
export class AddEditService {
    private inEditTarget$$ = new BehaviorSubject<ITarget>(null);
    public inEditTarget$ = this.inEditTarget$$.asObservable();

    public reset = (target: ITarget = null) => {
        this.inEditTarget$$.next(target);
    }
}
