import { JSONParseError } from "./exceptions";
import { TextMessage } from "./types";

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

export function buildTextMessage(text: string | string[]): TextMessage[] {
  return toArray(text).map(value => ({ type: "text", text: value }));
}
