import * as bodyParser from "body-parser";
import { Buffer } from "node:buffer";
import express from "express";
import { Server } from "node:http";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import {
  JSONParseError,
  SignatureValidationFailed,
} from "../../lib/exceptions.js";

// Use a map to store multiple server instances
let servers: Map<number, Server> = new Map();

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
      // Fallback for any other unexpected error. We handle it here instead of
      // delegating to Express's default error handler (via next(err)), which
      // would log the stack trace to the console during tests. This mirrors
      // what finalhandler did, but without the extra dependency.
      if (res.headersSent) {
        return;
      }
      const { status, statusCode } = err as {
        status?: number;
        statusCode?: number;
      };
      const code = status ?? statusCode ?? 500;
      res.status(code >= 400 && code < 600 ? code : 500).end();
    },
  );

  return new Promise(resolve => {
    const server = app.listen(port, () => resolve(undefined));
    servers.set(port, server);
  });
}

function close(port?: number) {
  return new Promise(resolve => {
    if (port !== undefined) {
      const server = servers.get(port);
      if (!server) {
        return resolve(undefined);
      }

      server.close(() => {
        servers.delete(port);
        resolve(undefined);
      });
    } else {
      // Close all servers if no port is specified
      if (servers.size === 0) {
        return resolve(undefined);
      }

      const promises = Array.from(servers.entries()).map(([port, server]) => {
        return new Promise(resolveServer => {
          server.close(() => {
            servers.delete(port);
            resolveServer(undefined);
          });
        });
      });

      Promise.all(promises).then(() => resolve(undefined));
    }
  });
}

export { listen, close };
