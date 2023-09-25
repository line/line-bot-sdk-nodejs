export * from './errorResponse';
export * from './missionStickerRequest';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { ErrorResponse } from './errorResponse';
import { MissionStickerRequest } from './missionStickerRequest';

