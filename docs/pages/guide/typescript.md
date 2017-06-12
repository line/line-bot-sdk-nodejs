# TypeScript

[TypeScript](https://www.typescriptlang.org/) is a statically typed language
that compiled to plain JavaScript. As you may already have found, This library
is written in TypeScript.

When installed via npm, the built JavaScript files are already included and
you do not need to worry about TypeScript, but it may be nice to consider
using TypeScript for implement what you need.

## What's good about using TypeScript

It provides a default type set for mostly used objects in webhook and client
and prevent possible typo and mistakes.

``` typescript
const config = {
  channelAccessTokne: "", // typo Tokne
  channelSecret: "",
}

const c = new Client(config) // will throw a compile error
```

Also, when building a complex message object, you can make use of types for
its fields.

``` typescript
const message: Line.TemplateMessage = {
  type: "template",
  altText: "cannot display template message",
  template: {
    type: "carousel",
    columns: [ {
      text: "col1",
      title: "Column 1",
      actions: [ {
        type: "message",
        label: "send message",
        text: "hi, there",
      } ],
    } ],
  },
}
```

The object above will be type-checked to have the type of
`Line.TemplateMessage`, and thus ensured not to miss any required field.

Also, [literal type](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
is used for `type` fields, which means the compiler will complain if a wrong
type string is used, and also inference the type of objects by its `type` field.

## How to use

The library is built to just-work with TypeScript too, so import the library and
there you go.

``` typescript
import { Client, validateSignature, middleware } from "@line/bot-sdk";
```

Webhook event and message object types are defined in the `Line` namespace, e.g.
`Line.WebhookEvent` or `Line.Message`. For declarations of the types, please
refer to [global.d.ts](https://github.com/line/line-bot-sdk-nodejs/blob/master/types/global.d.ts).
