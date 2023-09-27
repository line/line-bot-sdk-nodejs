import {defaultTheme} from 'vuepress'

export default {
    base: "/line-bot-sdk-nodejs/",
    head: [
        ["link", {rel: "icon", href: "/favicon.ico"}]
    ],
    title: "line-bot-sdk-nodejs",
    description: "Node.js SDK for LINE Messaging API",
    theme: defaultTheme({
        // default theme config
        navbar: [
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
                link: "/apidocs/modules.html"
            },
            {
                text: "Contributing",
                link: "/CONTRIBUTING"
            },
            {
                text: "LINE Developers",
                link: "https://developers.line.biz/en/"
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
                    "/apidocs/modules.html"
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
    }),
}
