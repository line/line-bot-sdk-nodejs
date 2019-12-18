import * as bodyParser from "body-parser";
import * as express from "express";
import { Server } from "http";
import { join } from "path";
import { writeFileSync } from "fs";
import {
  JSONParseError,
  SignatureValidationFailed,
} from "../../lib/exceptions";
import * as finalhandler from "finalhandler";

let server: Server = null;

function listen(port: number, middleware?: express.RequestHandler) {
  const app = express();

  if (middleware) {
    app.use((req: express.Request, res, next) => {
      if (req.path === "/mid-text") {
        bodyParser.text({ type: "*/*" })(req, res, next);
      } else if (req.path === "/mid-buffer") {
        bodyParser.raw({ type: "*/*" })(req, res, next);
      } else if (req.path === "/mid-rawbody") {
        bodyParser.raw({ type: "*/*" })(req, res, err => {
          if (err) return next(err);
          (req as any).rawBody = req.body;
          delete req.body;
          next();
        });
      } else if (req.path === "/mid-json") {
        bodyParser.json({ type: "*/*" })(req, res, next);
      } else {
        next();
      }
    });

    app.use(middleware);
  }

  // write request info
  app.use((req: express.Request, res, next) => {
    const request: any = ["headers", "method", "path", "query"].reduce(
      (r, k) => Object.assign(r, { [k]: (req as any)[k] }),
      {},
    );
    if (Buffer.isBuffer(req.body)) {
      request.body = req.body.toString("base64");
    } else {
      request.body = req.body;
    }
    writeFileSync(
      join(__dirname, "request.json"),
      JSON.stringify(request, null, 2),
    );
    next();
  });

  // return an empty object for others
  app.use((req, res) => res.json({}));

  app.use(
    (err: Error, req: express.Request, res: express.Response, next: any) => {
      if (err instanceof SignatureValidationFailed) {
        res.status(401).send(err.signature);
        return;
      } else if (err instanceof JSONParseError) {
        res.status(400).send(err.raw);
        return;
      }
      // https://github.com/expressjs/express/blob/2df1ad26a58bf51228d7600df0d62ed17a90ff71/lib/application.js#L162
      // express will record error in console when
      // there is no other handler to handle error & it is in test environment
      // use final handler the same as in express application.js
      finalhandler(req, res)(err);
    },
  );

  return new Promise(resolve => {
    server = app.listen(port, () => resolve());
  });
}

function close() {
  return new Promise(resolve => {
    if (!server) {
      resolve();
    }
    server.close(() => resolve());
  });
}

export { listen, close };
