# LINE Echo Bot with TypeScript

An example LINE bot to echo message with TypeScript. The bot is coded according to TypeScript's best practices.

## Prerequisite

- Git
- Node.js version 10 and up
- Heroku CLI (optional)
- LINE Developers Account for the bot

## Installation

- Clone the repository.

```bash
git clone https://github.com/line/line-bot-sdk-nodejs.git
```

- Change directory to the example.

```bash
cd line-bot-sdk-nodejs/examples/echo-bot-ts
```

- Install all dependencies.

```bash
npm install
```

- Configure all of the environment variables.

```bash
export CHANNEL_ACCESS_TOKEN=<YOUR_CHANNEL_ACCESS_TOKEN>
export CHANNEL_SECRET=<YOUR_CHANNEL_SECRET>
export PORT=<YOUR_PORT>
```

- Setup your webhook URL in your LINE Official Account to be in the following format. Don't forget to disable the greeting messages and auto-response messages for convenience.

```bash
https://example-url.com/webhook
```

- Compile the TypeScript files.

```bash
npm run build
```

- Run the application.

```bash
npm start
```

## Alternative Installation

If you want to deploy it via Heroku, it is also possible and is even easier for testing purposes.

- Clone the repository.

```bash
git clone https://github.com/line/line-bot-sdk-nodejs.git
```

- Change directory to the example.

```bash
cd line-bot-sdk-nodejs/examples/echo-bot-ts
```

- Create a Heroku application.

```bash
git init
heroku create <YOUR_APP_NAME> # Do not specify for a random name
```

- Setup the environment variables, and don't forget to setup your webhook URL (from the Heroku application that you have just created) in your LINE Offical Account. The webhook URL will still accept the following format: `https://example-url.com.herokuapp.com/webhook`.

```bash
heroku config:set CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
heroku config:set CHANNEL_SECRET=YOUR_CHANNEL_SECRET
```

- Push the application to the server.

```bash
git add .
git commit -m "Initial commit for Heroku testing"
git push heroku master
```

- Open your application.

```bash
heroku open
```

- Done!
