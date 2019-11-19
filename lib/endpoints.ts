let MESSAGING_API_HOST: string, DATA_HOST: string, OAUTH_BASE_URL: string;

if (process.env.NODE_ENV == "test") {
  const TEST_SERVER = `http://localhost:1234`;
  process.env.TEST_PORT = "1234";

  MESSAGING_API_HOST = TEST_SERVER;
  DATA_HOST = TEST_SERVER;
  OAUTH_BASE_URL = `${TEST_SERVER}/oauth`;
} else {
  MESSAGING_API_HOST = `https://api.line.me/v2/bot`;
  DATA_HOST = `https://api-data.line.me/v2/bot`;
  OAUTH_BASE_URL = `'https://api.line.me/v2/oauth`;
}

export { MESSAGING_API_HOST, DATA_HOST, OAUTH_BASE_URL };
