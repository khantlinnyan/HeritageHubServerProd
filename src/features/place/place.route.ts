import { Router } from 'express';
import { getPlacesHandler, getDetailPlaceHandler } from './place.controller';

const router = Router();
router.get('/', getPlacesHandler);
router.get('/:id', getDetailPlaceHandler);

export default router;
