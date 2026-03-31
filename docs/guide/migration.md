# Migration Guide: Client → LineBotClient

The legacy `Client` class is deprecated. Use `LineBotClient` instead.
The legacy `OAuth` class is deprecated. Use `channelAccessToken.ChannelAccessTokenClient` instead.

`LineBotClient` wraps the Messaging, Insight, LIFF, Audience, Shop, and Module API
categories. Channel Access Token (OAuth) operations are handled by the separate
`channelAccessToken.ChannelAccessTokenClient`.

---

## Migration procedure

### Step 1: Upgrade to v10

Update `@line/bot-sdk` to v10.x.x <!-- TODO: fill in exact patch version -->:

```sh
npm install @line/bot-sdk@10
```

Both the legacy `Client`/`OAuth` API and the new `LineBotClient` API coexist in
v10, so you can migrate incrementally without breaking existing code.

### Step 2: Replace client construction

```js
// Before
const { Client, OAuth } = require('@line/bot-sdk');
const client = new Client({ channelAccessToken: '...' });
const oauth  = new OAuth();

// After
const { LineBotClient, channelAccessToken } = require('@line/bot-sdk');
const client = LineBotClient.create({ channelAccessToken: '...' });
const oauthClient = new channelAccessToken.ChannelAccessTokenClient();
```

The `channelAccessToken` option is the same. Additional options available on
`LineBotClientConfig`:

| Option | Default | Description |
|---|---|---|
| `channelAccessToken` | required | Bearer token sent as `Authorization` header |
| `defaultHeaders` | `{}` | Extra headers merged into every request |
| `apiBaseURL` | `https://api.line.me` | Override for `api.line.me` endpoints |
| `dataApiBaseURL` | `https://api-data.line.me` | Override for `api-data.line.me` endpoints |
| `managerBaseURL` | `https://manager.line.biz` | Override for `manager.line.biz` endpoints |

### Step 3: Update method calls

See the [method mapping tables](#method-mapping-client--linebotclient) below.
Most method signatures change: positional arguments are now collected into a single
request object, e.g.:

```js
// Before
client.pushMessage(to, messages, notificationDisabled);

// After
client.pushMessage({ to, messages, notificationDisabled });
```

### Step 4: Update error handling

`LineBotClient` uses the Fetch API internally and throws `HTTPFetchError` on
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
`LineBotClient` uses the runtime's native `fetch()` and throws `HTTPFetchError` instead.
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

| `HTTPError` (v8) | `HTTPFetchError` (v9+) | Notes |
|---|---|---|
| `originalError.response.status` | `status` | |
| `originalError.response.headers` | `headers` | Now a Fetch `Headers` object |
| `originalError.response.data` | `body` | Was parsed JSON; now a raw string |
| `originalError` | deleted | |

`SignatureValidationFailed` and `JSONParseError` are unchanged.

---

## Method mapping: Client → LineBotClient

### Messaging

| Client method | LineBotClient method | Notes |
|---|---|---|
| `pushMessage(to, messages, notificationDisabled?, customAggregationUnits?)` | `pushMessage({ to, messages, notificationDisabled, customAggregationUnits }, xLineRetryKey?)` | Arguments wrapped in a request object. Retry key moved to 2nd param. |
| `replyMessage(replyToken, messages, notificationDisabled?)` | `replyMessage({ replyToken, messages, notificationDisabled })` | Arguments wrapped in a request object. |
| `multicast(to, messages, notificationDisabled?, customAggregationUnits?)` | `multicast({ to, messages, notificationDisabled, customAggregationUnits }, xLineRetryKey?)` | Arguments wrapped in a request object. Retry key moved to 2nd param. |
| `narrowcast(messages, recipient?, filter?, limit?, notificationDisabled?)` | `narrowcast({ messages, recipient, filter, limit, notificationDisabled }, xLineRetryKey?)` | Arguments wrapped in a request object. Retry key moved to 2nd param. |
| `broadcast(messages, notificationDisabled?)` | `broadcast({ messages, notificationDisabled }, xLineRetryKey?)` | Arguments wrapped in a request object. Retry key moved to 2nd param. |
| `setRequestOptionOnce({ retryKey })` | deleted | Pass `xLineRetryKey` as the 2nd argument to `pushMessage` / `multicast` / `narrowcast` / `broadcast` directly. |

### Message validation

| Client method | LineBotClient method | Notes |
|---|---|---|
| `validatePushMessageObjects(messages)` | `validatePush({ messages })` | Renamed. |
| `validateReplyMessageObjects(messages)` | `validateReply({ messages })` | Renamed. |
| `validateMulticastMessageObjects(messages)` | `validateMulticast({ messages })` | Renamed. |
| `validateNarrowcastMessageObjects(messages)` | `validateNarrowcast({ messages })` | Renamed. |
| `validateBroadcastMessageObjects(messages)` | `validateBroadcast({ messages })` | Renamed. |
| `validateCustomAggregationUnits(units)` | deleted | Client-side validation only; no longer provided. |

### Profile & group

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getProfile(userId)` | `getProfile(userId)` | Same. |
| `getGroupMemberProfile(groupId, userId)` | `getGroupMemberProfile(groupId, userId)` | Same. |
| `getRoomMemberProfile(roomId, userId)` | `getRoomMemberProfile(roomId, userId)` | Same. |
| `getGroupMemberIds(groupId)` | `getGroupMembersIds(groupId, start?)` | Renamed (added `s`). No longer auto-paginates; returns a single page. |
| `getRoomMemberIds(roomId)` | `getRoomMembersIds(roomId, start?)` | Renamed (added `s`). No longer auto-paginates; returns a single page. |
| `getBotFollowersIds()` | `getFollowers(start?, limit?)` | Renamed. No longer returns `string[]` directly; returns `GetFollowersResponse` with `userIds`. |
| `getGroupMembersCount(groupId)` | `getGroupMemberCount(groupId)` | Renamed (removed `s`). |
| `getRoomMembersCount(roomId)` | `getRoomMemberCount(roomId)` | Renamed (removed `s`). |
| `getGroupSummary(groupId)` | `getGroupSummary(groupId)` | Same. |
| `getBotInfo()` | `getBotInfo()` | Same. |
| `leaveGroup(groupId)` | `leaveGroup(groupId)` | Same. |
| `leaveRoom(roomId)` | `leaveRoom(roomId)` | Same. |

### Message content

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getMessageContent(messageId)` | `getMessageContent(messageId)` | Same. Returns `Readable`. |

### Rich menu

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getRichMenu(richMenuId)` | `getRichMenu(richMenuId)` | Same. |
| `createRichMenu(richMenu)` | `createRichMenu(richMenuRequest)` | Return type changed from `string` to `RichMenuIdResponse`. |
| `deleteRichMenu(richMenuId)` | `deleteRichMenu(richMenuId)` | Same. |
| `getRichMenuAliasList()` | `getRichMenuAliasList()` | Same. |
| `getRichMenuAlias(richMenuAliasId)` | `getRichMenuAlias(richMenuAliasId)` | Same. |
| `createRichMenuAlias(richMenuId, richMenuAliasId)` | `createRichMenuAlias({ richMenuId, richMenuAliasId })` | Arguments wrapped in a request object. |
| `deleteRichMenuAlias(richMenuAliasId)` | `deleteRichMenuAlias(richMenuAliasId)` | Same. |
| `updateRichMenuAlias(richMenuAliasId, richMenuId)` | `updateRichMenuAlias(richMenuAliasId, { richMenuId })` | 2nd argument wrapped in a request object. |
| `getRichMenuIdOfUser(userId)` | `getRichMenuIdOfUser(userId)` | Return type changed from `string` to `RichMenuIdResponse`. |
| `linkRichMenuToUser(userId, richMenuId)` | `linkRichMenuIdToUser(userId, richMenuId)` | Renamed. |
| `unlinkRichMenuFromUser(userId)` | `unlinkRichMenuIdFromUser(userId)` | Renamed. |
| `linkRichMenuToMultipleUsers(richMenuId, userIds[])` | `linkRichMenuIdToUsers({ richMenuId, userIds })` | Renamed. Arguments wrapped in a request object. |
| `unlinkRichMenusFromMultipleUsers(userIds[])` | `unlinkRichMenuIdFromUsers({ userIds })` | Renamed. Arguments wrapped in a request object. |
| `getRichMenuImage(richMenuId)` | `getRichMenuImage(richMenuId)` | Same. |
| `setRichMenuImage(richMenuId, data, contentType?)` | `setRichMenuImage(richMenuId, body?)` | `body` is now `Blob` (optional) instead of `Buffer \| Readable`. `contentType` removed. |
| `getRichMenuList()` | `getRichMenuList()` | Return type changed from `RichMenuResponse[]` to `RichMenuListResponse`. |
| `setDefaultRichMenu(richMenuId)` | `setDefaultRichMenu(richMenuId)` | Same. |
| `getDefaultRichMenuId()` | `getDefaultRichMenuId()` | Return type changed from `string` to `RichMenuIdResponse`. |
| `deleteDefaultRichMenu()` | `cancelDefaultRichMenu()` | Renamed. |
| `validateRichMenu(richMenu)` | `validateRichMenuObject(richMenu)` | Renamed. |

### Webhook

| Client method | LineBotClient method | Notes |
|---|---|---|
| `setWebhookEndpointUrl(endpoint)` | `setWebhookEndpoint({ endpoint })` | Renamed. Argument wrapped in a request object. |
| `getWebhookEndpointInfo()` | `getWebhookEndpoint()` | Renamed. |
| `testWebhookEndpoint(endpoint?)` | `testWebhookEndpoint({ endpoint }?)` | Argument wrapped in a request object. The entire request object is optional. |

### Link token

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getLinkToken(userId)` | `issueLinkToken(userId)` | Renamed. Return type changed from `string` to `IssueLinkTokenResponse`. |

### Message delivery stats

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getNumberOfSentReplyMessages(date)` | `getNumberOfSentReplyMessages(date)` | Same. |
| `getNumberOfSentPushMessages(date)` | `getNumberOfSentPushMessages(date)` | Same. |
| `getNumberOfSentMulticastMessages(date)` | `getNumberOfSentMulticastMessages(date)` | Same. |
| `getNumberOfSentBroadcastMessages(date)` | `getNumberOfSentBroadcastMessages(date)` | Same. |
| `getNarrowcastProgress(requestId)` | `getNarrowcastProgress(requestId)` | Same. |
| `getTargetLimitForAdditionalMessages()` | `getMessageQuota()` | Renamed. |
| `getNumberOfMessagesSentThisMonth()` | `getMessageQuotaConsumption()` | Renamed. |

### Insight

| Client method | LineBotClient method | Notes |
|---|---|---|
| `getNumberOfMessageDeliveries(date)` | `getNumberOfMessageDeliveries(date)` | Same. |
| `getNumberOfFollowers(date)` | `getNumberOfFollowers(date?)` | `date` is now optional. |
| `getFriendDemographics()` | `getFriendsDemographics()` | Renamed (added `s`). |
| `getUserInteractionStatistics(requestId)` | `getMessageEvent(requestId)` | Renamed. |
| `getStatisticsPerUnit(unit, from, to)` | `getStatisticsPerUnit(unit, from, to)` | Same. |

### Audience

| Client method | LineBotClient method | Notes |
|---|---|---|
| `createUploadAudienceGroup({ description, isIfaAudience?, audiences?, uploadDescription? })` | `createAudienceGroup({ description, isIfaAudience, audiences, uploadDescription })` | Renamed. |
| `createUploadAudienceGroupByFile({ description, isIfaAudience?, uploadDescription?, file })` | `createAudienceForUploadingUserIds(file, description?, isIfaAudience?, uploadDescription?)` | Renamed. `file` type changed from `Buffer \| Readable` to `Blob`. |
| `updateUploadAudienceGroup({ audienceGroupId, description?, uploadDescription?, audiences })` | `addAudienceToAudienceGroup({ audienceGroupId, uploadDescription, audiences })` then, if `description` was used, also call `updateAudienceGroupDescription(audienceGroupId, { description })` | Renamed. `description` requires a separate call. |
| `updateUploadAudienceGroupByFile({ audienceGroupId, uploadDescription?, file })` | `addUserIdsToAudience(file, audienceGroupId?, uploadDescription?)` | Renamed. `file` type changed from `Buffer \| Readable` to `Blob`. |
| `createClickAudienceGroup({ description, requestId, clickUrl? })` | `createClickBasedAudienceGroup({ description, requestId, clickUrl })` | Renamed. |
| `createImpAudienceGroup({ requestId, description })` | `createImpBasedAudienceGroup({ requestId, description })` | Renamed. |
| `setDescriptionAudienceGroup(description, audienceGroupId)` | `updateAudienceGroupDescription(audienceGroupId, { description })` | Renamed. Argument order reversed. `audienceGroupId` type changed from `string` to `number`. |
| `deleteAudienceGroup(audienceGroupId)` | `deleteAudienceGroup(audienceGroupId)` | `audienceGroupId` type changed from `string` to `number`. |
| `getAudienceGroup(audienceGroupId)` | `getAudienceData(audienceGroupId)` | Renamed. `audienceGroupId` type changed from `string` to `number`. |
| `getAudienceGroups(page, description?, status?, size?, createRoute?, includesExternalPublicGroups?)` | `getAudienceGroups(page, description?, status?, size?, includesExternalPublicGroups?, createRoute?)` | Last two arguments swapped. |
| `getAudienceGroupAuthorityLevel()` | deleted | No equivalent in current API. |
| `changeAudienceGroupAuthorityLevel(authorityLevel)` | deleted | No equivalent in current API. |

---

## Method mapping: OAuth → channelAccessToken.ChannelAccessTokenClient

`OAuth` methods are not on `LineBotClient`. They live on `channelAccessToken.ChannelAccessTokenClient`,
which is constructed without a channel access token:

```js
const { channelAccessToken } = require('@line/bot-sdk');
const oauthClient = new channelAccessToken.ChannelAccessTokenClient();
```

| OAuth method | ChannelAccessTokenClient method | Notes |
|---|---|---|
| `issueAccessToken(client_id, client_secret)` | `issueChannelToken('client_credentials', client_id, client_secret)` | Renamed. `grant_type` is now an explicit argument. |
| `revokeAccessToken(access_token)` | `revokeChannelToken(access_token)` | Renamed. |
| `verifyAccessToken(access_token)` | `verifyChannelTokenByJWT(access_token)` | Renamed. Verifies a v2.1 (JWT-issued) channel access token. |
| `verifyIdToken(id_token, client_id, nonce?, user_id?)` | deleted | No direct equivalent. |
| `issueChannelAccessTokenV2_1(client_assertion)` | `issueChannelTokenByJWT('client_credentials', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer', client_assertion)` | Renamed. `grant_type` and `client_assertion_type` are now explicit arguments. |
| `getChannelAccessTokenKeyIdsV2_1(client_assertion)` | `getsAllValidChannelAccessTokenKeyIds('urn:ietf:params:oauth:client-assertion-type:jwt-bearer', client_assertion)` | Renamed. `client_assertion_type` is now an explicit argument. |
| `revokeChannelAccessTokenV2_1(client_id, client_secret, access_token)` | `revokeChannelTokenByJWT(client_id, client_secret, access_token)` | Renamed. |

---

## Type mapping

All types in `lib/types.ts` are deprecated. Use the generated types from the
sub-namespaces exported by `@line/bot-sdk`.

### Config types

| Old type | New type | Notes |
|---|---|---|
| `ClientConfig` | `LineBotClientConfig` | From `@line/bot-sdk` |
| `MiddlewareConfig` | `MiddlewareConfig` | Unchanged. No longer extends `Config`; only `channelSecret` is needed. |

### Webhook event types

| Old type | New type | Notes |
|---|---|---|
| `WebhookRequestBody` | `webhook.CallbackRequest` | From `@line/bot-sdk` |
| `WebhookEvent` | `webhook.Event` | From `@line/bot-sdk` |
| `EventBase` | `webhook.EventBase` | From `@line/bot-sdk` |
| `EventSource` | `webhook.Source` | From `@line/bot-sdk` |
| `User` _(source)_ | `webhook.UserSource` | From `@line/bot-sdk` |
| `Group` _(source)_ | `webhook.GroupSource` | From `@line/bot-sdk` |
| `Room` _(source)_ | `webhook.RoomSource` | From `@line/bot-sdk` |
| `DeliveryContext` | `webhook.DeliveryContext` | From `@line/bot-sdk` |
| `MessageEvent` | `webhook.MessageEvent` | From `@line/bot-sdk` |
| `UnsendEvent` | `webhook.UnsendEvent` | From `@line/bot-sdk` |
| `FollowEvent` | `webhook.FollowEvent` | From `@line/bot-sdk` |
| `UnfollowEvent` | `webhook.UnfollowEvent` | From `@line/bot-sdk` |
| `JoinEvent` | `webhook.JoinEvent` | From `@line/bot-sdk` |
| `LeaveEvent` | `webhook.LeaveEvent` | From `@line/bot-sdk` |
| `MemberJoinEvent` | `webhook.MemberJoinedEvent` | Renamed (added `d`). |
| `MemberLeaveEvent` | `webhook.MemberLeftEvent` | Renamed. |
| `PostbackEvent` | `webhook.PostbackEvent` | From `@line/bot-sdk` |
| `VideoPlayCompleteEvent` | `webhook.VideoPlayCompleteEvent` | From `@line/bot-sdk` |
| `BeaconEvent` | `webhook.BeaconEvent` | From `@line/bot-sdk` |
| `AccountLinkEvent` | `webhook.AccountLinkEvent` | From `@line/bot-sdk` |
| `DeliveryEvent` | `webhook.PnpDeliveryCompletionEvent` | Renamed. |

### Webhook message content types

| Old type | New type | Notes |
|---|---|---|
| `EventMessage` | `webhook.MessageContent` | Renamed. |
| `TextEventMessage` | `webhook.TextMessageContent` | Renamed. |
| `ImageEventMessage` | `webhook.ImageMessageContent` | Renamed. |
| `VideoEventMessage` | `webhook.VideoMessageContent` | Renamed. |
| `AudioEventMessage` | `webhook.AudioMessageContent` | Renamed. |
| `FileEventMessage` | `webhook.FileMessageContent` | Renamed. |
| `LocationEventMessage` | `webhook.LocationMessageContent` | Renamed. |
| `StickerEventMessage` | `webhook.StickerMessageContent` | Renamed. |
| `ContentProvider` | `webhook.ContentProvider` | From `@line/bot-sdk` |
| `Postback` | `webhook.PostbackContent` | Renamed. |

### Outbound message types

| Old type | New type | Notes |
|---|---|---|
| `Message` | `messagingApi.Message` | From `@line/bot-sdk` |
| `TextMessage` | `messagingApi.TextMessage` | From `@line/bot-sdk` |
| `ImageMessage` | `messagingApi.ImageMessage` | From `@line/bot-sdk` |
| `VideoMessage` | `messagingApi.VideoMessage` | From `@line/bot-sdk` |
| `AudioMessage` | `messagingApi.AudioMessage` | From `@line/bot-sdk` |
| `LocationMessage` | `messagingApi.LocationMessage` | From `@line/bot-sdk` |
| `StickerMessage` | `messagingApi.StickerMessage` | From `@line/bot-sdk` |
| `ImageMapMessage` | `messagingApi.ImagemapMessage` | Renamed (lowercase `m`). |
| `TemplateMessage` | `messagingApi.TemplateMessage` | From `@line/bot-sdk` |
| `FlexMessage` | `messagingApi.FlexMessage` | From `@line/bot-sdk` |
| `ImageMapAction` | `messagingApi.ImagemapAction` | Renamed (lowercase `m`). |
| `ImageMapURIAction` | `messagingApi.URIImagemapAction` | Renamed. |
| `ImageMapMessageAction` | `messagingApi.MessageImagemapAction` | Renamed. |
| `Area` | `messagingApi.ImagemapArea` | Renamed. |

### Flex types

| Old type | New type | Notes |
|---|---|---|
| `FlexContainer` | `messagingApi.FlexContainer` | From `@line/bot-sdk` |
| `FlexBubble` | `messagingApi.FlexBubble` | From `@line/bot-sdk` |
| `FlexBubbleStyle` | `messagingApi.FlexBubbleStyles` | Renamed (added `s`). |
| `FlexBlockStyle` | `messagingApi.FlexBlockStyle` | From `@line/bot-sdk` |
| `FlexCarousel` | `messagingApi.FlexCarousel` | From `@line/bot-sdk` |
| `FlexComponent` | `messagingApi.FlexComponent` | From `@line/bot-sdk` |
| `FlexBox` | `messagingApi.FlexBox` | From `@line/bot-sdk` |
| `Offset` | _(no direct equivalent)_ | Fields (`position`, `offsetTop`, `offsetBottom`, `offsetStart`, `offsetEnd`) are now inlined into each Flex component type (e.g. `messagingApi.FlexBox`). `messagingApi.FlexOffset` is an unrelated string union for sizing keywords. |
| `Background` | `messagingApi.FlexBoxBackground` | Renamed. |
| `FlexButton` | `messagingApi.FlexButton` | From `@line/bot-sdk` |
| `FlexFiller` | `messagingApi.FlexFiller` | From `@line/bot-sdk` |
| `FlexIcon` | `messagingApi.FlexIcon` | From `@line/bot-sdk` |
| `FlexImage` | `messagingApi.FlexImage` | From `@line/bot-sdk` |
| `FlexVideo` | `messagingApi.FlexVideo` | From `@line/bot-sdk` |
| `FlexSeparator` | `messagingApi.FlexSeparator` | From `@line/bot-sdk` |
| `FlexText` | `messagingApi.FlexText` | From `@line/bot-sdk` |
| `FlexSpan` | `messagingApi.FlexSpan` | From `@line/bot-sdk` |

### Template types

| Old type | New type | Notes |
|---|---|---|
| `TemplateContent` | `messagingApi.Template` | Renamed. |
| `TemplateButtons` | `messagingApi.ButtonsTemplate` | Renamed. |
| `TemplateConfirm` | `messagingApi.ConfirmTemplate` | Renamed. |
| `TemplateCarousel` | `messagingApi.CarouselTemplate` | Renamed. |
| `TemplateColumn` | `messagingApi.CarouselColumn` | Renamed. |
| `TemplateImageCarousel` | `messagingApi.ImageCarouselTemplate` | Renamed. |
| `TemplateImageColumn` | `messagingApi.ImageCarouselColumn` | Renamed. |

### Action / quick reply types

| Old type | New type | Notes |
|---|---|---|
| `QuickReply` | `messagingApi.QuickReply` | From `@line/bot-sdk` |
| `QuickReplyItem` | `messagingApi.QuickReplyItem` | From `@line/bot-sdk` |
| `Sender` | `messagingApi.Sender` | From `@line/bot-sdk` |
| `Action` | `messagingApi.Action` | From `@line/bot-sdk` |
| `PostbackAction` | `messagingApi.PostbackAction` | From `@line/bot-sdk` |
| `MessageAction` | `messagingApi.MessageAction` | From `@line/bot-sdk` |
| `URIAction` | `messagingApi.URIAction` | From `@line/bot-sdk` |
| `AltURI` | `messagingApi.AltUri` | Renamed (lowercase `ri`). |
| `DatetimePickerAction` | `messagingApi.DatetimePickerAction` | From `@line/bot-sdk` |
| `RichMenuSwitchAction` | `messagingApi.RichMenuSwitchAction` | From `@line/bot-sdk` |

### Rich menu types

| Old type | New type | Notes |
|---|---|---|
| `Size` | `messagingApi.RichMenuSize` | Renamed. |
| `RichMenu` | `messagingApi.RichMenuRequest` | Renamed. |
| `RichMenuResponse` | `messagingApi.RichMenuResponse` | From `@line/bot-sdk` |
| `GetRichMenuAliasResponse` | `messagingApi.RichMenuAliasResponse` | Renamed. |
| `GetRichMenuAliasListResponse` | `messagingApi.RichMenuAliasListResponse` | Renamed. |

### Response / stats types

| Old type | New type | Notes |
|---|---|---|
| `Profile` | `messagingApi.UserProfileResponse` | Renamed. |
| `BotInfoResponse` | `messagingApi.BotInfoResponse` | From `@line/bot-sdk` |
| `GroupSummaryResponse` | `messagingApi.GroupSummaryResponse` | From `@line/bot-sdk` |
| `MembersCountResponse` | `messagingApi.GroupMemberCountResponse` or `messagingApi.RoomMemberCountResponse` | Split into two types. |
| `WebhookEndpointInfoResponse` | `messagingApi.GetWebhookEndpointResponse` | Renamed. |
| `TestWebhookEndpointResponse` | `messagingApi.TestWebhookEndpointResponse` | From `@line/bot-sdk` |
| `TargetLimitForAdditionalMessages` | `messagingApi.MessageQuotaResponse` | Renamed. |
| `NumberOfMessagesSentThisMonth` | `messagingApi.QuotaConsumptionResponse` | Renamed. |
| `NumberOfMessagesSentResponse` | `messagingApi.NumberOfMessagesResponse` | Renamed. |
| `NarrowcastProgressResponse` | `messagingApi.NarrowcastProgressResponse` | From `@line/bot-sdk` |

### Insight types

| Old type | New type | Notes |
|---|---|---|
| `NumberOfMessageDeliveries` | `insight.GetNumberOfMessageDeliveriesResponse` | Renamed. |
| `NumberOfFollowers` | `insight.GetNumberOfFollowersResponse` | Renamed. |
| `NumberOfMessageDeliveriesResponse` | `insight.GetNumberOfMessageDeliveriesResponse` | Renamed. |
| `NumberOfFollowersResponse` | `insight.GetNumberOfFollowersResponse` | Renamed. |
| `FriendDemographics` | `insight.GetFriendsDemographicsResponse` | Renamed. |
| `UserInteractionStatistics` | `insight.GetMessageEventResponse` | Renamed. |
| `StatisticsPerUnit` | `insight.GetStatisticsPerUnitResponse` | Renamed. |

### Audience types

| Old type | New type | Notes |
|---|---|---|
| `AudienceGroupStatus` | `manageAudience.AudienceGroupStatus` | From `@line/bot-sdk` |
| `AudienceGroupCreateRoute` | `manageAudience.AudienceGroupCreateRoute` | From `@line/bot-sdk` |
| `AudienceGroup` | `manageAudience.AudienceGroup` | From `@line/bot-sdk` |
| `AudienceGroups` | `manageAudience.AudienceGroup[]` | No longer a named type. |
| `AudienceGroupAuthorityLevel` | deleted | No equivalent in current API. |

### Channel access token types

| Old type | New type | Notes |
|---|---|---|
| `ChannelAccessToken` | No single equivalent. See below. | Shape depends on which method was called. |
| `VerifyAccessToken` | `channelAccessToken.VerifyChannelAccessTokenResponse` | Renamed. |
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
| `HTTPError` | `HTTPFetchError` | Different properties; see [error handling](#error-handling). |
| `RequestError` | _(no equivalent)_ | Axios network/connection error. `LineBotClient` does not wrap these; native `fetch()` throws a `TypeError` instead. |
| `ReadError` | _(no equivalent)_ | Axios read error. `LineBotClient` does not wrap these; native `fetch()` errors propagate unwrapped. |
| `SignatureValidationFailed` | `SignatureValidationFailed` | Unchanged. |
| `JSONParseError` | `JSONParseError` | Unchanged. |
