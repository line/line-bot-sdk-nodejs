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
  | FileEventMessage
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
  | TemplateMessage
  | FlexMessage;

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

export type FlexMessage = {
  type: "flex";
  altText: string;
  contents: FlexContainer;
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

export type FlexContainer = FlexBubble | FlexCarousel;

export type FlexBubble = {
  type: "bubble";
  direction?: "ltr" | "rtl";
  header?: FlexBox;
  hero?: FlexImage;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: FlexBubbleStyle;
};

export type FlexBubbleStyle = {
  header?: FlexBlockStyle;
  hero?: FlexBlockStyle;
  body?: FlexBlockStyle;
  footer?: FlexBlockStyle;
};

export type FlexBlockStyle = {
  backgroundColor?: string;
  separator?: boolean;
  separatorColor?: string;
};

export type FlexCarousel = {
  type: "carousel";
  contents: FlexBubble[];
};

export type FlexComponent =
  | FlexBox
  | FlexButton
  | FlexFiller
  | FlexIcon
  | FlexImage
  | FlexSeparator
  | FlexSpacer
  | FlexText;

export type FlexBox = {
  type: "box";
  layout: "horizontal" | "vertical" | "baseline";
  contents: FlexComponent[];
  flex?: number;
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};

export type FlexButton = {
  type: "button";
  action: Action;
  flex?: number;
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  height?: "sm" | "md";
  style?: "link" | "primary" | "secondary";
  color?: string;
  gravity?: "top" | "bottom" | "center";
};

export type FlexFiller = {
  type: "filler";
};

export type FlexIcon = {
  type: "icon";
  url: string;
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  size?:
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "3xl"
    | "4xl"
    | "5xl";
  aspectRatio?: "1:1" | "2:1" | "3:1";
};

export type FlexImage = {
  type: "image";
  url: string;
  flex?: number;
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  align?: "start" | "end" | "center";
  gravity?: "top" | "bottom" | "center";
  size?:
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  aspectRatio?:
    | "1:1"
    | "1.51:1"
    | "1.91:1"
    | "4:3"
    | "16:9"
    | "20:13"
    | "2:1"
    | "3:1"
    | "3:4"
    | "9:16"
    | "1:2"
    | "1:3";
  aspectMode?: "cover" | "fit";
  backgroundColor?: string;
  action?: Action;
};

export type FlexSeparator = {
  type: "separator";
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  color?: string;
};

export type FlexSpacer = {
  type: "spacer";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};

export type FlexText = {
  type: "text";
  text: string;
  flex?: number;
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  size?:
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "3xl"
    | "4xl"
    | "5xl";
  align?: "start" | "end" | "center";
  gravity?: "top" | "bottom" | "center";
  wrap?: boolean;
  weight?: "regular" | "bold";
  color?: string;
  action?: Action;
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
  actions: Action[];
};

export type TemplateConfirm = {
  type: "confirm";
  text: string;
  actions: Action[];
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
  actions: Action[];
};

export type TemplateImageCarousel = {
  type: "image_carousel";
  columns: TemplateImageColumn;
};

export type TemplateImageColumn = {
  imageUrl: string;
  action: Action<{ label?: string }>;
};

export type Action<ExtraFields = { label: string }> = (
  | PostbackAction
  | MessageAction
  | URIAction
  | DatetimePickerAction) &
  ExtraFields;

export type PostbackAction = {
  type: "postback";
  data: string;
  text?: string;
  displayText?: string;
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
