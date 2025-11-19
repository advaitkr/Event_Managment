// CommonJS style
const { createClient } = require("redis");

// don't call dotenv here if you already call it in server.js, but it's harmless to call again
require("dotenv").config();

const redisClient = createClient({
  url: process.env.REDIS_URL, // must be e.g. 'redis://localhost:6379'
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

async function initRedis() {
  if (redisClient.isReady) {
    console.log("Redis already connected");
    return;
  }
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    // decide whether to throw so app stops or continue running:
    // throw err;
  }
}

module.exports = { redisClient, initRedis };

