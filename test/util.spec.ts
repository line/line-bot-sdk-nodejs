import { deepEqual, equal } from "assert";
import { toArray, detectContentType } from "../lib/util";
import * as fs from "fs";
import { join } from "path";

describe("util", () => {
  describe("toArray", () => {
    it("returns an array as it is", () => {
      deepEqual(toArray([1, 2, 3]), [1, 2, 3]);
    });

    it("wrap others as an array", () => {
      deepEqual(toArray(1), [1]);
    });
  });

  describe("detectContentType", () => {
    it("returns correct result for stream", () => {
      const filepath = join(__dirname, "/helpers/line-icon.png");
      const readable = fs.createReadStream(filepath);
      return detectContentType(readable).then((type: string) => {
        equal(type, "image/png");
      });
    });

    it("returns correct result for buffer", () => {
      const filepath = join(__dirname, "/helpers/line-icon.png");
      const buffer = fs.readFileSync(filepath);
      return detectContentType(buffer).then((type: string) => {
        equal(type, "image/png");
      });
    });
  });
});
