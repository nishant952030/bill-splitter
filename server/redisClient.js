const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
    host: '127.0.0.1', // Replace with your Redis host
    port: 6379,        // Replace with your Redis port
});

// Handle connection
client.on('connect', () => {
    console.log(`Connected to Redis on port: ${client.options.port}`);
});

// Handle errors
client.on('error', (err) => {
    console.error('Redis error:', err);
});
module.exports = client;
