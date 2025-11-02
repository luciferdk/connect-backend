"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis"); // Import RedisClientType
// Create and export the redis client instance
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL, // Use an environment variable for the Redis URL
    // url: process.env.REDIS_URL || 'redis://localhost:6379', 
});
//------- hendale connection ------------//
exports.redisClient.on('connect', () => {
    console.log('Connected to Redis!');
});
exports.redisClient.on('error', (err) => {
    // Explicitly type 'err' as 'any' or a more specific error type
    console.error('Redis Client Error:', err);
});
//------------Call / Connect to RedisClient --------------/
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //connect() is start to open redisClient server and TCP connection Redis server (local or remote)
            yield exports.redisClient.connect();
            console.log('Redis client connected successfully.');
        }
        catch (err) {
            // Explicitly type 'err'
            console.error('Failed to connect to Redis:', err);
            process.exit(1); // Exit the process if Redis connection fails
        }
    });
}
connectRedis(); // Call the connect function
