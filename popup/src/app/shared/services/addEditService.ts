import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { ITarget, IOutputConfig } from '../models/ITarget';
import { OutputType } from '../models/OutputConfigTarget';

@Injectable({ providedIn: 'root' })
export class AddEditService {
    private inEditTarget$$ = new BehaviorSubject<ITarget>(null);
    public inEditTarget$ = this.inEditTarget$$.asObservable();

    public reset = (target: ITarget = null) => {
        this.inEditTarget$$.next(target);
    }

    public updateConfiguration = (config: IOutputConfig) => {
        this.inEditTarget$.subscribe(
            target => {
                const configs: IOutputConfig[] = [];

                for (const existingConfig of target.outputConfigs) {
                    if (existingConfig.type === config.type) {
                        configs.push(config);
                    } else {
                        configs.push(existingConfig);
                    }
                }

                target.outputConfigs = configs;

                this.inEditTarget$$.next(target);
            }
        ).unsubscribe();
    }

    public updateActiveConfigurations = (type: OutputType, active: boolean) => {
        let target;

        this.inEditTarget$.pipe(first()).subscribe(t => {
            target = t;

            if (active) {
                if (target.outputConfigTypes.indexOf(type) === -1) {
                    target.outputConfigTypes.push(type);
                }
            }
            else {
                const outputTypes: OutputType[] = [];
                for (const existingType of target.outputConfigTypes) {
                    if (existingType !== type) {
                        outputTypes.push(existingType);
                    }
                }
                target.outputConfigTypes = outputTypes;
            }

            return target;
        }).unsubscribe();

        this.inEditTarget$$.next(target);
    }
}


