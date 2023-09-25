import localVarRequest from 'request';

export * from './ageTile';
export * from './appTypeTile';
export * from './areaTile';
export * from './errorDetail';
export * from './errorResponse';
export * from './genderTile';
export * from './getFriendsDemographicsResponse';
export * from './getMessageEventResponse';
export * from './getMessageEventResponseClick';
export * from './getMessageEventResponseMessage';
export * from './getMessageEventResponseOverview';
export * from './getNumberOfFollowersResponse';
export * from './getNumberOfMessageDeliveriesResponse';
export * from './getStatisticsPerUnitResponse';
export * from './getStatisticsPerUnitResponseClick';
export * from './getStatisticsPerUnitResponseMessage';
export * from './getStatisticsPerUnitResponseOverview';
export * from './subscriptionPeriodTile';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { AgeTile } from './ageTile';
import { AppTypeTile } from './appTypeTile';
import { AreaTile } from './areaTile';
import { ErrorDetail } from './errorDetail';
import { ErrorResponse } from './errorResponse';
import { GenderTile } from './genderTile';
import { GetFriendsDemographicsResponse } from './getFriendsDemographicsResponse';
import { GetMessageEventResponse } from './getMessageEventResponse';
import { GetMessageEventResponseClick } from './getMessageEventResponseClick';
import { GetMessageEventResponseMessage } from './getMessageEventResponseMessage';
import { GetMessageEventResponseOverview } from './getMessageEventResponseOverview';
import { GetNumberOfFollowersResponse } from './getNumberOfFollowersResponse';
import { GetNumberOfMessageDeliveriesResponse } from './getNumberOfMessageDeliveriesResponse';
import { GetStatisticsPerUnitResponse } from './getStatisticsPerUnitResponse';
import { GetStatisticsPerUnitResponseClick } from './getStatisticsPerUnitResponseClick';
import { GetStatisticsPerUnitResponseMessage } from './getStatisticsPerUnitResponseMessage';
import { GetStatisticsPerUnitResponseOverview } from './getStatisticsPerUnitResponseOverview';
import { SubscriptionPeriodTile } from './subscriptionPeriodTile';

