import { Readable } from "stream";
import { get, post, stream, del, postBinary } from "./http";
import * as Types from "./types";
import * as URL from "./urls";
import { JSONParseError } from "./exceptions";

function toArray<T>(maybeArr: T | T[]): T[] {
  return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}

function checkJSON(raw: any): any {
  if (typeof raw === "object") {
    return raw;
  } else {
    throw new JSONParseError("Failed to parse response body as JSON", raw);
  }
}

export default class Client {
  public config: Types.ClientConfig;

  constructor(config: Types.ClientConfig) {
    if (!config.channelAccessToken) {
      throw new Error("no channel access token");
    }

    this.config = config;
  }

  public pushMessage(
    to: string,
    messages: Types.Message | Types.Message[],
  ): Promise<any> {
    return this.post(URL.push, {
      messages: toArray(messages),
      to,
    });
  }

  public replyMessage(
    replyToken: string,
    messages: Types.Message | Types.Message[],
  ): Promise<any> {
    return this.post(URL.reply, {
      messages: toArray(messages),
      replyToken,
    });
  }

  public multicast(
    to: string[],
    messages: Types.Message | Types.Message[],
  ): Promise<any> {
    return this.post(URL.multicast, {
      messages: toArray(messages),
      to,
    });
  }

  public getProfile(userId: string): Promise<Types.Profile> {
    return this.get(URL.profile(userId)).then(checkJSON);
  }

  public getGroupMemberProfile(
    groupId: string,
    userId: string,
  ): Promise<Types.Profile> {
    return this.get(URL.groupMemberProfile(groupId, userId)).then(checkJSON);
  }

  public getRoomMemberProfile(
    roomId: string,
    userId: string,
  ): Promise<Types.Profile> {
    return this.get(URL.roomMemberProfile(roomId, userId)).then(checkJSON);
  }

  public getGroupMemberIds(groupId: string): Promise<string[]> {
    const load = (start?: string): Promise<string[]> =>
      this.get(URL.groupMemberIds(groupId, start))
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
      this.get(URL.roomMemberIds(roomId, start))
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
    return this.stream(URL.content(messageId));
  }

  public leaveGroup(groupId: string): Promise<any> {
    return this.post(URL.leaveGroup(groupId));
  }

  public leaveRoom(roomId: string): Promise<any> {
    return this.post(URL.leaveRoom(roomId));
  }

  public getRichMenu(richMenuId: string): Promise<Types.RichMenuResponse> {
    return this.get(URL.richMenu(richMenuId)).then(checkJSON);
  }

  public createRichMenu(richMenu: Types.RichMenu): Promise<string> {
    return this.post(URL.richMenu(), richMenu)
      .then(checkJSON)
      .then(res => res.richMenuId);
  }

  public deleteRichMenu(richMenuId: string): Promise<any> {
    return this.delete(URL.richMenu(richMenuId));
  }

  public getRichMenuIdOfUser(userId: string): Promise<string> {
    return this.get(URL.userRichMenu(userId))
      .then(checkJSON)
      .then(res => res.richMenuId);
  }

  public linkRichMenuToUser(userId: string, richMenuId: string): Promise<any> {
    return this.post(URL.userRichMenu(userId, richMenuId));
  }

  public unlinkRichMenuFromUser(
    userId: string,
    richMenuId: string,
  ): Promise<any> {
    return this.delete(URL.userRichMenu(userId, richMenuId));
  }

  public getRichMenuImage(richMenuId: string): Promise<Readable> {
    return this.stream(URL.richMenuContent(richMenuId));
  }

  public setRichMenuImage(
    richMenuId: string,
    data: Buffer | Readable,
    contentType?: string,
  ): Promise<any> {
    return this.postBinary(URL.richMenuContent(richMenuId), data, contentType);
  }

  public getRichMenuList(): Promise<Array<Types.RichMenuResponse>> {
    return this.get(URL.richMenuList())
      .then(checkJSON)
      .then(res => res.richmenus);
  }

  private authHeader(): { [key: string]: string } {
    return { Authorization: "Bearer " + this.config.channelAccessToken };
  }

  private delete(url: string): Promise<any> {
    return del(url, this.authHeader());
  }

  private get(url: string): Promise<any> {
    return get(url, this.authHeader());
  }

  private post(url: string, body?: any): Promise<any> {
    return post(url, this.authHeader(), body);
  }

  private postBinary(
    url: string,
    data: Buffer | Readable,
    contentType?: string,
  ) {
    return postBinary(url, this.authHeader(), data, contentType);
  }

  private stream(url: string): Promise<Readable> {
    return stream(url, this.authHeader());
  }
}
