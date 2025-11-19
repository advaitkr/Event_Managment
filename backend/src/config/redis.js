// backend/src/config/redis.js
// backend/src/config/redis.js
const { createClient } = require('redis');

function normalizeRedisUrl(raw) {
  if (!raw) return null;
  if (raw.startsWith('REDIS_URL=')) raw = raw.slice('REDIS_URL='.length);
  raw = raw.replace(/^\s*export\s+/i, '');
  raw = raw.replace(/^['"]|['"]$/g, '');
  if (!/^rediss?:\/\//i.test(raw)) return null;
  return raw;
}

const rawUrl = process.env.REDIS_URL;
const redisUrl = normalizeRedisUrl(rawUrl) || 'redis://localhost:6379';

let _client = null;
let _connecting = false;

function createSingletonClient() {
  if (_client) return _client;

  _client = createClient({ url: redisUrl });

  _client.on('error', (err) => {
    console.error('Redis Client Error', err && err.message ? err.message : err);
  });

  _client.on('connect', () => {
    console.log('Redis connected (event)');
  });

  _client.on('ready', () => {
    console.log('Redis ready (event)');
  });

  _client.on('end', () => {
    console.warn('Redis connection closed');
  });

  return _client;
}

async function ensureConnected({ maxAttempts = 5, delayMs = 1000 } = {}) {
  const client = createSingletonClient();

  if (client.isOpen) {
    console.log('Redis already open — skipping connect');
    return client;
  }

  if (_connecting) {
    console.log('Redis connection already in progress — waiting');
    for (let i = 0; i < maxAttempts; i++) {
      if (client.isOpen) return client;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  _connecting = true;
  try {
    await client.connect().catch((err) => {
      if (String(err).includes('Socket already opened')) {
        console.warn('Redis connect(): socket already opened — ignoring.');
      } else {
        throw err;
      }
    });

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (client.isOpen) {
        console.log('Redis connected successfully');
        _connecting = false;
        return client;
      }
      console.log(`Attempting to connect to Redis (${attempt}/${maxAttempts}) at ${redisUrl}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }

    console.error('Exceeded max Redis connect attempts. Continuing without Redis.');
    _connecting = false;
    return client;
  } catch (err) {
    _connecting = false;
    console.error('Redis connect attempt failed:', err && err.message ? err.message : err);
    return client;
  }
}

module.exports = {
  getClient: createSingletonClient,
  connect: ensureConnected,
};
