import { createHmac, timingSafeEqual } from "crypto";

function s2b(str: string, encoding: string): Buffer {
  try {
    return Buffer.from(str, encoding);
  } catch (err) {
    if (err.name === "TypeError") {
      return new Buffer(str, encoding);
    }
    throw err;
  }
}

function safeCompare(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export default function validateSignature(
  body: string | Buffer,
  channelSecret: string,
  signature: string,
): boolean {
  return safeCompare(
    createHmac("SHA256", channelSecret)
      .update(body)
      .digest(),
    s2b(signature, "base64"),
  );
}
