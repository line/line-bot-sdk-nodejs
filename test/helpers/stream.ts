export function getStreamData(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve) => {
    let result: string = "";
    stream.on("data", (chunk: Buffer) => {
      result += chunk.toString();
    });
    stream.on("end", () => {
      resolve(result);
    });
  });
}
