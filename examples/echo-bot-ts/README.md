# LINE Echo Bot with TypeScript

An example LINE bot to echo message with TypeScript. The bot is coded according to TypeScript's best practices.

## Prerequisite

- Git
- Node.js version 10 and up
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
npm run build-sdk
npm install
```

- Configure all the environment variables.

```bash
export CHANNEL_ACCESS_TOKEN=<YOUR_CHANNEL_ACCESS_TOKEN>
export CHANNEL_SECRET=<YOUR_CHANNEL_SECRET>
export PORT=<YOUR_PORT>
```

- Set up your webhook URL in your LINE Official Account to be in the following format. Don't forget to disable the greeting messages and auto-response messages for convenience.

```bash
https://example.com/callback
```

- Compile the TypeScript files.

```bash
npm run build
```

- Run the application.

```bash
npm start
```

