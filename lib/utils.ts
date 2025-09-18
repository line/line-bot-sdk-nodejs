import { Buffer } from "node:buffer";
import { JSONParseError } from "./exceptions.js";

export function toArray<T>(maybeArr: T | T[]): T[] {
  return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}

export function ensureJSON<T>(raw: T): T {
  if (typeof raw === "object") {
    return raw;
  } else {
    throw new JSONParseError("Failed to parse response body as JSON", { raw });
  }
}

function toArrayBuffer(input: Uint8Array | Buffer): ArrayBuffer {
  if (input.buffer instanceof ArrayBuffer) {
    return input.buffer.slice(
      input.byteOffset,
      input.byteOffset + input.byteLength,
    );
  }
  const arrayBuffer = new ArrayBuffer(input.byteLength);
  new Uint8Array(arrayBuffer).set(input);
  return arrayBuffer;
}

export function createMultipartFormData(
  this: FormData | void,
  formBody: Record<string, any>,
): FormData {
  const formData = this instanceof FormData ? this : new FormData();
  for (const [key, value] of Object.entries(formBody)) {
    if (value == null) continue;

    if (value instanceof Blob) {
      formData.append(key, value);
    } else if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
      const arrayBuffer = toArrayBuffer(value);
      formData.append(key, new Blob([arrayBuffer]));
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
}
