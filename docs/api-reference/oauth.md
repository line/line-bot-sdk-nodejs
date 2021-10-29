# `new OAuth()`

`OAuth` is a class representing OAuth APIs. It provides methods
corresponding to [messaging APIs](https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token).

#### Type signature

``` typescript
class OAuth {
  constructor() {}

  issueAccessToken(client_id: string, client_secret: string): Promise<Types.ChannelAccessToken>
  revokeAccessToken(access_token: string): Promise<{}>
  verifyAccessToken(access_token: string): Promise<Types.VerifyAccessToken>
  issueChannelAccessTokenV2_1(
    client_assertion: string,
  ): Promise<Types.ChannelAccessToken>
  getChannelAccessTokenKeyIdsV2_1(
    client_assertion: string,
  ): Promise<{ key_ids: string[] }>
  revokeChannelAccessTokenV2_1(
    client_id: string,
    client_secret: string,
    access_token: string,
  ): Promise<{}>
  verifyIdToken(
    id_token: string,
    client_id: string,
    nonce: string = undefined,
    user_id: string = undefined,
  ): Promise<Types.VerifyIDToken>
}
```

## Create a OAuth

The `OAuth` class is provided by the main module.

``` js
// CommonJS
const { OAuth } = require('@line/bot-sdk');

// ES6 modules or TypeScript
import { OAuth } from '@line/bot-sdk';
```

To create a client instance:

```js
const oauth = new OAuth();
```

And now you can call client functions as usual:

``` js
const { access_token } = await oauth.issueAccessToken("client_id", "client_secret");
```

## Methods

For functions returning `Promise`, there will be errors thrown if something
goes wrong, such as HTTP errors or parsing errors. You can catch them with the
`.catch()` method of the promises. The detailed error handling is explained
in [the Client guide](../guide/client.md).

### OAuth

#### `issueAccessToken(client_id: string, client_secret: string): Promise<Types.ChannelAccessToken>`

It corresponds to the [Issue channel access token](https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token) API.

``` js
const { access_token, expires_in, token_type } = await oauth.issueAccessToken("client_id", "client_secret");
```


#### `verifyAccessToken(access_token: string): Promise<Types.VerifyAccessToken>`

It corresponds to the [Verify access token validity](https://developers.line.biz/en/reference/line-login/#verify-access-token) API.


``` js
await oauth.verifyAccessToken("access_token");
```

#### `revokeAccessToken(access_token: string): Promise<{}>`

It corresponds to the [Revoke channel access token](https://developers.line.biz/en/reference/line-login/#revoke-access-token) API.


``` js
await oauth.revokeAccessToken("access_token");
```

#### issueChannelAccessTokenV2_1(client_assertion: string): Promise<Types.ChannelAccessToken>

It corresponds to the [Issue channel access token v2.1](https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token-v2-1) API.

#### getChannelAccessTokenKeyIdsV2_1(client_assertion: string): Promise<{ key_ids: string[] }>

It corresponds to the [Get all valid channel access token key IDs v2.1](https://developers.line.biz/en/reference/messaging-api/#get-all-issued-channel-access-token-key-ids-v2-1) API.

#### revokeChannelAccessTokenV2_1(client_id: string, client_secret: string, access_token: string): Promise<{}>

It corresponds to the [Revoke channel access token v2.1](https://developers.line.biz/en/reference/messaging-api/#revoke-channel-access-token-v2-1) API.

#### verifyIdToken(id_token: string, client_id: string, nonce: string = undefined, user_id: string = undefined): Promise<{}>

It corresponds to the [Verify ID token v2.1](https://developers.line.biz/en/reference/line-login/#verify-id-token) API.