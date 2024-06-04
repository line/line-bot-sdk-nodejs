// This is not a perfect multipart/form-data parser,
// but it works for the purpose of this test.
export function parseForm(
  arrayBuffer: ArrayBuffer,
): Record<string, string | Blob> {
  const uint8Array = new Uint8Array(arrayBuffer);
  const text = new TextDecoder().decode(uint8Array);

  /*
--axios-1.7.2-boundary-gO2LZK1gY4J9v9AfRI29XEHgu
Content-Disposition: form-data; name="audienceGroupId"

4389303728991
--axios-1.7.2-boundary-gO2LZK1gY4J9v9AfRI29XEHgu
Content-Disposition: form-data; name="uploadDescription"

fileName
--axios-1.7.2-boundary-gO2LZK1gY4J9v9AfRI29XEHgu
Content-Disposition: form-data; name="file"; filename="blob"
Content-Type: application/octet-stream

PNG BINARY DATA
--axios-1.7.2-boundary-gO2LZK1gY4J9v9AfRI29XEHgu--
   */

  const boundary = text.match(/^--[^\r\n]+/)![0];

  /*
[
  'Content-Disposition: form-data; name="audienceGroupId"\r\n\r\n4389303728991\r\n',
  'Content-Disposition: form-data; name="uploadDescription"\r\n\r\nfileName\r\n',
  'Content-Disposition: form-data; name="file"; filename="blob"\r\n' +
    'Content-Type: application/octet-stream\r\n' +
    '\r\n' +
    'HELLO\n' +
    '\r\n' +
    '--axios-1.7.2-boundary-HytTvC4rGiQmNGiM6aC23i1GT--\r\n' +
    '\r\n'
]
   */
  // split to parts, and drop first and last empty parts
  const parts = text.split(new RegExp(boundary + "(?:\\r\\n|--)")).slice(1, -1);

  const result: Record<string, string | Blob> = {};

  for (const part of parts) {
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headers = part.slice(0, headerEnd);
    const content = part.slice(headerEnd + 4);

    const nameMatch = headers.match(/name="([^"]+)"/);
    const fileNameMatch = headers.match(/filename="([^"]+)"/);

    if (nameMatch) {
      const name = nameMatch[1];

      if (fileNameMatch) {
        // it's a file
        const contentTypeMatch = headers.match(/Content-Type:\s*(\S+)/i);
        const contentType = contentTypeMatch
          ? contentTypeMatch[1]
          : "application/octet-stream";

        result[name] = new Blob([content.replace(/\r\n$/, "")], {
          type: contentType,
        });
      } else {
        // basic field
        const value = content.trim();
        result[name] = value;
      }
    }
  }

  return result;
}
