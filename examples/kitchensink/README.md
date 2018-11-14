# Kitchen Sink Bot

A kitchen-sink LINE bot example

## Requirements

Install npm dependencies:

```bash
npm run build-sdk # build SDK installed from local directory
npm install
```

Also, FFmpeg and ImageMagick should be installed to test image and video
echoing.

### About local dependencies

Currently, [`@line/bot-sdk`](package.json) is installed from local directory.

```json
{
  "@line/bot-sdk": "../../"
}
```

To install `@line/bot-sdk` from npm, please update the line with the following:

```json
{
  "@line/bot-sdk": "*"
}
```

In the case, `npm run build-sdk` needn't be run before `npm install`.

## Configuration

Configuration can be done via environment variables.

```bash
export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
export BASE_URL=https://your.base.url # for static file serving
export PORT=1234
```

The code above is an example of Bash. It may differ in other shells.

## Run webhook server

```bash
npm start
```

With the configuration above, the webhook listens on `https://your.base.url:1234/callback`.

## ngrok usage

[ngrok](https://ngrok.com/) tunnels extenral requests to localhost, helps
debugging local webhooks.

This example includes ngrok inside, and it just works if no `BASE_URL` is
set. Make sure that other configurations are set correctly.

```
❯ npm start

...

It seems that BASE_URL is not set. Connecting to ngrok...
listening on https://ffffffff.ngrok.io/callback
```

The URL can be directly registered as the webhook URL in LINE Developers
console.
