import instagramService from '../../services/instagramService.js';

export async function getLatestMedia(req, res, next) {
  try {
    const limit = Math.min(12, Number(req.query.limit) || 6);
    const result = await instagramService.fetchLatestMedia({ limit });
    return res.json({ fromCache: result.fromCache, data: result.items });
  } catch (err) {
    return next(err);
  }
}

export async function getMeta(req, res, next) {
  try {
    const meta = await instagramService.getMeta();
    return res.json({ ok: true, meta });
  } catch (err) {
    return next(err);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const result = await instagramService.refreshLongLivedToken();
    return res.json({
      ok: true,
      message: 'Token refreshed successfully. Please update your .env file with the new token to make it permanent across restarts.',
      data: result
    });
  } catch (err) {
    return next(err);
  }
}

