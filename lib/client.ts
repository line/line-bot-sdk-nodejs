import { Readable } from "stream";
import HTTPClient from "./http";
import * as Types from "./types";
import { JSONParseError } from "./exceptions";

function toArray<T>(maybeArr: T | T[]): T[] {
  return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}

function ensureJSON<T>(raw: T): T {
  if (typeof raw === "object") {
    return raw;
  } else {
    throw new JSONParseError("Failed to parse response body as JSON", raw);
  }
}

type ChatType = "group" | "room";

export default class Client {
  public config: Types.ClientConfig;
  private http: HTTPClient;

  constructor(config: Types.ClientConfig) {
    if (!config.channelAccessToken) {
      throw new Error("no channel access token");
    }

    this.config = config;
    this.http = new HTTPClient(
      process.env.API_BASE_URL || "https://api.line.me/v2/bot/",
      {
        Authorization: "Bearer " + this.config.channelAccessToken,
      },
    );
  }

  public async pushMessage(
    to: string,
    messages: Types.Message | Types.Message[],
  ): Promise<any> {
    return this.http.post("/message/push", {
      messages: toArray(messages),
      to,
    });
  }

  public async replyMessage(
    replyToken: string,
    messages: Types.Message | Types.Message[],
  ): Promise<any> {
    return this.http.post("/message/reply", {
      messages: toArray(messages),
      replyToken,
    });
  }

  public async multicast(
    to: string[],
    messages: Types.Message | Types.Message[],
  ): Promise<any> {
    return this.http.post("/message/multicast", {
      messages: toArray(messages),
      to,
    });
  }

  public async getProfile(userId: string): Promise<Types.Profile> {
    const profile = await this.http.get<Types.Profile>(`/profile/${userId}`);
    return ensureJSON(profile);
  }

  private async getChatMemberProfile(
    chatType: ChatType,
    chatId: string,
    userId: string,
  ): Promise<Types.Profile> {
    const profile = await this.http.get<Types.Profile>(
      `/${chatType}/${chatId}/member/${userId}`,
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
        `/${chatType}/${chatId}/members/ids`,
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
    return this.http.getStream(`/message/${messageId}/content`);
  }

  private leaveChat(chatType: ChatType, chatId: string): Promise<any> {
    return this.http.post(`/${chatType}/${chatId}/leave`);
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
      `/richmenu/${richMenuId}`,
    );
    return ensureJSON(res);
  }

  public async createRichMenu(richMenu: Types.RichMenu): Promise<string> {
    const res = await this.http.post<any>("/richmenu", richMenu);
    return ensureJSON(res).richMenuId;
  }

  public async deleteRichMenu(richMenuId: string): Promise<any> {
    return this.http.delete(`/richmenu/${richMenuId}`);
  }

  public async getRichMenuIdOfUser(userId: string): Promise<string> {
    const res = await this.http.get<any>(`/user/${userId}/richmenu`);
    return ensureJSON(res).richMenuId;
  }

  public async linkRichMenuToUser(
    userId: string,
    richMenuId: string,
  ): Promise<any> {
    return this.http.post(`/user/${userId}/richmenu/${richMenuId}`);
  }

  public async unlinkRichMenuFromUser(userId: string): Promise<any> {
    return this.http.delete(`/user/${userId}/richmenu`);
  }

  public async linkRichMenuToMultipleUsers(
    richMenuId: string,
    userIds: string[],
  ): Promise<any> {
    return this.http.post("/richmenu/bulk/link", {
      richMenuId,
      userIds,
    });
  }

  public async unlinkRichMenusFromMultipleUsers(
    userIds: string[],
  ): Promise<any> {
    return this.http.post("/richmenu/bulk/unlink", {
      userIds,
    });
  }

  public async getRichMenuImage(richMenuId: string): Promise<Readable> {
    return this.http.getStream(`/richmenu/${richMenuId}/content`);
  }

  public async setRichMenuImage(
    richMenuId: string,
    data: Buffer | Readable,
    contentType?: string,
  ): Promise<any> {
    return this.http.postBinary(
      `/richmenu/${richMenuId}/content`,
      data,
      contentType,
    );
  }

  public async getRichMenuList(): Promise<Array<Types.RichMenuResponse>> {
    const res = await this.http.get<any>(`/richmenu/list`);
    return ensureJSON(res).richmenus;
  }

  public async setDefaultRichMenu(richMenuId: string): Promise<{}> {
    return this.http.post(`/user/all/richmenu/${richMenuId}`);
  }

  public async getDefaultRichMenuId(): Promise<string> {
    const res = await this.http.get<any>("/user/all/richmenu");
    return ensureJSON(res).richMenuId;
  }

  public async deleteDefaultRichMenu(): Promise<{}> {
    return this.http.delete("/user/all/richmenu");
  }

  public async getLinkToken(userId: string): Promise<string> {
    const res = await this.http.post<any>(`/user/${userId}/linkToken`);
    return ensureJSON(res).linkToken;
  }

  public async getNumberOfSentReplyMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `/message/delivery/reply?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfSentPushMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `/message/delivery/push?date=${date}`,
    );
    return ensureJSON(res);
  }

  public async getNumberOfSentMulticastMessages(
    date: string,
  ): Promise<Types.NumberOfMessagesSentResponse> {
    const res = await this.http.get<Types.NumberOfMessagesSentResponse>(
      `/message/delivery/multicast?date=${date}`,
    );
    return ensureJSON(res);
  }
}
