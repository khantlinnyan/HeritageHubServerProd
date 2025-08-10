import { placeRepo } from '../../shared/common/repo';

export async function getDetailPlace(id: string) {
	const place = await placeRepo.findOne({ where: { id } });
	if (!place) throw new Error('Place not found');
	return place;
}

export async function getPlaces() {
	const places = await placeRepo.find();
	return places;
}
