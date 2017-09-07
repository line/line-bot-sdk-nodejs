import * as bodyParser from "body-parser";
import * as express from "express";
import { Server } from "http";
import { join } from "path";
import { JSONParseError, SignatureValidationFailed } from "../../lib/exceptions";

let server: Server = null;

function listen(port: number, middleware?: express.RequestHandler) {
  const app = express();

  if (middleware) {
    app.use((req: express.Request, res, next) => {
      if (req.path === "/mid-text") {
        bodyParser.text({ type: "*/*" })(req, res, next);
      } else if (req.path === "/mid-buffer") {
        bodyParser.raw({ type: "*/*" })(req, res, next);
      } else if (req.path === "/mid-json") {
        bodyParser.json({ type: "*/*" })(req, res, next);
      } else {
        next();
      }
    });

    app.use(middleware);
  }

  app.use(bodyParser.json());

  // for getIds API
  app.get("/:groupOrRoom/:id/members/ids", (req, res) => {
    const ty: string = req.params.groupOrRoom;
    const id: string = req.params.id;
    const start: number = parseInt(req.query.start, 10) || 0;

    const result: { memberIds: string[], next?: string } = {
      memberIds: [start, start + 1, start + 2].map((i) => `${ty}-${id}-${i}`),
    };

    if (start / 3 < 2) {
      result.next = String(start + 3);
    }

    res.json(result);
  });

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
