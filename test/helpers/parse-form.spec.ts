import { it } from "vitest";
import { parseForm } from "./parse-form";
import { deepEqual } from "node:assert";

it("test parseForm", async () => {
  const blob = new Blob([
    "--axios-1.7.2-boundary-gO2LZK1gY4J9v9AfRI29XEHgu\r\n" +
      'Content-Disposition: form-data; name="audienceGroupId"\r\n' +
      "\r\n" +
      "4389303728991\r\n" +
      "--axios-1.7.2-boundary-gO2LZK1gY4J9v9AfRI29XEHgu\r\n" +
      'Content-Disposition: form-data; name="uploadDescription"\r\n' +
      "\r\n" +
      "fileName\r\n" +
      "--axios-1.7.2-boundary-gO2LZK1gY4J9v9AfRI29XEHgu\r\n" +
      'Content-Disposition: form-data; name="file"; filename="blob"\r\n' +
      "Content-Type: application/octet-stream\r\n" +
      "\r\n" +
      "PNG BINARY DATA\r\n" +
      "--axios-1.7.2-boundary-gO2LZK1gY4J9v9AfRI29XEHgu--\r\n\r\n",
  ]);
  const arrayBuffer = await blob.arrayBuffer();
  const result = parseForm(arrayBuffer);
  deepEqual(result, {
    audienceGroupId: "4389303728991",
    uploadDescription: "fileName",
    file: new Blob(["PNG BINARY DATA"], {
      type: "application/octet-stream",
    }),
  });
});
