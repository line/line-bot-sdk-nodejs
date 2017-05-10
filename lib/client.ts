import { get, post, stream } from "./http";
import * as URL from "./urls";
import { toArray } from "./util";

export default class Client {
  public config: Line.Config;

  constructor(config: Line.Config & { channelAccessToken: string }) {
    if (!config.channelAccessToken) {
      throw new Error("no channel access token");
    }

    this.config = config;
  }

  public pushMessage(to: string, messages: Line.Message | Line.Message[]): Promise<any> {
    return this.post(URL.push, {
      to,
      messages: toArray(messages),
    });
  }

  public replyMessage(replyToken: string, messages: Line.Message | Line.Message[]): Promise<any> {
    return this.post(URL.reply, {
      replyToken,
      messages: toArray(messages),
    });
  }

  public multicast(to: string[], messages: Line.Message | Line.Message[]): Promise<any> {
    return this.post(URL.multicast, {
      to,
      messages: toArray(messages),
    });
  }

  public getProfile(userId: string): Promise<Line.Profile> {
    return this.get(URL.profile(userId));
  }

  public getMessageContent(messageId: string): NodeJS.ReadableStream {
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

  private stream(url: string): NodeJS.ReadableStream {
    return stream(url, this.authHeader());
  }
}
