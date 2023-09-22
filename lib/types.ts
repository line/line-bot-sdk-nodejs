import { AxiosRequestConfig } from "axios";

export interface Config {
  channelAccessToken?: string;
  channelSecret?: string;
}

export interface ClientConfig extends Config {
  channelAccessToken: string;
  httpConfig?: Partial<AxiosRequestConfig>;
}

export interface MiddlewareConfig extends Config {
  channelSecret: string;
}

export type Profile = {
  displayName: string;
  userId: string;
  pictureUrl?: string;
  statusMessage?: string;
  language?: string;
};

/**
 * Request body which is sent by webhook.
 *
 * @see [Request body](https://developers.line.biz/en/reference/messaging-api/#request-body)
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
 * @see [Webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects)
 */
export type WebhookEvent =
  | MessageEvent
  | UnsendEvent
  | FollowEvent
  | UnfollowEvent
  | JoinEvent
  | LeaveEvent
  | MemberJoinEvent
  | MemberLeaveEvent
  | PostbackEvent
  | VideoPlayCompleteEvent
  | BeaconEvent
  | AccountLinkEvent
  | DeviceLinkEvent
  | DeviceUnlinkEvent
  | LINEThingsScenarioExecutionEvent;

export type EventBase = {
  /**
   * Channel state.
   *
   * `active`: The channel is active. You can send a reply message or push message from the bot server that received this webhook event.
   *
   * `standby`: The channel is waiting. The bot server that received this webhook event shouldn't send any messages.
   */
  mode: "active" | "standby";
  /**
   * Time of the event in milliseconds
   */
  timestamp: number;
  /**
   * Source user, group, or room object with information about the source of the event.
   */
  source: EventSource;
  /**
   * Webhook Event ID, an ID that uniquely identifies a webhook event
   */
  webhookEventId: string;
  /**
   * Whether the webhook event is a redelivered one or not
   */
  deliveryContext: DeliveryContext;
};

export type EventSource = User | Group | Room;

export type User = { type: "user"; userId: string };

export type Group = {
  type: "group";
  groupId: string;
  /**
   * ID of the source user.
   *
   * Only included in [message events](https://developers.line.biz/en/reference/messaging-api/#message-event).
   * Not included if the user has not agreed to the
   * [Official Accounts Terms of Use](https://developers.line.biz/en/docs/messaging-api/user-consent/).
   */
  userId?: string;
};

export type Room = {
  type: "room";
  roomId: string;
  /**
   * ID of the source user.
   *
   * Only included in [message events](https://developers.line.biz/en/reference/messaging-api/#message-event).
   * Not included if the user has not agreed to the
   * [Official Accounts Terms of Use](https://developers.line.biz/en/docs/messaging-api/user-consent/).
   */
  userId?: string;
};

export type DeliveryContext = { isRedelivery: boolean };

export type ReplyableEvent = EventBase & { replyToken: string };

/**
 * Webhook event object which contains the sent message.
 *
 * The `message` property contains a message object which corresponds with the
 * message type. You can reply to message events.
 *
 * @see [Message event](https://developers.line.biz/en/reference/messaging-api/#message-event)
 */
export type MessageEvent = {
  type: "message";
  message: EventMessage;
} & ReplyableEvent;

/**
 * Event object for when the user unsends a message in a [group](https://developers.line.biz/en/docs/messaging-api/group-chats/#group)
 * or [room](https://developers.line.biz/en/docs/messaging-api/group-chats/#room).
 * [Unsend event](https://developers.line.biz/en/reference/messaging-api/#unsend-event)
 */
export type UnsendEvent = {
  type: "unsend";
  /**
   * The message ID of the unsent message
   */
  unsend: { messageId: string };
} & EventBase;

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
 * [template message](https://developers.line.biz/en/reference/messaging-api/#template-messages).
 */
export type PostbackEvent = {
  type: "postback";
  postback: Postback;
} & ReplyableEvent;

/**
 * Event for when a user finishes viewing a video at least once with the specified trackingId sent by the LINE Official Account.
 */
export type VideoPlayCompleteEvent = {
  type: "videoPlayComplete";
  /**
   * ID used to identify a video. Returns the same value as the trackingId assigned to the [video message](https://developers.line.biz/en/reference/messaging-api/#video-message).
   * String
   */
  videoPlayComplete: { trackingId: string };
} & ReplyableEvent;

/**
 * Event object for when a user enters or leaves the range of a
 * [LINE Beacon](https://developers.line.biz/en/docs/messaging-api/using-beacons/).
 */
export type BeaconEvent = ReplyableEvent & {
  type: "beacon";
  beacon: {
    /**
     * `leave` will be deprecated
     */
    type: "enter" | "leave" | "banner" | "stay";

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
  /**
   * Sendable LINE emojis
   */
  emojis?: {
    index: number;
    length: number;
    productId: string;
    emojiId: string;
  }[];
  /**
   * Object containing the contents of the mentioned user.
   */
  mention?: {
    /**
     * Mentioned user information.
     * Max: 20 mentions
     */
    mentionees: {
      /**
       * Index position of the user mention for a character in `text`,
       * with the first character being at position 0.
       */
      index: number;
      /**
       * The length of the text of the mentioned user. For a mention `@example`,
       * 8 is the length.
       */
      length: number;
      /**
       * Mentioned target.
       *
       * - `user`: User.
       * - `all`: Entire group.
       */
      type: "user" | "all";
      /**
       * User ID of the mentioned user. Only included if mention.mentions[].type is user
       * and the user consents to the LINE Official Account obtaining their user profile information.
       */
      userId?: string;
    }[];
  };
  /**
   * Message ID of a quoted message. Only included when the received message quotes a past message.
   */
  quotedMessageId?: string;
} & QuotableMessage &
  EventMessageBase;

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
  /**
   * Object containing the number of images sent simultaneously.
   */
  imageSet?: {
    /**
     * Image set ID. Only included when multiple images are sent simultaneously.
     */
    id: string;
    /**
     * An index starting from 1, indicating the image number in a set of images sent simultaneously.
     * Only included when multiple images are sent simultaneously.
     * However, it won't be included if the sender is using LINE 11.15 or earlier for Android.
     */
    index: number;
    /**
     * The total number of images sent simultaneously.
     * If two images are sent simultaneously, the number is 2.
     * Only included when multiple images are sent simultaneously.
     * However, it won't be included if the sender is using LINE 11.15 or earlier for Android.
     */
    total: number;
  };
} & QuotableMessage &
  EventMessageBase;

/**
 * Message object which contains the video content sent from the source.
 * The binary video data can be retrieved using Client#getMessageContent.
 */
export type VideoEventMessage = {
  type: "video";
  contentProvider: ContentProvider;
} & QuotableMessage &
  EventMessageBase;

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
 * [sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
 */
export type StickerEventMessage = {
  type: "sticker";
  packageId: string;
  stickerId: string;
  stickerResourceType:
    | "STATIC"
    | "ANIMATION"
    | "SOUND"
    | "ANIMATION_SOUND"
    | "POPUP"
    | "POPUP_SOUND"
    | "CUSTOM"
    | "MESSAGE";
  keywords: string[];
  /**
   * Any text entered by the user. This property is only included for message stickers.
   * Max character limit: 100
   */
  text?: string;
  /**
   * Message ID of a quoted message. Only included when the received message quotes a past message.
   */
  quotedMessageId?: string;
} & QuotableMessage &
  EventMessageBase;

export type Postback = {
  data: string;
  params?: DateTimePostback | RichMenuSwitchPostback;
};

/**
 * Object with the date and time selected by a user through a
 * [datetime picker action](https://developers.line.biz/en/reference/messaging-api/#datetime-picker-action).
 * Only returned for postback actions via a
 * [datetime picker action](https://developers.line.biz/en/reference/messaging-api/#datetime-picker-action).
 * The `full-date`, `time-hour`, and `time-minute` formats follow the
 * [RFC3339 protocol](https://www.ietf.org/rfc/rfc3339.txt).
 */
type DateTimePostback = {
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

/**
 * Object with rich menu alias ID selected by user via rich menu switch action.
 * https://developers.line.biz/en/reference/messaging-api/#postback-params-object-for-richmenu-switch-action
 */
type RichMenuSwitchPostback = {
  newRichMenuAliasId: string;
  status:
    | "SUCCESS"
    | "RICHMENU_ALIAS_ID_NOTFOUND"
    | "RICHMENU_NOTFOUND"
    | "FAILED";
};

/**
 * JSON object which contains the contents of the message you send.
 *
 * @see [Message objects](https://developers.line.biz/en/reference/messaging-api/#message-objects)
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
 * @see [Common properties for messages](https://developers.line.biz/en/reference/messaging-api/#common-properties-for-messages)
 */
export type MessageCommon = {
  /**
   * For the quick reply feature.
   * For more information, see [Using quick replies](https://developers.line.biz/en/docs/messaging-api/using-quick-reply/).
   *
   * If the user receives multiple
   * [message objects](https://developers.line.biz/en/reference/messaging-api/#message-objects),
   * the quickReply property of the last message object is displayed.
   */
  quickReply?: QuickReply;
  /**
   * [Change icon and display name](https://developers.line.biz/en/docs/messaging-api/icon-nickname-switch/)
   *
   * When sending a message from the LINE Official Account, you can specify the `sender.name` and the `sender.iconUrl` properties in [Message objects](https://developers.line.biz/en/reference/messaging-api/#message-objects).
   */
  sender?: Sender;
};

type QuotableMessage = {
  /**
   * Quote token to quote this message.
   */
  quoteToken: string;
};

type CanQuoteMessage = {
  /**
   * Quote token of the message you want to quote.
   */
  quoteText?: string;
};

/**
 * @see [Text message](https://developers.line.biz/en/reference/messaging-api/#text-message)
 */
export type TextMessage = MessageCommon &
  CanQuoteMessage & {
    type: "text";
    /**
     * Message text. You can include the following emoji:
     *
     * - LINE emojis. Use a $ character as a placeholder and specify the product ID and emoji ID of the LINE emoji you want to use in the emojis property.
     * - Unicode emoji
     * - (Deprecated) LINE original unicode emojis
     *   ([Unicode codepoint table for LINE original emoji](https://developers.line.biz/media/messaging-api/emoji-list.pdf))
     *
     * Max: 5000 characters
     */
    text: string;

    /**
     * One or more LINE emoji.
     *
     * Max: 20 LINE emoji
     */
    emojis?: {
      index: number;
      productId: string;
      emojiId: string;
    }[];
  };

/**
 * @see [Image message](https://developers.line.biz/en/reference/messaging-api/#image-message)
 */
export type ImageMessage = MessageCommon & {
  type: "image";
  /**
   * Image URL (Max: 2000 characters)
   *
   * - **HTTPS**
   * - JPEG
   * - Max: 1024 x 1024
   * - Max: 1 MB
   */
  originalContentUrl: string;
  /**
   * Preview image URL (Max: 2000 characters)
   *
   * - **HTTPS**
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   */
  previewImageUrl: string;
};

/**
 * @see [Video message](https://developers.line.biz/en/reference/messaging-api/#video-message)
 */
export type VideoMessage = MessageCommon & {
  type: "video";
  /**
   * URL of video file (Max: 2000 characters)
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
   * URL of preview image (Max: 2000 characters)
   *
   * - **HTTPS**
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   */
  previewImageUrl: string;
};

/**
 * @see [Audio message](https://developers.line.biz/en/reference/messaging-api/#audio-message)
 */
export type AudioMessage = MessageCommon & {
  type: "audio";
  /**
   * URL of audio file (Max: 2000 characters)
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
 * @see [Location message](https://developers.line.biz/en/reference/messaging-api/#location-message)
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
 * @see [Sticker message](https://developers.line.biz/en/reference/messaging-api/#sticker-message)
 */
export type StickerMessage = MessageCommon &
  CanQuoteMessage & {
    type: "sticker";
    /**
     * Package ID for a set of stickers.
     * For information on package IDs, see the
     * [Sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
     */
    packageId: string;
    /**
     * Sticker ID.
     * For a list of sticker IDs for stickers that can be sent with the Messaging
     * API, see the
     * [Sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
     */
    stickerId: string;
  };

/**
 * @see [Imagemap message](https://developers.line.biz/en/reference/messaging-api/#imagemap-message)
 */
export type ImageMapMessage = MessageCommon & {
  type: "imagemap";
  /**
   * [Base URL](https://developers.line.biz/en/reference/messaging-api/#base-url) of image
   * (Max: 2000 characters, **HTTPS**)
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
     * URL of video file (Max: 2000 characters)
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
     * URL of preview image (Max: 2000 characters)
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
 * [template messages](https://developers.line.biz/en/docs/messaging-api/message-types/#template-messages).
 *
 * The following template types are available:
 *
 * - [Buttons](https://developers.line.biz/en/reference/messaging-api/#buttons)
 * - [Confirm](https://developers.line.biz/en/reference/messaging-api/#confirm)
 * - [Carousel](https://developers.line.biz/en/reference/messaging-api/#carousel)
 * - [Image carousel](https://developers.line.biz/en/reference/messaging-api/#image-carousel)
 *
 * @see [Template messages](https://developers.line.biz/en/reference/messaging-api/#template-messages)
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
 * [Using Flex Messages](https://developers.line.biz/en/docs/messaging-api/using-flex-messages/).
 *
 * @see [Flex messages](https://developers.line.biz/en/reference/messaging-api/#flex-message)
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
 * @see [Imagemap action objects](https://developers.line.biz/en/reference/messaging-api/#imagemap-action-objects)
 */
export type ImageMapAction = ImageMapURIAction | ImageMapMessageAction;

export type ImageMapActionBase = {
  /**
   * Spoken when the accessibility feature is enabled on the client device. (Max: 50 characters)
   * Supported on LINE 8.2.0 and later for iOS.
   */
  label?: string;
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
 * - [Bubble](https://developers.line.biz/en/reference/messaging-api/#bubble)
 * - [Carousel](https://developers.line.biz/en/reference/messaging-api/#f-carousel)
 *
 * See [Flex Message elements](https://developers.line.biz/en/docs/messaging-api/flex-message-elements/)
 * for the containers' JSON data samples and usage.
 */
export type FlexContainer = FlexBubble | FlexCarousel;

/**
 * This is a container that contains one message bubble. It can contain four
 * blocks: header, hero, body, and footer.
 *
 * For more information about using each block, see
 * [Block](https://developers.line.biz/en/docs/messaging-api/flex-message-elements/#block).
 */
export type FlexBubble = {
  type: "bubble";
  size?: "nano" | "micro" | "kilo" | "mega" | "giga";
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
  hero?: FlexBox | FlexImage | FlexVideo;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: FlexBubbleStyle;
  action?: Action;
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
   * (Max: 12 bubbles)
   */
  contents: FlexBubble[];
};

/**
 * Components are objects that compose a Flex Message container. Here are the
 * types of components available:
 *
 * - [Box](https://developers.line.biz/en/reference/messaging-api/#box)
 * - [Button](https://developers.line.biz/en/reference/messaging-api/#button)
 * - [Image](https://developers.line.biz/en/reference/messaging-api/#f-image)
 * - [Video](https://developers.line.biz/en/reference/messaging-api/#f-video)
 * - [Icon](https://developers.line.biz/en/reference/messaging-api/#icon)
 * - [Text](https://developers.line.biz/en/reference/messaging-api/#f-text)
 * - [Span](https://developers.line.biz/en/reference/messaging-api/#span)
 * - [Separator](https://developers.line.biz/en/reference/messaging-api/#separator)
 * - [Filler](https://developers.line.biz/en/reference/messaging-api/#filler)
 * - [Spacer (not recommended)](https://developers.line.biz/en/reference/messaging-api/#spacer)
 *
 * See the followings for the components' JSON data samples and usage.
 *
 * - [Flex Message elements](https://developers.line.biz/en/docs/messaging-api/flex-message-elements/)
 * - [Flex Message layout](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/)
 */
export type FlexComponent =
  | FlexBox
  | FlexButton
  | FlexImage
  | FlexVideo
  | FlexIcon
  | FlexText
  | FlexSpan
  | FlexSeparator
  | FlexFiller
  | FlexSpacer;

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
   *     property of the [bubble](https://developers.line.biz/en/reference/messaging-api/#bubble)
   *     container specifies the order.
   * - `vertical`: Components are placed vertically from top to bottom.
   * - `baseline`: Components are placed in the same way as `horizontal` is
   *     specified except the baselines of the components are aligned.
   *
   * For more information, see
   * [Types of box layouts](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#box-layout-types).
   */
  layout: "horizontal" | "vertical" | "baseline";
  /**
   * Components in this box. Here are the types of components available:
   *
   * - When the `layout` property is `horizontal` or `vertical`:
   *   + [Box](https://developers.line.biz/en/reference/messaging-api/#box)
   *   + [button](https://developers.line.biz/en/reference/messaging-api/#button)
   *   + [image](https://developers.line.biz/en/reference/messaging-api/#f-image)
   *   + [text](https://developers.line.biz/en/reference/messaging-api/#f-text)
   *   + [separator](https://developers.line.biz/en/reference/messaging-api/#separator)
   *   + [filler](https://developers.line.biz/en/reference/messaging-api/#filler)
   *   + [spacer (not recommended)](https://developers.line.biz/en/reference/messaging-api/#spacer)
   * - When the `layout` property is `baseline`:
   *   + [icon](https://developers.line.biz/en/reference/messaging-api/#icon)
   *   + [text](https://developers.line.biz/en/reference/messaging-api/#f-text)
   *   + [filler](https://developers.line.biz/en/reference/messaging-api/#filler)
   *   + [spacer (not recommended)](https://developers.line.biz/en/reference/messaging-api/#spacer)
   */
  contents: FlexComponent[];
  /**
   * Background color of the block. In addition to the RGB color, an alpha
   * channel (transparency) can also be set. Use a hexadecimal color code.
   * (Example:#RRGGBBAA) The default value is `#00000000`.
   */
  backgroundColor?: string;
  /**
   * Color of box border. Use a hexadecimal color code.
   */
  borderColor?: string;
  /**
   * Width of box border. You can specify a value in pixels or any one of none,
   * light, normal, medium, semi-bold, or bold. none does not render a border
   * while the others become wider in the order of listing.
   */
  borderWidth?:
    | string
    | "none"
    | "light"
    | "normal"
    | "medium"
    | "semi-bold"
    | "bold";
  /**
   * Radius at the time of rounding the corners of the border. You can specify a
   * value in pixels or any one of `none`, `xs`, `sm`, `md`, `lg`, `xl`, or `xxl`. none does not
   * round the corner while the others increase in radius in the order of listing. The default value is none.
   */
  cornerRadius?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Width of the box. For more information, see [Width of a box](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#box-width) in the API documentation.
   */
  width?: string;
  /**
   * Max width of the box. For more information, see [Max width of a box](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#box-max-width) in the API documentation.
   */
  maxWidth?: string;
  /**
   * Height of the box. For more information, see [Height of a box](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#box-height) in the API documentation.
   */
  height?: string;
  /**
   * Max height of the box. For more information, see [Max height of a box](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#box-max-height) in the API documentation.
   */
  maxHeight?: string;
  /**
   * The ratio of the width or height of this box within the parent box. The
   * default value for the horizontal parent box is `1`, and the default value
   * for the vertical parent box is `0`.
   *
   * For more information, see
   * [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
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
  spacing?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
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
  margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Free space between the borders of this box and the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingAll?: string;
  /**
   * Free space between the border at the upper end of this box and the upper end of the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingTop?: string;
  /**
   * Free space between the border at the lower end of this box and the lower end of the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingBottom?: string;
  /**
   * Free space between the border at the left end of this box and the left end of the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingStart?: string;
  /**
   * Free space between the border at the right end of this box and the right end of the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingEnd?: string;
  /**
   * Action performed when this button is tapped.
   *
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   */
  action?: Action;
  /**
   * How child elements are aligned along the main axis of the parent element. If the
   * parent element is a horizontal box, this only takes effect when its child elements have
   * their `flex` property set equal to 0. For more information, see [Arranging a box's child elements and free space](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#justify-property)
   * in the Messaging API documentation.
   */
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  /**
   * How child elements are aligned along the cross axis of the parent element. For more
   * information, see [Arranging a box's child elements and free space](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#justify-property) in the Messaging API documentation.
   */
  alignItems?: "flex-start" | "center" | "flex-end";
  background?: Background;
} & Offset;

export type Offset = {
  /**
   * Reference position for placing this box. Specify one of the following values:
   * - `relative`: Use the previous box as reference.
   * - `absolute`: Use the top left of parent element as reference.
   *
   * The default value is relative.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  position?: "relative" | "absolute";
  /**
   * The top offset.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  offsetTop?: string;
  /**
   * The bottom offset.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  offsetBottom?: string;
  /**
   * The left offset.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  offsetStart?: string;
  /**
   * The right offset.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  offsetEnd?: string;
};

export type Background = {
  /**
   * The type of background used. Specify these values:
   * - `linearGradient`: Linear gradient. For more information, see [Linear gradient backgrounds](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#linear-gradient-bg) in the Messaging API documentation.
   */
  type: "linearGradient";
  /**
   * The angle at which a linear gradient moves. Specify the angle using an integer value
   * like `90deg` (90 degrees) or a decimal number like `23.5deg` (23.5 degrees) in the
   * half-open interval [0, 360). The direction of the linear gradient rotates clockwise as the
   * angle increases. Given a value of `0deg`, the gradient starts at the bottom and ends at
   * the top; given a value of `45deg`, the gradient starts at the bottom-left corner and ends
   * at the top-right corner; given a value of 90deg, the gradient starts at the left and ends
   * at the right; and given a value of `180deg`, the gradient starts at the top and ends at
   * the bottom. For more information, see [Direction (angle) of linear gradient backgrounds](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#linear-gradient-bg-angle) in the Messaging API documentation.
   */
  angle: string;
  /**
   * The color at the gradient's starting point. Use a hexadecimal color code in the
   * `#RRGGBB` or `#RRGGBBAA` format.
   */
  startColor: string;
  /**
   * The color at the gradient's ending point. Use a hexadecimal color code in the
   * `#RRGGBB` or `#RRGGBBAA` format.
   */
  endColor: string;
  /**
   * The color in the middle of the gradient. Use a hexadecimal color code in the `#RRGGBB`
   * or `#RRGGBBAA` format. Specify a value for the `background.centerColor` property to
   * create a gradient that has three colors. For more information, see [Intermediate color stops for linear gradients](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#linear-gradient-bg-center-color) in the
   * Messaging API documentation.
   */
  centerColor?: string;
  /**
   * The position of the intermediate color stop. Specify an integer or decimal value
   * between `0%` (the starting point) and `100%` (the ending point). This is `50%` by
   * default. For more information, see [Intermediate color stops for linear gradients](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#linear-gradient-bg-center-color) in the
   * Messaging API documentation.
   */
  centerPosition?: string;
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
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   */
  action: Action;
  /**
   * The ratio of the width or height of this box within the parent box.
   *
   * The default value for the horizontal parent box is `1`, and the default
   * value for the vertical parent box is `0`.
   *
   * For more information, see
   * [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
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
  margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
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
  /**
   * The method by which to adjust the text font size. Specify this value:
   *
   * - `shrink-to-fit`: Automatically shrink the font
   *   size to fit the width of the component. This
   *   property takes a "best-effort" approach that may
   *   work differently—or not at all!—on some platforms.
   *   For more information, see [Automatically shrink fonts to fit](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#adjusts-fontsize-to-fit)
   *   in the Messaging API documentation.
   * - LINE 10.13.0 or later for iOS and Android
   */
  adjustMode?: "shrink-to-fit";
} & Offset;

/**
 * This is an invisible component to fill extra space between components.
 *
 * - The filler's `flex` property is fixed to 1.
 * - The `spacing` property of the parent box will be ignored for fillers.
 */
export type FlexFiller = {
  type: "filler";
  /**
   * The ratio of the width or height of this component within the parent box. For more information, see [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
};

/**
 * This component draws an icon.
 */
export type FlexIcon = {
  type: "icon";
  /**
   * Image URL (Max character limit: 2000)
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
  margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Maximum size of the icon width.
   * The size increases in the order of listing.
   * The default value is `md`.
   * For more information, see [Icon, text, and span size](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#other-component-size) in the Messaging API documentation.
   */
  size?:
    | string
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
   * Aspect ratio of the icon. `{width}:{height}` format.
   * The values of `{width}` and `{height}` must be in the range 1–100000.
   * `{height}` can't be more than three times the value of `{width}`.
   * The default value is `1:1`.
   */
  aspectRatio?: string;
} & Offset;

/**
 * This component draws an image.
 */
export type FlexImage = {
  type: "image";
  /**
   * Image URL (Max character limit: 2000)
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
   * [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
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
  margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
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
   * For more information, see [Image size](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#image-size) in the Messaging API documentation.
   */
  size?:
    | string
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
   * Aspect ratio of the image. `{width}:{height}` format.
   * Specify the value of `{width}` and `{height}` in the range from 1 to 100000. However,
   * you cannot set `{height}` to a value that is more than three times the value of `{width}`.
   * The default value is `1:1`.
   */
  aspectRatio?: string;
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
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   */
  action?: Action;
  /**
   * When this is `true`, an animated image (APNG) plays.
   * You can specify a value of `true` up to three times in a single message.
   * You can't send messages that exceed this limit.
   * This is `false` by default.
   * Animated images larger than 300 KB aren't played back.
   */
  animated?: Boolean;
} & Offset;

/**
 * This component draws a video.
 */
export type FlexVideo = {
  type: "video";
  /**
   * Video file URL (Max character limit: 2000)
   *
   * - Protocol: HTTPS (TLS 1.2 or later)
   * - Video format: mp4
   * - Maximum data size: 200 MB
   */
  url: string;
  /**
   * Preview image URL (Max character limit: 2000)
   *
   * - Protocol: HTTPS (TLS 1.2 or later)
   * - Image format: JPEG or PNG
   * - Maximum data size: 1 MB
   */
  previewUrl: string;
  /**
   * Alternative content.
   *
   * The alternative content will be displayed on the screen of a user device
   * that is using a version of LINE that doesn't support the video component.
   * Specify a box or an image.
   *
   * - Protocol: HTTPS (TLS 1.2 or later)
   * - Image format: JPEG or PNG
   * - Maximum data size: 1 MB
   */
  altContent: FlexBox | FlexImage;
  /**
   * Aspect ratio of the video. `{width}:{height}` format.
   * Specify the value of `{width}` and `{height}` in the range from 1 to 100000. However,
   * you cannot set `{height}` to a value that is more than three times the value of `{width}`.
   * The default value is `1:1`.
   */
  aspectRatio?: string;
  /**
   * Action performed when this button is tapped.
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
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
  margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Color of the separator. Use a hexadecimal color code.
   */
  color?: string;
};

/**
 * This is an invisible component that places a fixed-size space at the
 * beginning or end of the box.
 * @deprecated
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
type FlexTextBase = {
  type: "text";
  /**
   * The method by which to adjust the text font size. Specify this value:
   *
   * - `shrink-to-fit`: Automatically shrink the font
   *   size to fit the width of the component. This
   *   property takes a "best-effort" approach that may
   *   work differently—or not at all!—on some platforms.
   *   For more information, see [Automatically shrink fonts to fit](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#adjusts-fontsize-to-fit)
   *   in the Messaging API documentation.
   * - LINE 10.13.0 or later for iOS and Android
   */
  adjustMode?: "shrink-to-fit";
  /**
   * The ratio of the width or height of this box within the parent box.
   *
   * The default value for the horizontal parent box is `1`, and the default
   * value for the vertical parent box is `0`.
   *
   * For more information, see
   * [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
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
  margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Font size.
   * The size increases in the order of listing.
   * The default value is `md`.
   * For more information, see [Icon, text, and span size](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#other-component-size) in the Messaging API documentation.
   */
  size?:
    | string
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
   * Line spacing in a wrapping text.
   *
   * Specify a positive integer or decimal number that ends in px.
   * The `lineSpacing` property doesn't apply to the top of the start line and the bottom of the last line.
   * For more information, see [Increase the line spacing in a text](https://developers.line.biz/en/docs/messaging-api/flex-message-elements/#text-line-spacing) in the Messaging API documentation.
   */
  lineSpacing?: string;
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
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   */
  action?: Action;
  /**
   * Style of the text. Specify one of the following values:
   * - `normal`: Normal
   * - `italic`: Italic
   *
   * The default value is `normal`.
   */
  style?: string;
  /**
   * Decoration of the text. Specify one of the following values:
   * `none`: No decoration
   * `underline`: Underline
   * `line-through`: Strikethrough
   *
   * The default value is `none`.
   */
  decoration?: string;
};

type FlexTextWithText = FlexTextBase & {
  text: string;
  contents?: never;
};

type FlexTextWithContents = FlexTextBase & {
  /**
   * Array of spans. Be sure to set either one of the `text` property or `contents` property. If you set the `contents` property, `text` is ignored.
   */
  contents: FlexSpan[];
  text?: never;
};

export type FlexText = (FlexTextWithText | FlexTextWithContents) & Offset;

/**
 * This component renders multiple text strings with different designs in one row. You can specify the color, size, weight, and decoration for the font. Span is set to `contents` property in [Text](https://developers.line.biz/en/reference/messaging-api/#f-text).
 */
export type FlexSpan = {
  type: "span";
  /**
   * Text. If the `wrap` property of the parent text is set to `true`, you can use a new line character (`\n`) to begin on a new line.
   */
  text: string;
  /**
   * Font color. Use a hexadecimal color code.
   */
  color?: string;
  /**
   * Font size. You can specify one of the following values: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `3xl`, `4xl`, or `5xl`. The size increases in the order of listing. The default value is `md`.
   * For more information, see [Icon, text, and span size](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#other-component-size) in the Messaging API documentation.
   */
  size?:
    | string
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
   * Font weight. You can specify one of the following values: `regular` or `bold`. Specifying `bold` makes the font bold. The default value is `regular`.
   */
  weight?: string;
  /**
   * Style of the text. Specify one of the following values:
   * - `normal`: Normal
   * - `italic`: Italic
   *
   * The default value is `normal`.
   */
  style?: string;
  /**
   * Decoration of the text. Specify one of the following values:
   * `none`: No decoration
   * `underline`: Underline
   * `line-through`: Strikethrough
   *
   * The default value is `none`.
   *
   * Note: The decoration set in the `decoration` property of the [text](https://developers.line.biz/en/reference/messaging-api/#f-text) cannot be overwritten by the `decoration` property of the span.
   */
  decoration?: string;
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
   * Image URL (Max: 2000 characters)
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
   * Image URL (Max: 2000 characters)
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
   * Image URL (Max: 2000 characters)
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
 * [Using quick replies](https://developers.line.biz/en/docs/messaging-api/using-quick-reply/).
 */
export type QuickReply = {
  /**
   * This is a container that contains
   * [quick reply buttons](https://developers.line.biz/en/reference/messaging-api/#quick-reply-button-object).
   *
   * Array of objects (Max: 13)
   */
  items: QuickReplyItem[];
};

/**
 * This is a quick reply option that is displayed as a button.
 *
 * For more information, see
 * [quick reply buttons](https://developers.line.biz/en/reference/messaging-api/#quick-reply-button-object).
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
   * - [camera action](https://developers.line.biz/en/reference/messaging-api/#camera-action)
   * - [camera roll action](https://developers.line.biz/en/reference/messaging-api/#camera-roll-action)
   * - [location action](https://developers.line.biz/en/reference/messaging-api/#location-action)
   *
   * the default icon is displayed.
   */
  imageUrl?: string;
  /**
   * Action performed when this button is tapped.
   *
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   *
   * The following is a list of the available actions:
   *
   * - [Postback action](https://developers.line.biz/en/reference/messaging-api/#postback-action)
   * - [Message action](https://developers.line.biz/en/reference/messaging-api/#message-action)
   * - [Datetime picker action](https://developers.line.biz/en/reference/messaging-api/#datetime-picker-action)
   * - [Camera action](https://developers.line.biz/en/reference/messaging-api/#camera-action)
   * - [Camera roll action](https://developers.line.biz/en/reference/messaging-api/#camera-roll-action)
   * - [Location action](https://developers.line.biz/en/reference/messaging-api/#location-action)
   * - [URI action](https://developers.line.biz/en/reference/messaging-api/#uri-action)
   */
  action: Action;
};

export type Sender = {
  /**
   * Display name
   *
   * - Max character limit: 20
   * - Certain words such as `LINE` may not be used.
   */
  name?: string;
  /**
   * Icon image URL
   *
   * - Max character limit: 1000
   * - URL scheme: https
   */
  iconUrl?: string;
};

/**
 * These are types of actions for your bot to take when a user taps a button or an image in a message.
 *
 * - [Postback action](https://developers.line.biz/en/reference/messaging-api/#postback-action)
 * - [Message action](https://developers.line.biz/en/reference/messaging-api/#message-action)
 * - [URI action](https://developers.line.biz/en/reference/messaging-api/#uri-action)
 * - [Datetime picker action](https://developers.line.biz/en/reference/messaging-api/#datetime-picker-action)
 * - [Rich menu switch action](https://developers.line.biz/en/reference/messaging-api/#richmenu-switch-action)
 * - [Camera action](https://developers.line.biz/en/reference/messaging-api/#camera-action)
 * - [Camera roll action](https://developers.line.biz/en/reference/messaging-api/#camera-roll-action)
 * - [Location action](https://developers.line.biz/en/reference/messaging-api/#location-action)
 */
export type Action<ExtraFields = { label: string }> = (
  | PostbackAction
  | MessageAction
  | URIAction
  | DatetimePickerAction
  | RichMenuSwitchAction
  | { type: "camera" }
  | { type: "cameraRoll" }
  | { type: "location" }
) &
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
  /**
   * The display method of such as rich menu based on user action. Specify one of the following values:
   *
   * - `closeRichMenu`: Close rich menu
   * - `openRichMenu`: Open rich menu
   * - `openKeyboard`: Open keyboard
   * - `openVoice`: Open voice message input mode
   *
   * This property is available on LINE version 12.6.0 or later for iOS or Android.
   */
  inputOption?: "closeRichMenu" | "openRichMenu" | "openKeyboard" | "openVoice";
  /**
   * String to be pre-filled in the input field when the keyboard is opened.
   * Valid only when the inputOption property is set to openKeyboard.
   * The string can be broken by a newline character (\n).
   *
   * Max: 300 characters
   */
  fillInText?: string;
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
 * [postback event](https://developers.line.biz/en/reference/messaging-api/#postback-event)
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
 * When a control associated with this action is tapped, the URI specified in
 * the `uri` property is opened.
 */
export type RichMenuSwitchAction = {
  type: "richmenuswitch";
  /**
   * Action label. Optional for rich menus. Read when the user's device accessibility feature is enabled.
   * Max character limit: 20. Supported on LINE for iOS 8.2.0 or later.
   */
  label?: string;
  /**
   * Rich menu alias ID to switch to.
   */
  richMenuAliasId: string;
  /**
   * String returned by the postback.data property of the postback event via a webhook
   * Max character limit: 300
   */
  data: string;
};

/**
 * Rich menus consist of either of these objects.
 *
 * - [Rich menu object](https://developers.line.biz/en/reference/messaging-api/#rich-menu-object)
 *   without the rich menu ID. Use this object when you
 *   [create a rich menu](https://developers.line.biz/en/reference/messaging-api/#create-rich-menu).
 * - [Rich menu response object](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object)
 *   with the rich menu ID. This object is returned when you
 *   [get a rich menu](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu)
 *   or [get a list of rich menus](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-list).
 *
 * [Area objects](https://developers.line.biz/en/reference/messaging-api/#area-object) and
 * [action objects](https://developers.line.biz/en/reference/messaging-api/#action-objects)
 * are included in these objects.
 */
export type RichMenu = {
  /**
   * [`size` object](https://developers.line.biz/en/reference/messaging-api/#size-object)
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
   * Array of [area objects](https://developers.line.biz/en/reference/messaging-api/#area-object)
   * which define the coordinates and size of tappable areas
   * (Max: 20 area objects)
   */
  areas: Array<{ bounds: Area; action: Action<{ label?: string }> }>;
};

export type RichMenuResponse = { richMenuId: string } & RichMenu;

export type NumberOfMessagesSentResponse = InsightStatisticsResponse & {
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

export const LINE_SIGNATURE_HTTP_HEADER_NAME = "x-line-signature";

export type InsightStatisticsResponse = {
  /**
   * Calculation status. One of:
   * - `ready`: Calculation has finished; the numbers are up-to-date.
   * - `unready`: We haven't finished calculating the number of sent messages for the specified `date`. Calculation usually takes about a day. Please try again later.
   * - `out_of_service`: The specified `date` is earlier than the date on which we first started calculating sent messages. Different APIs have different date. Check them at the [document](https://developers.line.biz/en/reference/messaging-api/).
   */
  status: "ready" | "unready" | "out_of_service";
};

export type NumberOfMessageDeliveries = InsightStatisticsResponse & {
  /**
   * Number of push messages sent to **all** of this LINE official account's friends (broadcast messages).
   */
  broadcast: number;
  /**
   * Number of push messages sent to **some** of this LINE official account's friends, based on specific attributes (targeted/segmented messages).
   */
  targeting: number;
  /**
   * Number of auto-response messages sent.
   */
  autoResponse: number;
  /**
   * Number of greeting messages sent.
   */
  welcomeResponse: number;
  /**
   * Number of messages sent from LINE Official Account Manager [Chat screen](https://www.linebiz.com/jp-en/manual/OfficialAccountManager/chats/screens/).
   */
  chat: number;
  /**
   * Number of broadcast messages sent with the [Send broadcast message](https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message) Messaging API operation.
   */
  apiBroadcast: number;
  /**
   * Number of push messages sent with the [Send push message](https://developers.line.biz/en/reference/messaging-api/#send-push-message) Messaging API operation.
   */
  apiPush: number;
  /**
   * Number of multicast messages sent with the [Send multicast message](https://developers.line.biz/en/reference/messaging-api/#send-multicast-message) Messaging API operation.
   */
  apiMulticast: number;
  /**
   * Number of replies sent with the [Send reply message](https://developers.line.biz/en/reference/messaging-api/#send-reply-message) Messaging API operation.
   */
  apiReply: number;
};

export type NumberOfFollowers = InsightStatisticsResponse & {
  /**
   * The number of times, as of the specified `date`, that a user added this LINE official account as a friend. The number doesn't decrease when a user blocks the account after adding it, or when they delete their own account.
   */
  followers: Number;
  /**
   * The number of users, as of the specified `date`, that the official account can reach with messages targeted by gender, age, or area. This number includes users for whom we estimated demographic attributes based on their activity in LINE and LINE-connected services.
   */
  targetedReaches: Number;
  /**
   * The number of users blocking the account as of the specified `date`. The number decreases when a user unblocks the account.
   */
  blocks: Number;
};

export type NumberOfMessageDeliveriesResponse =
  | InsightStatisticsResponse
  | NumberOfMessageDeliveries;

export type NumberOfFollowersResponse =
  | InsightStatisticsResponse
  | NumberOfFollowers;

type PercentageAble = {
  percentage: number;
};

export type FriendDemographics = {
  /**
   * `true` if friend demographic information is available.
   */
  available: boolean;
  /**
   * Percentage per gender
   */
  genders?: Array<
    {
      /**
       * Gender
       */
      gender: "unknown" | "male" | "female";
    } & PercentageAble
  >;
  /**
   * Percentage per age group
   */
  ages?: Array<
    {
      /**
       * Age group
       */
      age: string;
    } & PercentageAble
  >;
  /**
   * Percentage per area
   */
  areas?: Array<
    {
      area: string;
    } & PercentageAble
  >;
  /**
   * Percentage by OS
   */
  appTypes?: Array<
    {
      appType: "ios" | "android" | "others";
    } & PercentageAble
  >;
  /**
   * Percentage per friendship duration
   */
  subscriptionPeriods?: Array<
    {
      /**
       * Friendship duration
       */
      subscriptionPeriod:
        | "over365days"
        | "within365days"
        | "within180days"
        | "within90days"
        | "within30days"
        | "within7days"
        // in case for some rare cases(almost no)
        | "unknown";
    } & PercentageAble
  >;
};

type UserInteractionStatisticsOfEachMessage = {
  seq: number;
  impression: number;
  mediaPlayed: number;
  mediaPlayed25Percent: number;
  mediaPlayed50Percent: number;
  mediaPlayed75Percent: number;
  mediaPlayed100Percent: number;
  uniqueMediaPlayed: number;
  uniqueMediaPlayed25Percent: number;
  uniqueMediaPlayed50Percent: number;
  uniqueMediaPlayed75Percent: number;
  uniqueMediaPlayed100Percent: number;
};

type UserInteractionStatisticsOfEachURL = {
  seq: number;
  url: number;
  click: number;
  uniqueClick: number;
  uniqueClickOfRequest: number;
};

/**
 * https://developers.line.biz/en/reference/messaging-api/#get-message-event
 */
export type UserInteractionStatistics = {
  overview: {
    requestId: string;
    timestamp: number;
    delivered: number;
    uniqueImpression: number;
    uniqueClick: number;
    uniqueMediaPlayed: number;
    uniqueMediaPlayed100Percent: number;
  };
  messages: UserInteractionStatisticsOfEachMessage[];
  clicks: UserInteractionStatisticsOfEachURL[];
};

/**
 * https://developers.line.biz/en/reference/messaging-api/#get-statistics-per-unit
 */
export type StatisticsPerUnit = {
  overview: {
    uniqueImpression: number;
    uniqueClick: number;
    uniqueMediaPlayed: number;
    uniqueMediaPlayed100Percent: number;
  };
  messages: UserInteractionStatisticsOfEachMessage[];
  clicks: UserInteractionStatisticsOfEachURL[];
};

type FilterOperatorObject<T> = {
  type: "operator";
} & (
  | {
      and: (T | FilterOperatorObject<T>)[];
    }
  | {
      or: (T | FilterOperatorObject<T>)[];
    }
  | {
      not: T | (T | FilterOperatorObject<T>)[];
    }
);

type AudienceObject = {
  type: "audience";
  audienceGroupId: number;
};

type RedeliveryObject = {
  type: "redelivery";
  requestId: string;
};

export type ReceieptObject =
  | AudienceObject
  | RedeliveryObject
  | FilterOperatorObject<AudienceObject>
  | FilterOperatorObject<RedeliveryObject>;

type DemographicAge =
  | "age_15"
  | "age_20"
  | "age_25"
  | "age_30"
  | "age_35"
  | "age_40"
  | "age_45"
  | "age_50";

type DemographicSubscriptionPeriod =
  | "day_7"
  | "day_30"
  | "day_90"
  | "day_180"
  | "day_365";

type DemographicArea =
  | "jp_01"
  | "jp_02"
  | "jp_03"
  | "jp_04"
  | "jp_05"
  | "jp_06"
  | "jp_07"
  | "jp_08"
  | "jp_09"
  | "jp_10"
  | "jp_11"
  | "jp_12"
  | "jp_13"
  | "jp_14"
  | "jp_15"
  | "jp_16"
  | "jp_17"
  | "jp_18"
  | "jp_19"
  | "jp_20"
  | "jp_21"
  | "jp_22"
  | "jp_23"
  | "jp_24"
  | "jp_25"
  | "jp_26"
  | "jp_27"
  | "jp_28"
  | "jp_29"
  | "jp_30"
  | "jp_31"
  | "jp_32"
  | "jp_33"
  | "jp_34"
  | "jp_35"
  | "jp_36"
  | "jp_37"
  | "jp_38"
  | "jp_39"
  | "jp_40"
  | "jp_41"
  | "jp_42"
  | "jp_43"
  | "jp_44"
  | "jp_45"
  | "jp_46"
  | "jp_47"
  | "tw_01"
  | "tw_02"
  | "tw_03"
  | "tw_04"
  | "tw_05"
  | "tw_06"
  | "tw_07"
  | "tw_08"
  | "tw_09"
  | "tw_10"
  | "tw_11"
  | "tw_12"
  | "tw_13"
  | "tw_14"
  | "tw_15"
  | "tw_16"
  | "tw_17"
  | "tw_18"
  | "tw_19"
  | "tw_20"
  | "tw_21"
  | "tw_22"
  | "th_01"
  | "th_02"
  | "th_03"
  | "th_04"
  | "th_05"
  | "th_06"
  | "th_07"
  | "th_08"
  | "id_01"
  | "id_02"
  | "id_03"
  | "id_04"
  | "id_06"
  | "id_07"
  | "id_08"
  | "id_09"
  | "id_10"
  | "id_11"
  | "id_12"
  | "id_05";

type DemographicObject =
  | {
      type: "gender";
      oneOf: ("male" | "female")[];
    }
  | {
      type: "age";
      gte?: DemographicAge;
      lt?: DemographicAge;
    }
  | {
      type: "appType";
      oneOf: ("ios" | "android")[];
    }
  | {
      type: "area";
      oneOf: DemographicArea[];
    }
  | {
      type: "subscriptionPeriod";
      gte?: DemographicSubscriptionPeriod;
      lt?: DemographicSubscriptionPeriod;
    };

export type DemographicFilterObject =
  | DemographicObject
  | FilterOperatorObject<DemographicObject>;

export type NarrowcastProgressResponse = (
  | {
      phase: "waiting";
    }
  | ((
      | {
          phase: "sending" | "succeeded";
        }
      | {
          phase: "failed";
          failedDescription: string;
        }
    ) & {
      successCount: number;
      failureCount: number;
      targetCount: string;
      acceptedTime: string;
      completedTime: string;
    })
) & {
  errorCode?: 1 | 2;
};

type AudienceGroupJob = {
  audienceGroupJobId: number;
  audienceGroupId: number;
  description: string;
  type: "DIFF_ADD";
  audienceCount: number;
  created: number;
} & (
  | {
      jobStatus: "QUEUED" | "WORKING" | "FINISHED";
    }
  | {
      jobStatus: "FAILED";
      failedType: "INTERNAL_ERROR";
    }
);

export type AudienceGroupStatus =
  | "IN_PROGRESS"
  | "READY"
  | "EXPIRED"
  | "FAILED";

export type AudienceGroupCreateRoute = "OA_MANAGER" | "MESSAGING_API";

type _AudienceGroup = {
  audienceGroupId: number;
  description: string;
  audienceCount: number;
  created: number;
  isIfaAudience: boolean;
  permission: "READ" | "READ_WRITE";
  createRoute: AudienceGroupCreateRoute;
} & (
  | {
      status: Exclude<AudienceGroupStatus, "FAILED">;
    }
  | {
      status: "FAILED";
      failedType: "AUDIENCE_GROUP_AUDIENCE_INSUFFICIENT" | "INTERNAL_ERROR";
    }
) &
  (
    | {
        type: "UPLOAD";
      }
    | {
        type: "CLICK";
        clickUrl: string;
      }
    | {
        type: "IMP";
        requestId: string;
      }
  );

export type AudienceGroup = _AudienceGroup & {
  jobs: AudienceGroupJob[];
};

export type AudienceGroups = _AudienceGroup[];

export type AudienceGroupAuthorityLevel = "PUBLIC" | "PRIVATE";

export type ChannelAccessToken = {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
  key_id?: string;
};

export type VerifyAccessToken = {
  scope: string;
  client_id: string;
  expires_in: number;
};

export type VerifyIDToken = {
  scope: string;
  client_id: string;
  expires_in: number;

  iss: string;
  sub: string;
  aud: number;
  exp: number;
  iat: number;
  nonce: string;
  amr: string[];
  name: string;
  picture: string;
  email: string;
};

/**
 * Response body of get group summary.
 *
 * @see [Get group summary](https://developers.line.biz/en/reference/messaging-api/#get-group-summary)
 */
export type GroupSummaryResponse = {
  groupId: string;
  groupName: string;
  pictureUrl?: string;
};

/**
 * Response body of get members in group count and get members in room count.
 *
 * @see [Get members in group count](https://developers.line.biz/en/reference/messaging-api/#get-members-group-count)
 * @see [Get members in room count](https://developers.line.biz/en/reference/messaging-api/#get-members-room-count)
 */
export type MembersCountResponse = {
  count: number;
};

export type GetRichMenuAliasResponse = {
  richMenuAliasId: string;
  richMenuId: string;
};

export type GetRichMenuAliasListResponse = {
  aliases: GetRichMenuAliasResponse[];
};

/**
 * Response body of get bot info.
 *
 * @see [Get bot info](https://developers.line.biz/en/reference/messaging-api/#get-bot-info)
 */
export type BotInfoResponse = {
  userId: string;
  basicId: string;
  premiumId?: string;
  displayName: string;
  pictureUrl?: string;
  chatMode: "chat" | "bot";
  markAsReadMode: "auto" | "manual";
};

/**
 * Response body of get webhook endpoint info.
 *
 * @see [Get get webhook endpoint info](https://developers.line.biz/en/reference/messaging-api/#get-webhook-endpoint-information)
 */
export type WebhookEndpointInfoResponse = {
  endpoint: string;
  active: boolean;
};

/**
 * Response body of test webhook endpoint.
 *
 * @see [Test webhook endpoint](https://developers.line.biz/en/reference/messaging-api/#test-webhook-endpoint)
 */
export type TestWebhookEndpointResponse = {
  success: boolean;
  timestamp: string;
  statusCode: number;
  reason: string;
  detail: string;
};
