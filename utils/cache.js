
import NodeCache from 'node-cache';
import config from '../config/index.js';

const cache = new NodeCache({ stdTTL: config.cacheTtlSeconds, checkperiod: 60 });

export default {
  get: (key) => cache.get(key),
  set: (key, value, ttl) => cache.set(key, value, ttl),
  del: (key) => cache.del(key),
  flush: () => cache.flushAll()
};

