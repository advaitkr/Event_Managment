const { createClient } = require('redis');
let client;


const initRedis = async () => {
const url = process.env.REDIS_URL;
if (!url) {
console.log('REDIS_URL not provided, skipping redis init');
return;
}


client = createClient({ url });
client.on('error', (err) => console.error('Redis Client Error', err));
await client.connect();
console.log('Redis connected');
};


const getRedisClient = () => client;


module.exports = { initRedis, getRedisClient };