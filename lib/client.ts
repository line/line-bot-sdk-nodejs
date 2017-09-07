import { get, post, stream } from "./http";
import * as URL from "./urls";
import { toArray } from "./util";

export default class Client {
  public config: Line.ClientConfig;

  constructor(config: Line.Config & Line.ClientConfig) {
    if (!config.channelAccessToken) {
      throw new Error("no channel access token");
    }

    this.config = config;
  }

  public pushMessage(to: string, messages: Line.Message | Line.Message[]): Promise<any> {
    return this.post(URL.push, {
      messages: toArray(messages),
      to,
    });
  }

  public replyMessage(replyToken: string, messages: Line.Message | Line.Message[]): Promise<any> {
    return this.post(URL.reply, {
      messages: toArray(messages),
      replyToken,
    });
  }

  public multicast(to: string[], messages: Line.Message | Line.Message[]): Promise<any> {
    return this.post(URL.multicast, {
      messages: toArray(messages),
      to,
    });
  }

  public getProfile(userId: string): Promise<Line.Profile> {
    return this.get(URL.profile(userId));
  }

  public getGroupMemberProfile(groupId: string, userId: string): Promise<Line.Profile> {
    return this.get(URL.groupMemberProfile(groupId, userId));
  }

  public getRoomMemberProfile(roomId: string, userId: string): Promise<Line.Profile> {
    return this.get(URL.roomMemberProfile(roomId, userId));
  }

  public getGroupMemberIds(groupId: string): Promise<string[]> {
    const load = (start?: string): Promise<string[]> =>
      this.get(URL.groupMemberIds(groupId, start))
      .then((res: { memberIds: string[], next?: string }) => {
        if (!res.next) {
          return res.memberIds;
        }

        return load(res.next).then((extraIds) => res.memberIds.concat(extraIds));
      });
    return load();
  }

  public getRoomMemberIds(roomId: string): Promise<string[]> {
    const load = (start?: string): Promise<string[]> =>
      this.get(URL.roomMemberIds(roomId, start))
      .then((res: { memberIds: string[], next?: string }) => {
        if (!res.next) {
          return res.memberIds;
        }

        return load(res.next).then((extraIds) => res.memberIds.concat(extraIds));
      });
    return load();
  }

  public getMessageContent(messageId: string): Promise<NodeJS.ReadableStream> {
    return this.stream(URL.content(messageId));
  }

  public leaveGroup(groupId: string): Promise<any> {
    return this.post(URL.leaveGroup(groupId));
  }

  public leaveRoom(roomId: string): Promise<any> {
    return this.post(URL.leaveRoom(roomId));
  }

  private authHeader(): { [key: string]: string } {
    return { Authorization: "Bearer " + this.config.channelAccessToken };
  }

  private get(url: string): Promise<any> {
    return get(url, this.authHeader());
  }

  private post(url: string, body?: any): Promise<any> {
    return post(url, this.authHeader(), body);
  }

  private stream(url: string): Promise<NodeJS.ReadableStream> {
    return stream(url, this.authHeader());
  }
}
