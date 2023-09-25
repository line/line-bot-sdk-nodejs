import Client, { OAuth } from "./client";
import middleware from "./middleware";
import validateSignature from "./validate-signature";

export { Client, middleware, validateSignature, OAuth };

// re-export exceptions and types
export * from "./exceptions";
export * from "./types";

import * as channelAccessToken from "./channel-access-token/api";
export { channelAccessToken };
import * as insight from "./insight/api";
export { insight };
import * as liff from "./liff/api";
export { liff };
import * as manageAudience from "./manage-audience/api";
export { manageAudience };
import * as messagingApi from "./messaging-api/api";
export { messagingApi };
// Note: `module` is reserved word in Javascript.
import * as moduleOperation from "./module/api";
export { moduleOperation };
import * as moduleAttach from "./module-attach/api";
export { moduleAttach };
import * as shop from "./shop/api";
export { shop };
import * as webhook from "./webhook/api";
export { webhook };
