# Kitchen Sink Bot

A kitchen-sink LINE bot example

## Requirements

Install npm dependencies:

```bash
npm install
```

Also, FFmpeg and ImageMagick should be installed to test image and video
echoing.

### Use local SDK (optional)

If you want to test the local SDK from this repository (`../../`), run:

```bash
npm run build-sdk
```

## Configuration

Configuration can be done via environment variables.

```bash
export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
export BASE_URL=https://your.base.url # for static file serving
export PORT=1234
# Optional: open an ngrok tunnel only when explicitly enabled
export ENABLE_NGROK_TUNNEL=1
export NGROK_AUTHTOKEN=YOUR_NGROK_AUTHTOKEN
```

The code above is an example of Bash. It may differ in other shells.

## Run webhook server

```bash
npm start
```

With the configuration above, the webhook listens on
`https://your.base.url/callback`.

## ngrok usage

[ngrok](https://ngrok.com/) tunnels external requests to localhost, helps
debugging local webhooks.

This example does not open ngrok by default. To use ngrok, set
`ENABLE_NGROK_TUNNEL=1` and leave `BASE_URL` unset.

```
❯ npm start

...

BASE_URL is not set. ENABLE_NGROK_TUNNEL=1, opening an ngrok tunnel...
listening on https://ffffffff.ngrok.io/callback
```

The URL can be directly registered as the webhook URL in LINE Developers
console.
