/**
 * LINE Messaging API
 * This document describes LINE Messaging API.
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/* tslint:disable:no-unused-locals */
import { AddAudienceToAudienceGroupRequest } from "../model/addAudienceToAudienceGroupRequest.js";
import { AudienceGroupCreateRoute } from "../model/audienceGroupCreateRoute.js";
import { AudienceGroupStatus } from "../model/audienceGroupStatus.js";
import { CreateAudienceGroupRequest } from "../model/createAudienceGroupRequest.js";
import { CreateAudienceGroupResponse } from "../model/createAudienceGroupResponse.js";
import { CreateClickBasedAudienceGroupRequest } from "../model/createClickBasedAudienceGroupRequest.js";
import { CreateClickBasedAudienceGroupResponse } from "../model/createClickBasedAudienceGroupResponse.js";
import { CreateImpBasedAudienceGroupRequest } from "../model/createImpBasedAudienceGroupRequest.js";
import { CreateImpBasedAudienceGroupResponse } from "../model/createImpBasedAudienceGroupResponse.js";
import { ErrorResponse } from "../model/errorResponse.js";
import { GetAudienceDataResponse } from "../model/getAudienceDataResponse.js";
import { GetAudienceGroupAuthorityLevelResponse } from "../model/getAudienceGroupAuthorityLevelResponse.js";
import { GetAudienceGroupsResponse } from "../model/getAudienceGroupsResponse.js";
import { GetSharedAudienceDataResponse } from "../model/getSharedAudienceDataResponse.js";
import { GetSharedAudienceGroupsResponse } from "../model/getSharedAudienceGroupsResponse.js";
import { UpdateAudienceGroupAuthorityLevelRequest } from "../model/updateAudienceGroupAuthorityLevelRequest.js";
import { UpdateAudienceGroupDescriptionRequest } from "../model/updateAudienceGroupDescriptionRequest.js";

import * as Types from "../../types.js";
import { ensureJSON } from "../../utils.js";
import { Readable } from "node:stream";

import HTTPFetchClient, {
  convertResponseToReadable,
  mergeHeaders,
} from "../../http-fetch.js";

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

interface httpClientConfig {
  baseURL?: string;
  channelAccessToken: string;
  defaultHeaders?: Record<string, string>;
}

export class ManageAudienceClient {
  private httpClient: HTTPFetchClient;

  constructor(config: httpClientConfig) {
    const baseURL = config.baseURL || "https://api.line.me";
    const defaultHeaders = mergeHeaders(config.defaultHeaders, {
      Authorization: "Bearer " + config.channelAccessToken,
    });
    this.httpClient = new HTTPFetchClient({
      defaultHeaders: defaultHeaders,
      baseURL: baseURL,
    });
  }

  private async parseHTTPResponse(response: Response) {
    const { LINE_REQUEST_ID_HTTP_HEADER_NAME } = Types;
    let resBody: Record<string, any> = {
      ...(await response.json()),
    };
    if (response.headers.get(LINE_REQUEST_ID_HTTP_HEADER_NAME)) {
      resBody[LINE_REQUEST_ID_HTTP_HEADER_NAME] = response.headers.get(
        LINE_REQUEST_ID_HTTP_HEADER_NAME,
      );
    }
    return resBody;
  }

  /**
   * Activate audience
   * @param audienceGroupId The audience ID.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#activate-audience-group"> Documentation</a>
   */
  public async activateAudienceGroup(
    audienceGroupId: number,
  ): Promise<Types.MessageAPIResponseBase> {
    return (await this.activateAudienceGroupWithHttpInfo(audienceGroupId)).body;
  }

  /**
   * Activate audience.
   * This method includes HttpInfo object to return additional information.
   * @param audienceGroupId The audience ID.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#activate-audience-group"> Documentation</a>
   */
  public async activateAudienceGroupWithHttpInfo(
    audienceGroupId: number,
  ): Promise<Types.ApiResponseType<Types.MessageAPIResponseBase>> {
    const res = await this.httpClient.put(
      "/v2/bot/audienceGroup/{audienceGroupId}/activate".replace(
        "{audienceGroupId}",
        String(audienceGroupId),
      ),
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Add user IDs or Identifiers for Advertisers (IFAs) to an audience for uploading user IDs (by JSON)
   * @param addAudienceToAudienceGroupRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#update-upload-audience-group"> Documentation</a>
   */
  public async addAudienceToAudienceGroup(
    addAudienceToAudienceGroupRequest: AddAudienceToAudienceGroupRequest,
  ): Promise<Types.MessageAPIResponseBase> {
    return (
      await this.addAudienceToAudienceGroupWithHttpInfo(
        addAudienceToAudienceGroupRequest,
      )
    ).body;
  }

  /**
   * Add user IDs or Identifiers for Advertisers (IFAs) to an audience for uploading user IDs (by JSON).
   * This method includes HttpInfo object to return additional information.
   * @param addAudienceToAudienceGroupRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#update-upload-audience-group"> Documentation</a>
   */
  public async addAudienceToAudienceGroupWithHttpInfo(
    addAudienceToAudienceGroupRequest: AddAudienceToAudienceGroupRequest,
  ): Promise<Types.ApiResponseType<Types.MessageAPIResponseBase>> {
    const params = addAudienceToAudienceGroupRequest;

    const res = await this.httpClient.put(
      "/v2/bot/audienceGroup/upload",
      params,
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Create audience for uploading user IDs (by JSON)
   * @param createAudienceGroupRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-upload-audience-group"> Documentation</a>
   */
  public async createAudienceGroup(
    createAudienceGroupRequest: CreateAudienceGroupRequest,
  ): Promise<CreateAudienceGroupResponse> {
    return (
      await this.createAudienceGroupWithHttpInfo(createAudienceGroupRequest)
    ).body;
  }

  /**
   * Create audience for uploading user IDs (by JSON).
   * This method includes HttpInfo object to return additional information.
   * @param createAudienceGroupRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-upload-audience-group"> Documentation</a>
   */
  public async createAudienceGroupWithHttpInfo(
    createAudienceGroupRequest: CreateAudienceGroupRequest,
  ): Promise<Types.ApiResponseType<CreateAudienceGroupResponse>> {
    const params = createAudienceGroupRequest;

    const res = await this.httpClient.post(
      "/v2/bot/audienceGroup/upload",
      params,
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Create audience for click-based retargeting
   * @param createClickBasedAudienceGroupRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-click-audience-group"> Documentation</a>
   */
  public async createClickBasedAudienceGroup(
    createClickBasedAudienceGroupRequest: CreateClickBasedAudienceGroupRequest,
  ): Promise<CreateClickBasedAudienceGroupResponse> {
    return (
      await this.createClickBasedAudienceGroupWithHttpInfo(
        createClickBasedAudienceGroupRequest,
      )
    ).body;
  }

  /**
   * Create audience for click-based retargeting.
   * This method includes HttpInfo object to return additional information.
   * @param createClickBasedAudienceGroupRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-click-audience-group"> Documentation</a>
   */
  public async createClickBasedAudienceGroupWithHttpInfo(
    createClickBasedAudienceGroupRequest: CreateClickBasedAudienceGroupRequest,
  ): Promise<Types.ApiResponseType<CreateClickBasedAudienceGroupResponse>> {
    const params = createClickBasedAudienceGroupRequest;

    const res = await this.httpClient.post(
      "/v2/bot/audienceGroup/click",
      params,
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Create audience for impression-based retargeting
   * @param createImpBasedAudienceGroupRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-imp-audience-group"> Documentation</a>
   */
  public async createImpBasedAudienceGroup(
    createImpBasedAudienceGroupRequest: CreateImpBasedAudienceGroupRequest,
  ): Promise<CreateImpBasedAudienceGroupResponse> {
    return (
      await this.createImpBasedAudienceGroupWithHttpInfo(
        createImpBasedAudienceGroupRequest,
      )
    ).body;
  }

  /**
   * Create audience for impression-based retargeting.
   * This method includes HttpInfo object to return additional information.
   * @param createImpBasedAudienceGroupRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-imp-audience-group"> Documentation</a>
   */
  public async createImpBasedAudienceGroupWithHttpInfo(
    createImpBasedAudienceGroupRequest: CreateImpBasedAudienceGroupRequest,
  ): Promise<Types.ApiResponseType<CreateImpBasedAudienceGroupResponse>> {
    const params = createImpBasedAudienceGroupRequest;

    const res = await this.httpClient.post("/v2/bot/audienceGroup/imp", params);
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Delete audience
   * @param audienceGroupId The audience ID.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#delete-audience-group"> Documentation</a>
   */
  public async deleteAudienceGroup(
    audienceGroupId: number,
  ): Promise<Types.MessageAPIResponseBase> {
    return (await this.deleteAudienceGroupWithHttpInfo(audienceGroupId)).body;
  }

  /**
   * Delete audience.
   * This method includes HttpInfo object to return additional information.
   * @param audienceGroupId The audience ID.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#delete-audience-group"> Documentation</a>
   */
  public async deleteAudienceGroupWithHttpInfo(
    audienceGroupId: number,
  ): Promise<Types.ApiResponseType<Types.MessageAPIResponseBase>> {
    const res = await this.httpClient.delete(
      "/v2/bot/audienceGroup/{audienceGroupId}".replace(
        "{audienceGroupId}",
        String(audienceGroupId),
      ),
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Gets audience data.
   * @param audienceGroupId The audience ID.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-audience-group"> Documentation</a>
   */
  public async getAudienceData(
    audienceGroupId: number,
  ): Promise<GetAudienceDataResponse> {
    return (await this.getAudienceDataWithHttpInfo(audienceGroupId)).body;
  }

  /**
   * Gets audience data..
   * This method includes HttpInfo object to return additional information.
   * @param audienceGroupId The audience ID.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-audience-group"> Documentation</a>
   */
  public async getAudienceDataWithHttpInfo(
    audienceGroupId: number,
  ): Promise<Types.ApiResponseType<GetAudienceDataResponse>> {
    const res = await this.httpClient.get(
      "/v2/bot/audienceGroup/{audienceGroupId}".replace(
        "{audienceGroupId}",
        String(audienceGroupId),
      ),
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Get the authority level of the audience
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-authority-level"> Documentation</a>
   */
  public async getAudienceGroupAuthorityLevel(): Promise<GetAudienceGroupAuthorityLevelResponse> {
    return (await this.getAudienceGroupAuthorityLevelWithHttpInfo()).body;
  }

  /**
   * Get the authority level of the audience.
   * This method includes HttpInfo object to return additional information.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-authority-level"> Documentation</a>
   */
  public async getAudienceGroupAuthorityLevelWithHttpInfo(): Promise<
    Types.ApiResponseType<GetAudienceGroupAuthorityLevelResponse>
  > {
    const res = await this.httpClient.get(
      "/v2/bot/audienceGroup/authorityLevel",
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Gets data for more than one audience.
   * @param page The page to return when getting (paginated) results. Must be 1 or higher.
   * @param description The name of the audience(s) to return. You can search for partial matches. This is case-insensitive, meaning AUDIENCE and audience are considered identical. If omitted, the name of the audience(s) will not be used as a search criterion.
   * @param status The status of the audience(s) to return. If omitted, the status of the audience(s) will not be used as a search criterion.
   * @param size The number of audiences per page. Default: 20 Max: 40
   * @param includesExternalPublicGroups true (default): Get public audiences created in all channels linked to the same bot. false: Get audiences created in the same channel.
   * @param createRoute How the audience was created. If omitted, all audiences are included.  `OA_MANAGER`: Return only audiences created with LINE Official Account Manager (opens new window). `MESSAGING_API`: Return only audiences created with Messaging API.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-audience-groups"> Documentation</a>
   */
  public async getAudienceGroups(
    page: number,
    description?: string,
    status?: AudienceGroupStatus,
    size?: number,
    includesExternalPublicGroups?: boolean,
    createRoute?: AudienceGroupCreateRoute,
  ): Promise<GetAudienceGroupsResponse> {
    return (
      await this.getAudienceGroupsWithHttpInfo(
        page,
        description,
        status,
        size,
        includesExternalPublicGroups,
        createRoute,
      )
    ).body;
  }

  /**
   * Gets data for more than one audience..
   * This method includes HttpInfo object to return additional information.
   * @param page The page to return when getting (paginated) results. Must be 1 or higher.
   * @param description The name of the audience(s) to return. You can search for partial matches. This is case-insensitive, meaning AUDIENCE and audience are considered identical. If omitted, the name of the audience(s) will not be used as a search criterion.
   * @param status The status of the audience(s) to return. If omitted, the status of the audience(s) will not be used as a search criterion.
   * @param size The number of audiences per page. Default: 20 Max: 40
   * @param includesExternalPublicGroups true (default): Get public audiences created in all channels linked to the same bot. false: Get audiences created in the same channel.
   * @param createRoute How the audience was created. If omitted, all audiences are included.  `OA_MANAGER`: Return only audiences created with LINE Official Account Manager (opens new window). `MESSAGING_API`: Return only audiences created with Messaging API.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-audience-groups"> Documentation</a>
   */
  public async getAudienceGroupsWithHttpInfo(
    page: number,
    description?: string,
    status?: AudienceGroupStatus,
    size?: number,
    includesExternalPublicGroups?: boolean,
    createRoute?: AudienceGroupCreateRoute,
  ): Promise<Types.ApiResponseType<GetAudienceGroupsResponse>> {
    const queryParams = {
      page: page,
      description: description,
      status: status,
      size: size,
      includesExternalPublicGroups: includesExternalPublicGroups,
      createRoute: createRoute,
    };
    Object.keys(queryParams).forEach((key: keyof typeof queryParams) => {
      if (queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const res = await this.httpClient.get(
      "/v2/bot/audienceGroup/list",
      queryParams,
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Gets audience data.
   * @param audienceGroupId The audience ID.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-shared-audience"> Documentation</a>
   */
  public async getSharedAudienceData(
    audienceGroupId: number,
  ): Promise<GetSharedAudienceDataResponse> {
    return (await this.getSharedAudienceDataWithHttpInfo(audienceGroupId)).body;
  }

  /**
   * Gets audience data..
   * This method includes HttpInfo object to return additional information.
   * @param audienceGroupId The audience ID.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-shared-audience"> Documentation</a>
   */
  public async getSharedAudienceDataWithHttpInfo(
    audienceGroupId: number,
  ): Promise<Types.ApiResponseType<GetSharedAudienceDataResponse>> {
    const res = await this.httpClient.get(
      "/v2/bot/audienceGroup/shared/{audienceGroupId}".replace(
        "{audienceGroupId}",
        String(audienceGroupId),
      ),
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Gets data for more than one audience, including those shared by the Business Manager.
   * @param page The page to return when getting (paginated) results. Must be 1 or higher.
   * @param description The name of the audience(s) to return. You can search for partial matches. This is case-insensitive, meaning AUDIENCE and audience are considered identical. If omitted, the name of the audience(s) will not be used as a search criterion.
   * @param status The status of the audience(s) to return. If omitted, the status of the audience(s) will not be used as a search criterion.
   * @param size The number of audiences per page. Default: 20 Max: 40
   * @param createRoute How the audience was created. If omitted, all audiences are included.  `OA_MANAGER`: Return only audiences created with LINE Official Account Manager (opens new window). `MESSAGING_API`: Return only audiences created with Messaging API.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-shared-audience-list"> Documentation</a>
   */
  public async getSharedAudienceGroups(
    page: number,
    description?: string,
    status?: AudienceGroupStatus,
    size?: number,
    createRoute?: AudienceGroupCreateRoute,
  ): Promise<GetSharedAudienceGroupsResponse> {
    return (
      await this.getSharedAudienceGroupsWithHttpInfo(
        page,
        description,
        status,
        size,
        createRoute,
      )
    ).body;
  }

  /**
   * Gets data for more than one audience, including those shared by the Business Manager..
   * This method includes HttpInfo object to return additional information.
   * @param page The page to return when getting (paginated) results. Must be 1 or higher.
   * @param description The name of the audience(s) to return. You can search for partial matches. This is case-insensitive, meaning AUDIENCE and audience are considered identical. If omitted, the name of the audience(s) will not be used as a search criterion.
   * @param status The status of the audience(s) to return. If omitted, the status of the audience(s) will not be used as a search criterion.
   * @param size The number of audiences per page. Default: 20 Max: 40
   * @param createRoute How the audience was created. If omitted, all audiences are included.  `OA_MANAGER`: Return only audiences created with LINE Official Account Manager (opens new window). `MESSAGING_API`: Return only audiences created with Messaging API.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-shared-audience-list"> Documentation</a>
   */
  public async getSharedAudienceGroupsWithHttpInfo(
    page: number,
    description?: string,
    status?: AudienceGroupStatus,
    size?: number,
    createRoute?: AudienceGroupCreateRoute,
  ): Promise<Types.ApiResponseType<GetSharedAudienceGroupsResponse>> {
    const queryParams = {
      page: page,
      description: description,
      status: status,
      size: size,
      createRoute: createRoute,
    };
    Object.keys(queryParams).forEach((key: keyof typeof queryParams) => {
      if (queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const res = await this.httpClient.get(
      "/v2/bot/audienceGroup/shared/list",
      queryParams,
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Change the authority level of the audience
   * @param updateAudienceGroupAuthorityLevelRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#change-authority-level"> Documentation</a>
   */
  public async updateAudienceGroupAuthorityLevel(
    updateAudienceGroupAuthorityLevelRequest: UpdateAudienceGroupAuthorityLevelRequest,
  ): Promise<Types.MessageAPIResponseBase> {
    return (
      await this.updateAudienceGroupAuthorityLevelWithHttpInfo(
        updateAudienceGroupAuthorityLevelRequest,
      )
    ).body;
  }

  /**
   * Change the authority level of the audience.
   * This method includes HttpInfo object to return additional information.
   * @param updateAudienceGroupAuthorityLevelRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#change-authority-level"> Documentation</a>
   */
  public async updateAudienceGroupAuthorityLevelWithHttpInfo(
    updateAudienceGroupAuthorityLevelRequest: UpdateAudienceGroupAuthorityLevelRequest,
  ): Promise<Types.ApiResponseType<Types.MessageAPIResponseBase>> {
    const params = updateAudienceGroupAuthorityLevelRequest;

    const res = await this.httpClient.put(
      "/v2/bot/audienceGroup/authorityLevel",
      params,
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
  /**
   * Renames an existing audience.
   * @param audienceGroupId The audience ID.
   * @param updateAudienceGroupDescriptionRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#set-description-audience-group"> Documentation</a>
   */
  public async updateAudienceGroupDescription(
    audienceGroupId: number,
    updateAudienceGroupDescriptionRequest: UpdateAudienceGroupDescriptionRequest,
  ): Promise<Types.MessageAPIResponseBase> {
    return (
      await this.updateAudienceGroupDescriptionWithHttpInfo(
        audienceGroupId,
        updateAudienceGroupDescriptionRequest,
      )
    ).body;
  }

  /**
   * Renames an existing audience..
   * This method includes HttpInfo object to return additional information.
   * @param audienceGroupId The audience ID.
   * @param updateAudienceGroupDescriptionRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#set-description-audience-group"> Documentation</a>
   */
  public async updateAudienceGroupDescriptionWithHttpInfo(
    audienceGroupId: number,
    updateAudienceGroupDescriptionRequest: UpdateAudienceGroupDescriptionRequest,
  ): Promise<Types.ApiResponseType<Types.MessageAPIResponseBase>> {
    const params = updateAudienceGroupDescriptionRequest;

    const res = await this.httpClient.put(
      "/v2/bot/audienceGroup/{audienceGroupId}/updateDescription".replace(
        "{audienceGroupId}",
        String(audienceGroupId),
      ),
      params,
    );
    const text = await res.text();
    const parsedBody = text ? JSON.parse(text) : null;
    return { httpResponse: res, body: parsedBody };
  }
}
