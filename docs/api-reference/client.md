# `new Client(config)`

`Client` is a class representing an API client. It provides methods
corresponding to [messaging APIs](https://developers.line.me/en/docs/messaging-api/reference/).

#### Type signature

``` typescript
class Client {
  public config: ClientConfig

  constructor(config: ClientConfig) {}

  // Message
  pushMessage(to: string, messages: Message | Message[]): Promise<any>
  replyMessage(replyToken: string, messages: Message | Message[]): Promise<any>
  multicast(to: string[], messages: Message | Message[]): Promise<any>
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
  getRichMenuImage(richMenuId: string): Promise<Readable>
  setRichMenuImage(richMenuId: string, data: Buffer | Readable, contentType?: string): Promise<any>
  getRichMenuList(): Promise<Array<RichMenuResponse>>
  setDefaultRichMenu(richMenuId: string): Promise<{}>
  getDefaultRichMenuId(): Promise<string>
  deleteDefaultRichMenu(): Promise<{}>
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

#### `pushMessage(to: string, messages: Message | Message[]): Promise<any>`

It corresponds to the [Push message](https://developers.line.me/en/docs/messaging-api/reference/#send-push-message) API.

The first argument is an ID of a receiver, and the second is messages to be sent.

``` js
client.pushMessage('user_or_group_or_room_id', {
  type: 'text',
  text: 'hello, world',
})
```

#### `replyMessage(replyToken: string, messages: Message | Message[]): Promise<any>`

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

#### `multicast(to: string[], messages: Message | Message[]): Promise<any>`

It corresponds to the [Multicast](https://developers.line.me/en/docs/messaging-api/reference/#send-multicast-messages) API.

The first argument is a list of receiver IDs, and the second is messages to be
sent.

``` js
client.multicast(['user_id_1', 'user_id_2', 'room_id_1'], {
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
