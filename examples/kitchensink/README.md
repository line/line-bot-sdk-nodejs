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
export BASE_URL=https://your.base.url # required; public URL where this server is reachable
export PORT=1234
```

The code above is an example of Bash. It may differ in other shells.

## Run webhook server

```bash
npm start
```

With the configuration above, the webhook listens on `https://your.base.url:1234/callback`.

## Exposing a local server

LINE delivers webhook events over HTTPS, so the server must be reachable from
the internet. When developing locally, run a tunneling service of your choice
(for example [ngrok](https://ngrok.com/)) yourself, then set `BASE_URL` to the
public URL it gives you and register that URL as the webhook URL in the LINE
Developers console.
