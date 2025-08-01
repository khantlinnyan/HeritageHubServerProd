import { Router } from 'express';
import {
	createItineraryHandler,
	updateItineraryHandler,
	getChecklistHandler,
	updateChecklistItemHandler,
	getItineraryHandler,
	getItineraryItemHandler,
	getItineraryByUserIdHandler,
	getPlacesHandler
} from './plan.controller';

const router = Router();
router.get('/places', getPlacesHandler);
router.post('/recommend', createItineraryHandler);
router.patch('/:id', updateItineraryHandler);
router.get('/:id/checklist', getChecklistHandler);
router.patch('/:id/checklist/:taskId', updateChecklistItemHandler);
router.get('/:id', getItineraryHandler);
router.get('/:id/:placeId', getItineraryItemHandler);
router.get('/', getItineraryByUserIdHandler);

export default router;
