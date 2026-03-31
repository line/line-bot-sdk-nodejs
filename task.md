PR #1562 を「論点ごとに検証してから修正する」方式で進めてください。まとめて直さないでください。

対象
- PR: #1562
- base branch: unified-client
- head branch: deprecated-and-add-how-to-migrate

作業の原則
- 1回につき 1 issue だけ扱う。
- 必ず「検証 → 判定 → 最小修正 → 再検証」の順で進める。
- 他の issue にまたがる変更はしない。見つけたら Residual concerns に書いて止まる。
- generated file は編集しない。
- 推測で書かない。必ず実コードと実型を確認する。
- メソッド名だけで判断しない。constructor 要件、delegate 構成、endpoint、request shape、response shape を確認する。
- docs/guide/migration.md と deprecated JSDoc は「確認対象」であって「ソースオブトゥルース」ではない。
- 変更は最小差分にする。
- 例コードは、最終的に generated types に照らして妥当であることを確認する。
- issue 完了ごとに停止し、次の issue へは進まない。

ソースオブトゥルース
- 新APIの事実確認:
  - lib/*/api/*.ts
  - lib/*/model/*.ts
  - lib/line-bot-client.generated.ts
  - lib/line-bot-client.factory.generated.ts
  - docs/guide/client.md
- 旧APIの事実確認:
  - lib/client.ts
  - lib/types.ts
  - lib/http-axios.ts
  - lib/exceptions.ts
- fetch / axios エラーの確認:
  - lib/http-fetch.ts
  - lib/http-axios.ts
  - lib/exceptions.ts

各 issue の報告フォーマット
1. Verdict: valid / invalid / partially valid
2. Evidence
  - legacy side:
  - new side:
  - conflicting doc / JSDoc:
3. Why it matters
4. Minimal fix
5. Files edited
6. Verification
7. Residual concerns
8. STOP

まずは Issue #1 だけ処理してください。

Issue #1
- Verify whether OAuth migration should point to LineBotClient or to channelAccessToken.ChannelAccessTokenClient.
- Check docs/guide/migration.md Step 2 and the OAuth mapping table.
- Check lib/client.ts deprecated JSDoc for OAuth methods.
- Check docs/guide/client.md, lib/line-bot-client.factory.generated.ts, lib/line-bot-client.generated.ts, and channel-access-token client files to determine the actual architecture.
- Acceptance criteria:
  - If LineBotClient does not actually include channel access token delegates and requires a channel access token to construct, rewrite the migration guide and OAuth JSDoc to use channelAccessToken.ChannelAccessTokenClient where appropriate.
  - Do not change unrelated mappings.


## task 2
前回と同じプロトコルを維持して、Issue #2 だけ処理してください。

Issue #2
- Verify the exact mapping for OAuth.verifyAccessToken(access_token).
- Compare the legacy endpoint in lib/client.ts with the new methods in lib/channel-access-token/api/channelAccessTokenClient.ts.
- Decide whether the correct migration target is verifyChannelToken(accessToken) or verifyChannelTokenByJWT(accessToken).
- Update docs/guide/migration.md and OAuth JSDoc only if the code evidence supports it.
- Acceptance criteria:
  - The mapping must match endpoint semantics, not just a similar response type.
  - Do not edit unrelated OAuth mappings.

## task 3
前回と同じプロトコルを維持して、Issue #3 だけ処理してください。

Issue #3
- Verify webhook request object shapes.
- Compare docs/guide/migration.md and Client JSDoc with:
  - lib/messaging-api/model/setWebhookEndpointRequest.ts
  - lib/messaging-api/model/testWebhookEndpointRequest.ts
  - lib/messaging-api/api/messagingApiClient.ts
- Fix any guidance that uses the wrong request property name.
- Acceptance criteria:
  - All examples must match the actual generated request types.
  - The final examples should compile type-wise against the new API surface.

## task 4
前回と同じプロトコルを維持して、Issue #4 だけ処理してください。

Issue #4
- Verify whether legacy updateUploadAudienceGroup({ audienceGroupId, description?, uploadDescription?, audiences }) has a true 1:1 replacement.
- Compare:
  - legacy method signature in lib/client.ts
  - AddAudienceToAudienceGroupRequest
  - updateAudienceGroupDescription(...)
  - any related audience docs / generated methods
- Acceptance criteria:
  - If description cannot be preserved in the same call, the migration guide must explicitly document the extra step.
  - Do not silently drop legacy capability.

## task 5
前回と同じプロトコルを維持して、Issue #5 だけ処理してください。

Issue #5
- Verify whether old type ChannelAccessToken has a single direct replacement.
- Compare:
  - old shape in lib/types.ts
  - IssueShortLivedChannelAccessTokenResponse
  - IssueChannelAccessTokenResponse
  - IssueStatelessChannelAccessTokenResponse
  - the legacy OAuth methods that return ChannelAccessToken
- Acceptance criteria:
  - Do not map ChannelAccessToken to IssueStatelessChannelAccessTokenResponse unless the shapes and producers actually match.
  - If there is no single direct equivalent, document that clearly and give endpoint-specific replacements.


## task 6
前回と同じプロトコルを維持して、Issue #6 だけ処理してください。

Issue #6
- Audit error guidance very carefully before editing.
- Verify actual throw sites in:
  - lib/http-fetch.ts
  - lib/http-axios.ts
  - lib/exceptions.ts
  - docs/guide/client.md
  - docs/guide/migration.md
- Distinguish these cases explicitly:
  1) legacy Client / OAuth (axios) errors that are still thrown today
  2) LineBotClient fetch behavior for non-2xx responses
  3) fetch transport / read failures that are not wrapped into HTTPFetchError
- Do not delete legacy classes in this PR.
- Acceptance criteria:
  - The docs must not claim RequestError / ReadError are impossible globally while legacy Client / OAuth still exist.
  - The docs must not map network/read failures to HTTPFetchError unless the code proves that mapping.
  - If needed, reword deprecation guidance as “legacy-client-only” rather than “replace 1:1 with HTTPFetchError”.

