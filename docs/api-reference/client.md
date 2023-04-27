# `new Client(config)`

`Client` is a class representing an API client. It provides methods
corresponding to [messaging APIs](https://developers.line.biz/en/reference/messaging-api/).

#### Type signature

``` typescript
class Client {
  public config: ClientConfig

  constructor(config: ClientConfig) {}

  // requestOption
  setRequestOptionOnce(option: Partial<{
    retryKey: string;
  }>)

  // Message
  pushMessage(to: string, messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>
  replyMessage(replyToken: string, messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>
  multicast(to: string[], messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>
  narrowcast(
    messages: Message | Message[],
    recipient?: ReceieptObject,
    filter?: { demographic: DemographicFilterObject },
    limit?: { max?: number, upToRemainingQuota?: boolean },
    notificationDisabled?: boolean,
  ): Promise<MessageAPIResponseBase>
  broadcast(messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>
  getMessageContent(messageId: string): Promise<Readable>

  // Validate message objects
  validatePushMessageObjects(messages: Types.Message | Types.Message[]): Promise<Types.MessageAPIResponseBase>
  validateReplyMessageObjects(messages: Types.Message | Types.Message[]): Promise<Types.MessageAPIResponseBase>
  validateMulticastMessageObjects(messages: Types.Message | Types.Message[]): Promise<Types.MessageAPIResponseBase>
  validateNarrowcastMessageObjects(messages: Types.Message | Types.Message[]): Promise<Types.MessageAPIResponseBase>
  validateBroadcastMessageObjects(messages: Types.Message | Types.Message[]): Promise<Types.MessageAPIResponseBase>

  // Profile
  getProfile(userId: string): Promise<Profile>

  // Group
  getGroupSummary(groupId: string): Promise<GroupSummary>
  getGroupMembersCount(groupId: string): Promise<MemberCountResponse>
  getGroupMemberProfile(groupId: string, userId: string): Promise<Profile>
  getGroupMemberIds(groupId: string): Promise<string[]>
  leaveGroup(groupId: string): Promise<any>

  // Room
  getRoomMembersCount(roomId: string): Promise<MemberCountResponse>
  getRoomMemberProfile(roomId: string, userId: string): Promise<Profile>
  getRoomMemberIds(roomId: string): Promise<string[]>
  leaveRoom(roomId: string): Promise<any>

  // Rich menu
  getRichMenu(richMenuId: string): Promise<RichMenuResponse>
  createRichMenu(richMenu: RichMenu): Promise<string>
  deleteRichMenu(richMenuId: string): Promise<any>
  getRichMenuAliasList(): Promise<Types.GetRichMenuAliasListResponse>
  getRichMenuAlias(richMenuAliasId: string): Promise<Types.GetRichMenuAliasResponse>>
  createRichMenuAlias(richMenuId: string, richMenuAliasId: string): Promise<{}>
  deleteRichMenuAlias(richMenuAliasId: string): Promise<{}>
  updateRichMenuAlias(richMenuAliasId: string, richMenuId: string): Promise<{}>
  getRichMenuIdOfUser(userId: string): Promise<string>
  linkRichMenuToUser(userId: string, richMenuId: string): Promise<any>
  unlinkRichMenuFromUser(userId: string, richMenuId: string): Promise<any>
  linkRichMenuToMultipleUsers(richMenuId: string, userIds: string[]): Promise<any>
  unlinkRichMenusFromMultipleUsers(userIds: string[]): Promise<any>
  getRichMenuImage(richMenuId: string): Promise<Readable>
  setRichMenuImage(richMenuId: string, data: Buffer | Readable, contentType?: string): Promise<any>
  getRichMenuList(): Promise<Array<RichMenuResponse>>
  setDefaultRichMenu(richMenuId: string): Promise<{}>
  getDefaultRichMenuId(): Promise<string>
  deleteDefaultRichMenu(): Promise<{}>

  // Account link
  getLinkToken(userId: string): Promise<string>

  // Get number of messages sent
  getNumberOfSentReplyMessages(date: string): Promise<NumberOfMessagesSentResponse>
  getNumberOfSentPushMessages(date: string): Promise<NumberOfMessagesSentResponse>
  getNumberOfSentMulticastMessages(date: string): Promise<NumberOfMessagesSentResponse>
  getTargetLimitForAdditionalMessages(): Promise<TargetLimitForAdditionalMessages>
  getNumberOfMessagesSentThisMonth(): Promise<NumberOfMessagesSentThisMonth>
  getNumberOfSentBroadcastMessages(date: string): Promise<NumberOfMessagesSentResponse>
  getNarrowcastProgress(requestId: string): Promise<NarrowcastProgressResponse>

  // Insight
  getNumberOfMessageDeliveries(date: string): Promise<Types.NumberOfMessageDeliveriesResponse>
  getNumberOfFollowers(date: string): Promise<Types.NumberOfFollowersResponse>
  getFriendDemographics(): Promise<Types.FriendDemographics>
  getUserInteractionStatistics(requestId: string): Promise<Types.UserInteractionStatistics>
  getStatisticsPerUnit(customAggregationUnit: string, from: string, to: string): Promise<Types.StatisticsPerUnit>

  // AudienceGroup
  createUploadAudienceGroup(uploadAudienceGroup: {
    description: string;
    isIfaAudience?: boolean;
    audiences?: { id: string }[];
    uploadDescription?: string;
  }) : Promise<{
      audienceGroupId: number;
      type: string;
      description: string;
      created: number;
      requestId: string;
    }>
  createUploadAudienceGroupByFile(uploadAudienceGroup: {
    description: string;
    isIfaAudience?: boolean;
    uploadDescription?: string;
    file: Buffer | Readable;
  }) : Promise<{
      audienceGroupId: number;
      type: "UPLOAD";
      description: string;
      created: number;
    }>
  updateUploadAudienceGroup(
    uploadAudienceGroup: {
      audienceGroupId: number;
      description?: string;
      uploadDescription?: string;
      audiences: { id: string }[];
    },
    // for set request timeout
    httpConfig?: Partial<AxiosRequestConfig>,
  ) : Promise<{}>
  createUploadAudienceGroupByFile(
    uploadAudienceGroup: {
      audienceGroupId: number;
      uploadDescription?: string;
      file: Buffer | Readable;
    },
    // for set request timeout
    httpConfig?: Partial<AxiosRequestConfig>,
  }) : Promise<{}>
  createClickAudienceGroup(clickAudienceGroup: {
    description: string;
    requestId: string;
    clickUrl?: string;
  }) :Promise<{
      audienceGroupId: number;
      type: string;
      created: number;
      description: string;
      requestId: string;
      clickUrl: string;
    }>
  createImpAudienceGroup(impAudienceGroup: {
    requestId: string;
    description: string;
  }): Promise<{
      audienceGroupId: number;
      type: string;
      description: string;
      created: number;
      requestId: string;
    }>
  setDescriptionAudienceGroup(
    description: string,
    audienceGroupId: string,
  ): Promise<{}>
  deleteAudienceGroup(audienceGroupId: string): Promise<{}>
  getAudienceGroup(audienceGroupId: string): Promise<AudienceGroup>
  getAudienceGroups(
    page: number,
    description?: string,
    status?: AudienceGroupStatus,
    size?: number,
    createRoute?: AudienceGroupCreateRoute,
    includesExternalPublicGroups?: boolean,
  ): Promise<{
      audienceGroups: AudienceGroups;
      hasNextPage: boolean;
      totalCount: number;
      readWriteAudienceGroupTotalCount: number;
      page: number;
      size: number;
    }>
  getAudienceGroupAuthorityLevel(): Promise<{
    authorityLevel: Types.AudienceGroupAuthorityLevel
  }>
  changeAudienceGroupAuthorityLevel(
    authorityLevel: Types.AudienceGroupAuthorityLevel
  ): Promise<{}>

  // Bot
  getBotInfo(): Promise<BotInfoResponse>

  // Webhook
  setWebhookEndpointUrl(endpoint: string): Promise<{}>
  getWebhookEndpointInfo(): Promise<{
    endpoint: string;
    active: boolean;
  }>
  testWebhookEndpoint(endpoint?: string): Promise<{
    success: boolean;
    timestamp: string;
    statusCode: number;
    reason: string;
    detail: string;
  }>
}
```

`Message` is a valid message object. About message object structure, please
refer to [Message and event objects](./message-and-event-objects.md) on this guide, or
[Send message object](https://developers.line.biz/en/reference/messaging-api/#message-objects)
on the official documentation.

`ClientConfig` type is like below.

``` typescript
interface ClientConfig {
  channelAccessToken: string;
  channelSecret?: string;
}
```

## Common Specifications

Regarding to things like [Retrying an API request](https://developers.line.biz/en/reference/messaging-api/#retry-api-request), there's an API called `setRequestOptionOnce`.
When you call this first and call the API support that request option, then it will be set to that request and will be cleared automatically.

## Methods

For a parameter `messages: messages: Message | Message[]`, you can provide a
message object or an array of message objects. Both will work, but please beware
that there can be a limit on the number of the messages to be sent
simultaneously. About the API detail, please refer to [the official documentation](https://developers.line.biz/en/reference/messaging-api/#message-objects).

For functions returning `Promise`, there will be errors thrown if something
goes wrong, such as HTTP errors or parsing errors. You can catch them with the
`.catch()` method of the promises. The detailed error handling is explained
in [the Client guide](../guide/client.md).

### Message

#### `pushMessage(to: string, messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>`

It corresponds to the [Push message](https://developers.line.biz/en/reference/messaging-api/#send-push-message) API.

The first argument is an ID of a receiver, and the second is messages to be sent.

``` js
client.pushMessage('user_or_group_or_room_id', {
  type: 'text',
  text: 'hello, world',
})
```

#### `replyMessage(replyToken: string, messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>`

It corresponds to the [Reply message](https://developers.line.biz/en/reference/messaging-api/#send-reply-message) API.

The first argument is a reply token, which is retrieved from a webhook event
object. For the list of replyable events, please refer to [Webhook event object](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects)
of the official documentation. The second argument is the same with one in `pushMessage()`.

``` js
client.replyMessage(event.replyToken, {
  type: 'text',
  text: 'hello, world',
})
```

#### `multicast(to: string[], messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>`

It corresponds to the [Multicast](https://developers.line.biz/en/reference/messaging-api/#send-multicast-message) API.

The first argument is a list of receiver IDs, and the second is messages to be
sent.

``` js
client.multicast(['user_id_1', 'user_id_2', 'room_id_1'], {
  type: 'text',
  text: 'hello, world',
})
```

#### `broadcast(messages: Message | Message[], notificationDisabled: boolean = false): Promise<any>`

Sends push messages to multiple users at any time.

Note: LINE@ accounts cannot call this API endpoint. Please migrate it to a LINE official account. For more information, see [Migration of LINE@ accounts](https://developers.line.biz/en/docs/messaging-api/migrating-line-at/).

``` js
client.broadcast({
  type: 'text',
  text: 'hello, world',
})
```

#### `getMessageContent(messageId: string): Promise<Readable>`

It corresponds to the [Content](https://developers.line.biz/en/reference/messaging-api/#get-content) API.

The argument is an ID of media messages, such as image, video, and audio. The ID
can be retrieved from a message object of a message event.

Please beware that what it returns is promise of [readable stream](https://nodejs.org/dist/latest/docs/api/stream.html#stream_readable_streams).
You can pipe the stream into a file, an HTTP response, etc.

``` js
client.getMessageContent('message_id')
  .then((stream) => {
    stream.on('data', (chunk) => {
      ...
    })
    stream.on('error', (err) => {
      ...
    })
    stream.pipe(...)
  })
```
### Validate message objects

#### `validatePushMessageObjects(messages: Message | Message[]): Promise<MessageAPIResponseBase>`

It corresponds to the [Validate push message objects](https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-push-message) API.

The argument is messages to be sent.

``` js
client.validatePushMessageObjects({
  type: 'text',
  text: 'hello, world',
})
```

#### `validateReplyMessageObjects(messages: Message | Message[]): Promise<MessageAPIResponseBase>`

It corresponds to the [Validate reply message objects](https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-reply-message) API.

The argument is messages to be sent.

``` js
client.validateReplyMessageObjects({
  type: 'text',
  text: 'hello, world',
})
```

#### `validateMulticastMessageObjects(messages: Message | Message[]): Promise<MessageAPIResponseBase>`

It corresponds to the [Validate multicast message objects](https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-multicast-message) API.

The argument is messages to be sent.

``` js
client.validateMulticastMessageObjects({
  type: 'text',
  text: 'hello, world',
})
```

#### `validateNarrowcastMessageObjects(messages: Message | Message[]): Promise<MessageAPIResponseBase>`

It corresponds to the [Validate narrowcast message objects](https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-narrowcast-message) API.

The argument is messages to be sent.

``` js
client.validateNarrowcastMessageObjects({
  type: 'text',
  text: 'hello, world',
})
```

#### `validateBroadcastMessageObjects(messages: Message | Message[], notificationDisabled: boolean = false): Promise<any>`

It corresponds to the [Validate broadcast message objects](https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-broadcast-message) API.

The argument is messages to be sent.

``` js
client.validateBroadcastMessageObjects({
  type: 'text',
  text: 'hello, world',
})
```

### Profile

#### `getProfile(userId: string): Promise<Profile>`

It corresponds to the [Profile](https://developers.line.biz/en/reference/messaging-api/#get-profile) API.

The argument is a user ID.

``` js
client.getProfile('user_id').then((profile) => {
  console.log(profile);
});
```

### Group
#### `getGroupSummary(groupId: string): Promise<GroupSummary>`

It corresponds to the [Group Summary](https://developers.line.biz/en/reference/messaging-api/#get-group-summary) API.

The argument is a group ID.

``` js
client.getGroupSummary('group_id').then((summary) => {
  console.log(summary)
})
```

#### `getGroupMembersCount(groupId: string): Promise<MemberCountResponse>`

It corresponds to the [Group Members Count](https://developers.line.biz/en/reference/messaging-api/#get-members-group-count) API.

The argument is a group ID.

``` js
client.getGroupMembersCount('group_id').then((count) => {
  console.log(count)
})
```

#### `getGroupMemberProfile(groupId: string, userId: string): Promise<Profile>`

It corresponds to the [Group Member Profile](https://developers.line.biz/en/reference/messaging-api/#get-group-member-profile) API.

The arguments are a group ID and an ID of a user in the group. Please refer to
the official documentation for the difference between this API and `getProfile()`.

``` js
client.getGroupMemberProfile('group_id', 'user_id').then((profile) => {
  console.log(profile);
})
```

#### `getGroupMemberIds(groupId: string): Promise<string[]>`

It corresponds to the [Group Member IDs](https://developers.line.biz/en/reference/messaging-api/#get-group-member-user-ids) API.

*FYI: This feature is only available for LINE@ Approved accounts or official accounts.*

The argument is a group ID and the method returns a promise of an array of user IDs.

``` js
client.getGroupMemberIds('group_id').then((ids) => {
  ids.forEach((id) => console.log(id));
})
```


#### `getBotFollowersIds(): Promise<string[]>`

It corresponds to the [Bot Followers IDs](https://developers.line.biz/en/reference/messaging-api/#get-follower-ids) API.

*FYI: This feature is available only for verified or premium accounts.*

``` js
client.getBotFollowersIds().then((ids) => {
  ids.forEach((id) => console.log(id));
})
```

#### `leaveGroup(groupId: string): Promise<any>`

It corresponds to the [Leave group](https://developers.line.biz/en/reference/messaging-api/#leave-group) API.

The argument is a group ID.

``` js
client.leaveGroup('group_id')
```

### Room
#### `getRoomMembersCount(roomId: string): Promise<MembersCountResponse>`

It corresponds to the [Room Members Count](https://developers.line.biz/en/reference/messaging-api/#get-members-room-count) API.

The argument is a room ID.

``` js
client.getRoomMembersCount('room_id').then((count) => {
  console.log(count)
})
```

#### `getRoomMemberProfile(roomId: string, userId: string): Promise<Profile>`

It corresponds to the [Room Member Profile](https://developers.line.biz/en/reference/messaging-api/#get-room-member-profile) API.

The arguments are a room ID and an ID of a user in the room. Please refer to the
official documentation for the difference between this API and `getProfile()`.

``` js
client.getRoomMemberProfile('room_id', 'user_id').then((profile) => {
  console.log(profile);
})
```

#### `getRoomMemberIds(roomId: string): Promise<string[]>`

It corresponds to the [Room Member IDs](https://developers.line.biz/en/reference/messaging-api/#get-room-member-user-ids) API.

*FYI: This feature is only available for LINE@ Approved accounts or official accounts.*

The argument is a room ID and the method returns a promise of an array of user IDs.

``` js
client.getRoomMemberIds('room_id').then((ids) => {
  ids.forEach((id) => console.log(id));
})
```

#### `leaveRoom(roomId: string): Promise<any>`

It corresponds to the [Leave room](https://developers.line.biz/en/reference/messaging-api/#leave-room) API.

The argument is a room ID.

``` js
client.leaveGroup('room_id')
```

### Rich menu

#### `getRichMenu(richMenuId: string): Promise<RichMenuResponse>`

It corresponds to the [Get rich menu](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu) API.

The argument is a rich menu ID. The return type is [a rich menu response object](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object).

``` js
client.getRichMenu('rich_menu_id').then((richMenu) => {
  console.log(richMenu.size);
  console.log(richMenu.areas[0].bounds);
})
```

#### `createRichMenu(richMenu: RichMenu): Promise<string>`

It corresponds to the [Create rich menu](https://developers.line.biz/en/reference/messaging-api/#create-rich-menu) API.

The argument is [a rich menu object](https://developers.line.biz/en/reference/messaging-api/#rich-menu-object).
For the detail of the object format, please refer to the official documentation.
It returns the result rich menu ID.

``` js
client.createRichMenu({ size: { width: 2500, height: 1686 }, ... })
  .then((richMenuId) => console.log(richMenuId))
```

#### `deleteRichMenu(richMenuId: string): Promise<any>`

It corresponds to the [Delete rich menu](https://developers.line.biz/en/reference/messaging-api/#delete-rich-menu) API.

The argument is a rich menu ID.

``` js
client.deleteRichMenu('rich_menu_id')
```

#### `getRichMenuAliasList(): Promise<any>`

It corresponds to the [Get list of rich menu alias](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-alias-list) API.

``` js
client.getRichMenuAliasList()
```

#### `getRichMenuAlias(richMenuAliasId: string): Promise<any>`

It corresponds to the [Get rich menu alias information](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-alias-by-id) API.

The argument is a rich menu alias ID.

``` js
client.getRichMenuAlias('rich_menu_alias_id')
```

#### `createRichMenuAlias(richMenuId: string, richMenuAliasId: string): Promise<any>`

It corresponds to the [Create rich menu alias](https://developers.line.biz/en/reference/messaging-api/#create-rich-menu-alias) API.

The argument is a rich menu ID and a rich menu alias ID.

``` js
client.createRichMenuAlias('rich_menu_id', 'rich_menu_alias_id')
```

#### `deleteRichMenuAlias(richMenuAliasId: string): Promise<any>`

It corresponds to the [Delete rich menu alias](https://developers.line.biz/en/reference/messaging-api/#delete-rich-menu-alias) API.

The argument is a rich menu alias ID.

``` js
client.deleteRichMenuAlias('rich_menu_alias_id')
```

#### `updateRichMenuAlias(richMenuAliasId: string, richMenuId: string): Promise<any>`

It corresponds to the [Update rich menu alias](https://developers.line.biz/en/reference/messaging-api/#update-rich-menu-alias) API.

The argument is a rich menu alias ID and a rich menu ID.

``` js
client.updateRichMenuAlias('rich_menu_alias_id', 'rich_menu_id')
```

#### `getRichMenuIdOfUser(userId: string): Promise<string>`

It corresponds to the [Get rich menu ID of user](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-id-of-user) API.

The argument is a user ID. It returns a rich menu ID to be used with other APIs.

``` js
client.getRichMenuIdOfUser('user_id').then((richMenuId) => {
  console.log(richMenuId);
})
```

#### `linkRichMenuToUser(userId: string, richMenuId: string): Promise<any>`

It corresponds to the [Link rich menu to user](https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-user) API.

The arguments are a user ID and a rich menu ID.

``` js
client.linkRichMenuToUser('user_id', 'rich_menu_id')
```

#### `unlinkRichMenuFromUser(userId: string, richMenuId: string): Promise<any>`

It corresponds to the [Unlink rich menu from user](https://developers.line.biz/en/reference/messaging-api/#unlink-rich-menu-from-user) API.

The arguments are a user ID and a rich menu ID.

``` js
client.unlinkRichMenuFromUser('user_id', 'rich_menu_id')
```

#### `linkRichMenuToMultipleUsers(richMenuId: string, userIds: string[]): Promise<any>`

	It corresponds to the [Link rich menu to multiple users](https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-users) API.

	The arguments are a richMenuId and a array of userIds.

	``` js
	client.linkRichMenuToMultipleUsers('rich_menu_id', ['user_id'])
	```

#### `unlinkRichMenusFromMultipleUsers(userIds: string[]): Promise<any>`

	It corresponds to the [Unlink rich menus from multiple users](https://developers.line.biz/en/reference/messaging-api#unlink-rich-menu-from-users) API.

	The argument is a array of userIds.

	``` js
	client.unlinkRichMenusFromMultipleUsers(['user_id'])
	```

#### `getRichMenuImage(richMenuId: string): Promise<Readable>`

It corresponds to the [Download rich menu image](https://developers.line.biz/en/reference/messaging-api/#download-rich-menu-image) API.

The argument is a rich menu ID.

Please beware that what it returns is promise of [readable stream](https://nodejs.org/dist/latest/docs/api/stream.html#stream_readable_streams).
You can pipe the stream into a file, an HTTP response, etc.

``` js
client.getRichMenuImage('rich_menu_id')
  .then((stream) => {
    stream.on('data', (chunk) => {
      ...
    })
    stream.on('error', (err) => {
      ...
    })
    stream.pipe(...)
  })
```

#### `setRichMenuImage(richMenuId: string, data: Buffer | Readable, contentType?: string): Promise<any>`

It corresponds to the [Upload rich menu image](https://developers.line.biz/en/reference/messaging-api/#upload-rich-menu-image) API.

The 1st argument is a rich menu ID. For 2nd argument, a buffer or a readable
stream of an image should be provided. For the restriction of the image, please
refer to the official documentation. The last argument is optional. If it's not
provided, the mime type will be guessted from `data`. Only `image/jpeg` or
`image/png` is allowed for the content type.

``` js
client.setRichMenuImage('rich_menu_id', fs.createReadStream('./some_image.png'))
```

#### `getRichMenuList(): Promise<Array<RichMenuResponse>>`

It corresponds to the [Get rich menu list](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-list) API.

The return type is a list of [rich menu response objects](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object).

### `setDefaultRichMenu(richMenuId: string): Promise<{}>`

It corresponds to the [Set default rich menu](https://developers.line.biz/en/reference/messaging-api/#set-default-rich-menu) API.

### `getDefaultRichMenuId(): Promise<string>`

It corresponds to the [Get default rich menu ID](https://developers.line.biz/en/reference/messaging-api/#get-default-rich-menu-id) API.

### `deleteDefaultRichMenu(): Promise<{}>`

It corresponds to the [Cancel default rich menu](https://developers.line.biz/en/reference/messaging-api/#cancel-default-rich-menu) API.

### Account link

#### `getLinkToken(userId: string): Promise<string>`

Send an HTTP POST request to the `/bot/user/{userId}/linkToken` endpoint,
and [issue a link token](https://developers.line.biz/en/reference/messaging-api/#issue-link-token) for the user you are attempting to link.

If the request succeeds, a link token will be returned.
Link tokens are valid for 10 minutes and can only be used once.

### Get number of messages sent

#### `getNumberOfSentReplyMessages(date: string): Promise<NumberOfMessagesSentResponse>`

Gets the number of messages sent with the `/bot/message/reply` endpoint.

The number of messages retrieved by this operation does not include
the number of messages sent from LINE@ Manager.

``` js
client.getNumberOfSentReplyMessages('20191231').then((response) => {
  console.log(response);
})
```

#### `getNumberOfSentPushMessages(date: string): Promise<NumberOfMessagesSentResponse>`

Gets the number of messages sent with the `/bot/message/push` endpoint.

The number of messages retrieved by this operation does not include
the number of messages sent from LINE@ Manager.

``` js
client.getNumberOfSentPushMessages('20191231').then((response) => {
  console.log(response);
})
```

#### `getNumberOfSentMulticastMessages(date: string): Promise<NumberOfMessagesSentResponse>`

Gets the number of messages sent with the `/bot/message/multicast` endpoint.

The number of messages retrieved by this operation does not include
the number of messages sent from LINE@ Manager.

``` js
client.getNumberOfSentMulticastMessages('20191231').then((response) => {
  console.log(response);
})
```

#### `getTargetLimitForAdditionalMessages(): Promise<TargetLimitForAdditionalMessages>`

Gets the target limit for additional messages in the current month.

The number of messages retrieved by this operation includes the number of messages sent from LINE Official Account Manager.

Set a target limit with LINE Official Account Manager. For the procedures, refer to the LINE Official Account Manager manual.

Note: LINE@ accounts cannot call this API endpoint.

``` js
client.getTargetLimitForAdditionalMessages().then((response) => {
  console.log(response);
})
```

#### `getNumberOfMessagesSentThisMonth(): Promise<NumberOfMessagesSentThisMonth>`

Gets the number of messages sent in the current month.

The number of messages retrieved by this operation includes the number of messages sent from LINE Official Account Manager.

The number of messages retrieved by this operation is approximate. To get the correct number of sent messages, use LINE Official Account Manager or execute API operations for getting the number of sent messages.

Note: LINE@ accounts cannot call this API endpoint.

``` js
client.getNumberOfMessagesSentThisMonth().then((response) => {
  console.log(response);
})
```

#### `getNumberOfSentBroadcastMessages(date: string): Promise<NumberOfMessagesSentResponse>`

Gets the number of messages sent with the `/bot/message/broadcast` endpoint.

The number of messages retrieved by this operation does not include the number of messages sent from LINE Official Account Manager.

Note: LINE@ accounts cannot call this API endpoint. Please migrate it to a LINE official account. For more information, see [Migration of LINE@ accounts](https://developers.line.biz/en/docs/messaging-api/migrating-line-at/).

``` js
client.getNumberOfSentBroadcastMessages('20191231').then((response) => {
  console.log(response);
})
```

### Insight

#### `getNumberOfMessageDeliveries(date: string): Promise<NumberOfMessageDeliveriesResponse>`

It corresponds to the [Get number of message deliveries](https://developers.line.biz/en/reference/messaging-api/#get-number-of-delivery-messages) API.

#### `getNumberOfFollowers(date: string): Promise<NumberOfFollowersResponse>`

It corresponds to the [Get number of followers](https://developers.line.biz/en/reference/messaging-api/#get-number-of-followers) API.


#### `getFriendDemographics(): Promise<Types.FriendDemographics>`

It corresponds to the [Get friend demographics](https://developers.line.biz/en/reference/messaging-api/#get-demographic) API.

#### `getUserInteractionStatistics(): Promise<Types.UserInteractionStatistics>`

It corresponds to the [Get user interaction statistics](https://developers.line.biz/en/reference/messaging-api/#get-message-event) API.

#### `getStatisticsPerUnit(): Promise<Types.StatisticsPerUnit>`

It corresponds to the [Get statistics per unit](https://developers.line.biz/en/reference/messaging-api/#get-statistics-per-unit) API.

### Bot

#### `getBotInfo(): Promise<BotInfoResponse>`

It corresponds to the [Get bot info](https://developers.line.biz/en/reference/messaging-api/#get-bot-info) API.

### Webhook

#### `setWebhookEndpointUrl(endpoint: string): Promise<{}}>`

It corresponds to the [Set webhook endpoint URL](https://developers.line.biz/en/reference/messaging-api/#set-webhook-endpoint-url) API.


#### `getWebhookEndpointInfo(): Promise<Types.WebhookEndpointInfoResponse>`

It corresponds to the [Get webhook endpoint information](https://developers.line.biz/en/reference/messaging-api/#get-webhook-endpoint-information) API.

#### `testWebhookEndpoint(endpoint?: string): Promise<Types.TestWebhookEndpointResponse>`

It corresponds to the [Test webhook endpoint](https://developers.line.biz/en/reference/messaging-api/#test-webhook-endpoint) API.
