import { JSONParseError } from "./exceptions.js";

// Mirrors retrofit's PATH_TRAVERSAL: matches when any path segment is purely
// "." / ".." (or their percent-encoded forms), after the parameters have been
// substituted. See square/retrofit RequestBuilder.java.
const PATH_TRAVERSAL = /^(?:.*\/)?(?:\.|%2e|%2E){1,2}(?:\/.*)?$/;

export function ensureJSON<T>(raw: T): T {
  if (typeof raw === "object") {
    return raw;
  } else {
    throw new JSONParseError("Failed to parse response body as JSON", { raw });
  }
}

export function createURLSearchParams(
  params: Record<string, unknown>,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      searchParams.append(key, String(value));
    }
  }
  return searchParams;
}

function encodePathParam(value: unknown, name: string): string {
  if (value === null || value === undefined) {
    throw new TypeError(`${name} is required`);
  }
  return encodeURIComponent(String(value));
}

export function buildPath(
  pathTemplate: string,
  params: Record<string, unknown>,
): string {
  let path = pathTemplate;

  for (const [name, value] of Object.entries(params)) {
    path = path.split(`{${name}}`).join(encodePathParam(value, name));
  }

  if (PATH_TRAVERSAL.test(path)) {
    throw new TypeError(
      `Path parameters shouldn't perform path traversal ('.' or '..'): ${path}`,
    );
  }

  return path;
}
