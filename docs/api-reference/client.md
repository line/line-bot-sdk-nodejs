# `new Client(config)`

`Client` is a class representing an API client. It provides methods
corresponding to [messaging APIs](https://developers.line.me/en/docs/messaging-api/reference/).

#### Type signature

``` typescript
class Client {
  public config: ClientConfig

  constructor(config: ClientConfig) {}

  // Message
  pushMessage(to: string, messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>
  replyMessage(replyToken: string, messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>
  multicast(to: string[], messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>
  broadcast(messages: Message | Message[], notificationDisabled: boolean = false): Promise<any>
  getMessageContent(messageId: string): Promise<Readable>

  // Profile
  getProfile(userId: string): Promise<Profile>

  // Group
  getGroupMemberProfile(groupId: string, userId: string): Promise<Profile>
  getGroupMemberIds(groupId: string): Promise<string[]>
  leaveGroup(groupId: string): Promise<any>

  // Room
  getRoomMemberProfile(roomId: string, userId: string): Promise<Profile>
  getRoomMemberIds(roomId: string): Promise<string[]>
  leaveRoom(roomId: string): Promise<any>

  // Rich menu
  getRichMenu(richMenuId: string): Promise<RichMenuResponse>
  createRichMenu(richMenu: RichMenu): Promise<string>
  deleteRichMenu(richMenuId: string): Promise<any>
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

  // Insight
  getNumberOfMessageDeliveries(date: string): Promise<Types.NumberOfMessageDeliveriesResponse>
  getNumberOfFollowers(date: string): Promise<Types.NumberOfFollowersResponse>
  getFriendDemographics(): Promise<Types.FriendDemographics>
  getUserInteractionStatistics(requestId: string): Promise<Types.UserInteractionStatistics>
}
```

`Message` is a valid message object. About message object structure, please
refer to [Message and event objects](./message-and-event-objects.md) on this guide, or
[Send message object](https://developers.line.me/en/docs/messaging-api/reference/#message-objects)
on the official documentation.

`ClientConfig` type is like below.

``` typescript
interface ClientConfig {
  channelAccessToken: string;
  channelSecret?: string;
}
```

## Methods

For a parameter `messages: messages: Message | Message[]`, you can provide a
message object or an array of message objects. Both will work, but please beware
that there can be a limit on the number of the messages to be sent
simultaneously. About the API detail, please refer to [the official documentation](https://developers.line.me/en/docs/messaging-api/reference/#message-objects).

For functions returning `Promise`, there will be errors thrown if something
goes wrong, such as HTTP errors or parsing errors. You can catch them with the
`.catch()` method of the promises. The detailed error handling is explained
in [the Client guide](../guide/client.md).

### Message

#### `pushMessage(to: string, messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>`

It corresponds to the [Push message](https://developers.line.me/en/docs/messaging-api/reference/#send-push-message) API.

The first argument is an ID of a receiver, and the second is messages to be sent.

``` js
client.pushMessage('user_or_group_or_room_id', {
  type: 'text',
  text: 'hello, world',
})
```

#### `replyMessage(replyToken: string, messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>`

It corresponds to the [Reply message](https://developers.line.me/en/docs/messaging-api/reference/#send-reply-message) API.

The first argument is a reply token, which is retrieved from a webhook event
object. For the list of replyable events, please refer to [Webhook event object](https://developers.line.me/en/docs/messaging-api/reference/#webhook-event-objects)
of the official documentation. The second argument is the same with one in `pushMessage()`.

``` js
client.replyMessage(event.replyToken, {
  type: 'text',
  text: 'hello, world',
})
```

#### `multicast(to: string[], messages: Message | Message[], notificationDisabled: boolean = false): Promise<MessageAPIResponseBase>`

It corresponds to the [Multicast](https://developers.line.me/en/docs/messaging-api/reference/#send-multicast-messages) API.

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

It corresponds to the [Content](https://developers.line.me/en/docs/messaging-api/reference/#get-content) API.

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

### Profile

#### `getProfile(userId: string): Promise<Profile>`

It corresponds to the [Profile](https://developers.line.me/en/docs/messaging-api/reference/#get-profile) API.

The argument is a user ID.

``` js
client.getProfile('user_id').then((profile) => {
  console.log(profile);
});
```

### Group

#### `getGroupMemberProfile(groupId: string, userId: string): Promise<Profile>`

It corresponds to the [Group Member Profile](https://developers.line.me/en/docs/messaging-api/reference/#get-group-member-profile) API.

The arguments are a group ID and an ID of a user in the group. Please refer to
the official documentation for the difference between this API and `getProfile()`.

``` js
client.getGroupMemberProfile('group_id', 'user_id').then((profile) => {
  console.log(profile);
})
```

#### `getGroupMemberIds(groupId: string): Promise<string[]>`

It corresponds to the [Group Member IDs](https://developers.line.me/en/docs/messaging-api/reference/#get-group-member-user-ids) API.

*FYI: This feature is only available for LINE@ Approved accounts or official accounts.*

The argument is a group ID and the method returns a promise of an array of user IDs.

``` js
client.getGroupMemberIds('group_id').then((ids) => {
  ids.forEach((id) => console.log(id));
})
```

#### `leaveGroup(groupId: string): Promise<any>`

It corresponds to the [Leave group](https://developers.line.me/en/docs/messaging-api/reference/#leave-group) API.

The argument is a group ID.

``` js
client.leaveGroup('group_id')
```

### Room

#### `getRoomMemberProfile(roomId: string, userId: string): Promise<Profile>`

It corresponds to the [Room Member Profile](https://developers.line.me/en/docs/messaging-api/reference/#get-room-member-profile) API.

The arguments are a room ID and an ID of a user in the room. Please refer to the
official documentation for the difference between this API and `getProfile()`.

``` js
client.getRoomMemberProfile('room_id', 'user_id').then((profile) => {
  console.log(profile);
})
```

#### `getRoomMemberIds(roomId: string): Promise<string[]>`

It corresponds to the [Room Member IDs](https://developers.line.me/en/docs/messaging-api/reference/#get-room-member-user-ids) API.

*FYI: This feature is only available for LINE@ Approved accounts or official accounts.*

The argument is a room ID and the method returns a promise of an array of user IDs.

``` js
client.getRoomMemberIds('room_id').then((ids) => {
  ids.forEach((id) => console.log(id));
})
```

#### `leaveRoom(roomId: string): Promise<any>`

It corresponds to the [Leave room](https://developers.line.me/en/docs/messaging-api/reference/#leave-room) API.

The argument is a room ID.

``` js
client.leaveGroup('room_id')
```

### Rich menu

#### `getRichMenu(richMenuId: string): Promise<RichMenuResponse>`

It corresponds to the [Get rich menu](https://developers.line.me/en/docs/messaging-api/reference/#get-rich-menu) API.

The argument is a rich menu ID. The return type is [a rich menu response object](https://developers.line.me/en/docs/messaging-api/reference/#rich-menu-response-object).

``` js
client.getRichMenu('rich_menu_id').then((richMenu) => {
  console.log(richMenu.size);
  console.log(richMenu.areas[0].bounds);
})
```

#### `createRichMenu(richMenu: RichMenu): Promise<string>`

It corresponds to the [Create rich menu](https://developers.line.me/en/docs/messaging-api/reference/#create-rich-menu) API.

The argument is [a rich menu object](https://developers.line.me/en/docs/messaging-api/reference/#rich-menu-object).
For the detail of the object format, please refer to the official documentation.
It returns the result rich menu ID.

``` js
client.createRichMenu({ size: { width: 2500, height: 1686 }, ... })
  .then((richMenuId) => console.log(richMenuId))
```

#### `deleteRichMenu(richMenuId: string): Promise<any>`

It corresponds to the [Delete rich menu](https://developers.line.me/en/docs/messaging-api/reference/#delete-rich-menu) API.

The argument is a rich menu ID.

``` js
client.deleteRichMenu('rich_menu_id')
```

#### `getRichMenuIdOfUser(userId: string): Promise<string>`

It corresponds to the [Get rich menu ID of user](https://developers.line.me/en/docs/messaging-api/reference/#get-rich-menu-id-of-user) API.

The argument is a user ID. It returns a rich menu ID to be used with other APIs.

``` js
client.getRichMenuIdOfUser('user_id').then((richMenuId) => {
  console.log(richMenuId);
})
```

#### `linkRichMenuToUser(userId: string, richMenuId: string): Promise<any>`

It corresponds to the [Link rich menu to user](https://developers.line.me/en/docs/messaging-api/reference/#link-rich-menu-to-user) API.

The arguments are a user ID and a rich menu ID.

``` js
client.linkRichMenuToUser('user_id', 'rich_menu_id')
```

#### `unlinkRichMenuFromUser(userId: string, richMenuId: string): Promise<any>`

It corresponds to the [Unlink rich menu from user](https://developers.line.me/en/docs/messaging-api/reference/#unlink-rich-menu-from-user) API.

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

It corresponds to the [Download rich menu image](https://developers.line.me/en/docs/messaging-api/reference/#download-rich-menu-image) API.

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

It corresponds to the [Upload rich menu image](https://developers.line.me/en/docs/messaging-api/reference/#upload-rich-menu-image) API.

The 1st argument is a rich menu ID. For 2nd argument, a buffer or a readable
stream of an image should be provided. For the restriction of the image, please
refer to the official documentation. The last argument is optional. If it's not
provided, the mime type will be guessted from `data`. Only `image/jpeg` or
`image/png` is allowed for the content type.

``` js
client.setRichMenuImage('rich_menu_id', fs.createReadStream('./some_image.png'))
```

#### `getRichMenuList(): Promise<Array<RichMenuResponse>>`

It corresponds to the [Get rich menu list](https://developers.line.me/en/docs/messaging-api/reference/#get-rich-menu-list) API.

The return type is a list of [rich menu response objects](https://developers.line.me/en/docs/messaging-api/reference/#rich-menu-response-object).

### `setDefaultRichMenu(richMenuId: string): Promise<{}>`

It corresponds to the [Set default rich menu](https://developers.line.me/en/reference/messaging-api/#set-default-rich-menu) API.

### `getDefaultRichMenuId(): Promise<string>`

It corresponds to the [Get default rich menu ID](https://developers.line.me/en/reference/messaging-api/#get-default-rich-menu-id) API.

### `deleteDefaultRichMenu(): Promise<{}>`

It corresponds to the [Cancel default rich menu](https://developers.line.me/en/reference/messaging-api/#cancel-default-rich-menu) API.

### Account link

#### `getLinkToken(userId: string): Promise<string>`

Send an HTTP POST request to the `/bot/user/{userId}/linkToken` endpoint,
and [issue a link token](https://developers.line.me/en/reference/messaging-api/#issue-link-token) for the user you are attempting to link.

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
