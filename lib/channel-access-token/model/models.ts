import localVarRequest from 'request';

export * from './channelAccessTokenKeyIdsResponse';
export * from './errorResponse';
export * from './issueChannelAccessTokenResponse';
export * from './issueShortLivedChannelAccessTokenResponse';
export * from './issueStatelessChannelAccessTokenResponse';
export * from './verifyChannelAccessTokenResponse';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { ChannelAccessTokenKeyIdsResponse } from './channelAccessTokenKeyIdsResponse';
import { ErrorResponse } from './errorResponse';
import { IssueChannelAccessTokenResponse } from './issueChannelAccessTokenResponse';
import { IssueShortLivedChannelAccessTokenResponse } from './issueShortLivedChannelAccessTokenResponse';
import { IssueStatelessChannelAccessTokenResponse } from './issueStatelessChannelAccessTokenResponse';
import { VerifyChannelAccessTokenResponse } from './verifyChannelAccessTokenResponse';

