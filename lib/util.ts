import { Readable } from "stream";
import * as fileType from "file-type";
const fileTypeStream = require("file-type-stream").default;

export function toArray<T>(maybeArr: T | T[]): T[] {
  return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}

export function detectContentType(data: Buffer | Readable): Promise<string> {
  return new Promise(resolve => {
    const handleFileTypeResult = (result: any) =>
      resolve(result ? result.mime : null);

    if (data instanceof Buffer) {
      handleFileTypeResult(fileType(data));
    } else {
      data.pipe(fileTypeStream(handleFileTypeResult));
    }
  });
}
