import { ClientEndpoints, OAuthEndpoints } from "./types";

export const defaultClientEndpoints: ClientEndpoints = {
  MESSAGING_API_PREFIX: `https://api.line.me/v2/bot`,
  DATA_API_PREFIX: `https://api-data.line.me/v2/bot`,
};

export const defaultOAuthEndpoints: OAuthEndpoints = {
  OAUTH_BASE_PREFIX: `https://api.line.me/v2/oauth`,
  OAUTH_BASE_PREFIX_V2_1: `https://api.line.me/oauth2/v2.1`,
};
