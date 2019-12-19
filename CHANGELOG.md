## 6.8.4 (19 Dec 2019)

### Bug fix

* Fix typo in type of FriendDemographics (#177)
* Add label property to ImageMapAction type (#187)

### Feature

* Change data api's domain to api-data.line.me (#178)
* Add getUserInteractionStatistics API (#183)
* Add new properties in webhook types (#182)

### Misc

* Rewrite test in nock (#179)
* Update dependencies (#180)

## 6.8.3 (05 Nov 2019)

### Bug fix

* Add exception handler in middleware (#153)

### Feature

* Flex Message Update 1 (#173)
* Support friend statistics API (#161)

### Misc

* Update dependencies (#174)

## 6.8.2 (08 Aug 2019)

### Bug fix

* Fix LINEThings Scenario Execution Event Types (#158)

## 6.8.1 (29 Jul 2019)

### Bug fix

* Fix a type wrong in Template Message (#163)

### Feature
* Get `X-LINE-Request-Id` by using `responseData['x-line-request-id']` (#151 #157)

## 6.8.0 (25 Jun 2019)

### Feature

* Add new parameter in push/reply/multicast/broadcast API to catch up the newest bot API (#147)
* Add new APIs in bot API (#147)
  - Get the target limit for additional messages
  - Get number of messages sent this month
  - Get number of sent broadcast messages
  - Send broadcast message

### Breaking changes
* Deprecate Node 6 and start to support Node 12 (#139)
* Remove polyfills for Node 6 (#149)

### Type

* Add LINE Things Event (#150)

### Misc
* Update axios and other dependencies by running `npm audit fix` to fix vulnerabilities. (#148 #154)

## 6.7.0 (18 Apr 2019)

### Feature

* Add alt URL field to URI action (#135)
* Implement (un)linkRichMenuToMultipleUsers (#135)

### Type

* Fix typo in a type (#124)


## 6.6.0 (4 Mar 2019)

### Feature

* Add DeviceLinkEvent / DeviceUnlinkEvent (#123)

### Type

* Fix FlexSpacer to have optional 'size' property (#122)

### Misc

* Run `npm audit fix` to fix minor dependency vulnerability.


## 6.5.0 (16 Feb 2019)

### Feature

* Add APIs to get number of sent messages (#116)
* Add account link event (#117)

### Misc

* Fix a typo in doc (#119)


## 6.4.0 (19 Nov 2018)

### Feature

* Add `getLinkToken` API (#96)
* Handle `req.rawBody` in Google Cloud Functions (#101)
* [Kitchensink] Add ngrok functionality (#99)

### Type

* Add types for video in imagemap message (#100)
* Add `contentProvider` fields to content messages (#103)
* Add `destination` field to webhook request body (#102)
* Add `MemberJoinEvent` and `MemberLeaveEvent` types (#107)

### Misc

* Don't include doc in released source
* Upgrade TypeScript to 3.1.6 (#94)
* Refactoring (#94, #98, #99)
* Remove webhook-tester tool


## 6.3.0 (21 Sep 2018)

### Feature

* Add default rich menu APIs (#87)

### Type

* Add missing `defaultAction` field to `TemplateColumn`

### Misc

* Use VuePress as documentation engine (#85)
* Upgrade minimum supported Node.js version to 6


## 6.2.1 (16 Aug 2018)

### Misc

* Remove gitbook-cli from dev dependencies


## 6.2.0 (15 Aug 2018)

#### Type

* Add QuickReply types (#83)
* Format type comments

#### Misc

* Upgrade TypeScript to 3


## 6.1.1 (14 Aug 2018)

#### Type

* Update FlexMessage types (#81)

#### Misc

* Add test coverage (#78)
* Add JSDoc comments (#80)


## 6.1.0 (19 June 2018)

#### Type

* Add types for flex message (#74)
* Simplify type definition for `Action`


## 6.0.3 (18 June 2018)

#### Misc

* Move get-audio-duration dep to proper package.json (#73)
* Vulnerability fix with `npm audit fix`


## 6.0.2 (21 May 2018)

#### Type

* Add missing `displayText` field to postback action (#63)
* Add missing `FileEventMessage` to `EventMessage` (#71)

#### Misc

* Add audio duration lib to kitchensink example (#68)


## 6.0.1 (13 Mar 2018)

#### Type

* Fix misimplemented 'AudioMessage' type (#61)


## 6.0.0 (27 Feb 2018)

#### Major

* Fix misimplemented 'unlinkRichMenuFromUser' API

#### Type

* Fix TemplateColumn type definition (#48)

#### Misc

* Update GitHub issue template (#43)
* Add Code of Conduct (#50)
* Catch errors properly in examples (#52)


## 5.2.0 (11 Dec 2017)

#### Minor

* Set Content-Length manually for postBinary (#42)


## 5.1.0 (7 Dec 2017)

#### Minor

* Add new fields (#39)

#### Misc

* Fix Windows build (#38)
* Add start scripts and webhook info to examples


## 5.0.1 (14 Nov 2017)

#### Minor

* Fix typo in `ImageMapMessage` type
* Add kitchensink example (#36)


## 5.0.0 (2 Nov 2017)

#### Major

* Implement rich menu API (#34)

#### Type

* Rename `ImageMapArea` and `TemplateAction`s into general ones

#### Misc

* Do not enforce `checkJSON` for some APIs where it means nothing
* Change how to check request object in test cases


## 4.0.0 (25 Oct 2017)

#### Major

* Make index script export exceptions and types (#31)

#### Type

* Simplify config types for client and middleware (#31)

#### Misc

* Fix information and links in doc
* Use Prettier instead of TSLint (#30)
* Install git hooks for precommit and prepush (#30)


## 3.1.1 (19 Sep 2017)

#### Type

* Fix type of postback.params


## 3.1.0 (19 Sep 2017)

#### Major

* Make middleware return `SignatureValidationFailed` for no signature (#26)

#### Type

* Add `FileEventMessage` type


## 3.0.0 (8 Sep 2017)

#### Major

* Implement "Get group/room member profile" API (#15)
* Implement "Get group/room member IDs" API (#23)
* `getMessageContent` now returns `Promise<ReadableStream>` (#20)

#### Type

* Add "datetimepicker" support (#21)
* Fix typo in `TemplateURIAction` type (#21)

#### Misc

* Package updates and corresponding fixes
* Use npm 5 instead of Yarn in dev
* Fix `clean` script to work in Windows
* Use "axios" for internal HTTP client instead of "got" (#20)


## 2.0.0 (12 June 2017)

#### Type

* Use literal types for 'type' fields

#### Misc

* Update yarn.lock with the latest Yarn


## 1.1.0 (31 May 2017)

* Handle pre-parsed body (string and buffer only)

#### Type

* Separate config type into client and middleware types
* Add `userId` to group and room event sources

#### Misc

* Create issue template (#4)


## 1.0.0 (11 May 2017)

* Initial release
