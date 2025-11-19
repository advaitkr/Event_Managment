// CommonJS style
const { createClient } = require("redis");
require("dotenv").config();

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.warn("REDIS_URL not set. Skipping Redis initialization.");
  module.exports = { redisClient: null, initRedis: async () => {} };
  return;
}

const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

// optional: limited retry connect with backoff
async function initRedis({ maxAttempts = 5, delayMs = 1000 } = {}) {
  if (redisClient.isReady) return;
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      attempt++;
      console.log(`Attempting to connect to Redis (${attempt}/${maxAttempts}) at ${REDIS_URL}`);
      await redisClient.connect();
      console.log("Redis connected successfully");
      return;
    } catch (err) {
      console.error(`Redis connect attempt ${attempt} failed:`, err.code || err.message);
      if (attempt >= maxAttempts) {
        console.error("Exceeded max Redis connect attempts. Giving up.");
        return;
      }
      // exponential backoff
      const wait = delayMs * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

module.exports = { redisClient, initRedis };


