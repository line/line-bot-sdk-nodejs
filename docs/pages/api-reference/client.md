# `new Client(config)`

`Client` is a class representing an API client. It provides methods
corresponding to [messaging APIs](https://developers.line.me/en/docs/messaging-api/reference/).

#### Type signature

``` typescript
class Client {
  public config: ClientConfig

  constructor(config: ClientConfig)

  pushMessage(to: string, messages: Message | Message[]): Promise<{}>
  replyMessage(replyToken: string, messages: Message | Message[]): Promise<{}>
  multicast(to: string[], messages: Message | Message[]): Promise<{}>
  getProfile(userId: string): Promise<Profile>
  getGroupMemberProfile(groupId: string, userId: string): Promise<Profile>
  getRoomMemberProfile(roomId: string, userId: string): Promise<Profile>
  getGroupMemberIds(groupId: string): Promise<string[]>
  getRoomMemberIds(roomId: string): Promise<string[]>
  getMessageContent(messageId: string): Promise<ReadableStream>
  leaveGroup(groupId: string): Promise<{}>
  leaveRoom(roomId: string): Promise<{}>
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

### `pushMessage(to: string, messages: Message | Message[]): Promise<{}>`

It corresponds to the [Push message](https://developers.line.me/en/docs/messaging-api/reference/#send-push-message) API.

The first argument is an ID of a receiver, and the second is messages to be sent.

``` js
client.pushMessage('user_or_group_or_room_id', {
  type: 'text',
  text: 'hello, world',
})
```

### `replyMessage(replyToken: string, messages: Message | Message[]): Promise<{}>`

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

### `multicast(to: string[], messages: Message | Message[]): Promise<{}>`

It corresponds to the [Multicast](https://developers.line.me/en/docs/messaging-api/reference/#send-multicast-messages) API.

The first argument is a list of receiver IDs, and the second is messages to be
sent.

``` js
client.multicast(['user_id_1', 'user_id_2', 'room_id_1'], {
  type: 'text',
  text: 'hello, world',
})
```

### `getProfile(userId: string): Promise<Profile>`

It corresponds to the [Profile](https://developers.line.me/en/docs/messaging-api/reference/#get-profile) API.

The argument is a user ID.

``` js
client.getProfile('user_id').then((profile) => {
  console.log(profile);
});
```

### `getGroupMemberProfile(groupId: string, userId: string): Promise<Profile>`

It corresponds to the [Group Member Profile](https://developers.line.me/en/docs/messaging-api/reference/#get-group-member-profile) API.

The arguments are a group ID and an ID of a user in the group. Please refer to
the official documentation for the difference between this API and `getProfile()`.

``` js
client.getGroupMemberProfile('group_id', 'user_id').then((profile) => {
  console.log(profile);
})
```

### `getRoomMemberProfile(roomId: string, userId: string): Promise<Profile>`

It corresponds to the [Room Member Profile](https://developers.line.me/en/docs/messaging-api/reference/#get-room-member-profile) API.

The arguments are a room ID and an ID of a user in the room. Please refer to the
official documentation for the difference between this API and `getProfile()`.

``` js
client.getRoomMemberProfile('room_id', 'user_id').then((profile) => {
  console.log(profile);
})
```

### `getGroupMemberIds(groupId: string): Promise<string[]>`

It corresponds to the [Group Member IDs](https://developers.line.me/en/docs/messaging-api/reference/#get-group-member-user-ids) API.

*FYI: This feature is only available for LINE@ Approved accounts or official accounts.*

The argument is a group ID and the method returns a promise of an array of user IDs.

``` js
client.getGroupMemberIds('group_id').then((ids) => {
  ids.forEach((id) => console.log(id));
})
```

### `getRoomMemberIds(roomId: string): Promise<string[]>`

It corresponds to the [Room Member IDs](https://developers.line.me/en/docs/messaging-api/reference/#get-room-member-user-ids) API.

*FYI: This feature is only available for LINE@ Approved accounts or official accounts.*

The argument is a room ID and the method returns a promise of an array of user IDs.

``` js
client.getRoomMemberIds('room_id').then((ids) => {
  ids.forEach((id) => console.log(id));
})
```

### `getMessageContent(messageId: string): Promise<ReadableStream>`

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

### `leaveGroup(groupId: string): Promise<{}>`

It corresponds to the [Leave group](https://developers.line.me/en/docs/messaging-api/reference/#leave-group) API.

The argument is a group ID.

``` js
client.leaveGroup('group_id')
```

### `leaveRoom(roomId: string): Promise<{}>`

It corresponds to the [Leave room](https://developers.line.me/en/docs/messaging-api/reference/#leave-room) API.

The argument is a room ID.

``` js
client.leaveGroup('room_id')
```
