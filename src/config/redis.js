require('dotenv').config();
const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Cache Engine Connected Successfully'));

(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;
