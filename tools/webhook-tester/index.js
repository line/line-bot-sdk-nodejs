const express = require('express');
const fs = require('fs');
const bp = require('body-parser');
const request = require('request');
const crypto = require('crypto');

const app = express();

app.use(bp.json());

const html = (res, path) => {
  res.set('Content-Type', 'text/html');
  res.send(fs.readFileSync(path));
};

app.get('/', (_, res) => html(res, './index.html'));

const createSignature = (secret, body) => {
  return crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');
};

app.post('/', (req, res) => {
  const webhook = req.body.webhook;
  const body = JSON.stringify(req.body.content);
  request.post({
    url: webhook.url,
    headers: {
      'X-Line-Signature': createSignature(webhook.secret, body),
      'Content-Type': 'application/json'
    },
    body: body
  }, (e, r, body) => res.json({
    status: r.statusCode,
    body: body,
  }));
});

app.post('/webhook', (req, res) => {
  console.log('-- hook -------------------');
  console.log('content type:', req.get('Content-Type'));
  console.log('signature', req.get('X-Line-Signature'));
  console.log('body:', req.body);
  console.log('---------------------------');
  res.end();
});

const port = parseInt(process.argv[2], 10) || 3030;

app.listen(port, () => console.log(`http://localhost:${port}`));
