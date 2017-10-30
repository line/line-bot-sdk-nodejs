declare module "file-type-stream" {
  import { Transform } from "stream";

  class FileTypeStream extends Transform {
    constructor(callback: Function);
    _transform(chunk: any, encoding: string, cb: Function): void;
  }

  export default function(cb: Function): FileTypeStream;
}
