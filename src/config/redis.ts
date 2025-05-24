import Redis from 'ioredis';
import { config } from './index';

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('error', (error) => {
  console.error('Redis error:', error);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
}); 