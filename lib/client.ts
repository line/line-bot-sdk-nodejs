import { Readable } from "stream";
import HTTPClient from "./http";
import * as Types from "./types";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import { createMultipartFormData, ensureJSON, toArray } from "./utils";

type ChatType = "group" | "room";
type RequestOption = {
  retryKey: string;
};
import { defaultClientEndpoints, defaultOAuthEndpoints } from "./endpoints";

export default class Client {
  public config: Types.ClientConfig;
  private http: HTTPClient;

  private requestOption: Partial<RequestOption> = {};
  private endpoints: Types.ClientEndpoints;

  constructor(config: Types.ClientConfig) {
    if (!config.channelAccessToken) {
      throw new Error("no channel access token");
    }

    this.config = config;
    this.http = new HTTPClient({
      defaultHeaders: {
        Authorization: "Bearer " + this.config.channelAccessToken,
      },
      responseParser: this.parseHTTPResponse.bind(this),
      ...config.httpConfig,
    });
    this.endpoints = config.endpoints || defaultClientEndpoints;
  }
  public setRequestOptionOnce(option: Partial<RequestOption>) {
    this.requestOption = option;
  }

  private generateRequestConfig(): Partial<AxiosRequestConfig> {
    const config: Partial<AxiosRequestConfig> = { headers: {} };
    if (this.requestOption.retryKey) {
      config.headers["X-Line-Retry-Key"] = this.requestOption.retryKey;
    }

    // clear requestOption
    this.requestOption = {};
    return config;
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

  public pushMessage(
    to: string,
    messages: Types.Message | Types.Message[],
    notificationDisabled: boolean = false,
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/push`,
      {
        messages: toArray(messages),
        to,
        notificationDisabled,
      },
      this.generateRequestConfig(),
    );
  }

  public replyMessage(
    replyToken: string,
    messages: Types.Message | Types.Message[],
    notificationDisabled: boolean = false,
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/reply`,
      {
        messages: toArray(messages),
        replyToken,
        notificationDisabled,
      },
    );
  }

  public async multicast(
    to: string[],
    messages: Types.Message | Types.Message[],
    notificationDisabled: boolean = false,
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/multicast`,
      {
        messages: toArray(messages),
        to,
        notificationDisabled,
      },
      this.generateRequestConfig(),
    );
  }

  public async narrowcast(
    messages: Types.Message | Types.Message[],
    recipient?: Types.ReceieptObject,
    filter?: { demographic: Types.DemographicFilterObject },
    limit?: { max?: number; upToRemainingQuota?: boolean },
    notificationDisabled?: boolean,
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/narrowcast`,
      {
        messages: toArray(messages),
        recipient,
        filter,
        limit,
        notificationDisabled,
      },
      this.generateRequestConfig(),
    );
  }

  public async broadcast(
    messages: Types.Message | Types.Message[],
    notificationDisabled: boolean = false,
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/broadcast`,
      {
        messages: toArray(messages),
        notificationDisabled,
      },
      this.generateRequestConfig(),
    );
  }

  public validatePushMessageObjects(
    messages: Types.Message | Types.Message[],
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(
      `${MESSAGING_API_PREFIX}/message/validate/push`,
      {
        messages: toArray(messages),
      },
      this.generateRequestConfig(),
    );
  }

  public validateReplyMessageObjects(
    messages: Types.Message | Types.Message[],
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(`${MESSAGING_API_PREFIX}/message/validate/reply`, {
      messages: toArray(messages),
    });
  }

  public async validateMulticastMessageObjects(
    messages: Types.Message | Types.Message[],
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(
      `${MESSAGING_API_PREFIX}/message/validate/multicast`,
      {
        messages: toArray(messages),
      },
      this.generateRequestConfig(),
    );
  }

  public async validateNarrowcastMessageObjects(
    messages: Types.Message | Types.Message[],
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(
      `${MESSAGING_API_PREFIX}/message/validate/narrowcast`,
      {
        messages: toArray(messages),
      },
      this.generateRequestConfig(),
    );
  }

  public async validateBroadcastMessageObjects(
    messages: Types.Message | Types.Message[],
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(
      `${MESSAGING_API_PREFIX}/message/validate/broadcast`,
      {
        messages: toArray(messages),
      },
      this.generateRequestConfig(),
    );
  }

  public async getProfile(userId: string): Promise<Types.Profile> {
    const profile = await this.http.get<Types.Profile>(
      `${this.endpoints.MESSAGING_API_PREFIX}/profile/${userId}`,
    );
    return ensureJSON(profile);
  }

  private async getChatMemberProfile(
    chatType: ChatType,
    chatId: string,
    userId: string,
  ): Promise<Types.Profile> {
    const profile = await this.http.get<Types.Profile>(
      `${this.endpoints.MESSAGING_API_PREFIX}/${chatType}/${chatId}/member/${userId}`,
    );
    return ensureJSON(profile);
  }

  public async getGroupMemberProfile(
    groupId: string,
    userId: string,
  ): Promise<Types.Profile> {
    return this.getChatMemberProfile("group", groupId, userId);
  }

  public async getRoomMemberProfile(
    roomId: string,
    userId: string,
  ): Promise<Types.Profile> {
    return this.getChatMemberProfile("room", roomId, userId);
  }

  private async getChatMemberIds(
    chatType: ChatType,
    chatId: string,
  ): Promise<string[]> {
    let memberIds: string[] = [];

    let start: string;
    do {
      const res = await this.http.get<{ memberIds: string[]; next?: string }>(
        `${this.endpoints.MESSAGING_API_PREFIX}/${chatType}/${chatId}/members/ids`,
        start ? { start } : null,
      );
      ensureJSON(res);
      memberIds = memberIds.concat(res.memberIds);
      start = res.next;
    } while (start);

    return memberIds;
  }

  public async getGroupMemberIds(groupId: string): Promise<string[]> {
    return this.getChatMemberIds("group", groupId);
  }

  public async getRoomMemberIds(roomId: string): Promise<string[]> {
    return this.getChatMemberIds("room", roomId);
  }

  public async getBotFollowersIds(): Promise<string[]> {
    let userIds: string[] = [];

    let start: string;
    do {
      const res = await this.http.get<{ userIds: string[]; next?: string }>(
        `${this.endpoints.MESSAGING_API_PREFIX}/followers/ids`,
        start ? { start, limit: 1000 } : { limit: 1000 },
      );
      ensureJSON(res);
      userIds = userIds.concat(res.userIds);
      start = res.next;
    } while (start);

    return userIds;
  }

  public async getGroupMembersCount(
    groupId: string,
  ): Promise<Types.MembersCountResponse> {
    const groupMemberCount = await this.http.get<Types.MembersCountResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/group/${groupId}/members/count`,
    );
    return ensureJSON(groupMemberCount);
  }

  public async getRoomMembersCount(
    roomId: string,
  ): Promise<Types.MembersCountResponse> {
    const roomMemberCount = await this.http.get<Types.MembersCountResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/room/${roomId}/members/count`,
    );
    return ensureJSON(roomMemberCount);
  }

  public async getGroupSummary(
    groupId: string,
  ): Promise<Types.GroupSummaryResponse> {
    const groupSummary = await this.http.get<Types.GroupSummaryResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/group/${groupId}/summary`,
    );
    return ensureJSON(groupSummary);
  }

  public async getMessageContent(messageId: string): Promise<Readable> {
    return this.http.getStream(
      `${this.endpoints.DATA_API_PREFIX}/message/${messageId}/content`,
    );
  }

  private leaveChat(chatType: ChatType, chatId: string): Promise<any> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/${chatType}/${chatId}/leave`,
    );
  }

  public async leaveGroup(groupId: string): Promise<any> {
    return this.leaveChat("group", groupId);
  }

  public async leaveRoom(roomId: string): Promise<any> {
    return this.leaveChat("room", roomId);
  }

  public async getRichMenu(
    richMenuId: string,
  ): Promise<Types.RichMenuResponse> {
    const res = await this.http.get<Types.RichMenuResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/${richMenuId}`,
    );
    return ensureJSON(res);
  }

  public async createRichMenu(richMenu: Types.RichMenu): Promise<string> {
    const res = await this.http.post<any>(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu`,
      richMenu,
    );
    return ensureJSON(res).richMenuId;
  }

  public async deleteRichMenu(richMenuId: string): Promise<any> {
    return this.http.delete(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/${richMenuId}`,
    );
  }

  public async getRichMenuAliasList(): Promise<Types.GetRichMenuAliasListResponse> {
    const res = await this.http.get<Types.GetRichMenuAliasListResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/alias/list`,
    );
    return ensureJSON(res);
  }

  public async getRichMenuAlias(
    richMenuAliasId: string,
  ): Promise<Types.GetRichMenuAliasResponse> {
    const res = await this.http.get<Types.GetRichMenuAliasResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/alias/${richMenuAliasId}`,
    );
    return ensureJSON(res);
  }

  public async createRichMenuAlias(
    richMenuId: string,
    richMenuAliasId: string,
  ): Promise<{}> {
    const res = await this.http.post<{}>(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/alias`,
      {
        richMenuId,
        richMenuAliasId,
      },
    );
    return ensureJSON(res);
  }

  public async deleteRichMenuAlias(richMenuAliasId: string): Promise<{}> {
    const res = this.http.delete<{}>(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/alias/${richMenuAliasId}`,
    );
    return ensureJSON(res);
  }

  public async updateRichMenuAlias(
    richMenuAliasId: string,
    richMenuId: string,
  ): Promise<{}> {
    const res = await this.http.post<{}>(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/alias/${richMenuAliasId}`,
      {
        richMenuId,
      },
    );
    return ensureJSON(res);
  }

  public async getRichMenuIdOfUser(userId: string): Promise<string> {
    const res = await this.http.get<any>(
      `${this.endpoints.MESSAGING_API_PREFIX}/user/${userId}/richmenu`,
    );
    return ensureJSON(res).richMenuId;
  }

  public async linkRichMenuToUser(
    userId: string,
    richMenuId: string,
  ): Promise<any> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/user/${userId}/richmenu/${richMenuId}`,
    );
  }

  public async unlinkRichMenuFromUser(userId: string): Promise<any> {
    return this.http.delete(
      `${this.endpoints.MESSAGING_API_PREFIX}/user/${userId}/richmenu`,
    );
  }

  public async linkRichMenuToMultipleUsers(
    richMenuId: string,
    userIds: string[],
  ): Promise<any> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/bulk/link`,
      {
        richMenuId,
        userIds,
      },
    );
  }

  public async unlinkRichMenusFromMultipleUsers(
    userIds: string[],
  ): Promise<any> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/bulk/unlink`,
      {
        userIds,
      },
    );
  }

  public async getRichMenuImage(richMenuId: string): Promise<Readable> {
    return this.http.getStream(
      `${this.endpoints.DATA_API_PREFIX}/richmenu/${richMenuId}/content`,
    );
  }

  public async setRichMenuImage(
    richMenuId: string,
    data: Buffer | Readable,
    contentType?: string,
  ): Promise<any> {
    return this.http.postBinary(
      `${this.endpoints.DATA_API_PREFIX}/richmenu/${richMenuId}/content`,
      data,
      contentType,
    );
  }

  public async getRichMenuList(): Promise<Array<Types.RichMenuResponse>> {
    const res = await this.http.get<any>(
      `${this.endpoints.MESSAGING_API_PREFIX}/richmenu/list`,
    );
    return ensureJSON(res).richmenus;
  }

  public async setDefaultRichMenu(richMenuId: string): Promise<{}> {
    return this.http.post(
      `${this.endpoints.MESSAGING_API_PREFIX}/user/all/richmenu/${richMenuId}`,
    );
  }

  public async getDefaultRichMenuId(): Promise<string> {
    const res = await this.http.get<any>(
      `${this.endpoints.MESSAGING_API_PREFIX}/user/all/richmenu`,
    );
    return ensureJSON(res).richMenuId;
  }

  public async deleteDefaultRichMenu(): Promise<{}> {
    return this.http.delete(
      `${this.endpoints.MESSAGING_API_PREFIX}/user/all/richmenu`,
    );
  }

  public async getLinkToken(userId: string): Promise<string> {
    const res = await this.http.post<any>(
      `${this.endpoints.MESSAGING_API_PREFIX}/user/${userId}/linkToken`,
    );
    return ensureJSON(res).linkToken;
  }

  public async getNumberOfSentReplyMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/delivery/reply?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfSentPushMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/delivery/push?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfSentMulticastMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/delivery/multicast?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNarrowcastProgress(
    requestId: string,
  ): Promise<Types.NarrowcastProgressResponse> {
    const res = await this.http.get<Types.NarrowcastProgressResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/progress/narrowcast?requestId=${requestId}`,
    );
    return ensureJSON(res);
  }

  public async getTargetLimitForAdditionalMessages(): Promise<Types.TargetLimitForAdditionalMessages> {
    const res = await this.http.get<Types.TargetLimitForAdditionalMessages>(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/quota`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfMessagesSentThisMonth(): Promise<Types.NumberOfMessagesSentThisMonth> {
    const res = await this.http.get<Types.NumberOfMessagesSentThisMonth>(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/quota/consumption`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfSentBroadcastMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/message/delivery/broadcast?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfMessageDeliveries(
    date: string,
  ): Promise<Types.NumberOfMessageDeliveriesResponse> {
    const res = await this.http.get<Types.NumberOfMessageDeliveriesResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/insight/message/delivery?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfFollowers(
    date: string,
  ): Promise<Types.NumberOfFollowersResponse> {
    const res = await this.http.get<Types.NumberOfFollowersResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/insight/followers?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getFriendDemographics(): Promise<Types.FriendDemographics> {
    const res = await this.http.get<Types.FriendDemographics>(
      `${this.endpoints.MESSAGING_API_PREFIX}/insight/demographic`,
    );
    return ensureJSON(res);
  }

  public async getUserInteractionStatistics(
    requestId: string,
  ): Promise<Types.UserInteractionStatistics> {
    const res = await this.http.get<Types.UserInteractionStatistics>(
      `${this.endpoints.MESSAGING_API_PREFIX}/insight/message/event?requestId=${requestId}`,
    );
    return ensureJSON(res);
  }

  public async getStatisticsPerUnit(
    customAggregationUnit: string,
    from: string,
    to: string,
  ): Promise<Types.StatisticsPerUnit> {
    const res = await this.http.get<Types.StatisticsPerUnit>(
      `${MESSAGING_API_PREFIX}/insight/message/event/aggregation?customAggregationUnit=${customAggregationUnit}&from=${from}&to=${to}`,
    );
    return ensureJSON(res);
  }

  public async createUploadAudienceGroup(uploadAudienceGroup: {
    description: string;
    isIfaAudience?: boolean;
    audiences?: { id: string }[];
    uploadDescription?: string;
  }) {
    const res = await this.http.post<{
      audienceGroupId: number;
      type: string;
      description: string;
      created: number;
    }>(`${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/upload`, {
      ...uploadAudienceGroup,
    });
    return ensureJSON(res);
  }

  public async createUploadAudienceGroupByFile(uploadAudienceGroup: {
    description: string;
    isIfaAudience?: boolean;
    uploadDescription?: string;
    file: Buffer | Readable;
  }) {
    const file = await this.http.toBuffer(uploadAudienceGroup.file);
    const body = createMultipartFormData({ ...uploadAudienceGroup, file });
    const res = await this.http.post<{
      audienceGroupId: number;
      type: "UPLOAD";
      description: string;
      created: number;
    }>(`${this.endpoints.DATA_API_PREFIX}/audienceGroup/upload/byFile`, body, {
      headers: body.getHeaders(),
    });
    return ensureJSON(res);
  }

  public async updateUploadAudienceGroup(
    uploadAudienceGroup: {
      audienceGroupId: number;
      description?: string;
      uploadDescription?: string;
      audiences: { id: string }[];
    },
    // for set request timeout
    httpConfig?: Partial<AxiosRequestConfig>,
  ) {
    const res = await this.http.put<{}>(
      `${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/upload`,
      {
        ...uploadAudienceGroup,
      },
      httpConfig,
    );
    return ensureJSON(res);
  }

  public async updateUploadAudienceGroupByFile(
    uploadAudienceGroup: {
      audienceGroupId: number;
      uploadDescription?: string;
      file: Buffer | Readable;
    },
    // for set request timeout
    httpConfig?: Partial<AxiosRequestConfig>,
  ) {
    const file = await this.http.toBuffer(uploadAudienceGroup.file);
    const body = createMultipartFormData({ ...uploadAudienceGroup, file });

    const res = await this.http.put<{}>(
      `${this.endpoints.DATA_API_PREFIX}/audienceGroup/upload/byFile`,
      body,
      {
        headers: body.getHeaders(),
        ...httpConfig,
      },
    );
    return ensureJSON(res);
  }

  public async createClickAudienceGroup(clickAudienceGroup: {
    description: string;
    requestId: string;
    clickUrl?: string;
  }) {
    const res = await this.http.post<
      {
        audienceGroupId: number;
        type: string;
        created: number;
      } & typeof clickAudienceGroup
    >(`${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/click`, {
      ...clickAudienceGroup,
    });
    return ensureJSON(res);
  }

  public async createImpAudienceGroup(impAudienceGroup: {
    requestId: string;
    description: string;
  }) {
    const res = await this.http.post<
      {
        audienceGroupId: number;
        type: string;
        created: number;
      } & typeof impAudienceGroup
    >(`${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/imp`, {
      ...impAudienceGroup,
    });
    return ensureJSON(res);
  }

  public async setDescriptionAudienceGroup(
    description: string,
    audienceGroupId: string,
  ) {
    const res = await this.http.put<{}>(
      `${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/${audienceGroupId}/updateDescription`,
      {
        description,
      },
    );
    return ensureJSON(res);
  }

  public async deleteAudienceGroup(audienceGroupId: string) {
    const res = await this.http.delete<{}>(
      `${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/${audienceGroupId}`,
    );
    return ensureJSON(res);
  }

  public async getAudienceGroup(audienceGroupId: string) {
    const res = await this.http.get<Types.AudienceGroup>(
      `${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/${audienceGroupId}`,
    );
    return ensureJSON(res);
  }

  public async getAudienceGroups(
    page: number,
    description?: string,
    status?: Types.AudienceGroupStatus,
    size?: number,
    createRoute?: Types.AudienceGroupCreateRoute,
    includesExternalPublicGroups?: boolean,
  ) {
    const res = await this.http.get<{
      audienceGroups: Types.AudienceGroups;
      hasNextPage: boolean;
      totalCount: number;
      readWriteAudienceGroupTotalCount: number;
      page: number;
      size: number;
    }>(`${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/list`, {
      page,
      description,
      status,
      size,
      createRoute,
      includesExternalPublicGroups,
    });
    return ensureJSON(res);
  }

  public async getAudienceGroupAuthorityLevel() {
    const res = await this.http.get<{
      authorityLevel: Types.AudienceGroupAuthorityLevel;
    }>(`${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/authorityLevel`);
    return ensureJSON(res);
  }

  public async changeAudienceGroupAuthorityLevel(
    authorityLevel: Types.AudienceGroupAuthorityLevel,
  ) {
    const res = await this.http.put<{}>(
      `${this.endpoints.MESSAGING_API_PREFIX}/audienceGroup/authorityLevel`,
      {
        authorityLevel,
      },
    );
    return ensureJSON(res);
  }

  public async getBotInfo(): Promise<Types.BotInfoResponse> {
    const res = await this.http.get<Types.BotInfoResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/info`,
    );
    return ensureJSON(res);
  }

  public async setWebhookEndpointUrl(endpoint: string) {
    return this.http.put<{}>(
      `${this.endpoints.MESSAGING_API_PREFIX}/channel/webhook/endpoint`,
      { endpoint },
    );
  }

  public async getWebhookEndpointInfo() {
    const res = await this.http.get<Types.WebhookEndpointInfoResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/channel/webhook/endpoint`,
    );
    return ensureJSON(res);
  }

  public async testWebhookEndpoint(endpoint?: string) {
    const res = await this.http.post<Types.TestWebhookEndpointResponse>(
      `${this.endpoints.MESSAGING_API_PREFIX}/channel/webhook/test`,
      { endpoint },
    );
    return ensureJSON(res);
  }
}

export class OAuth {
  private http: HTTPClient;
  private endpoints: Types.OAuthEndpoints;

  constructor(config?: { endpoints: Types.OAuthEndpoints }) {
    this.http = new HTTPClient();
    this.endpoints = config?.endpoints || defaultOAuthEndpoints;
  }

  public issueAccessToken(
    client_id: string,
    client_secret: string,
  ): Promise<Types.ChannelAccessToken> {
    return this.http.postForm(
      `${this.endpoints.OAUTH_BASE_PREFIX}/accessToken`,
      {
        grant_type: "client_credentials",
        client_id,
        client_secret,
      },
    );
  }

  public revokeAccessToken(access_token: string): Promise<{}> {
    return this.http.postForm(`${this.endpoints.OAUTH_BASE_PREFIX}/revoke`, {
      access_token,
    });
  }

  public verifyAccessToken(
    access_token: string,
  ): Promise<Types.VerifyAccessToken> {
    return this.http.get(`${this.endpoints.OAUTH_BASE_PREFIX_V2_1}/verify`, {
      access_token,
    });
  }

  public verifyIdToken(
    id_token: string,
    client_id: string,
    nonce?: string,
    user_id?: string,
  ): Promise<Types.VerifyIDToken> {
    return this.http.postForm(`${this.endpoints.OAUTH_BASE_PREFIX_V2_1}/verify`, {
      id_token,
      client_id,
      nonce,
      user_id,
    });
  }

  public issueChannelAccessTokenV2_1(
    client_assertion: string,
  ): Promise<Types.ChannelAccessToken> {
    return this.http.postForm(
      `${this.endpoints.OAUTH_BASE_PREFIX_V2_1}/token`,
      {
        grant_type: "client_credentials",
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion,
      },
    );
  }

  public getChannelAccessTokenKeyIdsV2_1(
    client_assertion: string,
  ): Promise<{ key_ids: string[] }> {
    return this.http.get(
      `${this.endpoints.OAUTH_BASE_PREFIX_V2_1}/tokens/kid`,
      {
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion,
      },
    );
  }

  public revokeChannelAccessTokenV2_1(
    client_id: string,
    client_secret: string,
    access_token: string,
  ): Promise<{}> {
    return this.http.postForm(
      `${this.endpoints.OAUTH_BASE_PREFIX_V2_1}/revoke`,
      {
        client_id,
        client_secret,
        access_token,
      },
    );
  }
}
