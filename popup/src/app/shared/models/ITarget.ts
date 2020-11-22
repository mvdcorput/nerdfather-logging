import { AuthType } from './AuthType';
import { OutputType } from './OutputConfigTarget';

export interface ITarget
{
    url: string;
    environment: string;
    application: string;
    enabled: boolean;
    isNew?: boolean;
    outputConfigTypes: OutputType[];
    outputConfigs: IOutputConfig[];
}

export interface IOutputConfig {
    type: OutputType;
    url?: string;
    authType: AuthType;
    secret?: string;
    username?: string;
    password?: string;
}
