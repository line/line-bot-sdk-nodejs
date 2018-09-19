module.exports = {
  base: "/line-bot-sdk-nodejs/",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }]
  ],
  title: "line-bot-sdk-nodejs",
  description: "Node.js SDK for LINE Messaging API",
  themeConfig: {
    nav: [
      {
        text: "Introduction",
        link: "/"
      },
      {
        text: "Getting Started",
        link: "/getting-started"
      },
      {
        text: "Guide",
        link: "/guide"
      },
      {
        text: "API Reference",
        link: "/api-reference"

      },
      {
        text: "Contributing",
        link: "/CONTRIBUTING"
      },
      {
        text: "LINE Developers",
        link: "https://developers.line.me/en/"
      },
      {
        text: "GitHub",
        link: "https://github.com/line/line-bot-sdk-nodejs/"
      },
    ],
    sidebar: [
      {
        title: "Introduction",
        collapsable: false,
        children: [
          "",
        ]
      },
      {
        title: "Getting Started",
        collapsable: false,
        children: [
          "/getting-started/requirements",
          "/getting-started/install",
          "/getting-started/basic-usage",
        ]
      },
      {
        title: "Guide",
        collapsable: false,
        children: [
          "/guide/webhook",
          "/guide/client",
          "/guide/typescript",
        ]
      },
      {
        title: "API Reference",
        collapsable: false,
        children: [
          "/api-reference/client",
          "/api-reference/validate-signature",
          "/api-reference/middleware",
          "/api-reference/exceptions",
          "/api-reference/message-and-event-objects",
        ]
      },
      {
        title: "Contributing",
        collapsable: false,
        children: [
          "/CONTRIBUTING",
        ]
      },
    ]
  }
}
