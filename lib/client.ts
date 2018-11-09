import { Readable } from "stream";
import HTTPClient from "./http";
import * as Types from "./types";
import { JSONParseError } from "./exceptions";

function toArray<T>(maybeArr: T | T[]): T[] {
  return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}

function checkJSON<T>(raw: T): T {
  if (typeof raw === "object") {
    return raw;
  } else {
    throw new JSONParseError("Failed to parse response body as JSON", raw);
  }
}

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

  public pushMessage(
    to: string,
    messages: Types.Message | Types.Message[],
  ): Promise<any> {
    return this.http.post("/message/push", {
      messages: toArray(messages),
      to,
    });
  }

  public replyMessage(
    replyToken: string,
    messages: Types.Message | Types.Message[],
  ): Promise<any> {
    return this.http.post("/message/reply", {
      messages: toArray(messages),
      replyToken,
    });
  }

  public multicast(
    to: string[],
    messages: Types.Message | Types.Message[],
  ): Promise<any> {
    return this.http.post("/message/multicast", {
      messages: toArray(messages),
      to,
    });
  }

  public getProfile(userId: string): Promise<Types.Profile> {
    return this.http.get<Types.Profile>(`/profile/${userId}`).then(checkJSON);
  }

  public getGroupMemberProfile(
    groupId: string,
    userId: string,
  ): Promise<Types.Profile> {
    return this.http
      .get<Types.Profile>(`/group/${groupId}/member/${userId}`)
      .then(checkJSON);
  }

  public getRoomMemberProfile(
    roomId: string,
    userId: string,
  ): Promise<Types.Profile> {
    return this.http
      .get<Types.Profile>(`/room/${roomId}/member/${userId}`)
      .then(checkJSON);
  }

  public getGroupMemberIds(groupId: string): Promise<string[]> {
    const load = (start?: string): Promise<string[]> =>
      this.http
        .get(`/group/${groupId}/members/ids`, start ? { start } : null)
        .then(checkJSON)
        .then((res: { memberIds: string[]; next?: string }) => {
          if (!res.next) {
            return res.memberIds;
          }

          return load(res.next).then(extraIds =>
            res.memberIds.concat(extraIds),
          );
        });
    return load();
  }

  public getRoomMemberIds(roomId: string): Promise<string[]> {
    const load = (start?: string): Promise<string[]> =>
      this.http
        .get(`/room/${roomId}/members/ids`, start ? { start } : null)
        .then(checkJSON)
        .then((res: { memberIds: string[]; next?: string }) => {
          if (!res.next) {
            return res.memberIds;
          }

          return load(res.next).then(extraIds =>
            res.memberIds.concat(extraIds),
          );
        });
    return load();
  }

  public getMessageContent(messageId: string): Promise<Readable> {
    return this.http.getStream(`/message/${messageId}/content`);
  }

  public leaveGroup(groupId: string): Promise<any> {
    return this.http.post(`/group/${groupId}/leave`);
  }

  public leaveRoom(roomId: string): Promise<any> {
    return this.http.post(`/room/${roomId}/leave`);
  }

  public getRichMenu(richMenuId: string): Promise<Types.RichMenuResponse> {
    return this.http
      .get<Types.RichMenuResponse>(`/richmenu/${richMenuId}`)
      .then(checkJSON);
  }

  public createRichMenu(richMenu: Types.RichMenu): Promise<string> {
    return this.http
      .post<any>("/richmenu", richMenu)
      .then(checkJSON)
      .then(res => res.richMenuId);
  }

  public deleteRichMenu(richMenuId: string): Promise<any> {
    return this.http.delete(`/richmenu/${richMenuId}`);
  }

  public getRichMenuIdOfUser(userId: string): Promise<string> {
    return this.http
      .get<any>(`/user/${userId}/richmenu`)
      .then(checkJSON)
      .then(res => res.richMenuId);
  }

  public linkRichMenuToUser(userId: string, richMenuId: string): Promise<any> {
    return this.http.post(`/user/${userId}/richmenu/${richMenuId}`);
  }

  public unlinkRichMenuFromUser(userId: string): Promise<any> {
    return this.http.delete(`/user/${userId}/richmenu`);
  }

  public getRichMenuImage(richMenuId: string): Promise<Readable> {
    return this.http.getStream(`/richmenu/${richMenuId}/content`);
  }

  public setRichMenuImage(
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

  public getRichMenuList(): Promise<Array<Types.RichMenuResponse>> {
    return this.http
      .get<any>(`/richmenu/list`)
      .then(checkJSON)
      .then(res => res.richmenus);
  }

  public setDefaultRichMenu(richMenuId: string): Promise<{}> {
    return this.http.post(`/user/all/richmenu/${richMenuId}`);
  }

  public getDefaultRichMenuId(): Promise<string> {
    return this.http
      .get<any>("/user/all/richmenu")
      .then(checkJSON)
      .then(res => res.richMenuId);
  }

  public deleteDefaultRichMenu(): Promise<{}> {
    return this.http.delete("/user/all/richmenu");
  }
}
