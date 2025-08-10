import { Router } from 'express';
import {
	createItineraryHandler,
	updateItineraryHandler,
	getChecklistHandler,
	updateChecklistItemHandler,
	getItineraryHandler,
	getItineraryItemHandler,
	getItineraryByUserIdHandler,
	getPlacesHandler,
	getPublicItinerariesHandler,
	deleteItineraryHandler
} from './plan.controller';

const router = Router();
router.get('/places', getPlacesHandler);
router.get('/public', getPublicItinerariesHandler);

router.post('/recommend', createItineraryHandler);
router.patch('/:id', updateItineraryHandler);
router.get('/:id/checklist', getChecklistHandler);
router.patch('/:id/checklist/:taskId', updateChecklistItemHandler);
router.get('/:id', getItineraryHandler);
router.get('/:id/:placeId', getItineraryItemHandler);
router.get('/', getItineraryByUserIdHandler);
router.delete('/:id', deleteItineraryHandler);

export default router;
