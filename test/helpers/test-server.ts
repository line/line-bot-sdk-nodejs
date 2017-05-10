import * as bodyParser from "body-parser";
import * as express from "express";
import { Server } from "http";
import { join } from "path";
import { JSONParseError, SignatureValidationFailed } from "../../lib/exceptions";

let server: Server = null;

function listen(port: number, middleware?: express.RequestHandler) {
  const app = express();

  if (middleware) {
    app.use(middleware);
  }

  app.use(bodyParser.json());

  app.use((req: express.Request, res) => {
    if (req.path === "/stream.txt") {
      res.sendFile(join(__dirname, "stream.txt"));
    } else if (req.path === "/text") {
      res.send("i am not jason");
    } else if (req.path === "/404") {
      res.status(404).end();
    } else {
      const keys = ["body", "headers", "method", "path", "query"];
      res.json(keys.reduce((r, k) => Object.assign(r, { [k]: (req as any)[k] }), {}));
    }
  });

  app.use((err: Error, req: express.Request, res: express.Response, next: any) => {
    if (err instanceof SignatureValidationFailed) {
      res.status(401).send(err.signature);
      return;
    } else if (err instanceof JSONParseError) {
      res.status(400).send(err.raw);
      return;
    }
    next(err);
  });

  return new Promise((resolve) => {
    server = app.listen(port, () => resolve());
  });
}

function close() {
  return new Promise((resolve) => {
    if (!server) {
      resolve();
    }
    server.close(() => resolve());
  });
}

export { listen, close };
