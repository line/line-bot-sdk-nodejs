import { ok } from "assert";
import validateSignature from "../lib/validate-signature";

const body = { hello: "world" };
const secret = "test_secret";

describe("validateSignature", () => {
  it("success", () => {
    const validSignature = "t7Hn4ZDHqs6e+wdvI5TyQIvzie0DmMUmuXEBqyyE/tM=";
    ok(validateSignature(JSON.stringify(body), secret, validSignature));
  });

  it("failure", () => {
    const invalidSignature = "t7Hn4ZDHqs6e+wdvi5TyQivzie0DmMUmuXEBqyyE/tM=";
    ok(!validateSignature(JSON.stringify(body), secret, invalidSignature));
  });
});
