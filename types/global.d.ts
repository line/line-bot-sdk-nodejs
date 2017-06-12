/* tslint:disable interface-over-type-literal no-namespace */
// Type definitions globally used in source code

// FIXME: got has no ts declarations for the time being
declare module "got";

declare namespace Line {
  export type ClientConfig = {
    channelAccessToken: string,
  };

  export type MiddlewareConfig = {
    channelSecret: string,
  };

  export type Config = ClientConfig | MiddlewareConfig;

  export type Profile = {
    displayName: string,
    userId: string,
    pictureUrl: string,
    statusMessage: string,
  };

  export type WebhookEvent =
    MessageEvent | FollowEvent | UnfollowEvent | JoinEvent |
    LeaveEvent | PostbackEvent | BeaconEvent;

  export type EventBase = {
    timestamp: number,
    source: EventSource,
  };

  export type EventSource = User | Group | Room;

  export type User = { type: "user", userId: string };
  export type Group = { type: "group", groupId: string, userId?: string };
  export type Room = { type: "room", roomId: string, userId?: string };

  export type ReplyableEvent = EventBase & { replyToken: string };

  export type MessageEvent = { type: "message", message: EventMessage } & ReplyableEvent;
  export type FollowEvent = { type: "follow" } & ReplyableEvent;
  export type UnfollowEvent = { type: "unfollow" } & EventBase;
  export type JoinEvent = { type: "join" } & ReplyableEvent;
  export type LeaveEvent = { type: "leave" } & EventBase;
  export type PostbackEvent = { type: "postback", postback: { data: string } } & ReplyableEvent;
  export type BeaconEvent = ReplyableEvent & {
    type: "beacon",
    beacon: {
      type: "enter" | "leave" | "banner",
      hwid: string,
      dm?: string,
    },
  };

  export type EventMessage =
    TextEventMessage | ImageEventMessage | VideoEventMessage |
    AudioEventMessage | LocationEventMessage | StickerEventMessage;

  export type EventMessageBase = { id: string };
  export type TextEventMessage = { type: "text", text: string } & EventMessageBase;
  export type ImageEventMessage = { type: "image" } & EventMessageBase;
  export type VideoEventMessage = { type: "video" } & EventMessageBase;
  export type AudioEventMessage = { type: "audio" } & EventMessageBase;
  export type LocationEventMessage = {
    type: "location"
    title: string,
    address: string,
    latitude: number,
    longitude: number,
  } & EventMessageBase;
  export type StickerEventMessage = {
    type: "sticker",
    packageId: string,
    stickerId: string,
  } & EventMessageBase;

  export type Message =
    TextMessage | ImageMessage | VideoMessage | AudioMessage |
    LocationMessage | StickerMessage | ImageMapMessage |
    TemplateMessage;

  export type TextMessage = {
    type: "text",
    text: string
  };
  export type ImageMessage = {
    type: "image",
    originalContentUrl: string,
    previewImageUrl: string,
  };
  export type VideoMessage = {
    type: "video",
    originalContentUrl: string,
    previewImageUrl: string,
  };
  export type AudioMessage = {
    type: "audio",
    originalContentUrl: string,
    duration: string,
  };
  export type LocationMessage = {
    type: "location",
    title: string,
    address: string,
    latitude: number,
    longitude: number,
  };
  export type StickerMessage = {
    type: "sticker",
    packageId: string,
    stickerId: string,
  };
  export type ImageMapMessage = {
    type: "image",
    baseUrl: string,
    altText: string,
    baseSize: { width: number, height: number },
    actions: ImageMapAction[],
  };
  export type TemplateMessage = {
    type: "template",
    altText: string,
    template: TemplateContent,
  };

  export type ImageMapAction = ImageMapURIAction | ImageMapMessageAction;
  export type ImageMapActionBase = { area: ImageMapArea };
  export type ImageMapURIAction = { type: "uri", linkUri: string } & ImageMapActionBase;
  export type ImageMapMessageAction = { type: "message", text: string } & ImageMapActionBase;

  export type ImageMapArea = { x: number, y: number, width: number, height: number };

  export type TemplateContent = TemplateButtons | TemplateConfirm | TemplateCarousel;
  export type TemplateButtons = {
    type: "buttons",
    thumbnailImageUrl?: string,
    title?: string,
    text: string,
    actions: TemplateAction[],
  };
  export type TemplateConfirm = {
    type: "confirm",
    text: string,
    actions: TemplateAction[],
  };
  export type TemplateCarousel = { type: "carousel", columns: TemplateColumn[] };

  export type TemplateColumn = {
    thumbnailImageUrl?: string,
    title?: string,
    text: string,
    actions: TemplateAction[],
  };

  export type TemplateAction = TemplatePostbackAction | TemplateMessageAction | TemplateURIAction;
  export type TemplateActionBase = { label: string };
  export type TemplatePostbackAction = {
    type: "postback",
    data: string,
    text?: string,
  } & TemplateActionBase;
  export type TemplateMessageAction = {
    type: "message",
    text: string,
  } & TemplateActionBase;
  export type TemplateURIAction = {
    type: "template",
    uri: string,
  } & TemplateActionBase;
}
