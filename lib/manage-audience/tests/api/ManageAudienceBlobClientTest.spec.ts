import { ManageAudienceBlobClient } from "../../api.js";

import { CreateAudienceGroupResponse } from "../../model/createAudienceGroupResponse.js";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

import { describe, it } from "vitest";

const channel_access_token = "test_channel_access_token";

// This is not a perfect multipart/form-data parser,
// but it works for the purpose of this test.
function parseForm(arrayBuffer: ArrayBuffer): Record<string, string | Blob> {
  const uint8Array = new Uint8Array(arrayBuffer);
  const text = new TextDecoder().decode(uint8Array);

  const boundary = text.match(/^--[^\r\n]+/)![0];

  // split to parts, and drop first and last empty parts
  const parts = text.split(new RegExp(boundary + "(?:\\r\\n|--)")).slice(1, -1);

  const result: Record<string, string | Blob> = {};

  for (const part of parts) {
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headers = part.slice(0, headerEnd);
    const content = part.slice(headerEnd + 4);

    const nameMatch = headers.match(/name="([^"]+)"/);
    const fileNameMatch = headers.match(/filename="([^"]+)"/);

    if (nameMatch) {
      const name = nameMatch[1];

      if (fileNameMatch) {
        // it's a file
        const contentTypeMatch = headers.match(/Content-Type:\s*(\S+)/i);
        const contentType = contentTypeMatch
          ? contentTypeMatch[1]
          : "application/octet-stream";

        result[name] = new Blob([content.replace(/\r\n$/, "")], {
          type: contentType,
        });
      } else {
        // basic field
        const value = content.trim();
        result[name] = value;
      }
    }
  }

  return result;
}

describe("ManageAudienceBlobClient", () => {
  it("addUserIdsToAudienceWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/upload/byFile"
          .replace("{audienceGroupId}", "0") // number
          .replace("{uploadDescription}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

      ok(
        req.headers["content-type"].startsWith(
          `multipart/form-data; boundary=`,
        ),
      );

      let data: Buffer[] = [];

      req.on("data", chunk => {
        data.push(chunk);
      });

      req.on("end", () => {
        // Combine the data chunks into a single Buffer
        const buffer = Buffer.concat(data);

        // Convert Buffer to ArrayBuffer
        const arrayBuffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        );

        // Form parameters
        const formData = parseForm(arrayBuffer);
        equal(
          formData["audienceGroupId"],
          String(
            // audienceGroupId: number
            0, // paramName=audienceGroupId(number or int or long)
          ),
        );
        equal(
          formData["uploadDescription"],
          String(
            // uploadDescription: string
            "DUMMY", // uploadDescription(string)
          ),
        );
        equal(
          formData["file"],
          String(
            // file: Blob
            new Blob([]), // paramName=file
          ),
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({}));
      });
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new ManageAudienceBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.addUserIdsToAudienceWithHttpInfo(
      // file: Blob
      new Blob([]), // paramName=file

      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)

      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("addUserIdsToAudience", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/upload/byFile"
          .replace("{audienceGroupId}", "0") // number
          .replace("{uploadDescription}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

      ok(
        req.headers["content-type"].startsWith(
          `multipart/form-data; boundary=`,
        ),
      );

      let data: Buffer[] = [];

      req.on("data", chunk => {
        data.push(chunk);
      });

      req.on("end", () => {
        // Combine the data chunks into a single Buffer
        const buffer = Buffer.concat(data);

        // Convert Buffer to ArrayBuffer
        const arrayBuffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        );

        // Form parameters
        const formData = parseForm(arrayBuffer);
        equal(
          formData["audienceGroupId"],
          String(
            // audienceGroupId: number
            0, // paramName=audienceGroupId(number or int or long)
          ),
        );
        equal(
          formData["uploadDescription"],
          String(
            // uploadDescription: string
            "DUMMY", // uploadDescription(string)
          ),
        );
        equal(
          formData["file"],
          String(
            // file: Blob
            new Blob([]), // paramName=file
          ),
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({}));
      });
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new ManageAudienceBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.addUserIdsToAudience(
      // file: Blob
      new Blob([]), // paramName=file

      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)

      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createAudienceForUploadingUserIdsWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/upload/byFile"
          .replace("{description}", "DUMMY") // string
          .replace("{uploadDescription}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

      ok(
        req.headers["content-type"].startsWith(
          `multipart/form-data; boundary=`,
        ),
      );

      let data: Buffer[] = [];

      req.on("data", chunk => {
        data.push(chunk);
      });

      req.on("end", () => {
        // Combine the data chunks into a single Buffer
        const buffer = Buffer.concat(data);

        // Convert Buffer to ArrayBuffer
        const arrayBuffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        );

        // Form parameters
        const formData = parseForm(arrayBuffer);
        equal(
          formData["description"],
          String(
            // description: string
            "DUMMY", // description(string)
          ),
        );
        equal(
          formData["isIfaAudience"],
          String(
            // isIfaAudience: boolean
            true, // paramName=isIfaAudience
          ),
        );
        equal(
          formData["uploadDescription"],
          String(
            // uploadDescription: string
            "DUMMY", // uploadDescription(string)
          ),
        );
        equal(
          formData["file"],
          String(
            // file: Blob
            new Blob([]), // paramName=file
          ),
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({}));
      });
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new ManageAudienceBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createAudienceForUploadingUserIdsWithHttpInfo(
      // file: Blob
      new Blob([]), // paramName=file

      // description: string
      "DUMMY", // description(string)

      // isIfaAudience: boolean
      true, // paramName=isIfaAudience

      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createAudienceForUploadingUserIds", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/upload/byFile"
          .replace("{description}", "DUMMY") // string
          .replace("{uploadDescription}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

      ok(
        req.headers["content-type"].startsWith(
          `multipart/form-data; boundary=`,
        ),
      );

      let data: Buffer[] = [];

      req.on("data", chunk => {
        data.push(chunk);
      });

      req.on("end", () => {
        // Combine the data chunks into a single Buffer
        const buffer = Buffer.concat(data);

        // Convert Buffer to ArrayBuffer
        const arrayBuffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        );

        // Form parameters
        const formData = parseForm(arrayBuffer);
        equal(
          formData["description"],
          String(
            // description: string
            "DUMMY", // description(string)
          ),
        );
        equal(
          formData["isIfaAudience"],
          String(
            // isIfaAudience: boolean
            true, // paramName=isIfaAudience
          ),
        );
        equal(
          formData["uploadDescription"],
          String(
            // uploadDescription: string
            "DUMMY", // uploadDescription(string)
          ),
        );
        equal(
          formData["file"],
          String(
            // file: Blob
            new Blob([]), // paramName=file
          ),
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({}));
      });
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new ManageAudienceBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createAudienceForUploadingUserIds(
      // file: Blob
      new Blob([]), // paramName=file

      // description: string
      "DUMMY", // description(string)

      // isIfaAudience: boolean
      true, // paramName=isIfaAudience

      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );

    equal(requestCount, 1);
    server.close();
  });
});
