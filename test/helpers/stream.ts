import { Readable } from "stream";

export function getStreamData(stream: Readable): Promise<string> {
  return new Promise(resolve => {
    let result: string = "";
    stream.on("data", (chunk: Buffer) => {
      result += chunk.toString();
    });
    stream.on("end", () => {
      resolve(result);
    });
  });
}
