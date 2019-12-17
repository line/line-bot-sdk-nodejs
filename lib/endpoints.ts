let MESSAGING_API_PREFIX: string,
  DATA_API_PREFIX: string,
  OAUTH_BASE_PREFIX: string;

if (process.env.NODE_ENV == "test") {
  const TEST_SERVER = `http://localhost:1234`;
  process.env.TEST_PORT = "1234";

  MESSAGING_API_PREFIX = TEST_SERVER;
  DATA_API_PREFIX = TEST_SERVER;
  OAUTH_BASE_PREFIX = `${TEST_SERVER}/oauth`;
} else {
  MESSAGING_API_PREFIX = `https://api.line.me/v2/bot`;
  DATA_API_PREFIX = `https://api-data.line.me/v2/bot`;
  OAUTH_BASE_PREFIX = `https://api.line.me/v2/oauth`;
}

export { MESSAGING_API_PREFIX, DATA_API_PREFIX, OAUTH_BASE_PREFIX };
