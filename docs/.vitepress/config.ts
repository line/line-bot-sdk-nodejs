import { copyFile, rewriteFile } from './utils.js';

copyFile('README.md', 'index.md');
copyFile('CONTRIBUTING.md', 'CONTRIBUTING.md');

rewriteFile('../apidocs/README.md', /\(CONTRIBUTING.md\)/g, '(../CONTRIBUTING.md)');

export default {
    title: 'line-bot-sdk-nodejs',
    description: 'Node.js SDK for LINE Messaging API',
    base: '/line-bot-sdk-nodejs/',
    head: [
      ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    ],
    themeConfig: {
      // Navbar items
      nav: [
        { text: 'Introduction', link: '/index.html' },
        { text: 'Getting Started', link: '/getting-started.html' },
        { text: 'Guide', link: '/guide.html' },
        { text: 'API Reference', link: '/apidocs/globals.html' },
        { text: 'Contributing', link: '/CONTRIBUTING.html' },
        { text: 'GitHub', link: 'https://github.com/line/line-bot-sdk-nodejs/' },
      ],
      // Sidebar items
      sidebar: {
        '/': [
          {
            text: 'Introduction',
            items: [
              {text: 'Introduction', link: '/index.html'},
            ],
          },
          {
            text: 'Getting Started',
            items: [
                {text: 'Requirements', link: '/getting-started/requirements.html'},
                {text: 'Install', link: '/getting-started/install.html'},
                {text: 'Basic Usage', link: '/getting-started/basic-usage.html'},
            ],
          },
          {
            text: 'Guide',
            items: [
                {text: 'Webhook', link: '/guide/webhook.html'},
                {text: 'Client', link: '/guide/client.html'},
                {text: 'TypeScript', link: '/guide/typescript.html'},
            ],
          },
          {
            text: 'API Reference',
            items: [
              { text: 'API Docs', link: '/apidocs/globals.html' },
            ],
          },
          {
            text: 'Contributing',
            items: [
                {text: 'Contributing', link: '/CONTRIBUTING.html'},
            ],
          },
        ],
      },
    },
  }
