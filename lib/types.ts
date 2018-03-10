export interface Config {
  channelAccessToken?: string;
  channelSecret?: string;
}

export interface ClientConfig extends Config {
  channelAccessToken: string;
}

export interface MiddlewareConfig extends Config {
  channelSecret: string;
}

export type Profile = {
  displayName: string;
  userId: string;
  pictureUrl: string;
  statusMessage: string;
};

export type WebhookEvent =
  | MessageEvent
  | FollowEvent
  | UnfollowEvent
  | JoinEvent
  | LeaveEvent
  | PostbackEvent
  | BeaconEvent;

export type EventBase = {
  timestamp: number;
  source: EventSource;
};

export type EventSource = User | Group | Room;

export type User = { type: "user"; userId: string };

export type Group = { type: "group"; groupId: string; userId?: string };

export type Room = { type: "room"; roomId: string; userId?: string };

export type ReplyableEvent = EventBase & { replyToken: string };

export type MessageEvent = {
  type: "message";
  message: EventMessage;
} & ReplyableEvent;

export type FollowEvent = { type: "follow" } & ReplyableEvent;

export type UnfollowEvent = { type: "unfollow" } & EventBase;

export type JoinEvent = { type: "join" } & ReplyableEvent;

export type LeaveEvent = { type: "leave" } & EventBase;

export type PostbackEvent = {
  type: "postback";
  postback: Postback;
} & ReplyableEvent;

export type BeaconEvent = ReplyableEvent & {
  type: "beacon";
  beacon: {
    type: "enter" | "leave" | "banner";
    hwid: string;
    dm?: string;
  };
};

export type EventMessage =
  | TextEventMessage
  | ImageEventMessage
  | VideoEventMessage
  | AudioEventMessage
  | LocationEventMessage
  | StickerEventMessage;

export type EventMessageBase = { id: string };

export type TextEventMessage = {
  type: "text";
  text: string;
} & EventMessageBase;

export type ImageEventMessage = { type: "image" } & EventMessageBase;

export type VideoEventMessage = { type: "video" } & EventMessageBase;

export type AudioEventMessage = { type: "audio" } & EventMessageBase;

export type FileEventMessage = {
  type: "file";
  fileName: string;
  fileSize: string;
} & EventMessageBase;

export type LocationEventMessage = {
  type: "location";
  title: string;
  address: string;
  latitude: number;
  longitude: number;
} & EventMessageBase;

export type StickerEventMessage = {
  type: "sticker";
  packageId: string;
  stickerId: string;
} & EventMessageBase;

export type Postback = {
  data: string;
  params?: {
    date?: string;
    time?: string;
    datetime?: string;
  };
};

export type Message =
  | TextMessage
  | ImageMessage
  | VideoMessage
  | AudioMessage
  | LocationMessage
  | StickerMessage
  | ImageMapMessage
  | TemplateMessage;

export type TextMessage = {
  type: "text";
  text: string;
};

export type ImageMessage = {
  type: "image";
  originalContentUrl: string;
  previewImageUrl: string;
};

export type VideoMessage = {
  type: "video";
  originalContentUrl: string;
  previewImageUrl: string;
};

export type AudioMessage = {
  type: "audio";
  originalContentUrl: string;
  duration: number;
};

export type LocationMessage = {
  type: "location";
  title: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type StickerMessage = {
  type: "sticker";
  packageId: string;
  stickerId: string;
};

export type ImageMapMessage = {
  type: "imagemap";
  baseUrl: string;
  altText: string;
  baseSize: Size;
  actions: ImageMapAction[];
};

export type TemplateMessage = {
  type: "template";
  altText: string;
  template: TemplateContent;
};

export type ImageMapAction = ImageMapURIAction | ImageMapMessageAction;

export type ImageMapActionBase = { area: Area };

export type ImageMapURIAction = {
  type: "uri";
  linkUri: string;
} & ImageMapActionBase;

export type ImageMapMessageAction = {
  type: "message";
  text: string;
} & ImageMapActionBase;

export type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TemplateContent =
  | TemplateButtons
  | TemplateConfirm
  | TemplateCarousel
  | TemplateImageCarousel;

export type TemplateButtons = {
  type: "buttons";
  thumbnailImageUrl?: string;
  imageAspectRatio?: "rectangle" | "square";
  imageSize?: "cover" | "contain";
  imageBackgroundColor?: string;
  title?: string;
  text: string;
  actions: Action<{ label: string }>[];
};

export type TemplateConfirm = {
  type: "confirm";
  text: string;
  actions: Action<{ label: string }>[];
};

export type TemplateCarousel = {
  type: "carousel";
  columns: TemplateColumn[];
  imageAspectRatio?: "rectangle" | "square";
  imageSize?: "cover" | "contain";
};

export type TemplateColumn = {
  thumbnailImageUrl?: string;
  imageBackgroundColor?: string;
  title?: string;
  text: string;
  actions: Action<{ label: string }>[];
};

export type TemplateImageCarousel = {
  type: "image_carousel";
  columns: TemplateImageColumn;
};

export type TemplateImageColumn = {
  imageUrl: string;
  action: Action<{ label?: string }>;
};

export type Action<Label> =
  | PostbackAction & Label
  | MessageAction & Label
  | URIAction & Label
  | DatetimePickerAction & Label;

export type PostbackAction = {
  type: "postback";
  data: string;
  text?: string;
};

export type MessageAction = {
  type: "message";
  text: string;
};

export type URIAction = {
  type: "uri";
  uri: string;
};

export type DatetimePickerAction = {
  type: "datetimepicker";
  data: string;
  mode: "date" | "time" | "datetime";
  initial?: string;
  max?: string;
  min?: string;
};

export type Size = {
  width: number;
  height: number;
};

export type RichMenu = {
  size: Size;
  selected: boolean;
  name: string;
  chatBarText: string;
  areas: Array<{ bounds: Area; action: Action<{}> }>;
};

export type RichMenuResponse = { richMenuId: string } & RichMenu;
