# Migration Guide: Client → LineBotClient

The legacy `Client` class is deprecated. Use [`LineBotClient`](../apidocs/classes/LineBotClient.md) instead.
The legacy `OAuth` class is deprecated. Use [`channelAccessToken.ChannelAccessTokenClient`](../apidocs/@line/namespaces/channelAccessToken/classes/ChannelAccessTokenClient.md) instead.

[`LineBotClient`](../apidocs/classes/LineBotClient.md) wraps the Messaging, Insight, LIFF, Audience, Shop, and Module API
categories. Channel Access Token (OAuth) operations are handled by the separate
[`channelAccessToken.ChannelAccessTokenClient`](../apidocs/@line/namespaces/channelAccessToken/classes/ChannelAccessTokenClient.md).

---

## Migration procedure

### Step 1: Upgrade to v10.8.0

Update `@line/bot-sdk` to v10.8.0

```sh
npm install --ignore-scripts @line/bot-sdk@10.8.0 # just in case
```

Both the legacy `Client`/`OAuth` API and the new [`LineBotClient`](../apidocs/classes/LineBotClient.md) API coexist in
v10, so you can migrate incrementally without breaking existing code.

### Step 2: Replace client construction

```js
// Before
const { Client, OAuth } = require('@line/bot-sdk');
const client = new Client({ channelAccessToken: '...' });
const oauth  = new OAuth();

// After
const { LineBotClient, channelAccessToken } = require('@line/bot-sdk');
const client = LineBotClient.fromChannelAccessToken({ channelAccessToken: '...' });
const oauthClient = new channelAccessToken.ChannelAccessTokenClient({});
```

The `channelAccessToken` option is the same. Additional options available on
[`LineBotClientChannelAccessTokenConfig`](../apidocs/interfaces/LineBotClientChannelAccessTokenConfig.md):

| Option | Default | Description |
|---|---|---|
| `channelAccessToken` | required | Bearer token sent as `Authorization` header |
| `defaultHeaders` | `{}` | Extra headers merged into every request |
| `apiBaseURL` | `https://api.line.me` | Override for `api.line.me` endpoints |
| `dataApiBaseURL` | `https://api-data.line.me` | Override for `api-data.line.me` endpoints |
| `managerBaseURL` | `https://manager.line.biz` | Override for `manager.line.biz` endpoints |

> **`httpConfig` is not available in [`LineBotClient`](../apidocs/classes/LineBotClient.md).**
> The legacy `ClientConfig` accepted `httpConfig?: Partial<AxiosRequestConfig>` to
> customise timeout, proxy, and other axios-specific settings. [`LineBotClient`](../apidocs/classes/LineBotClient.md) uses
> the runtime's native `fetch()` internally, so there is no direct equivalent.
> `defaultHeaders` and the base-URL overrides above are still supported. If you
> relied on other axios options (e.g. `timeout`, `proxy`), you will need to
> configure them at the environment or runtime level (e.g. `node --experimental-fetch`,
> a custom `fetch` wrapper, or environment-level proxy settings).

### Step 3: Update method calls

See the [method mapping tables](#method-mapping-client--linebotclient) below.
Most method signatures change: positional arguments are now collected into a single
request object, e.g.:

```js
// Before
await client.pushMessage(to, messages, notificationDisabled);

// After
await client.pushMessage({ to, messages, notificationDisabled });
```

### Step 4: Update error handling

[`LineBotClient`](../apidocs/classes/LineBotClient.md) uses the Fetch API internally and throws [`HTTPFetchError`](../apidocs/classes/HTTPFetchError.md) on
non-2xx responses. The legacy `Client` used axios and threw `HTTPError`.
See the [error handling section](#error-handling) below.

### Step 5: Update TypeScript types

Types in `lib/types.ts` are deprecated. Replace them with the generated types
exported from the sub-namespaces. See the [type mapping table](#type-mapping) below.

### Step 6: Upgrade to v11

Once all usages of the legacy API have been removed, upgrade to v11 which drops
the deprecated `Client`, `OAuth`, and related types entirely:

```sh
npm install @line/bot-sdk@11
```

---

## Error handling

The legacy `Client` uses axios internally and throws `HTTPError` (which wraps the axios error).
[`LineBotClient`](../apidocs/classes/LineBotClient.md) uses the runtime's native `fetch()` and throws [`HTTPFetchError`](../apidocs/classes/HTTPFetchError.md) instead.
The version of the package does not affect this — the difference is purely which client you use.

```ts
// Before (legacy Client — axios-based)
import { HTTPError } from '@line/bot-sdk';

try {
  await client.pushMessage(to, messages);
} catch (err) {
  if (err instanceof HTTPError) {
    console.error(err.originalError.response.status);
    console.error(err.originalError.response.headers.get('x-line-request-id'));
    console.error(err.originalError.response.data); // parsed JSON
  }
}

// After (LineBotClient — fetch-based)
import { HTTPFetchError } from '@line/bot-sdk';

try {
  await client.pushMessage({ to, messages });
} catch (err) {
  if (err instanceof HTTPFetchError) {
    console.error(err.status);
    console.error(err.headers.get('x-line-request-id'));
    console.error(err.body); // raw string — JSON.parse() if needed
  }
}
```

| `HTTPError` (v8) | [`HTTPFetchError`](../apidocs/classes/HTTPFetchError.md) (v9+) | Notes |
|---|---|---|
| `originalError.response.status` | `status` | |
| `originalError.response.headers` | `headers` | Now a Fetch `Headers` object |
| `originalError.response.data` | `body` | Was parsed JSON; now a raw string |
| `originalError` | deleted | |

[`SignatureValidationFailed`](../apidocs/classes/SignatureValidationFailed.md) is unchanged. In the normal [`LineBotClient`](../apidocs/classes/LineBotClient.md) fetch path, invalid JSON surfaces as a native `SyntaxError` rather than [`JSONParseError`](../apidocs/classes/JSONParseError.md). [`JSONParseError`](../apidocs/classes/JSONParseError.md) is only thrown in legacy/helper paths that use `ensureJSON()`.

---

## Method mapping: Client → LineBotClient

### Messaging

| Client method | LineBotClient method | Notes |
|---|---|---|
| `pushMessage(to, messages, notificationDisabled?, customAggregationUnits?)` | [`pushMessage({ to, messages, notificationDisabled, customAggregationUnits }, xLineRetryKey?)`](../apidocs/classes/LineBotClient.md#pushmessage) | Arguments wrapped in a request object. Retry key moved to 2nd param. |
| `replyMessage(replyToken, messages, notificationDisabled?)` | [`replyMessage({ replyToken, messages, notificationDisabled })`](../apidocs/classes/LineBotClient.md#replymessage) | Arguments wrapped in a request object. |
| `multicast(to, messages, notificationDisabled?, customAggregationUnits?)` | [`multicast({ to, messages, notificationDisabled, customAggregationUnits }, xLineRetryKey?)`](../apidocs/classes/LineBotClient.md#multicast) | Arguments wrapped in a request object. Retry key moved to 2nd param. |
| `narrowcast(messages, recipient?, filter?, limit?, notificationDisabled?)` | [`narrowcast({ messages, recipient, filter, limit, notificationDisabled }, xLineRetryKey?)`](../apidocs/classes/LineBotClient.md#narrowcast) | Arguments wrapped in a request object. Retry key moved to 2nd param. |
| `broadcast(messages, notificationDisabled?)` | [`broadcast({ messages, notificationDisabled }, xLineRetryKey?)`](../apidocs/classes/LineBotClient.md#broadcast) | Arguments wrapped in a request object. Retry key moved to 2nd param. |
| `setRequestOptionOnce({ retryKey })` | deleted | Pass `xLineRetryKey` as the 2nd argument to `pushMessage` / `multicast` / `narrowcast` / `broadcast` directly. |

### Message validation

| Client method | LineBotClient method | Notes |
|---|---|---|
| `validatePushMessageObjects(messages)` | [`validatePush({ messages })`](../apidocs/classes/LineBotClient.md#validatepush) | Renamed. |
| `validateReplyMessageObjects(messages)` | [`validateReply({ messages })`](../apidocs/classes/LineBotClient.md#validatereply) | Renamed. |
| `validateMulticastMessageObjects(messages)` | [`validateMulticast({ messages })`](../apidocs/classes/LineBotClient.md#validatemulticast) | Renamed. |
| `validateNarrowcastMessageObjects(messages)` | [`validateNarrowcast({ messages })`](../apidocs/classes/LineBotClient.md#validatenarrowcast) | Renamed. |
| `validateBroadcastMessageObjects(messages)` | [`validateBroadcast({ messages })`](../apidocs/classes/LineBotClient.md#validatebroadcast) | Renamed. |
| `validateCustomAggregationUnits(units)` | deleted | Client-side validation only; no longer provided. |

### Profile & group

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getProfile(userId)` | [`getProfile(userId)`](../apidocs/classes/LineBotClient.md#getprofile) | Same. |
| `getGroupMemberProfile(groupId, userId)` | [`getGroupMemberProfile(groupId, userId)`](../apidocs/classes/LineBotClient.md#getgroupmemberprofile) | Same. |
| `getRoomMemberProfile(roomId, userId)` | [`getRoomMemberProfile(roomId, userId)`](../apidocs/classes/LineBotClient.md#getroommemberprofile) | Same. |
| `getGroupMemberIds(groupId)` | [`getGroupMembersIds(groupId, start?)`](../apidocs/classes/LineBotClient.md#getgroupmembersids) | Renamed (added `s`). No longer auto-paginates; returns a single page. |
| `getRoomMemberIds(roomId)` | [`getRoomMembersIds(roomId, start?)`](../apidocs/classes/LineBotClient.md#getroommembersids) | Renamed (added `s`). No longer auto-paginates; returns a single page. |
| `getBotFollowersIds()` | [`getFollowers(start?, limit?)`](../apidocs/classes/LineBotClient.md#getfollowers) | Renamed. No longer auto-paginates; returns a single page (`GetFollowersResponse`). Loop with the `next` token to retrieve all followers. |
| `getGroupMembersCount(groupId)` | [`getGroupMemberCount(groupId)`](../apidocs/classes/LineBotClient.md#getgroupmembercount) | Renamed (removed `s`). |
| `getRoomMembersCount(roomId)` | [`getRoomMemberCount(roomId)`](../apidocs/classes/LineBotClient.md#getroommembercount) | Renamed (removed `s`). |
| `getGroupSummary(groupId)` | [`getGroupSummary(groupId)`](../apidocs/classes/LineBotClient.md#getgroupsummary) | Same. |
| `getBotInfo()` | [`getBotInfo()`](../apidocs/classes/LineBotClient.md#getbotinfo) | Same. |
| `leaveGroup(groupId)` | [`leaveGroup(groupId)`](../apidocs/classes/LineBotClient.md#leavegroup) | Same. |
| `leaveRoom(roomId)` | [`leaveRoom(roomId)`](../apidocs/classes/LineBotClient.md#leaveroom) | Same. |

### Message content

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getMessageContent(messageId)` | [`getMessageContent(messageId)`](../apidocs/classes/LineBotClient.md#getmessagecontent) | Same. Returns `Readable`. |

### Rich menu

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getRichMenu(richMenuId)` | [`getRichMenu(richMenuId)`](../apidocs/classes/LineBotClient.md#getrichmenu) | Same. |
| `createRichMenu(richMenu)` | [`createRichMenu(richMenuRequest)`](../apidocs/classes/LineBotClient.md#createrichmenu) | Return type changed from `string` to `RichMenuIdResponse`. |
| `deleteRichMenu(richMenuId)` | [`deleteRichMenu(richMenuId)`](../apidocs/classes/LineBotClient.md#deleterichmenu) | Same. |
| `getRichMenuAliasList()` | [`getRichMenuAliasList()`](../apidocs/classes/LineBotClient.md#getrichmenualiaslist) | Same. |
| `getRichMenuAlias(richMenuAliasId)` | [`getRichMenuAlias(richMenuAliasId)`](../apidocs/classes/LineBotClient.md#getrichmenualias) | Same. |
| `createRichMenuAlias(richMenuId, richMenuAliasId)` | [`createRichMenuAlias({ richMenuId, richMenuAliasId })`](../apidocs/classes/LineBotClient.md#createrichmenualias) | Arguments wrapped in a request object. |
| `deleteRichMenuAlias(richMenuAliasId)` | [`deleteRichMenuAlias(richMenuAliasId)`](../apidocs/classes/LineBotClient.md#deleterichmenualias) | Same. |
| `updateRichMenuAlias(richMenuAliasId, richMenuId)` | [`updateRichMenuAlias(richMenuAliasId, { richMenuId })`](../apidocs/classes/LineBotClient.md#updaterichmenualias) | 2nd argument wrapped in a request object. |
| `getRichMenuIdOfUser(userId)` | [`getRichMenuIdOfUser(userId)`](../apidocs/classes/LineBotClient.md#getrichmenuidofuser) | Return type changed from `string` to `RichMenuIdResponse`. |
| `linkRichMenuToUser(userId, richMenuId)` | [`linkRichMenuIdToUser(userId, richMenuId)`](../apidocs/classes/LineBotClient.md#linkrichmenuidtouser) | Renamed. |
| `unlinkRichMenuFromUser(userId)` | [`unlinkRichMenuIdFromUser(userId)`](../apidocs/classes/LineBotClient.md#unlinkrichmenuidfromuser) | Renamed. |
| `linkRichMenuToMultipleUsers(richMenuId, userIds[])` | [`linkRichMenuIdToUsers({ richMenuId, userIds })`](../apidocs/classes/LineBotClient.md#linkrichmenuidtousers) | Renamed. Arguments wrapped in a request object. |
| `unlinkRichMenusFromMultipleUsers(userIds[])` | [`unlinkRichMenuIdFromUsers({ userIds })`](../apidocs/classes/LineBotClient.md#unlinkrichmenuidfromusers) | Renamed. Arguments wrapped in a request object. |
| `getRichMenuImage(richMenuId)` | [`getRichMenuImage(richMenuId)`](../apidocs/classes/LineBotClient.md#getrichmenuimage) | Same. |
| `setRichMenuImage(richMenuId, data, contentType?)` | [`setRichMenuImage(richMenuId, body?)`](../apidocs/classes/LineBotClient.md#setrichmenuimage) | `body` is now `Blob` (optional) instead of `Buffer \| Readable`. `contentType` removed. |
| `getRichMenuList()` | [`getRichMenuList()`](../apidocs/classes/LineBotClient.md#getrichmenulist) | Return type changed from `RichMenuResponse[]` to `RichMenuListResponse`. |
| `setDefaultRichMenu(richMenuId)` | [`setDefaultRichMenu(richMenuId)`](../apidocs/classes/LineBotClient.md#setdefaultrichmenu) | Same. |
| `getDefaultRichMenuId()` | [`getDefaultRichMenuId()`](../apidocs/classes/LineBotClient.md#getdefaultrichmenuid) | Return type changed from `string` to `RichMenuIdResponse`. |
| `deleteDefaultRichMenu()` | [`cancelDefaultRichMenu()`](../apidocs/classes/LineBotClient.md#canceldefaultrichmenu) | Renamed. |
| `validateRichMenu(richMenu)` | [`validateRichMenuObject(richMenu)`](../apidocs/classes/LineBotClient.md#validaterichmenuobject) | Renamed. |

### Webhook

| Client method | LineBotClient method | Notes |
|---|---|---|
| `setWebhookEndpointUrl(endpoint)` | [`setWebhookEndpoint({ endpoint })`](../apidocs/classes/LineBotClient.md#setwebhookendpoint) | Renamed. Argument wrapped in a request object. |
| `getWebhookEndpointInfo()` | [`getWebhookEndpoint()`](../apidocs/classes/LineBotClient.md#getwebhookendpoint) | Renamed. |
| `testWebhookEndpoint(endpoint?)` | [`testWebhookEndpoint({ endpoint }?)`](../apidocs/classes/LineBotClient.md#testwebhookendpoint) | Argument wrapped in a request object. The entire request object is optional. |

### Link token

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getLinkToken(userId)` | [`issueLinkToken(userId)`](../apidocs/classes/LineBotClient.md#issuelinktoken) | Renamed. Return type changed from `string` to `IssueLinkTokenResponse`. |

### Message delivery stats

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getNumberOfSentReplyMessages(date)` | [`getNumberOfSentReplyMessages(date)`](../apidocs/classes/LineBotClient.md#getnumberofsentreplymessages) | Same. |
| `getNumberOfSentPushMessages(date)` | [`getNumberOfSentPushMessages(date)`](../apidocs/classes/LineBotClient.md#getnumberofsentpushmessages) | Same. |
| `getNumberOfSentMulticastMessages(date)` | [`getNumberOfSentMulticastMessages(date)`](../apidocs/classes/LineBotClient.md#getnumberofsentmulticastmessages) | Same. |
| `getNumberOfSentBroadcastMessages(date)` | [`getNumberOfSentBroadcastMessages(date)`](../apidocs/classes/LineBotClient.md#getnumberofsentbroadcastmessages) | Same. |
| `getNarrowcastProgress(requestId)` | [`getNarrowcastProgress(requestId)`](../apidocs/classes/LineBotClient.md#getnarrowcastprogress) | Same. |
| `getTargetLimitForAdditionalMessages()` | [`getMessageQuota()`](../apidocs/classes/LineBotClient.md#getmessagequota) | Renamed. |
| `getNumberOfMessagesSentThisMonth()` | [`getMessageQuotaConsumption()`](../apidocs/classes/LineBotClient.md#getmessagequotaconsumption) | Renamed. |

### Insight

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getNumberOfMessageDeliveries(date)` | [`getNumberOfMessageDeliveries(date)`](../apidocs/classes/LineBotClient.md#getnumberofmessagedeliveries) | Same. |
| `getNumberOfFollowers(date)` | [`getNumberOfFollowers(date?)`](../apidocs/classes/LineBotClient.md#getnumberoffollowers) | `date` is now optional. |
| `getFriendDemographics()` | [`getFriendsDemographics()`](../apidocs/classes/LineBotClient.md#getfriendsdemographics) | Renamed (added `s`). |
| `getUserInteractionStatistics(requestId)` | [`getMessageEvent(requestId)`](../apidocs/classes/LineBotClient.md#getmessageevent) | Renamed. |
| `getStatisticsPerUnit(unit, from, to)` | [`getStatisticsPerUnit(unit, from, to)`](../apidocs/classes/LineBotClient.md#getstatisticsperunit) | Same. |

### Audience

| Client method | LineBotClient method | Notes |
|---|---|---|
| `createUploadAudienceGroup({ description, isIfaAudience?, audiences?, uploadDescription? })` | [`createAudienceGroup({ description, isIfaAudience, audiences, uploadDescription })`](../apidocs/classes/LineBotClient.md#createaudiencegroup) | Renamed. |
| `createUploadAudienceGroupByFile({ description, isIfaAudience?, uploadDescription?, file })` | [`createAudienceForUploadingUserIds(file, description?, isIfaAudience?, uploadDescription?)`](../apidocs/classes/LineBotClient.md#createaudienceforuploadinguserids) | Renamed. `file` type changed from `Buffer \| Readable` to `Blob`. |
| `updateUploadAudienceGroup({ audienceGroupId, description?, uploadDescription?, audiences })` | [`addAudienceToAudienceGroup({ audienceGroupId, uploadDescription, audiences })`](../apidocs/classes/LineBotClient.md#addaudiencetoaudiencegroup) then, if `description` was used, also call [`updateAudienceGroupDescription(audienceGroupId, { description })`](../apidocs/classes/LineBotClient.md#updateaudiencegroupdescription) | Renamed. `description` requires a separate call. The legacy per-request `httpConfig` argument has no direct replacement in `LineBotClient`. |
| `updateUploadAudienceGroupByFile({ audienceGroupId, uploadDescription?, file })` | [`addUserIdsToAudience(file, audienceGroupId?, uploadDescription?)`](../apidocs/classes/LineBotClient.md#adduseridstoaudience) | Renamed. `file` type changed from `Buffer \| Readable` to `Blob`. The legacy per-request `httpConfig` argument has no direct replacement in `LineBotClient`. |
| `createClickAudienceGroup({ description, requestId, clickUrl? })` | [`createClickBasedAudienceGroup({ description, requestId, clickUrl })`](../apidocs/classes/LineBotClient.md#createclickbasedaudiencegroup) | Renamed. |
| `createImpAudienceGroup({ requestId, description })` | [`createImpBasedAudienceGroup({ requestId, description })`](../apidocs/classes/LineBotClient.md#createimpbasedaudiencegroup) | Renamed. |
| `setDescriptionAudienceGroup(description, audienceGroupId)` | [`updateAudienceGroupDescription(audienceGroupId, { description })`](../apidocs/classes/LineBotClient.md#updateaudiencegroupdescription) | Renamed. Argument order reversed. `audienceGroupId` type changed from `string` to `number`. |
| `deleteAudienceGroup(audienceGroupId)` | [`deleteAudienceGroup(audienceGroupId)`](../apidocs/classes/LineBotClient.md#deleteaudiencegroup) | `audienceGroupId` type changed from `string` to `number`. |
| `getAudienceGroup(audienceGroupId)` | [`getAudienceData(audienceGroupId)`](../apidocs/classes/LineBotClient.md#getaudiencedata) | Renamed. `audienceGroupId` type changed from `string` to `number`. |
| `getAudienceGroups(page, description?, status?, size?, createRoute?, includesExternalPublicGroups?)` | [`getAudienceGroups(page, description?, status?, size?, includesExternalPublicGroups?, createRoute?)`](../apidocs/classes/LineBotClient.md#getaudiencegroups) | Last two arguments swapped. |
| `getAudienceGroupAuthorityLevel()` | deleted | No equivalent in current API. |
| `changeAudienceGroupAuthorityLevel(authorityLevel)` | deleted | No equivalent in current API. |

---

## Method mapping: OAuth → channelAccessToken.ChannelAccessTokenClient

`OAuth` methods are not on [`LineBotClient`](../apidocs/classes/LineBotClient.md). They live on [`channelAccessToken.ChannelAccessTokenClient`](../apidocs/@line/namespaces/channelAccessToken/classes/ChannelAccessTokenClient.md),
which is constructed without a channel access token:

```js
const { channelAccessToken } = require('@line/bot-sdk');
const oauthClient = new channelAccessToken.ChannelAccessTokenClient({});
```

| OAuth method | ChannelAccessTokenClient method | Notes |
|---|---|---|
| `issueAccessToken(client_id, client_secret)` | [`issueChannelToken('client_credentials', client_id, client_secret)`](../apidocs/@line/namespaces/channelAccessToken/classes/ChannelAccessTokenClient.md#issuechanneltoken) | Renamed. `grant_type` is now an explicit argument. |
| `revokeAccessToken(access_token)` | [`revokeChannelToken(access_token)`](../apidocs/@line/namespaces/channelAccessToken/classes/ChannelAccessTokenClient.md#revokechanneltoken) | Renamed. |
| `verifyAccessToken(access_token)` | [`verifyChannelTokenByJWT(access_token)`](../apidocs/@line/namespaces/channelAccessToken/classes/ChannelAccessTokenClient.md#verifychanneltokenbyjwt) | Renamed. Verifies a v2.1 (JWT-issued) channel access token. |
| `verifyIdToken(id_token, client_id, nonce?, user_id?)` | deleted | No direct equivalent. |
| `issueChannelAccessTokenV2_1(client_assertion)` | [`issueChannelTokenByJWT('client_credentials', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer', client_assertion)`](../apidocs/@line/namespaces/channelAccessToken/classes/ChannelAccessTokenClient.md#issuechanneltokenbyjwt) | Renamed. `grant_type` and `client_assertion_type` are now explicit arguments. |
| `getChannelAccessTokenKeyIdsV2_1(client_assertion)` | [`getsAllValidChannelAccessTokenKeyIds('urn:ietf:params:oauth:client-assertion-type:jwt-bearer', client_assertion)`](../apidocs/@line/namespaces/channelAccessToken/classes/ChannelAccessTokenClient.md#getsallvalidchannelaccesstokenkeyids) | Renamed. `client_assertion_type` is now an explicit argument. Response shape changed: `key_ids` → `kids`. |
| `revokeChannelAccessTokenV2_1(client_id, client_secret, access_token)` | [`revokeChannelTokenByJWT(client_id, client_secret, access_token)`](../apidocs/@line/namespaces/channelAccessToken/classes/ChannelAccessTokenClient.md#revokechanneltokenbyjwt) | Renamed. |

---

## Type mapping

Most types in `lib/types.ts` are deprecated. Use the generated types from the
sub-namespaces exported by `@line/bot-sdk`.

> **Note:** A few helper types in `lib/types.ts` are still used by the current
> generated clients and are **not** deprecated: [`ApiResponseType<T>`](../apidocs/interfaces/ApiResponseType.md),
> [`MessageAPIResponseBase`](../apidocs/type-aliases/MessageAPIResponseBase.md), `LINE_REQUEST_ID_HTTP_HEADER_NAME`,
> `LINE_SIGNATURE_HTTP_HEADER_NAME`, and [`MiddlewareConfig`](../apidocs/interfaces/MiddlewareConfig.md).

### Config types

| Old type | New type | Notes |
|---|---|---|
| `Config` | _(no single replacement)_ | Split: use [`LineBotClientChannelAccessTokenConfig`](../apidocs/interfaces/LineBotClientChannelAccessTokenConfig.md) for client (`channelAccessToken`) and [`MiddlewareConfig`](../apidocs/interfaces/MiddlewareConfig.md) for middleware (`channelSecret`). |
| `ClientConfig` | [`LineBotClientChannelAccessTokenConfig`](../apidocs/interfaces/LineBotClientChannelAccessTokenConfig.md) | From `@line/bot-sdk` |
| [`MiddlewareConfig`](../apidocs/interfaces/MiddlewareConfig.md) | [`MiddlewareConfig`](../apidocs/interfaces/MiddlewareConfig.md) | Unchanged. No longer extends `Config`; only `channelSecret` is needed. |

### Webhook event types

| Old type | New type | Notes |
|---|---|---|
| `WebhookRequestBody` | [`webhook.CallbackRequest`](../apidocs/@line/namespaces/webhook/type-aliases/CallbackRequest.md) | From `@line/bot-sdk` |
| `WebhookEvent` | [`webhook.Event`](../apidocs/@line/namespaces/webhook/type-aliases/Event.md) | From `@line/bot-sdk` |
| `EventBase` | [`webhook.EventBase`](../apidocs/@line/namespaces/webhook/type-aliases/EventBase.md) | From `@line/bot-sdk` |
| `ReplyableEvent` | _(no direct equivalent)_ | In the new API, `replyToken` is included directly in each replyable event type (e.g. [`webhook.MessageEvent`](../apidocs/@line/namespaces/webhook/type-aliases/MessageEvent.md)). |
| `EventSource` | [`webhook.Source`](../apidocs/@line/namespaces/webhook/type-aliases/Source.md) | From `@line/bot-sdk` |
| `User` _(source)_ | [`webhook.UserSource`](../apidocs/@line/namespaces/webhook/type-aliases/UserSource.md) | From `@line/bot-sdk` |
| `Group` _(source)_ | [`webhook.GroupSource`](../apidocs/@line/namespaces/webhook/type-aliases/GroupSource.md) | From `@line/bot-sdk` |
| `Room` _(source)_ | [`webhook.RoomSource`](../apidocs/@line/namespaces/webhook/type-aliases/RoomSource.md) | From `@line/bot-sdk` |
| `DeliveryContext` | [`webhook.DeliveryContext`](../apidocs/@line/namespaces/webhook/type-aliases/DeliveryContext.md) | From `@line/bot-sdk` |
| `MessageEvent` | [`webhook.MessageEvent`](../apidocs/@line/namespaces/webhook/type-aliases/MessageEvent.md) | From `@line/bot-sdk` |
| `UnsendEvent` | [`webhook.UnsendEvent`](../apidocs/@line/namespaces/webhook/type-aliases/UnsendEvent.md) | From `@line/bot-sdk` |
| `FollowEvent` | [`webhook.FollowEvent`](../apidocs/@line/namespaces/webhook/type-aliases/FollowEvent.md) | From `@line/bot-sdk` |
| `UnfollowEvent` | [`webhook.UnfollowEvent`](../apidocs/@line/namespaces/webhook/type-aliases/UnfollowEvent.md) | From `@line/bot-sdk` |
| `JoinEvent` | [`webhook.JoinEvent`](../apidocs/@line/namespaces/webhook/type-aliases/JoinEvent.md) | From `@line/bot-sdk` |
| `LeaveEvent` | [`webhook.LeaveEvent`](../apidocs/@line/namespaces/webhook/type-aliases/LeaveEvent.md) | From `@line/bot-sdk` |
| `MemberJoinEvent` | [`webhook.MemberJoinedEvent`](../apidocs/@line/namespaces/webhook/type-aliases/MemberJoinedEvent.md) | Renamed (added `d`). |
| `MemberLeaveEvent` | [`webhook.MemberLeftEvent`](../apidocs/@line/namespaces/webhook/type-aliases/MemberLeftEvent.md) | Renamed. |
| `PostbackEvent` | [`webhook.PostbackEvent`](../apidocs/@line/namespaces/webhook/type-aliases/PostbackEvent.md) | From `@line/bot-sdk` |
| `VideoPlayCompleteEvent` | [`webhook.VideoPlayCompleteEvent`](../apidocs/@line/namespaces/webhook/type-aliases/VideoPlayCompleteEvent.md) | From `@line/bot-sdk` |
| `BeaconEvent` | [`webhook.BeaconEvent`](../apidocs/@line/namespaces/webhook/type-aliases/BeaconEvent.md) | From `@line/bot-sdk` |
| `AccountLinkEvent` | [`webhook.AccountLinkEvent`](../apidocs/@line/namespaces/webhook/type-aliases/AccountLinkEvent.md) | From `@line/bot-sdk` |
| `DeliveryEvent` | [`webhook.PnpDeliveryCompletionEvent`](../apidocs/@line/namespaces/webhook/type-aliases/PnpDeliveryCompletionEvent.md) | Renamed. |

### Webhook message content types

| Old type | New type | Notes |
|---|---|---|
| `EventMessage` | [`webhook.MessageContent`](../apidocs/@line/namespaces/webhook/type-aliases/MessageContent.md) | Renamed. |
| `EventMessageBase` | [`webhook.MessageContentBase`](../apidocs/@line/namespaces/webhook/type-aliases/MessageContentBase.md) | Renamed. |
| `TextEventMessage` | [`webhook.TextMessageContent`](../apidocs/@line/namespaces/webhook/type-aliases/TextMessageContent.md) | Renamed. |
| `ImageEventMessage` | [`webhook.ImageMessageContent`](../apidocs/@line/namespaces/webhook/type-aliases/ImageMessageContent.md) | Renamed. |
| `VideoEventMessage` | [`webhook.VideoMessageContent`](../apidocs/@line/namespaces/webhook/type-aliases/VideoMessageContent.md) | Renamed. |
| `AudioEventMessage` | [`webhook.AudioMessageContent`](../apidocs/@line/namespaces/webhook/type-aliases/AudioMessageContent.md) | Renamed. |
| `FileEventMessage` | [`webhook.FileMessageContent`](../apidocs/@line/namespaces/webhook/type-aliases/FileMessageContent.md) | Renamed. |
| `LocationEventMessage` | [`webhook.LocationMessageContent`](../apidocs/@line/namespaces/webhook/type-aliases/LocationMessageContent.md) | Renamed. |
| `StickerEventMessage` | [`webhook.StickerMessageContent`](../apidocs/@line/namespaces/webhook/type-aliases/StickerMessageContent.md) | Renamed. |
| `ContentProvider` | [`webhook.ContentProvider`](../apidocs/@line/namespaces/webhook/type-aliases/ContentProvider.md) | From `@line/bot-sdk` |
| `Postback` | [`webhook.PostbackContent`](../apidocs/@line/namespaces/webhook/type-aliases/PostbackContent.md) | Renamed. |

### Outbound message types

| Old type | New type | Notes |
|---|---|---|
| `MessageCommon` | [`messagingApi.MessageBase`](../apidocs/@line/namespaces/messagingApi/type-aliases/MessageBase.md) | Renamed. |
| `Message` | [`messagingApi.Message`](../apidocs/@line/namespaces/messagingApi/type-aliases/Message.md) | From `@line/bot-sdk` |
| `TextMessage` | [`messagingApi.TextMessage`](../apidocs/@line/namespaces/messagingApi/type-aliases/TextMessage.md) | From `@line/bot-sdk` |
| `ImageMessage` | [`messagingApi.ImageMessage`](../apidocs/@line/namespaces/messagingApi/type-aliases/ImageMessage.md) | From `@line/bot-sdk` |
| `VideoMessage` | [`messagingApi.VideoMessage`](../apidocs/@line/namespaces/messagingApi/type-aliases/VideoMessage.md) | From `@line/bot-sdk` |
| `AudioMessage` | [`messagingApi.AudioMessage`](../apidocs/@line/namespaces/messagingApi/type-aliases/AudioMessage.md) | From `@line/bot-sdk` |
| `LocationMessage` | [`messagingApi.LocationMessage`](../apidocs/@line/namespaces/messagingApi/type-aliases/LocationMessage.md) | From `@line/bot-sdk` |
| `StickerMessage` | [`messagingApi.StickerMessage`](../apidocs/@line/namespaces/messagingApi/type-aliases/StickerMessage.md) | From `@line/bot-sdk` |
| `ImageMapMessage` | [`messagingApi.ImagemapMessage`](../apidocs/@line/namespaces/messagingApi/type-aliases/ImagemapMessage.md) | Renamed (lowercase `m`). |
| `TemplateMessage` | [`messagingApi.TemplateMessage`](../apidocs/@line/namespaces/messagingApi/type-aliases/TemplateMessage.md) | From `@line/bot-sdk` |
| `FlexMessage` | [`messagingApi.FlexMessage`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexMessage.md) | From `@line/bot-sdk` |
| `ImageMapAction` | [`messagingApi.ImagemapAction`](../apidocs/@line/namespaces/messagingApi/type-aliases/ImagemapAction.md) | Renamed (lowercase `m`). |
| `ImageMapActionBase` | [`messagingApi.ImagemapActionBase`](../apidocs/@line/namespaces/messagingApi/type-aliases/ImagemapActionBase.md) | Renamed (lowercase `m`). |
| `ImageMapURIAction` | [`messagingApi.URIImagemapAction`](../apidocs/@line/namespaces/messagingApi/type-aliases/URIImagemapAction.md) | Renamed. |
| `ImageMapMessageAction` | [`messagingApi.MessageImagemapAction`](../apidocs/@line/namespaces/messagingApi/type-aliases/MessageImagemapAction.md) | Renamed. |
| `Area` | [`messagingApi.ImagemapArea`](../apidocs/@line/namespaces/messagingApi/type-aliases/ImagemapArea.md) | Renamed. |

### Flex types

| Old type | New type | Notes |
|---|---|---|
| `FlexContainer` | [`messagingApi.FlexContainer`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexContainer.md) | From `@line/bot-sdk` |
| `FlexBubble` | [`messagingApi.FlexBubble`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexBubble.md) | From `@line/bot-sdk` |
| `FlexBubbleStyle` | [`messagingApi.FlexBubbleStyles`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexBubbleStyles.md) | Renamed (added `s`). |
| `FlexBlockStyle` | [`messagingApi.FlexBlockStyle`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexBlockStyle.md) | From `@line/bot-sdk` |
| `FlexCarousel` | [`messagingApi.FlexCarousel`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexCarousel.md) | From `@line/bot-sdk` |
| `FlexComponent` | [`messagingApi.FlexComponent`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexComponent.md) | From `@line/bot-sdk` |
| `FlexBox` | [`messagingApi.FlexBox`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexBox.md) | From `@line/bot-sdk` |
| `Offset` | _(no direct equivalent)_ | Fields (`position`, `offsetTop`, `offsetBottom`, `offsetStart`, `offsetEnd`) are now inlined into each Flex component type (e.g. [`messagingApi.FlexBox`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexBox.md)). [`messagingApi.FlexOffset`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexOffset.md) is an unrelated string union for sizing keywords. |
| `Background` | [`messagingApi.FlexBoxBackground`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexBoxBackground.md) | Renamed. |
| `FlexButton` | [`messagingApi.FlexButton`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexButton.md) | From `@line/bot-sdk` |
| `FlexFiller` | [`messagingApi.FlexFiller`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexFiller.md) | From `@line/bot-sdk` |
| `FlexIcon` | [`messagingApi.FlexIcon`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexIcon.md) | From `@line/bot-sdk` |
| `FlexImage` | [`messagingApi.FlexImage`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexImage.md) | From `@line/bot-sdk` |
| `FlexVideo` | [`messagingApi.FlexVideo`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexVideo.md) | From `@line/bot-sdk` |
| `FlexSeparator` | [`messagingApi.FlexSeparator`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexSeparator.md) | From `@line/bot-sdk` |
| `FlexText` | [`messagingApi.FlexText`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexText.md) | From `@line/bot-sdk` |
| `FlexSpacer` | _(removed)_ | Not part of [`messagingApi.FlexComponent`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexComponent.md) in the new API. Use [`messagingApi.FlexFiller`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexFiller.md) or box padding instead. |
| `FlexSpan` | [`messagingApi.FlexSpan`](../apidocs/@line/namespaces/messagingApi/type-aliases/FlexSpan.md) | From `@line/bot-sdk` |

### Template types

| Old type | New type | Notes |
|---|---|---|
| `TemplateContent` | [`messagingApi.Template`](../apidocs/@line/namespaces/messagingApi/type-aliases/Template.md) | Renamed. |
| `TemplateButtons` | [`messagingApi.ButtonsTemplate`](../apidocs/@line/namespaces/messagingApi/type-aliases/ButtonsTemplate.md) | Renamed. |
| `TemplateConfirm` | [`messagingApi.ConfirmTemplate`](../apidocs/@line/namespaces/messagingApi/type-aliases/ConfirmTemplate.md) | Renamed. |
| `TemplateCarousel` | [`messagingApi.CarouselTemplate`](../apidocs/@line/namespaces/messagingApi/type-aliases/CarouselTemplate.md) | Renamed. |
| `TemplateColumn` | [`messagingApi.CarouselColumn`](../apidocs/@line/namespaces/messagingApi/type-aliases/CarouselColumn.md) | Renamed. |
| `TemplateImageCarousel` | [`messagingApi.ImageCarouselTemplate`](../apidocs/@line/namespaces/messagingApi/type-aliases/ImageCarouselTemplate.md) | Renamed. |
| `TemplateImageColumn` | [`messagingApi.ImageCarouselColumn`](../apidocs/@line/namespaces/messagingApi/type-aliases/ImageCarouselColumn.md) | Renamed. |

### Action / quick reply types

| Old type | New type | Notes |
|---|---|---|
| `QuickReply` | [`messagingApi.QuickReply`](../apidocs/@line/namespaces/messagingApi/type-aliases/QuickReply.md) | From `@line/bot-sdk` |
| `QuickReplyItem` | [`messagingApi.QuickReplyItem`](../apidocs/@line/namespaces/messagingApi/type-aliases/QuickReplyItem.md) | From `@line/bot-sdk` |
| `Sender` | [`messagingApi.Sender`](../apidocs/@line/namespaces/messagingApi/type-aliases/Sender.md) | From `@line/bot-sdk` |
| `Action` | [`messagingApi.Action`](../apidocs/@line/namespaces/messagingApi/type-aliases/Action.md) | From `@line/bot-sdk` |
| `PostbackAction` | [`messagingApi.PostbackAction`](../apidocs/@line/namespaces/messagingApi/type-aliases/PostbackAction.md) | From `@line/bot-sdk` |
| `MessageAction` | [`messagingApi.MessageAction`](../apidocs/@line/namespaces/messagingApi/type-aliases/MessageAction.md) | From `@line/bot-sdk` |
| `URIAction` | [`messagingApi.URIAction`](../apidocs/@line/namespaces/messagingApi/type-aliases/URIAction.md) | From `@line/bot-sdk` |
| `AltURI` | [`messagingApi.AltUri`](../apidocs/@line/namespaces/messagingApi/type-aliases/AltUri.md) | Renamed (lowercase `ri`). |
| `DatetimePickerAction` | [`messagingApi.DatetimePickerAction`](../apidocs/@line/namespaces/messagingApi/type-aliases/DatetimePickerAction.md) | From `@line/bot-sdk` |
| `RichMenuSwitchAction` | [`messagingApi.RichMenuSwitchAction`](../apidocs/@line/namespaces/messagingApi/type-aliases/RichMenuSwitchAction.md) | From `@line/bot-sdk` |

### Rich menu types

| Old type | New type | Notes |
|---|---|---|
| `Size` | [`messagingApi.RichMenuSize`](../apidocs/@line/namespaces/messagingApi/type-aliases/RichMenuSize.md) | Renamed. |
| `RichMenu` | [`messagingApi.RichMenuRequest`](../apidocs/@line/namespaces/messagingApi/type-aliases/RichMenuRequest.md) | Renamed. |
| `RichMenuResponse` | [`messagingApi.RichMenuResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/RichMenuResponse.md) | From `@line/bot-sdk` |
| `GetRichMenuAliasResponse` | [`messagingApi.RichMenuAliasResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/RichMenuAliasResponse.md) | Renamed. |
| `GetRichMenuAliasListResponse` | [`messagingApi.RichMenuAliasListResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/RichMenuAliasListResponse.md) | Renamed. |

### Response / stats types

| Old type | New type | Notes |
|---|---|---|
| `Profile` | [`messagingApi.UserProfileResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/UserProfileResponse.md) | Renamed. |
| `BotInfoResponse` | [`messagingApi.BotInfoResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/BotInfoResponse.md) | From `@line/bot-sdk` |
| `GroupSummaryResponse` | [`messagingApi.GroupSummaryResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/GroupSummaryResponse.md) | From `@line/bot-sdk` |
| `MembersCountResponse` | [`messagingApi.GroupMemberCountResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/GroupMemberCountResponse.md) or [`messagingApi.RoomMemberCountResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/RoomMemberCountResponse.md) | Split into two types. |
| `WebhookEndpointInfoResponse` | [`messagingApi.GetWebhookEndpointResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/GetWebhookEndpointResponse.md) | Renamed. |
| `TestWebhookEndpointResponse` | [`messagingApi.TestWebhookEndpointResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/TestWebhookEndpointResponse.md) | From `@line/bot-sdk` |
| `TargetLimitForAdditionalMessages` | [`messagingApi.MessageQuotaResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/MessageQuotaResponse.md) | Renamed. |
| `NumberOfMessagesSentThisMonth` | [`messagingApi.QuotaConsumptionResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/QuotaConsumptionResponse.md) | Renamed. |
| `NumberOfMessagesSentResponse` | [`messagingApi.NumberOfMessagesResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/NumberOfMessagesResponse.md) | Renamed. |
| `NarrowcastProgressResponse` | [`messagingApi.NarrowcastProgressResponse`](../apidocs/@line/namespaces/messagingApi/type-aliases/NarrowcastProgressResponse.md) | From `@line/bot-sdk` |

### Insight types

| Old type | New type | Notes |
|---|---|---|
| `NumberOfMessageDeliveries` | [`insight.GetNumberOfMessageDeliveriesResponse`](../apidocs/@line/namespaces/insight/type-aliases/GetNumberOfMessageDeliveriesResponse.md) | Renamed. |
| `NumberOfFollowers` | [`insight.GetNumberOfFollowersResponse`](../apidocs/@line/namespaces/insight/type-aliases/GetNumberOfFollowersResponse.md) | Renamed. |
| `NumberOfMessageDeliveriesResponse` | [`insight.GetNumberOfMessageDeliveriesResponse`](../apidocs/@line/namespaces/insight/type-aliases/GetNumberOfMessageDeliveriesResponse.md) | Renamed. |
| `NumberOfFollowersResponse` | [`insight.GetNumberOfFollowersResponse`](../apidocs/@line/namespaces/insight/type-aliases/GetNumberOfFollowersResponse.md) | Renamed. |
| `FriendDemographics` | [`insight.GetFriendsDemographicsResponse`](../apidocs/@line/namespaces/insight/type-aliases/GetFriendsDemographicsResponse.md) | Renamed. |
| `UserInteractionStatistics` | [`insight.GetMessageEventResponse`](../apidocs/@line/namespaces/insight/type-aliases/GetMessageEventResponse.md) | Renamed. |
| `InsightStatisticsResponse` | _(no direct equivalent)_ | Shared base type. In the new API, the `status` field is inlined into each concrete response type. |
| `StatisticsPerUnit` | [`insight.GetStatisticsPerUnitResponse`](../apidocs/@line/namespaces/insight/type-aliases/GetStatisticsPerUnitResponse.md) | Renamed. |

### Narrowcast types

| Old type | New type | Notes |
|---|---|---|
| `ReceieptObject` | [`messagingApi.Recipient`](../apidocs/@line/namespaces/messagingApi/type-aliases/Recipient.md) | Renamed (also fixes typo). Union structure differs: old type used `FilterOperatorObject` wrappers; new type includes `OperatorRecipient` as a direct variant. |
| `DemographicFilterObject` | [`messagingApi.DemographicFilter`](../apidocs/@line/namespaces/messagingApi/type-aliases/DemographicFilter.md) | Union structure differs: old type used `FilterOperatorObject` wrappers; new type includes `OperatorDemographicFilter` as a direct variant. |

### Audience types

| Old type | New type | Notes |
|---|---|---|
| `AudienceGroupStatus` | [`manageAudience.AudienceGroupStatus`](../apidocs/@line/namespaces/manageAudience/type-aliases/AudienceGroupStatus.md) | From `@line/bot-sdk` |
| `AudienceGroupCreateRoute` | [`manageAudience.AudienceGroupCreateRoute`](../apidocs/@line/namespaces/manageAudience/type-aliases/AudienceGroupCreateRoute.md) | From `@line/bot-sdk` |
| `AudienceGroup` | [`manageAudience.AudienceGroup`](../apidocs/@line/namespaces/manageAudience/type-aliases/AudienceGroup.md) | From `@line/bot-sdk` |
| `AudienceGroups` | `manageAudience.AudienceGroup[]` | No longer a named type. |
| `AudienceGroupAuthorityLevel` | deleted | No equivalent in current API. |

### Channel access token types

| Old type | New type | Notes |
|---|---|---|
| `ChannelAccessToken` | No single equivalent. See below. | Shape depends on which method was called. |
| `VerifyAccessToken` | [`channelAccessToken.VerifyChannelAccessTokenResponse`](../apidocs/@line/namespaces/channelAccessToken/type-aliases/VerifyChannelAccessTokenResponse.md) | Renamed. |
| `VerifyIDToken` | deleted | No direct equivalent. |

> **`ChannelAccessToken` has no single replacement.**
> - If the type was returned by `issueAccessToken`, use `channelAccessToken.IssueShortLivedChannelAccessTokenResponse`.
>   Note: this type has no `key_id` field.
> - If the type was returned by `issueChannelAccessTokenV2_1`, use `channelAccessToken.IssueChannelAccessTokenResponse`.
>   Note: `key_id` is a **required** field in this type (not optional as in the legacy type).
>
> `IssueStatelessChannelAccessTokenResponse` is a different token type entirely (15-minute lifetime, non-revocable)
> and is not a replacement for either legacy path.

### Error types

| Old class | New class | Notes |
|---|---|---|
| `HTTPError` | [`HTTPFetchError`](../apidocs/classes/HTTPFetchError.md) | Different properties; see [error handling](#error-handling). |
| `RequestError` | _(no equivalent)_ | Axios network/connection error. `LineBotClient` does not wrap these; native `fetch()` throws a `TypeError` instead. |
| `ReadError` | _(no equivalent)_ | Axios read error. `LineBotClient` does not wrap these; native `fetch()` errors propagate unwrapped. |
| [`SignatureValidationFailed`](../apidocs/classes/SignatureValidationFailed.md) | [`SignatureValidationFailed`](../apidocs/classes/SignatureValidationFailed.md) | Unchanged. |
| [`JSONParseError`](../apidocs/classes/JSONParseError.md) | [`JSONParseError`](../apidocs/classes/JSONParseError.md) | Unchanged. |
