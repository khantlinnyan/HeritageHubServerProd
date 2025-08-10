import { responseFn } from '../../shared/common/responseFn';
import { getDetailPage, getDetailPlace, getPlaces } from './place.service';
import { Request, Response } from 'express';

export async function getPlacesHandler(req: Request, res: Response) {
	try {
		const places = await getPlaces();
		responseFn(res, 200, 'Places retrieved successfully', places);
	} catch (error) {
		res.status(500).json({});
	}
}

export async function getDetailPlaceHandler(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const place = await getDetailPlace(id);
		console.log(place);
		responseFn(res, 200, 'Place retrieved successfully', place);
	} catch (error) {
		res.status(500).json({});
	}
}
