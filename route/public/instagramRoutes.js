import express from 'express';
import * as instagramController from '../../controllers/publicController/instagramController.js';

const router = express.Router();

router.get('/', instagramController.getLatestMedia);
router.get('/meta', instagramController.getMeta);
router.get('/refresh', instagramController.refreshToken);

export default router;

