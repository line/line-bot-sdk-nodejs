/**
 * LINE Messaging API(Insight)
 * This document describes LINE Messaging API(Insight).
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/* tslint:disable:no-unused-locals */
import { GetFriendsDemographicsResponse } from '../model/getFriendsDemographicsResponse';
import { GetMessageEventResponse } from '../model/getMessageEventResponse';
import { GetNumberOfFollowersResponse } from '../model/getNumberOfFollowersResponse';
import { GetNumberOfMessageDeliveriesResponse } from '../model/getNumberOfMessageDeliveriesResponse';
import { GetStatisticsPerUnitResponse } from '../model/getStatisticsPerUnitResponse';
import * as Types from "../../types";
import {ensureJSON} from "../../utils";
import {Readable} from "stream";

import { RequestFile } from '../../http';
import HTTPClient from "../../http";
import {AxiosResponse} from "axios";

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================


interface httpClientConfig {
    baseURL?: string;
    channelAccessToken: string;
    // TODO support defaultHeaders?
}


export class InsightClient {
    private httpClient: HTTPClient;

    constructor(config: httpClientConfig) {
        if (!config.baseURL) {
            config.baseURL = 'https://api.line.me';
        }
        this.httpClient = new HTTPClient({
            defaultHeaders: {
                Authorization: "Bearer " + config.channelAccessToken,
            },
            responseParser: this.parseHTTPResponse.bind(this),
            baseURL: config.baseURL,
        });
    }

    private parseHTTPResponse(response: AxiosResponse) {
        const { LINE_REQUEST_ID_HTTP_HEADER_NAME } = Types;
        let resBody = {
            ...response.data,
        };
        if (response.headers[LINE_REQUEST_ID_HTTP_HEADER_NAME]) {
            resBody[LINE_REQUEST_ID_HTTP_HEADER_NAME] =
                response.headers[LINE_REQUEST_ID_HTTP_HEADER_NAME];
        }
        return resBody;
    }

    /**
     * Retrieves the demographic attributes for a LINE Official Account\'s friends.You can only retrieve information about friends for LINE Official Accounts created by users in Japan (JP), Thailand (TH), Taiwan (TW) and Indonesia (ID). 
     */
    public async getFriendsDemographics() : Promise<GetFriendsDemographicsResponse> {
        





        const res = this.httpClient.get<GetFriendsDemographicsResponse>(
            "/v2/bot/insight/demographic",
            
            
            
            
        );
        return ensureJSON(res);
    }
    /**
     * Returns statistics about how users interact with narrowcast messages or broadcast messages sent from your LINE Official Account. 
     * @summary Get user interaction statistics
     * @param requestId Request ID of a narrowcast message or broadcast message. Each Messaging API request has a request ID. 
     */
    public async getMessageEvent(requestId: string, ) : Promise<GetMessageEventResponse> {
        



        const queryParams = {
            "requestId": requestId,
        };


        const res = this.httpClient.get<GetMessageEventResponse>(
            "/v2/bot/insight/message/event",
            
            
            queryParams,
            
        );
        return ensureJSON(res);
    }
    /**
     * Returns the number of users who have added the LINE Official Account on or before a specified date. 
     * @summary Get number of followers
     * @param date Date for which to retrieve the number of followers.  Format: yyyyMMdd (e.g. 20191231) Timezone: UTC+9 
     */
    public async getNumberOfFollowers(date?: string, ) : Promise<GetNumberOfFollowersResponse> {
        



        const queryParams = {
            "date": date,
        };


        const res = this.httpClient.get<GetNumberOfFollowersResponse>(
            "/v2/bot/insight/followers",
            
            
            queryParams,
            
        );
        return ensureJSON(res);
    }
    /**
     * Returns the number of messages sent from LINE Official Account on a specified day. 
     * @summary Get number of message deliveries
     * @param date Date for which to retrieve number of sent messages. - Format: yyyyMMdd (e.g. 20191231) - Timezone: UTC+9 
     */
    public async getNumberOfMessageDeliveries(date: string, ) : Promise<GetNumberOfMessageDeliveriesResponse> {
        



        const queryParams = {
            "date": date,
        };


        const res = this.httpClient.get<GetNumberOfMessageDeliveriesResponse>(
            "/v2/bot/insight/message/delivery",
            
            
            queryParams,
            
        );
        return ensureJSON(res);
    }
    /**
     * You can check the per-unit statistics of how users interact with push messages and multicast messages sent from your LINE Official Account. 
     * @param customAggregationUnit Name of aggregation unit specified when sending the message. Case-sensitive. For example, &#x60;Promotion_a&#x60; and &#x60;Promotion_A&#x60; are regarded as different unit names. 
     * @param from Start date of aggregation period.  Format: yyyyMMdd (e.g. 20210301) Time zone: UTC+9 
     * @param to End date of aggregation period. The end date can be specified for up to 30 days later. For example, if the start date is 20210301, the latest end date is 20210331.  Format: yyyyMMdd (e.g. 20210301) Time zone: UTC+9 
     */
    public async getStatisticsPerUnit(customAggregationUnit: string, from: string, to: string, ) : Promise<GetStatisticsPerUnitResponse> {
        



        const queryParams = {
            "customAggregationUnit": customAggregationUnit,
            "from": from,
            "to": to,
        };


        const res = this.httpClient.get<GetStatisticsPerUnitResponse>(
            "/v2/bot/insight/message/event/aggregation",
            
            
            queryParams,
            
        );
        return ensureJSON(res);
    }
}