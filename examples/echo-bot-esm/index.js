import express from 'express'
import {middleware, JSONParseError, SignatureValidationFailed} from '@line/bot-sdk'

const app = express()

const config = {
  channelSecret: 'YOUR_CHANNEL_SECRET'
}

app.use(middleware(config))

app.post('/webhook', (req, res) => {
  res.json(req.body.events) // req.body will be webhook event object
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

app.listen(8080)
