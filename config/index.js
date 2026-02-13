
import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 8084,
  accessToken: process.env.ACCESS_TOKEN || '',
  graphApiVersion: process.env.GRAPH_API_VERSION || 'v17.0',
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS) || 300,
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX_MS) || 60,
  corsOrigin: process.env.CORS_ORIGINS
    ? (process.env.CORS_ORIGINS.includes(',') ? process.env.CORS_ORIGINS.split(',') : process.env.CORS_ORIGINS)
    : '*'
};

