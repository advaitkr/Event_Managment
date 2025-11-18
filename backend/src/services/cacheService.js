import { getRedisClient } from '../config/redis';


export async function get(key) {
const client = getRedisClient();
if (!client) return null;
const data = await client.get(key);
return data ? JSON.parse(data) : null;
}


export async function set(key, value, ttl = 3600) {
const client = getRedisClient();
if (!client) return;
await client.setEx(key, ttl, JSON.stringify(value));
}


export async function del(key) {
const client = getRedisClient();
if (!client) return;
await client.del(key);
}