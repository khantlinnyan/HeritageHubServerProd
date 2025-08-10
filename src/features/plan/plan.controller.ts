import { Request, Response, NextFunction } from 'express';
import {
	createItinerary,
	updateItinerary,
	getChecklist,
	updateChecklistItem,
	getItinerary,
	getItineraryItem,
	getItineraryByUserId,
	getPlaces,
	getPublicItineraries,
	deleteItinerary
} from './plan.service';
import { responseFn } from '../../shared/common/responseFn';
import { clerkClient, getAuth } from '@clerk/express';

export async function createItineraryHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const { preferences, userId } = req.body;

		const itinerary = await createItinerary(preferences, userId);

		responseFn(res, 200, 'Itinerary created successfully', itinerary);
	} catch (error) {
		next(error);
	}
}

export async function updateItineraryHandler(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { days, title, duration, isPublic } = req.body;

		const itinerary = await updateItinerary(id, days, title, duration, isPublic);
		responseFn(res, 200, 'Itinerary updated successfully', itinerary);
	} catch (error: any) {
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
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new Error('Authorization header missing or invalid');
		}

		const userId = authHeader.split(' ')[1];
		if (!userId) throw new Error('User ID not found');
		const itinerary = await getItinerary(id, userId);
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
		responseFn(res, 200, 'Places retrieved successfully', places);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			status: 500
		});
	}
}

export async function getPublicItinerariesHandler(req: Request, res: Response) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new Error('Authorization header missing or invalid');
	}

	const userId = authHeader.split(' ')[1];
	if (!userId) throw new Error('User ID not found');
	try {
		const publicItineraries = await getPublicItineraries(userId);
		responseFn(res, 200, 'Public itineraries retrieved successfully', publicItineraries);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			status: 500
		});
	}
}

export async function deleteItineraryHandler(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new Error('Authorization header missing or invalid');
		}

		const userId = authHeader.split(' ')[1];
		if (!userId) throw new Error('User ID not found');
		const itinerary = await deleteItinerary(id, userId);
		responseFn(res, 200, 'Itinerary deleted successfully', itinerary);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			status: 500
		});
	}
}

export async function updateItineraryVisibilityHandler(req: Request, res: Response) {
	const { userId } = req.auth;

	if (!userId) {
		return null;
	}

	const user = await clerkClient.users.getUser(userId);
	if (!userId) return res.status(401).json({ error: 'Unauthorized' });
	try {
		const updatedItinerary = await updateItineraryVisibility(req.params.id, userId, req.body.isPublic);
		res.status(200).json({ data: updatedItinerary });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}
