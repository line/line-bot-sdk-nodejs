# `new Client(config)`

`Client` is a class representing an API client. It provides methods
corresponding to [messaging APIs](https://devdocs.line.me/en/#messaging-api).

#### Type signature

``` typescript
class Client {
  public config: ClientConfig

  constructor(config: ClientConfig)

  pushMessage(to: string, messages: Message | Message[]): Promise<{}>
  replyMessage(replyToken: string, messages: Message | Message[]): Promise<{}>
  multicast(to: string[], messages: Message | Message[]): Promise<{}>
  getProfile(userId: string): Promise<Profile>
  getMessageContent(messageId: string): Promise<ReadableStream>
  leaveGroup(groupId: string): Promise<{}>
  leaveRoom(roomId: string): Promise<{}>
}
```

`Message` is a valid message object. About message object structure, please
refer to [Send message object](https://devdocs.line.me/en/#send-message-object)
of the official document.

`ClientConfig` type is like below, except that it also allows fields
from [MiddlewareConfig](./middleware.md) too.

``` typescript
type ClientConfig = {
  channelAccessToken: string,
}
```

## Methods

For a parameter `messages: messages: Message | Message[]`, you can provide a
message object or an array of message objects. Both will work, but please beware
that there can be a limit on the number of the messages to be sent
simultaneously. About the API detail, please refer to [the official document](https://devdocs.line.me/en/#messaging-api).

For functions returning `Promise`, there will be errors thrown if something
goes wrong, such as HTTP errors or parsing errors. You can catch them with the
`.catch()` method of the promises. The detailed error handling is explained
in [the Client guide](../guide/client.md).

### `pushMessage(to: string, messages: Message | Message[]): Promise<{}>`

It corresponds to the [Push message](https://devdocs.line.me/en/#push-message) API.

The first argument is an ID of a receiver, and the second is messages to be sent.

``` js
client.pushMessage('user_or_group_or_room_id', {
  type: 'text',
  text: 'hello, world',
})
```

### `replyMessage(replyToken: string, messages: Message | Message[]): Promise<{}>`

It corresponds to the [Reply message](https://devdocs.line.me/en/#reply-message) API.

The first argument is a reply token, which is retrieved from a webhook event
object. For the list of replyable events, please refer to [Webhook event object](https://devdocs.line.me/en/#webhook-event-object)
of the official document. The second argument is the same with one in `pushMessage()`.

``` js
client.replyMessage(event.replyToken, {
  type: 'text',
  text: 'hello, world',
})
```

### `multicast(to: string[], messages: Message | Message[]): Promise<{}>`

It corresponds to the [Multicast](https://devdocs.line.me/en/#multicast) API.

The first argument is a list of receiver IDs, and the second is messages to be
sent.

``` js
client.multicast(['user_id_1', 'user_id_2', 'room_id_1'], {
  type: 'text',
  text: 'hello, world',
})
```

### `getProfile(userId: string): Promise<Profile>`

It corresponds to the [Profile](https://devdocs.line.me/en/#bot-api-get-profile) API.

The argument is a user ID.

``` js
client.getProfile('user_id').then((profile) => {
  console.log(profile);
});
```

### `getMessageContent(messageId: string): Promise<ReadableStream>`

It corresponds to the [Content](https://devdocs.line.me/en/#content) API.

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

It corresponds to the [Leave group](https://devdocs.line.me/en/#leave) API.

The argument is a group ID.

``` js
client.leaveGroup('group_id')
```

### `leaveRoom(roomId: string): Promise<{}>`

It corresponds to the [Leave room](https://devdocs.line.me/en/#leave) API.

The argument is a room ID.

``` js
client.leaveGroup('room_id')
```
