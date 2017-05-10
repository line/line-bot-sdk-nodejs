/* tslint:disable interface-over-type-literal no-namespace */
// Type definitions globally used in source code

// FIXME: got has no ts declarations for the time being
declare module "got";

declare namespace Line {
  export type Config = {
    channelAccessToken?: string,
    channelSecret?: string,
  };

  export type Profile = {
    displayName: string,
    userId: string,
    pictureUrl: string,
    statusMessage: string,
  };

  export type Typed = { type: string };

  export type WebhookEvent =
    MessageEvent | FollowEvent | UnfollowEvent | JoinEvent |
    LeaveEvent | PostbackEvent | BeaconEvent;

  export type EventBase = Typed & {
    timestamp: number,
    source: EventSource,
  };

  export type EventSource = User | Group | Room;

  export type User = Typed & { userId: string };
  export type Group = Typed & { groupId: string };
  export type Room = Typed & { roomId: string };

  export type ReplyableEvent = EventBase & { replyToken: string };

  export type MessageEvent = ReplyableEvent & { message: EventMessage };
  export type FollowEvent = ReplyableEvent;
  export type UnfollowEvent = EventBase;
  export type JoinEvent = ReplyableEvent;
  export type LeaveEvent = EventBase;
  export type PostbackEvent = ReplyableEvent & { postback: { data: string } };
  export type BeaconEvent = ReplyableEvent & {
    beacon: Typed & {
      hwid: string,
      dm?: string,
    },
  };

  export type EventMessage =
    TextEventMessage | ImageEventMessage | VideoEventMessage |
    AudioEventMessage | LocationEventMessage | StickerEventMessage;

  export type EventMessageBase = Typed & { id: string };
  export type TextEventMessage = EventMessageBase & { text: string };
  export type ImageEventMessage = EventMessageBase;
  export type VideoEventMessage = EventMessageBase;
  export type AudioEventMessage = EventMessageBase;
  export type LocationEventMessage = EventMessageBase & {
    title: string,
    address: string,
    latitude: number,
    longitude: number,
  };
  export type StickerEventMessage = EventMessageBase & {
    packageId: string,
    stickerId: string,
  };

  export type Message =
    TextMessage | ImageMessage | VideoMessage | AudioMessage |
    LocationMessage | StickerMessage | ImageMapMessage |
    TemplateMessage;

  export type TextMessage = Typed & { text: string };
  export type ImageMessage = Typed & {
    originalContentUrl: string,
    previewImageUrl: string,
  };
  export type VideoMessage = Typed & {
    originalContentUrl: string,
    previewImageUrl: string,
  };
  export type AudioMessage = Typed & {
    originalContentUrl: string,
    duration: string,
  };
  export type LocationMessage = Typed & {
    title: string,
    address: string,
    latitude: number,
    longitude: number,
  };
  export type StickerMessage = Typed & {
    packageId: string,
    stickerId: string,
  };
  export type ImageMapMessage = Typed & {
    baseUrl: string,
    altText: string,
    baseSize: { width: number, height: number },
    actions: ImageMapAction[],
  };
  export type TemplateMessage = Typed & {
    altText: string,
    template: TemplateContent,
  };

  export type ImageMapAction = ImageMapURIAction | ImageMapMessageAction;
  export type ImageMapActionBase = Typed & { area: ImageMapArea };
  export type ImageMapURIAction = ImageMapActionBase & { linkUri: string };
  export type ImageMapMessageAction = ImageMapActionBase & { text: string };

  export type ImageMapArea = { x: number, y: number, width: number, height: number };

  export type TemplateContent = TemplateButtons | TemplateConfirm | TemplateCarousel;
  export type TemplateButtons = Typed & {
    thumbnailImageUrl?: string,
    title?: string,
    text: string,
    actions: TemplateAction[],
  };
  export type TemplateConfirm = Typed & {
    text: string,
    actions: TemplateAction[],
  };
  export type TemplateCarousel = Typed & { columns: TemplateColumn[] };

  export type TemplateColumn = {
    thumbnailImageUrl?: string,
    title?: string,
    text: string,
    actions: TemplateAction[],
  };

  export type TemplateAction = TemplatePostbackAction | TemplateMessageAction | TemplateURIAction;
  export type TemplateActionBase = Typed & { label: string };
  export type TemplatePostbackAction = TemplateActionBase & { data: string, text?: string };
  export type TemplateMessageAction = TemplateActionBase & { text: string };
  export type TemplateURIAction = TemplateActionBase & { uri: string };
}
