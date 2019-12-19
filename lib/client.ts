import { Readable } from "stream";
import HTTPClient from "./http";
import * as Types from "./types";
import { AxiosResponse } from "axios";

import { ensureJSON, toArray } from "./utils";

type ChatType = "group" | "room";
import {
  MESSAGING_API_PREFIX,
  DATA_API_PREFIX,
  OAUTH_BASE_PREFIX,
} from "./endpoints";

export default class Client {
  public config: Types.ClientConfig;
  private http: HTTPClient;

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

  public pushMessage(
    to: string,
    messages: Types.Message | Types.Message[],
    notificationDisabled: boolean = false,
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(`${MESSAGING_API_PREFIX}/message/push`, {
      messages: toArray(messages),
      to,
      notificationDisabled,
    });
  }

  public replyMessage(
    replyToken: string,
    messages: Types.Message | Types.Message[],
    notificationDisabled: boolean = false,
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(`${MESSAGING_API_PREFIX}/message/reply`, {
      messages: toArray(messages),
      replyToken,
      notificationDisabled,
    });
  }

  public async multicast(
    to: string[],
    messages: Types.Message | Types.Message[],
    notificationDisabled: boolean = false,
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(`${MESSAGING_API_PREFIX}/message/multicast`, {
      messages: toArray(messages),
      to,
      notificationDisabled,
    });
  }

  public async broadcast(
    messages: Types.Message | Types.Message[],
    notificationDisabled: boolean = false,
  ): Promise<Types.MessageAPIResponseBase> {
    return this.http.post(`${MESSAGING_API_PREFIX}/message/broadcast`, {
      messages: toArray(messages),
      notificationDisabled,
    });
  }

  public async getProfile(userId: string): Promise<Types.Profile> {
    const profile = await this.http.get<Types.Profile>(
      `${MESSAGING_API_PREFIX}/profile/${userId}`,
    );
    return ensureJSON(profile);
  }

  private async getChatMemberProfile(
    chatType: ChatType,
    chatId: string,
    userId: string,
  ): Promise<Types.Profile> {
    const profile = await this.http.get<Types.Profile>(
      `${MESSAGING_API_PREFIX}/${chatType}/${chatId}/member/${userId}`,
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
        `${MESSAGING_API_PREFIX}/${chatType}/${chatId}/members/ids`,
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

  public async getMessageContent(messageId: string): Promise<Readable> {
    return this.http.getStream(
      `${DATA_API_PREFIX}/message/${messageId}/content`,
    );
  }

  private leaveChat(chatType: ChatType, chatId: string): Promise<any> {
    return this.http.post(
      `${MESSAGING_API_PREFIX}/${chatType}/${chatId}/leave`,
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
      `${MESSAGING_API_PREFIX}/richmenu/${richMenuId}`,
    );
    return ensureJSON(res);
  }

  public async createRichMenu(richMenu: Types.RichMenu): Promise<string> {
    const res = await this.http.post<any>(
      `${MESSAGING_API_PREFIX}/richmenu`,
      richMenu,
    );
    return ensureJSON(res).richMenuId;
  }

  public async deleteRichMenu(richMenuId: string): Promise<any> {
    return this.http.delete(`${MESSAGING_API_PREFIX}/richmenu/${richMenuId}`);
  }

  public async getRichMenuIdOfUser(userId: string): Promise<string> {
    const res = await this.http.get<any>(
      `${MESSAGING_API_PREFIX}/user/${userId}/richmenu`,
    );
    return ensureJSON(res).richMenuId;
  }

  public async linkRichMenuToUser(
    userId: string,
    richMenuId: string,
  ): Promise<any> {
    return this.http.post(
      `${MESSAGING_API_PREFIX}/user/${userId}/richmenu/${richMenuId}`,
    );
  }

  public async unlinkRichMenuFromUser(userId: string): Promise<any> {
    return this.http.delete(`${MESSAGING_API_PREFIX}/user/${userId}/richmenu`);
  }

  public async linkRichMenuToMultipleUsers(
    richMenuId: string,
    userIds: string[],
  ): Promise<any> {
    return this.http.post(`${MESSAGING_API_PREFIX}/richmenu/bulk/link`, {
      richMenuId,
      userIds,
    });
  }

  public async unlinkRichMenusFromMultipleUsers(
    userIds: string[],
  ): Promise<any> {
    return this.http.post(`${MESSAGING_API_PREFIX}/richmenu/bulk/unlink`, {
      userIds,
    });
  }

  public async getRichMenuImage(richMenuId: string): Promise<Readable> {
    return this.http.getStream(
      `${DATA_API_PREFIX}/richmenu/${richMenuId}/content`,
    );
  }

  public async setRichMenuImage(
    richMenuId: string,
    data: Buffer | Readable,
    contentType?: string,
  ): Promise<any> {
    return this.http.postBinary(
      `${DATA_API_PREFIX}/richmenu/${richMenuId}/content`,
      data,
      contentType,
    );
  }

  public async getRichMenuList(): Promise<Array<Types.RichMenuResponse>> {
    const res = await this.http.get<any>(
      `${MESSAGING_API_PREFIX}/richmenu/list`,
    );
    return ensureJSON(res).richmenus;
  }

  public async setDefaultRichMenu(richMenuId: string): Promise<{}> {
    return this.http.post(
      `${MESSAGING_API_PREFIX}/user/all/richmenu/${richMenuId}`,
    );
  }

  public async getDefaultRichMenuId(): Promise<string> {
    const res = await this.http.get<any>(
      `${MESSAGING_API_PREFIX}/user/all/richmenu`,
    );
    return ensureJSON(res).richMenuId;
  }

  public async deleteDefaultRichMenu(): Promise<{}> {
    return this.http.delete(`${MESSAGING_API_PREFIX}/user/all/richmenu`);
  }

  public async getLinkToken(userId: string): Promise<string> {
    const res = await this.http.post<any>(
      `${MESSAGING_API_PREFIX}/user/${userId}/linkToken`,
    );
    return ensureJSON(res).linkToken;
  }

  public async getNumberOfSentReplyMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `${MESSAGING_API_PREFIX}/message/delivery/reply?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfSentPushMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `${MESSAGING_API_PREFIX}/message/delivery/push?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfSentMulticastMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `${MESSAGING_API_PREFIX}/message/delivery/multicast?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getTargetLimitForAdditionalMessages(): Promise<
    Types.TargetLimitForAdditionalMessages
  > {
    const res = await this.http.get<Types.TargetLimitForAdditionalMessages>(
      `${MESSAGING_API_PREFIX}/message/quota`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfMessagesSentThisMonth(): Promise<
    Types.NumberOfMessagesSentThisMonth
  > {
    const res = await this.http.get<Types.NumberOfMessagesSentThisMonth>(
      `${MESSAGING_API_PREFIX}/message/quota/consumption`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfSentBroadcastMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `${MESSAGING_API_PREFIX}/message/delivery/broadcast?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfMessageDeliveries(
    date: string,
  ): Promise<Types.NumberOfMessageDeliveriesResponse> {
    const res = await this.http.get<Types.NumberOfMessageDeliveriesResponse>(
      `${MESSAGING_API_PREFIX}/insight/message/delivery?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfFollowers(
    date: string,
  ): Promise<Types.NumberOfFollowersResponse> {
    const res = await this.http.get<Types.NumberOfFollowersResponse>(
      `${MESSAGING_API_PREFIX}/insight/followers?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getFriendDemographics(): Promise<Types.FriendDemographics> {
    const res = await this.http.get<Types.FriendDemographics>(
      `${MESSAGING_API_PREFIX}/insight/demographic`,
    );
    return ensureJSON(res);
  }

  public async getUserInteractionStatistics(
    requestId: string,
  ): Promise<Types.UserInteractionStatistics> {
    const res = await this.http.get<Types.UserInteractionStatistics>(
      `/insight/message/event?requestId=${requestId}`,
    );
    return ensureJSON(res);
  }
}

export class OAuth {
  private http: HTTPClient;

  constructor() {
    this.http = new HTTPClient();
  }

  public issueAccessToken(
    client_id: string,
    client_secret: string,
  ): Promise<{
    access_token: string;
    expires_in: number;
    token_type: "Bearer";
  }> {
    return this.http.postForm(`${OAUTH_BASE_PREFIX}/accessToken`, {
      grant_type: "client_credentials",
      client_id,
      client_secret,
    });
  }

  public revokeAccessToken(access_token: string): Promise<{}> {
    return this.http.postForm(`${OAUTH_BASE_PREFIX}/revoke`, { access_token });
  }
}
