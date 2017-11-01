import { Readable } from "stream";
import * as fileType from "file-type";
const { default: fileTypeStream } = require("file-type-stream");

export function toArray<T>(maybeArr: T | T[]): T[] {
  return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}

export function detectContentType(data: Buffer | Readable): Promise<string> {
  return new Promise(resolve => {
    const handleFileTypeResult = (result: any) => {
      return resolve(result ? result.mime : null);
    };

    if (data instanceof Buffer) {
      const result = fileType(data);
      return handleFileTypeResult(result);
    } else {
      data.pipe(fileTypeStream(handleFileTypeResult));
    }
  });
}
