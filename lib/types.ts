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

/**
 * Request body which is sent by webhook.
 *
 * @see [Request body](https://developers.line.me/en/reference/messaging-api/#request-body)
 */
export type WebhookRequestBody = {
  /**
   * User ID of a bot that should receive webhook events. The user ID value is a string that matches the regular expression, U[0-9a-f]{32}.
   */
  destination: string;

  /**
   * Information about the event
   */
  events: Array<WebhookEvent>;
};

/**
 * JSON objects which contain events generated on the LINE Platform.
 *
 * @see [Webhook event objects](https://developers.line.me/en/reference/messaging-api/#webhook-event-objects)
 */
export type WebhookEvent =
  | MessageEvent
  | FollowEvent
  | UnfollowEvent
  | JoinEvent
  | LeaveEvent
  | MemberJoinEvent
  | MemberLeaveEvent
  | PostbackEvent
  | BeaconEvent
  | AccountLinkEvent
  | DeviceLinkEvent
  | DeviceUnlinkEvent
  | LINEThingsScenarioExecutionEvent;

export type EventBase = {
  /**
   * Time of the event in milliseconds
   */
  timestamp: number;
  /**
   * Source user, group, or room object with information about the source of the event.
   */
  source: EventSource;
};

export type EventSource = User | Group | Room;

export type User = { type: "user"; userId: string };

export type Group = {
  type: "group";
  groupId: string;
  /**
   * ID of the source user.
   *
   * Only included in [message events](https://developers.line.me/en/reference/messaging-api/#message-event).
   * Not included if the user has not agreed to the
   * [Official Accounts Terms of Use](https://developers.line.me/en/docs/messaging-api/user-consent/).
   */
  userId?: string;
};

export type Room = {
  type: "room";
  roomId: string;
  /**
   * ID of the source user.
   *
   * Only included in [message events](https://developers.line.me/en/reference/messaging-api/#message-event).
   * Not included if the user has not agreed to the
   * [Official Accounts Terms of Use](https://developers.line.me/en/docs/messaging-api/user-consent/).
   */
  userId?: string;
};

export type ReplyableEvent = EventBase & { replyToken: string };

/**
 * Webhook event object which contains the sent message.
 *
 * The `message` property contains a message object which corresponds with the
 * message type. You can reply to message events.
 *
 * @see [Message event](https://developers.line.me/en/reference/messaging-api/#message-event)
 */
export type MessageEvent = {
  type: "message";
  message: EventMessage;
} & ReplyableEvent;

/**
 * Event object for when your account is added as a friend (or unblocked).
 */
export type FollowEvent = { type: "follow" } & ReplyableEvent;

/**
 * Event object for when your account is blocked.
 */
export type UnfollowEvent = { type: "unfollow" } & EventBase;

/**
 * Event object for when your bot joins a group or room. You can reply to join events.
 *
 * A join event is triggered at different times for groups and rooms.
 *
 * - For groups: A join event is sent when a user invites your bot.
 * - For rooms: A join event is sent when the first event (for example when a
 *     user sends a message or is added to the room) occurs after your bot is
 *     added.
 */
export type JoinEvent = { type: "join" } & ReplyableEvent;

/**
 * Event object for when a user removes your bot from a group or a room.
 */
export type LeaveEvent = { type: "leave" } & EventBase;

/**
 * Event object for when a user joins a [group](https://developers.line.biz/en/docs/messaging-api/group-chats/#group)
 * or [room](https://developers.line.biz/en/docs/messaging-api/group-chats/#room) that the bot is in.
 */
export type MemberJoinEvent = {
  type: "memberJoined";
  /**
   * User ID of users who joined
   * Array of [source user](https://developers.line.biz/en/reference/messaging-api/#source-user) objects
   */
  joined: { members: Array<User> };
} & ReplyableEvent;

/**
 * Event object for when a user leaves a [group](https://developers.line.biz/en/docs/messaging-api/group-chats/#group)
 * or [room](https://developers.line.biz/en/docs/messaging-api/group-chats/#room) that the bot is in.
 */
export type MemberLeaveEvent = {
  type: "memberLeft";
  /**
   * User ID of users who left
   * Array of [source user](https://developers.line.biz/en/reference/messaging-api/#source-user) objects
   */
  left: { members: Array<User> };
} & EventBase;

/**
 * Event object for when a user performs an action on a
 * [template message](https://developers.line.me/en/reference/messaging-api/#template-messages).
 */
export type PostbackEvent = {
  type: "postback";
  postback: Postback;
} & ReplyableEvent;

/**
 * Event object for when a user enters or leaves the range of a
 * [LINE Beacon](https://developers.line.me/en/docs/messaging-api/using-beacons/).
 */
export type BeaconEvent = ReplyableEvent & {
  type: "beacon";
  beacon: {
    type: "enter" | "leave" | "banner";

    /**
     * Hardware ID of the beacon that was detected
     */
    hwid: string;

    /**
     * Device message of beacon that was detected.
     *
     * This message consists of data generated by the beacon to send notifications to bots.
     * Only included in webhooks from devices that support the "device message" property.
     * For more information, see the
     * [LINE Simple Beacon specification](https://github.com/line/line-simple-beacon/blob/master/README.en.md/#line-simple-beacon-frame).
     */
    dm?: string;
  };
};

/**
 * Event object for when a user has linked his/her LINE account with a provider's service account.
 */
export type AccountLinkEvent = ReplyableEvent & {
  type: "accountLink";
  link: {
    result: "ok" | "failed";

    /**
     * Specified nonce when verifying the user ID
     */
    nonce: string;
  };
};

/**
 * Indicates that a LINE Things-compatible device has been linked with LINE by a user operation.
 * For more information, see [Receiving device link events via webhook](https://developers.line.biz/en/docs/line-things/develop-bot/#link-event).
 */
export type DeviceLinkEvent = ReplyableEvent & {
  type: "things";
  things: {
    /**
     * Device ID of the LINE Things-compatible device that was linked with LINE
     */
    deviceId: string;
    type: "link";
  };
};

/**
 * Indicates that a LINE Things-compatible device has been unlinked from LINE by a user operation.
 * For more information, see [Receiving device unlink events via webhook](https://developers.line.biz/en/docs/line-things/develop-bot/#unlink-event).
 */
export type DeviceUnlinkEvent = ReplyableEvent & {
  type: "things";
  things: {
    /**
     * Device ID of the LINE Things-compatible device that was unlinked with LINE
     */
    deviceId: string;
    type: "unlink";
  };
};

export type LINEThingsScenarioExecutionEvent = ReplyableEvent & {
  type: "things";
  things: {
    type: "scenarioResult";
    /**
     * Device ID of the device that executed the scenario
     */
    deviceId: string;
    result: {
      /**
       * Scenario ID executed
       */
      scenarioId: string;
      /**
       * Revision number of the scenario set containing the executed scenario
       */
      revision: number;
      /**
       * Timestamp for when execution of scenario action started (milliseconds, LINE app time)
       */
      startTime: number;
      /**
       * Timestamp for when execution of scenario was completed (milliseconds, LINE app time)
       */
      endtime: number;
      /**
       * Scenario execution completion status
       * See also [things.resultCode definitions](https://developers.line.biz/en/reference/messaging-api/#things-resultcode).
       */
      resultCode: "success" | "gatt_error" | "runtime_error";
      /**
       * Execution result of individual operations specified in action
       * Note that an array of actions specified in a scenario has the following characteristics
       *  - The actions defined in a scenario are performed sequentially, from top to bottom.
       *  - Each action produces some result when executed.
       *    Even actions that do not generate data, such as `SLEEP`, return an execution result of type `void`.
       *    The number of items in an action array may be 0.
       *
       * Therefore, things.actionResults has the following properties:
       *  - The number of items in the array matches the number of actions defined in the scenario.
       *  - The order of execution results matches the order in which actions are performed.
       *    That is, in a scenario set with multiple `GATT_READ` actions,
       *    the results are returned in the order in which each individual `GATT_READ` action was performed.
       *  - If 0 actions are defined in the scenario, the number of items in things.actionResults will be 0.
       */
      actionResults: Array<LINEThingsActionResult>;
      /**
       * Data contained in notification
       * The value is Base64-encoded binary data.
       * Only included for scenarios where `trigger.type = BLE_NOTIFICATION`.
       */
      bleNotificationPayload?: string;
      /**
       * Error reason
       */
      errorReason?: string;
    };
  };
};

export type LINEThingsActionResult = {
  /**
   * `void`, `binary`
   * Depends on `type` of the executed action.
   * This property is always included if `things.actionResults` is not empty.
   */
  type: "void" | "binary";
  /**
   * Base64-encoded binary data
   *  This property is always included when `things.actionResults[].type` is `binary`.
   */
  data?: string;
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

/**
 * Message object which contains the text sent from the source.
 */
export type TextEventMessage = {
  type: "text";
  text: string;
} & EventMessageBase;

export type ContentProvider<WithPreview extends boolean = true> =
  | {
      /**
       * The content is provided by LINE.
       *
       * The data itself can be retrieved from the content API.
       */
      type: "line";
    }
  | {
      /**
       * The content is provided by a provider other than LINE
       */
      type: "external";
      /**
       * URL of the content. Only included when contentProvider.type is external.
       */
      originalContentUrl: string;
      /**
       * URL of the content preview. Only included when contentProvider.type is external.
       *
       * For contents without preview (e.g. audio), it's undefined.
       */
      previewImageUrl: WithPreview extends true ? string : undefined;
    };

/**
 * Message object which contains the image content sent from the source.
 * The binary image data can be retrieved using Client#getMessageContent.
 */
export type ImageEventMessage = {
  type: "image";
  contentProvider: ContentProvider;
} & EventMessageBase;

/**
 * Message object which contains the video content sent from the source.
 * The binary video data can be retrieved using Client#getMessageContent.
 */
export type VideoEventMessage = {
  type: "video";
  contentProvider: ContentProvider;
} & EventMessageBase;

/**
 * Message object which contains the audio content sent from the source.
 * The binary audio data can be retrieved using Client#getMessageContent.
 */
export type AudioEventMessage = {
  type: "audio";
  duration: number;
  contentProvider: ContentProvider<false>;
} & EventMessageBase;

/**
 * Message object which contains the file sent from the source.
 * The binary data can be retrieved using Client#getMessageContent.
 */
export type FileEventMessage = {
  type: "file";
  fileName: string;
  fileSize: string;
} & EventMessageBase;

/**
 * Message object which contains the location data sent from the source.
 */
export type LocationEventMessage = {
  type: "location";
  title: string;
  address: string;
  latitude: number;
  longitude: number;
} & EventMessageBase;

/**
 * Message object which contains the sticker data sent from the source.
 * For a list of basic LINE stickers and sticker IDs, see
 * [sticker list](https://developers.line.me/media/messaging-api/sticker_list.pdf).
 */
export type StickerEventMessage = {
  type: "sticker";
  packageId: string;
  stickerId: string;
} & EventMessageBase;

export type Postback = {
  data: string;
  /**
   * Object with the date and time selected by a user through a
   * [datetime picker action](https://developers.line.me/en/reference/messaging-api/#datetime-picker-action).
   * Only returned for postback actions via a
   * [datetime picker action](https://developers.line.me/en/reference/messaging-api/#datetime-picker-action).
   * The `full-date`, `time-hour`, and `time-minute` formats follow the
   * [RFC3339 protocol](https://www.ietf.org/rfc/rfc3339.txt).
   */
  params?: {
    /**
     * Date selected by user. Only included in the `date` mode.
     */
    date?: string;
    /**
     * Time selected by the user. Only included in the `time` mode.
     */
    time?: string;
    /**
     * Date and time selected by the user. Only included in the `datetime` mode.
     */
    datetime?: string;
  };
};

/**
 * JSON object which contains the contents of the message you send.
 *
 * @see [Message objects](https://developers.line.me/en/reference/messaging-api/#message-objects)
 */
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

/**
 * @see [Common properties for messages](https://developers.line.me/en/reference/messaging-api/#common-properties-for-messages)
 */
export type MessageCommon = {
  /**
   * For the quick reply feature.
   * For more information, see [Using quick replies](https://developers.line.me/en/docs/messaging-api/using-quick-reply/).
   *
   * If the user receives multiple
   * [message objects](https://developers.line.me/en/reference/messaging-api/#message-objects),
   * the quickReply property of the last message object is displayed.
   */
  quickReply?: QuickReply;
};

/**
 * @see [Text message](https://developers.line.me/en/reference/messaging-api/#text-message)
 */
export type TextMessage = MessageCommon & {
  type: "text";
  /**
   * Message text. You can include the following emoji:
   *
   * - Unicode emoji
   * - LINE original emoji
   *   ([Unicode codepoint table for LINE original emoji](https://developers.line.me/media/messaging-api/emoji-list.pdf))
   *
   * Max: 2000 characters
   */
  text: string;
};

/**
 * @see [Image message](https://developers.line.me/en/reference/messaging-api/#image-message)
 */
export type ImageMessage = MessageCommon & {
  type: "image";
  /**
   * Image URL (Max: 1000 characters)
   *
   * - **HTTPS**
   * - JPEG
   * - Max: 1024 x 1024
   * - Max: 1 MB
   */
  originalContentUrl: string;
  /**
   * Preview image URL (Max: 1000 characters)
   *
   * - **HTTPS**
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   */
  previewImageUrl: string;
};

/**
 * @see [Video message](https://developers.line.me/en/reference/messaging-api/#video-message)
 */
export type VideoMessage = MessageCommon & {
  type: "video";
  /**
   * URL of video file (Max: 1000 characters)
   *
   * - **HTTPS**
   * - mp4
   * - Max: 1 minute
   * - Max: 10 MB
   *
   * A very wide or tall video may be cropped when played in some environments.
   */
  originalContentUrl: string;
  /**
   * URL of preview image (Max: 1000 characters)
   *
   * - **HTTPS**
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   */
  previewImageUrl: string;
};

/**
 * @see [Audio message](https://developers.line.me/en/reference/messaging-api/#audio-message)
 */
export type AudioMessage = MessageCommon & {
  type: "audio";
  /**
   * URL of audio file (Max: 1000 characters)
   *
   * - **HTTPS**
   * - m4a
   * - Max: 1 minute
   * - Max: 10 MB
   */
  originalContentUrl: string;
  /**
   * Length of audio file (milliseconds)
   */
  duration: number;
};

/**
 * @see [Location message](https://developers.line.me/en/reference/messaging-api/#location-message)
 */
export type LocationMessage = MessageCommon & {
  type: "location";
  /**
   * Title (Max: 100 characters)
   */
  title: string;
  /**
   * Address (Max: 100 characters)
   */
  address: string;
  latitude: number;
  longitude: number;
};

/**
 * @see [Sticker message](https://developers.line.me/en/reference/messaging-api/#sticker-message)
 */
export type StickerMessage = MessageCommon & {
  type: "sticker";
  /**
   * Package ID for a set of stickers.
   * For information on package IDs, see the
   * [Sticker list](https://developers.line.me/media/messaging-api/sticker_list.pdf).
   */
  packageId: string;
  /**
   * Sticker ID.
   * For a list of sticker IDs for stickers that can be sent with the Messaging
   * API, see the
   * [Sticker list](https://developers.line.me/media/messaging-api/sticker_list.pdf).
   */
  stickerId: string;
};

/**
 * @see [Imagemap message](https://developers.line.me/en/reference/messaging-api/#imagemap-message)
 */
export type ImageMapMessage = MessageCommon & {
  type: "imagemap";
  /**
   * [Base URL](https://developers.line.me/en/reference/messaging-api/#base-url) of image
   * (Max: 1000 characters, **HTTPS**)
   */
  baseUrl: string;
  /**
   * Alternative text (Max: 400 characters)
   */
  altText: string;
  baseSize: Size;
  /**
   * Video to play inside a image map messages
   */
  video?: {
    /**
     * URL of video file (Max: 1000 characters)
     *
     * - **HTTPS**
     * - mp4
     * - Max: 1 minute
     * - Max: 10 MB
     *
     * A very wide or tall video may be cropped when played in some environments.
     */
    originalContentUrl: string;
    /**
     * URL of preview image (Max: 1000 characters)
     *
     * - **HTTPS**
     * - JPEG
     * - Max: 240 x 240
     * - Max: 1 MB
     */
    previewImageUrl: string;
    area: Area;
    /**
     * External link to be displayed after a video is played
     * This property is required if you set a video to play and a label to display after the video on the imagemap
     */
    externalLink?: {
      linkUri: string;
      label: string;
    };
  };
  /**
   * Action when tapped (Max: 50)
   */
  actions: ImageMapAction[];
};

/**
 * Template messages are messages with predefined layouts which you can
 * customize. For more information, see
 * [template messages](https://developers.line.me/en/docs/messaging-api/message-types/#template-messages).
 *
 * The following template types are available:
 *
 * - [Buttons](https://developers.line.me/en/reference/messaging-api/#buttons)
 * - [Confirm](https://developers.line.me/en/reference/messaging-api/#confirm)
 * - [Carousel](https://developers.line.me/en/reference/messaging-api/#carousel)
 * - [Image carousel](https://developers.line.me/en/reference/messaging-api/#image-carousel)
 *
 * @see [Template messages](https://developers.line.me/en/reference/messaging-api/#template-messages)
 */
export type TemplateMessage = MessageCommon & {
  type: "template";
  /**
   * Alternative text (Max: 400 characters)
   */
  altText: string;
  /**
   * Carousel template content
   */
  template: TemplateContent;
};

/**
 * Flex Messages are messages with a customizable layout.
 * You can customize the layout freely by combining multiple elements.
 * For more information, see
 * [Using Flex Messages](https://developers.line.me/en/docs/messaging-api/using-flex-messages/).
 *
 * @see [Flex messages](https://developers.line.me/en/reference/messaging-api/#flex-message)
 */
export type FlexMessage = MessageCommon & {
  type: "flex";
  altText: string;
  contents: FlexContainer;
};

/**
 * Object which specifies the actions and tappable regions of an imagemap.
 *
 * When a region is tapped, the user is redirected to the URI specified in
 * `uri` and the message specified in `message` is sent.
 *
 * @see [Imagemap action objects](https://developers.line.me/en/reference/messaging-api/#imagemap-action-objects)
 */
export type ImageMapAction = ImageMapURIAction | ImageMapMessageAction;

export type ImageMapActionBase = {
  /** Defined tappable area */
  area: Area;
};

export type ImageMapURIAction = {
  type: "uri";
  /**
   * Webpage URL (Max: 1000 characters)
   */
  linkUri: string;
} & ImageMapActionBase;

export type ImageMapMessageAction = {
  type: "message";
  /**
   * Message to send (Max: 400 characters)
   */
  text: string;
} & ImageMapActionBase;

export type Area = {
  /**
   * Horizontal position relative to the top-left corner of the area
   */
  x: number;
  /**
   * Vertical position relative to the top-left corner of the area
   */
  y: number;
  /**
   * Width of the tappable area
   */
  width: number;
  /**
   * Height of the tappable area
   */
  height: number;
};

/**
 * A container is the top-level structure of a Flex Message. Here are the types of containers available.
 *
 * - [Bubble](https://developers.line.me/en/reference/messaging-api/#bubble)
 * - [Carousel](https://developers.line.me/en/reference/messaging-api/#f-carousel)
 *
 * See [Flex Message elements](https://developers.line.me/en/docs/messaging-api/flex-message-elements/)
 * for the containers' JSON data samples and usage.
 */
export type FlexContainer = FlexBubble | FlexCarousel;

/**
 * This is a container that contains one message bubble. It can contain four
 * blocks: header, hero, body, and footer.
 *
 * For more information about using each block, see
 * [Block](https://developers.line.me/en/docs/messaging-api/flex-message-elements/#block).
 */
export type FlexBubble = {
  type: "bubble";
  /**
   * Text directionality and the order of components in horizontal boxes in the
   * container. Specify one of the following values:
   *
   * - `ltr`: Left to right
   * - `rtl`: Right to left
   *
   * The default value is `ltr`.
   */
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
  /**
   * Background color of the block. Use a hexadecimal color code.
   */
  backgroundColor?: string;
  /**
   * - `true` to place a separator above the block.
   * - `true` will be ignored for the first block in a container because you
   *   cannot place a separator above the first block.
   * - The default value is `false`.
   */
  separator?: boolean;
  /**
   * Color of the separator. Use a hexadecimal color code.
   */
  separatorColor?: string;
};

export type FlexCarousel = {
  type: "carousel";
  /**
   * (Max: 10 bubbles)
   */
  contents: FlexBubble[];
};

/**
 * Components are objects that compose a Flex Message container. Here are the
 * types of components available:
 *
 * - [Box](https://developers.line.me/en/reference/messaging-api/#box)
 * - [Button](https://developers.line.me/en/reference/messaging-api/#button)
 * - [Filler](https://developers.line.me/en/reference/messaging-api/#filler)
 * - [Icon](https://developers.line.me/en/reference/messaging-api/#icon)
 * - [Image](https://developers.line.me/en/reference/messaging-api/#f-image)
 * - [Separator](https://developers.line.me/en/reference/messaging-api/#separator)
 * - [Spacer](https://developers.line.me/en/reference/messaging-api/#spacer)
 * - [Text](https://developers.line.me/en/reference/messaging-api/#f-text)
 *
 * See the followings for the components' JSON data samples and usage.
 *
 * - [Flex Message elements](https://developers.line.me/en/docs/messaging-api/flex-message-elements/)
 * - [Flex Message layout](https://developers.line.me/en/docs/messaging-api/flex-message-layout/)
 */
export type FlexComponent =
  | FlexBox
  | FlexButton
  | FlexFiller
  | FlexIcon
  | FlexImage
  | FlexSeparator
  | FlexSpacer
  | FlexText;

/**
 * This is a component that defines the layout of child components.
 * You can also include a box in a box.
 */
export type FlexBox = {
  type: "box";
  /**
   * The placement style of components in this box. Specify one of the following values:
   *
   * - `horizontal`: Components are placed horizontally. The `direction`
   *     property of the [bubble](https://developers.line.me/en/reference/messaging-api/#bubble)
   *     container specifies the order.
   * - `vertical`: Components are placed vertically from top to bottom.
   * - `baseline`: Components are placed in the same way as `horizontal` is
   *     specified except the baselines of the components are aligned.
   *
   * For more information, see
   * [Types of box layouts](https://developers.line.me/en/docs/messaging-api/flex-message-layout/#box-layout-types).
   */
  layout: "horizontal" | "vertical" | "baseline";
  /**
   * Components in this box. Here are the types of components available:
   *
   * - When the `layout` property is `horizontal` or `vertical`:
   *   + [Box](https://developers.line.me/en/reference/messaging-api/#box)
   *   + [button](https://developers.line.me/en/reference/messaging-api/#button)
   *   + [filler](https://developers.line.me/en/reference/messaging-api/#filler)
   *   + [image](https://developers.line.me/en/reference/messaging-api/#f-image)
   *   + [separator](https://developers.line.me/en/reference/messaging-api/#separator)
   *   + [text](https://developers.line.me/en/reference/messaging-api/#f-text)
   * - When the `layout` property is `baseline`:
   *   + [filler](https://developers.line.me/en/reference/messaging-api/#filler)
   *   + [icon](https://developers.line.me/en/reference/messaging-api/#icon)
   *   + [text](https://developers.line.me/en/reference/messaging-api/#f-text)
   */
  contents: FlexComponent[];
  /**
   * The ratio of the width or height of this box within the parent box. The
   * default value for the horizontal parent box is `1`, and the default value
   * for the vertical parent box is `0`.
   *
   * For more information, see
   * [Width and height of components](https://developers.line.me/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
  /**
   * Minimum space between components in this box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is `none`.
   * - To override this setting for a specific component, set the `margin`
   *   property of that component.
   */
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Minimum space between this box and the previous component in the parent box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Action performed when this button is tapped.
   *
   * Specify an [action object](https://developers.line.me/en/reference/messaging-api/#action-objects).
   */
  action?: Action;
};

/**
 * This component draws a button.
 *
 * When the user taps a button, a specified action is performed.
 */
export type FlexButton = {
  type: "button";
  /**
   * Action performed when this button is tapped.
   *
   * Specify an [action object](https://developers.line.me/en/reference/messaging-api/#action-objects).
   */
  action: Action;
  /**
   * The ratio of the width or height of this box within the parent box.
   *
   * The default value for the horizontal parent box is `1`, and the default
   * value for the vertical parent box is `0`.
   *
   * For more information, see
   * [Width and height of components](https://developers.line.me/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
  /**
   * Minimum space between this box and the previous component in the parent box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Height of the button. The default value is `md`.
   */
  height?: "sm" | "md";
  /**
   * Style of the button. Specify one of the following values:
   *
   * - `link`: HTML link style
   * - `primary`: Style for dark color buttons
   * - `secondary`: Style for light color buttons
   *
   * The default value is `link`.
   */
  style?: "link" | "primary" | "secondary";
  /**
   * Use a hexadecimal color code.
   *
   * - Character color when the `style` property is `link`.
   * - Background color when the `style` property is `primary` or `secondary`.
   */
  color?: string;
  /**
   * Vertical alignment style. Specify one of the following values:
   *
   * - `top`: Top-aligned
   * - `bottom`: Bottom-aligned
   * - `center`: Center-aligned
   *
   * The default value is `top`.
   *
   * If the `layout` property of the parent box is `baseline`, the `gravity`
   * property will be ignored.
   */
  gravity?: "top" | "bottom" | "center";
};

/**
 * This is an invisible component to fill extra space between components.
 *
 * - The filler's `flex` property is fixed to 1.
 * - The `spacing` property of the parent box will be ignored for fillers.
 */
export type FlexFiller = {
  type: "filler";
};

/**
 * This component draws an icon.
 */
export type FlexIcon = {
  type: "icon";
  /**
   * Image URL
   *
   * Protocol: HTTPS
   * Image format: JPEG or PNG
   * Maximum image size: 240×240 pixels
   * Maximum data size: 1 MB
   */
  url: string;
  /**
   * Minimum space between this box and the previous component in the parent
   * box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Maximum size of the icon width.
   * The size increases in the order of listing.
   * The default value is `md`.
   */
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
  /**
   * Aspect ratio of the icon. The default value is `1:1`.
   */
  aspectRatio?: "1:1" | "2:1" | "3:1";
};

/**
 * This component draws an image.
 */
export type FlexImage = {
  type: "image";
  /**
   * Image URL
   *
   * - Protocol: HTTPS
   * - Image format: JPEG or PNG
   * - Maximum image size: 1024×1024 pixels
   * - Maximum data size: 1 MB
   */
  url: string;
  /**
   * The ratio of the width or height of this box within the parent box.
   *
   * The default value for the horizontal parent box is `1`, and the default
   * value for the vertical parent box is `0`.
   *
   * - For more information, see
   * [Width and height of components](https://developers.line.me/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
  /**
   * Minimum space between this box and the previous component in the parent
   * box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Horizontal alignment style. Specify one of the following values:
   *
   * - `start`: Left-aligned
   * - `end`: Right-aligned
   * - `center`: Center-aligned
   *
   * The default value is `center`.
   */
  align?: "start" | "end" | "center";
  /**
   * Vertical alignment style. Specify one of the following values:
   *
   * - `top`: Top-aligned
   * - `bottom`: Bottom-aligned
   * - `center`: Center-aligned
   *
   * The default value is `top`.
   *
   * If the `layout` property of the parent box is `baseline`, the `gravity` property will be ignored.
   */
  gravity?: "top" | "bottom" | "center";
  /**
   * Maximum size of the image width.
   * The size increases in the order of listing.
   * The default value is `md`.
   */
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
  /**
   * Aspect ratio of the image.
   * The default value is `1:1`.
   */
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
  /**
   * Style of the image. Specify one of the following values:
   *
   * - `cover`: The image fills the entire drawing area. Parts of the image
   *   that do not fit in the drawing area are not displayed.
   * - `fit`: The entire image is displayed in the drawing area. The background
   *   is displayed in the unused areas to the left and right of vertical images
   *   and in the areas above and below horizontal images.
   *
   * The default value is `fit`.
   */
  aspectMode?: "cover" | "fit";
  /**
   * Background color of the image. Use a hexadecimal color code.
   */
  backgroundColor?: string;
  /**
   * Action performed when this button is tapped.
   * Specify an [action object](https://developers.line.me/en/reference/messaging-api/#action-objects).
   */
  action?: Action;
};

/**
 * This component draws a separator between components in the parent box.
 */
export type FlexSeparator = {
  type: "separator";
  /**
   * Minimum space between this box and the previous component in the parent
   * box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Color of the separator. Use a hexadecimal color code.
   */
  color?: string;
};

/**
 * This is an invisible component that places a fixed-size space at the
 * beginning or end of the box.
 */
export type FlexSpacer = {
  type: "spacer";
  /**
   * Size of the space.
   * The size increases in the order of listing.
   * The default value is `md`.
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};

export type FlexText = {
  type: "text";
  text: string;
  /**
   * The ratio of the width or height of this box within the parent box.
   *
   * The default value for the horizontal parent box is `1`, and the default
   * value for the vertical parent box is `0`.
   *
   * For more information, see
   * [Width and height of components](https://developers.line.me/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
  /**
   * Minimum space between this box and the previous component in the parent
   * box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Font size.
   * The size increases in the order of listing.
   * The default value is `md`.
   */
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
  /**
   * Horizontal alignment style. Specify one of the following values:
   *
   * - `start`: Left-aligned
   * - `end`: Right-aligned
   * - `center`: Center-aligned
   *
   * The default value is `start`.
   */
  align?: "start" | "end" | "center";
  /**
   * Vertical alignment style. Specify one of the following values:
   *
   * - `top`: Top-aligned
   * - `bottom`: Bottom-aligned
   * - `center`: Center-aligned
   *
   * The default value is `top`.
   *
   * If the `layout` property of the parent box is `baseline`, the `gravity`
   * property will be ignored.
   */
  gravity?: "top" | "bottom" | "center";
  /**
   * `true` to wrap text.
   *
   * The default value is `false`.
   *
   * If set to `true`, you can use a new line character (\n) to begin on a new
   * line.
   */
  wrap?: boolean;
  /**
   * Max number of lines. If the text does not fit in the specified number of
   * lines, an ellipsis (…) is displayed at the end of the last line. If set to
   * 0, all the text is displayed. The default value is 0.
   */
  maxLines?: number;
  /**
   * Font weight.
   * Specifying `bold`makes the font bold.
   * The default value is `regular`.
   */
  weight?: "regular" | "bold";
  /**
   * Font color. Use a hexadecimal color code.
   */
  color?: string;
  /**
   * Action performed when this text is tapped.
   * Specify an [action object](https://developers.line.me/en/reference/messaging-api/#action-objects).
   */
  action?: Action;
};

export type TemplateContent =
  | TemplateButtons
  | TemplateConfirm
  | TemplateCarousel
  | TemplateImageCarousel;

/**
 * Template with an image, title, text, and multiple action buttons.
 *
 * Because of the height limitation for buttons template messages, the lower
 * part of the text display area will get cut off if the height limitation is
 * exceeded. For this reason, depending on the character width, the message
 * text may not be fully displayed even when it is within the character limits.
 */
export type TemplateButtons = {
  type: "buttons";
  /**
   * Image URL (Max: 1000 characters)
   *
   * - HTTPS
   * - JPEG or PNG
   * - Max width: 1024px
   * - Max: 1 MB
   */
  thumbnailImageUrl?: string;
  /**
   * Aspect ratio of the image. Specify one of the following values:
   *
   * - `rectangle`: 1.51:1
   * - `square`: 1:1
   *
   * The default value is `rectangle`
   */
  imageAspectRatio?: "rectangle" | "square";
  /**
   * Size of the image. Specify one of the following values:
   *
   * - `cover`: The image fills the entire image area. Parts of the image that
   *   do not fit in the area are not displayed.
   * - `contain`: The entire image is displayed in the image area. A background
   *   is displayed in the unused areas to the left and right of vertical images
   *   and in the areas above and below horizontal images.
   *
   * The default value is `cover`.
   */
  imageSize?: "cover" | "contain";
  /**
   * Background color of image. Specify a RGB color value.
   * The default value is `#FFFFFF` (white).
   */
  imageBackgroundColor?: string;
  /**
   * Title (Max: 40 characters)
   */
  title?: string;
  /**
   * Message text
   *
   * - Max: 160 characters (no image or title)
   * - Max: 60 characters (message with an image or title)
   */
  text: string;
  /**
   * Action when tapped (Max: 4)
   */
  actions: Action[];
};

/**
 * Template with two action buttons.
 *
 * Because of the height limitation for confirm template messages, the lower
 * part of the `text` display area will get cut off if the height limitation is
 * exceeded. For this reason, depending on the character width, the message
 * text may not be fully displayed even when it is within the character limits.
 */
export type TemplateConfirm = {
  type: "confirm";
  /**
   * Message text (Max: 240 characters)
   */
  text: string;
  /**
   * Action when tapped. Set 2 actions for the 2 buttons
   */
  actions: Action[];
};

/**
 * Template with multiple columns which can be cycled like a carousel.
 * The columns will be shown in order by scrolling horizontally.
 *
 * Because of the height limitation for carousel template messages, the lower
 * part of the `text` display area will get cut off if the height limitation is
 * exceeded. For this reason, depending on the character width, the message
 * text may not be fully displayed even when it is within the character limits.
 *
 * Keep the number of actions consistent for all columns. If you use an image
 * or title for a column, make sure to do the same for all other columns.
 */
export type TemplateCarousel = {
  type: "carousel";
  /**
   * Array of columns (Max: 10)
   */
  columns: TemplateColumn[];
  /**
   * Aspect ratio of the image. Specify one of the following values:
   *
   * - `rectangle`: 1.51:1
   * - `square`: 1:1
   *
   * Applies to all columns. The default value is `rectangle`.
   */
  imageAspectRatio?: "rectangle" | "square";
  /**
   * Size of the image. Specify one of the following values:
   *
   * - `cover`: The image fills the entire image area. Parts of the image that
   *   do not fit in the area are not displayed.
   * - `contain`: The entire image is displayed in the image area. A background
   *   is displayed in the unused areas to the left and right of vertical images
   *   and in the areas above and below horizontal images.
   *
   * Applies to all columns. The default value is `cover`.
   */
  imageSize?: "cover" | "contain";
};

export type TemplateColumn = {
  /**
   * Image URL (Max: 1000 characters)
   *
   * - HTTPS
   * - JPEG or PNG
   * - Aspect ratio: 1:1.51
   * - Max width: 1024px
   * - Max: 1 MB
   */
  thumbnailImageUrl?: string;
  /**
   * Background color of image. Specify a RGB color value.
   * The default value is `#FFFFFF` (white).
   */
  imageBackgroundColor?: string;
  /**
   * Title (Max: 40 characters)
   */
  title?: string;
  /**
   * Message text
   *
   * - Max: 120 characters (no image or title)
   * - Max: 60 characters (message with an image or title)
   */
  text: string;
  /**
   * Action when image is tapped; set for the entire image, title, and text area
   */
  defaultAction?: Action;
  /**
   * Action when tapped (Max: 3)
   */
  actions: Action[];
};

/**
 * Template with multiple images which can be cycled like a carousel.
 * The images will be shown in order by scrolling horizontally.
 */
export type TemplateImageCarousel = {
  type: "image_carousel";
  /**
   * Array of columns (Max: 10)
   */
  columns: TemplateImageColumn[];
};

export type TemplateImageColumn = {
  /**
   * Image URL (Max: 1000 characters)
   *
   * - HTTPS
   * - JPEG or PNG
   * - Aspect ratio: 1:1
   * - Max width: 1024px
   * - Max: 1 MB
   */
  imageUrl: string;
  /**
   * Action when image is tapped
   */
  action: Action<{ label?: string }>;
};

/**
 * These properties are used for the quick reply.
 *
 * For more information, see
 * [Using quick replies](https://developers.line.me/en/docs/messaging-api/using-quick-reply/).
 */
export type QuickReply = {
  /**
   * This is a container that contains
   * [quick reply buttons](https://developers.line.me/en/reference/messaging-api/#quick-reply-button-object).
   *
   * Array of objects (Max: 13)
   */
  items: QuickReplyItem[];
};

/**
 * This is a quick reply option that is displayed as a button.
 *
 * For more information, see
 * [quick reply buttons](https://developers.line.me/en/reference/messaging-api/#quick-reply-button-object).
 */
export type QuickReplyItem = {
  type: "action";
  /**
   * URL of the icon that is displayed at the beginning of the button (Max: 1000 characters)
   *
   * - URL scheme: https
   * - Image format: PNG
   * - Aspect ratio: 1:1
   * - Data size: Up to 1 MB
   *
   * There is no limit on the image size. If the `action` property has the
   * following actions with empty `imageUrl`:
   *
   * - [camera action](https://developers.line.me/en/reference/messaging-api/#camera-action)
   * - [camera roll action](https://developers.line.me/en/reference/messaging-api/#camera-roll-action)
   * - [location action](https://developers.line.me/en/reference/messaging-api/#location-action)
   *
   * the default icon is displayed.
   */
  imageUrl?: string;
  /**
   * Action performed when this button is tapped.
   *
   * Specify an [action object](https://developers.line.me/en/reference/messaging-api/#action-objects).
   *
   * The following is a list of the available actions:
   *
   * - [Postback action](https://developers.line.me/en/reference/messaging-api/#postback-action)
   * - [Message action](https://developers.line.me/en/reference/messaging-api/#message-action)
   * - [Datetime picker action](https://developers.line.me/en/reference/messaging-api/#datetime-picker-action)
   * - [Camera action](https://developers.line.me/en/reference/messaging-api/#camera-action)
   * - [Camera roll action](https://developers.line.me/en/reference/messaging-api/#camera-roll-action)
   * - [Location action](https://developers.line.me/en/reference/messaging-api/#location-action)
   */
  action: Action;
};

/**
 * These are types of actions for your bot to take when a user taps a button or an image in a message.
 *
 * - [Postback action](https://developers.line.me/en/reference/messaging-api/#postback-action)
 * - [Message action](https://developers.line.me/en/reference/messaging-api/#message-action)
 * - [URI action](https://developers.line.me/en/reference/messaging-api/#uri-action)
 * - [Datetime picker action](https://developers.line.me/en/reference/messaging-api/#datetime-picker-action)
 * - [Camera action](https://developers.line.me/en/reference/messaging-api/#camera-action)
 * - [Camera roll action](https://developers.line.me/en/reference/messaging-api/#camera-roll-action)
 * - [Location action](https://developers.line.me/en/reference/messaging-api/#location-action)
 */
export type Action<ExtraFields = { label: string }> = (
  | PostbackAction
  | MessageAction
  | URIAction
  | DatetimePickerAction) &
  ExtraFields;

/**
 * When a control associated with this action is tapped, a postback event is
 * returned via webhook with the specified string in the data property.
 */
export type PostbackAction = {
  type: "postback";
  /**
   * String returned via webhook in the `postback.data` property of the
   * postback event (Max: 300 characters)
   */
  data: string;
  /**
   * Text displayed in the chat as a message sent by the user when the action
   * is performed. Returned from the server through a webhook.
   *
   * - This property cannot be used with quick reply buttons. (Max: 300 characters)
   * - The `displayText` and `text` properties cannot both be used at the same time.
   * @deprecated
   */
  text?: string;
  /**
   * Text displayed in the chat as a message sent by the user when the action is performed.
   *
   * - Required for quick reply buttons.
   * - Optional for the other message types.
   *
   * Max: 300 characters
   *
   * The `displayText` and `text` properties cannot both be used at the same time.
   */
  displayText?: string;
};

/**
 * When a control associated with this action is tapped, the string in the text
 * property is sent as a message from the user.
 */
export type MessageAction = {
  type: "message";
  /**
   * Text sent when the action is performed (Max: 300 characters)
   */
  text: string;
};

/**
 * When a control associated with this action is tapped, the URI specified in
 * the `uri` property is opened.
 */
export type URIAction = {
  type: "uri";
  /**
   * URI opened when the action is performed (Max: 1000 characters).
   * Must start with `http`, `https`, or `tel`.
   */
  uri: string;
  altUri?: AltURI;
};

/**
 * URI opened on LINE for macOS and Windows when the action is performed (Max: 1000 characters)
 * If the altUri.desktop property is set, the uri property is ignored on LINE for macOS and Windows.
 * The available schemes are http, https, line, and tel.
 * For more information about the LINE URL scheme, see Using the LINE URL scheme.
 * This property is supported on the following version of LINE.
 *
 * LINE 5.12.0 or later for macOS and Windows
 * Note: The altUri.desktop property is supported only when you set URI actions in Flex Messages.
 */
export type AltURI = {
  desktop: string;
};

/**
 * When a control associated with this action is tapped, a
 * [postback event](https://developers.line.me/en/reference/messaging-api/#postback-event)
 * is returned via webhook with the date and time selected by the user from the
 * date and time selection dialog.
 *
 * The datetime picker action does not support time zones.
 *
 * #### Date and time format
 *
 * The date and time formats for the `initial`, `max`, and `min` values are
 * shown below. The `full-date`, `time-hour`, and `time-minute` formats follow
 * the [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) protocol.
 *
 * | Mode     | Format                                                       | Example                          |
 * | -------- | ------------------------------------------------------------ | -------------------------------- |
 * | date     | `full-date` (Max: 2100-12-31; Min: 1900-01-01)               | 2017-06-18                       |
 * | time     | `time-hour`:`time-minute` (Max: 23:59; Min: 00:00)           | 00:0006:1523:59                  |
 * | datetime | `full-date`T`time-hour`:`time-minute` or `full-date`t`time-hour`:`time-minute` (Max: 2100-12-31T23:59; Min: 1900-01-01T00:00) | 2017-06-18T06:152017-06-18t06:15 |
 */
export type DatetimePickerAction = {
  type: "datetimepicker";
  /**
   * String returned via webhook in the `postback.data` property of the
   * postback event (Max: 300 characters)
   */
  data: string;
  mode: "date" | "time" | "datetime";
  /**
   * Initial value of date or time
   */
  initial?: string;
  /**
   * Largest date or time value that can be selected. Must be greater than the
   * `min` value.
   */
  max?: string;
  /**
   * Smallest date or time value that can be selected. Must be less than the
   * `max` value.
   */
  min?: string;
};

export type Size = {
  width: number;
  height: number;
};

/**
 * Rich menus consist of either of these objects.
 *
 * - [Rich menu object](https://developers.line.me/en/reference/messaging-api/#rich-menu-object)
 *   without the rich menu ID. Use this object when you
 *   [create a rich menu](https://developers.line.me/en/reference/messaging-api/#create-rich-menu).
 * - [Rich menu response object](https://developers.line.me/en/reference/messaging-api/#rich-menu-response-object)
 *   with the rich menu ID. This object is returned when you
 *   [get a rich menu](https://developers.line.me/en/reference/messaging-api/#get-rich-menu)
 *   or [get a list of rich menus](https://developers.line.me/en/reference/messaging-api/#get-rich-menu-list).
 *
 * [Area objects](https://developers.line.me/en/reference/messaging-api/#area-object) and
 * [action objects](https://developers.line.me/en/reference/messaging-api/#action-objects)
 * are included in these objects.
 */
export type RichMenu = {
  /**
   * [`size` object](https://developers.line.me/en/reference/messaging-api/#size-object)
   * which contains the width and height of the rich menu displayed in the chat.
   * Rich menu images must be one of the following sizes: 2500x1686px or 2500x843px.
   */
  size: Size;
  /**
   * `true` to display the rich menu by default. Otherwise, `false`.
   */
  selected: boolean;
  /**
   * Name of the rich menu.
   *
   * This value can be used to help manage your rich menus and is not displayed
   * to users.
   *
   * (Max: 300 characters)
   */
  name: string;
  /**
   * Text displayed in the chat bar (Max: 14 characters)
   */
  chatBarText: string;
  /**
   * Array of [area objects](https://developers.line.me/en/reference/messaging-api/#area-object)
   * which define the coordinates and size of tappable areas
   * (Max: 20 area objects)
   */
  areas: Array<{ bounds: Area; action: Action<{}> }>;
};

export type RichMenuResponse = { richMenuId: string } & RichMenu;

export type NumberOfMessagesSentResponse = {
  /**
   * Status of the counting process. One of the following values is returned:
   *  - `ready`: You can get the number of messages.
   *  - `unready`: The message counting process for the date specified in date has not been completed yet.
   *    Retry your request later. Normally, the counting process is completed within the next day.
   *  - `out_of_service`: The date specified in date is earlier than March 31, 2018, when the operation of the counting system started.
   */
  status: "ready" | "unready" | "out_of_service";
  /**
   * The number of messages sent with the Messaging API on the date specified in date.
   * The response has this property only when the value of status is `ready`.
   */
  success?: number;
};

export type TargetLimitForAdditionalMessages = {
  /**
   * One of the following values to indicate whether a target limit is set or not.
   *  - `none`: This indicates that a target limit is not set.
   *  - `limited`: This indicates that a target limit is set.
   */
  type: "none" | "limited";
  /**
   * The target limit for additional messages in the current month.
   * This property is returned when the `type` property has a value of `limited`.
   */
  value?: number;
};

export type NumberOfMessagesSentThisMonth = {
  /**
   * The number of sent messages in the current month
   */
  totalUsage: number;
};

export const LINE_REQUEST_ID_HTTP_HEADER_NAME = "x-line-request-id";
export type MessageAPIResponseBase = {
  [LINE_REQUEST_ID_HTTP_HEADER_NAME]?: string;
};
