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
