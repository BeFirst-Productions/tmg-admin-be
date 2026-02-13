// services/instagramService.js
import axios from 'axios';
import config from '../config/index.js';
import cache from '../utils/cache.js';
import logger from '../utils/logger.js';

const FIELDS = [
  'id',
  'media_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'caption',
  'timestamp'
].join(',');

/**
 * Normalize items returned by Instagram Basic Display API
 */
function normalizeItems(raw = []) {
  return raw
    .map(item => ({
      id: item.id,
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || null,
      permalink: item.permalink || null,
      caption: item.caption || '',
      // keep ISO string for consistency
      timestamp: item.timestamp ? new Date(item.timestamp).toISOString() : null
    }))
    // keep only items with valid timestamp
    .filter(i => i.timestamp)
    // keep only IMAGE media types (filter out VIDEO and others)
    .filter(i => i.media_type === 'IMAGE')
    // newest-first
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Fetch latest media from Instagram Basic Display API with caching
 * returns { fromCache: boolean, items: [] }
 */
export async function fetchLatestMedia({ limit = 6 } = {}) {
  if (!config.accessToken) {
    const e = new Error('Missing ACCESS_TOKEN in configuration');
    e.status = 500;
    throw e;
  }

  const cacheKey = `instagram_media_limit_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug('Returning instagram data from cache', { cacheKey });
    return { fromCache: true, items: cached };
  }

  const url = `https://graph.instagram.com/me/media`;

  try {
    const response = await axios.get(url, {
      params: {
        fields: FIELDS,
        access_token: config.accessToken,
        limit: 50
      },
      timeout: 10000
    });

    const rawItems = response.data && response.data.data ? response.data.data : [];
    // normalize, filter to images only, then slice to requested limit
    const normalized = normalizeItems(rawItems).slice(0, limit);
    cache.set(cacheKey, normalized, config.cacheTtlSeconds);

    return { fromCache: false, items: normalized };
  } catch (err) {
    logger.error('Graph Instagram API call failed', {
      message: err.message,
      body: err?.response?.data || null
    });
    const e = new Error(err?.response?.data?.error?.message || 'Failed to fetch Instagram posts');
    e.status = err?.response?.status || 502;
    throw e;
  }
}

/**
 * Meta endpoint: verify token / get account id & username (Basic Display supports /me)
 */
export async function getMeta() {
  if (!config.accessToken) {
    const e = new Error('Missing ACCESS_TOKEN in configuration');
    e.status = 500;
    throw e;
  }

  try {
    const url = `https://graph.instagram.com/me`;
    const response = await axios.get(url, {
      params: {
        fields: 'id,username',
        access_token: config.accessToken
      },
      timeout: 8000
    });
    return response.data;
  } catch (err) {
    logger.error('Failed to fetch /me meta', { message: err.message, body: err?.response?.data || null });
    const e = new Error(err?.response?.data?.error?.message || 'Failed to validate access token');
    e.status = err?.response?.status || 502;
    throw e;
  }
}

/**
 * Refresh the long-lived access token
 * The token must be valid (not expired) for this to work.
 * Returns { access_token, expires_in, token_type }
 */
export async function refreshLongLivedToken() {
  if (!config.accessToken) {
    const e = new Error('Missing ACCESS_TOKEN in configuration');
    e.status = 500;
    throw e;
  }

  try {
    const url = `https://graph.instagram.com/refresh_access_token`;
    const response = await axios.get(url, {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: config.accessToken
      },
      timeout: 10000
    });

    // Update the in-memory config immediately so subsequent requests use the new token
    if (response.data && response.data.access_token) {
      config.accessToken = response.data.access_token;
      logger.info('Instagram access token refreshed successfully in memory');
    }

    return response.data;
  } catch (err) {
    logger.error('Failed to refresh Instagram token', {
      message: err.message,
      body: err?.response?.data || null
    });
    const e = new Error(err?.response?.data?.error?.message || 'Failed to refresh access token');
    e.status = err?.response?.status || 502;
    throw e;
  }
}

export default {
  fetchLatestMedia,
  getMeta,
  refreshLongLivedToken
};

