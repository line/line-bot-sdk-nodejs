export * from './addLiffAppRequest';
export * from './addLiffAppResponse';
export * from './getAllLiffAppsResponse';
export * from './liffApp';
export * from './liffBotPrompt';
export * from './liffFeatures';
export * from './liffScope';
export * from './liffView';
export * from './updateLiffAppRequest';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { AddLiffAppRequest } from './addLiffAppRequest';
import { AddLiffAppResponse } from './addLiffAppResponse';
import { GetAllLiffAppsResponse } from './getAllLiffAppsResponse';
import { LiffApp } from './liffApp';
import { LiffBotPrompt } from './liffBotPrompt';
import { LiffFeatures } from './liffFeatures';
import { LiffScope } from './liffScope';
import { LiffView } from './liffView';
import { UpdateLiffAppRequest } from './updateLiffAppRequest';

