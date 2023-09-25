export * from './acquireChatControlRequest';
export * from './detachModuleRequest';
export * from './getModulesResponse';
export * from './moduleBot';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { AcquireChatControlRequest } from './acquireChatControlRequest';
import { DetachModuleRequest } from './detachModuleRequest';
import { GetModulesResponse } from './getModulesResponse';
import { ModuleBot } from './moduleBot';

