# Kitchen Sink Bot

A kitchen-sink LINE bot example

## How to use

### Install deps

``` shell
npm install
```

Also, FFmpeg and ImageMagick should be installed to test image and video
echoing.

### Configuration

``` shell
export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
export BASE_URL=https://your.base.url # for static file serving
export PORT=1234
```

## Run

``` shell
node .
```

## Webhook URL

```
https://your.base.url/callback
```
