# Kitchen Sink Bot

A kitchen-sink LINE bot example

## Requirements

Install npm dependencies:

```bash
npm install
```

Also, FFmpeg and ImageMagick should be installed to test image and video
echoing.

### Using a local build of `@line/bot-sdk`

When developing the SDK in this repository, run `npm run build-sdk` after `npm install` to test the example
against your unreleased local SDK changes instead of the published package from npm:

```bash
npm install
npm run build-sdk
```

Without `build-sdk`, the published package from npm is used.

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
