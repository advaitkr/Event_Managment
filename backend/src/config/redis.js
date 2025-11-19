const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
  url: process.env.REDIS_URL, // must be ONLY redis://localhost:6379
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
}

connectRedis();

module.exports = redisClient;
