# Echo Bot (CommonJS)

An example LINE bot just to echo messages written in CommonJS.

## How to use

### Install deps

``` shell
$ npm install
```

### Use local SDK (optional)

If you want to test the local SDK at `../../` while working in this repository:

``` shell
$ npm run build-sdk
```

### Configuration

``` shell
$ export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
$ export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
$ export PORT=1234
```

### Run

``` shell
$ node .
```

## Webhook URL

```
https://your.base.url/callback
```
