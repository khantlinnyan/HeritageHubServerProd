import { Request, Response, NextFunction } from 'express';
import {
	createItinerary,
	updateItinerary,
	getChecklist,
	updateChecklistItem,
	getItinerary,
	getItineraryItem,
	getItineraryByUserId,
	getPlaces
} from './plan.service';
import { responseFn } from '../../shared/common/responseFn';

export async function createItineraryHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const { preferences, userId } = req.body;
		console.log('Received preferences:', preferences);
		console.log('Received userId:', userId);

		const itinerary = await createItinerary(preferences, userId);
		console.log(itinerary);
		responseFn(res, 200, 'Itinerary created successfully', itinerary);
	} catch (error) {
		next(error);
	}
}

export async function updateItineraryHandler(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { items } = req.body;
		const itinerary = await updateItinerary(id, items);
		responseFn(res, 200, 'Itinerary updated successfully', itinerary);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			status: 500
		});
	}
}

export async function getChecklistHandler(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const checklist = await getChecklist(id);
		responseFn(res, 200, 'Checklist retrieved successfully', checklist);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			status: 500
		});
	}
}

export async function updateChecklistItemHandler(req: Request, res: Response) {
	try {
		const { id, taskId } = req.params;
		const { completed } = req.body;
		const checklist = await updateChecklistItem(id, parseInt(taskId), completed);
		responseFn(res, 200, 'Checklist item updated successfully', checklist);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			status: 500
		});
	}
}

export async function getItineraryHandler(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const itinerary = await getItinerary(id);
		responseFn(res, 200, 'Itinerary retrieved successfully', itinerary);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			status: 500
		});
	}
}

export async function getItineraryByUserIdHandler(req: Request, res: Response) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new Error('Authorization header missing or invalid');
		}

		const userId = authHeader.split(' ')[1];
		if (!userId) throw new Error('User ID not found');
		const itinerary = await getItineraryByUserId(userId as string);
		responseFn(res, 200, 'Itinerary retrieved successfully', itinerary);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			status: 500
		});
	}
}

export async function getItineraryItemHandler(req: Request, res: Response) {
	try {
		const { id, placeId } = req.params;
		const item = await getItineraryItem(id, placeId);
		res.status(200).json(item);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			status: 500
		});
	}
}
export async function getPlacesHandler(req: Request, res: Response) {
	try {
		const places = await getPlaces();
		console.log(places);
		responseFn(res, 200, 'Places retrieved successfully', places);
	} catch (error) {
		res.status(500).json({});
	}
}
