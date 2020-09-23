import { JSONParseError } from "./exceptions";
import * as FormData from "form-data";

export function toArray<T>(maybeArr: T | T[]): T[] {
  return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}

export function ensureJSON<T>(raw: T): T {
  if (typeof raw === "object") {
    return raw;
  } else {
    throw new JSONParseError("Failed to parse response body as JSON", raw);
  }
}

export function createMultipartFormData(
  this: FormData | void,
  formBody: Record<string, any>,
): FormData {
  const formData = this instanceof FormData ? this : new FormData();
  Object.entries(formBody).forEach(([key, value]) => {
    if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  return formData;
}
