# rich menu

[Using rich menus](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/)

## How to use

### Install deps

``` shell
$ npm install
```

### Configuration

``` shell
$ export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
$ export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
```

### Run

``` shell
$ node .
```

## Using a local build of `@line/bot-sdk`

When developing the SDK in this repository, run `npm run build-sdk` after `npm install` to test the example
against your unreleased local SDK changes instead of the published package from npm:

``` shell
$ npm install
$ npm run build-sdk
```

Without `build-sdk`, the published package from npm is used.
