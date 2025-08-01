import { placeRepo, itineraryRepo, userRepo } from '../../shared/common/repo';
import { generateItinerary } from '../../utils/itinerary-generator';
import { handleServiceError } from '../../shared/common/handle-service-error';
import parseTime from '../../utils/parse-time';

export async function createItinerary(preferences: any, userId: string) {
	const itineraryData = await generateItinerary(preferences);
	if (!itineraryData) {
		throw new Error('No itinerary generated');
	}

	const savedPlaces = await Promise.all(
		itineraryData.items.map(async (item: any) => {
			const place = await placeRepo.findOne({ where: { name: item.name } });
			if (!place) {
				return placeRepo.save({
					name: item?.name,
					description: item?.description,
					photoUrl: item?.photoUrl || 'https://unsplash.com/photos/fallback',
					coordinates: {
						type: 'Point',
						coordinates: [item?.coordinates?.longitude, item?.coordinates?.latitude]
					},
					category:
						(item.name && item?.name?.includes('Temple')) || item?.name?.includes('Pagoda') ? 'Temple' : 'Activity'
				});
			}
			return place;
		})
	);
	const user = await userRepo.findOne({ where: { clerkUserId: userId } });
	if (!user) {
		return handleServiceError('User not found', 404);
	}
	const itinerary = await itineraryRepo.save({
		user,
		title: `Bagan ${preferences.duration}-Day Tour`,
		duration: preferences.duration,
		items: itineraryData.items.map((item: any, index: number) => ({
			placeId: savedPlaces[index].id,
			time: item.time,
			notes: '',
			name: item.name,
			description: item.description,
			photoUrl: item.photoUrl,
			coordinates: item.coordinates
		})),
		checklist: [
			{ task: 'Book activities', completed: false },
			{ task: 'Pack essentials', completed: false },
			{ task: preferences.visaAssistance ? 'Apply for visa/ETAK' : 'Confirm travel documents', completed: false }
		]
	});

	return itinerary;
}

export async function getItinerary(id: string) {
	const itinerary = await itineraryRepo.findOne({ where: { id } });
	if (!itinerary) throw new Error('Itinerary not found');

	// Split items evenly into days
	const itemsPerDay = Math.ceil(itinerary.items.length / itinerary.duration);
	const days: { day: number; items: typeof itinerary.items }[] = [];

	for (let i = 0; i < itinerary.duration; i++) {
		const dayItems = itinerary.items.slice(i * itemsPerDay, (i + 1) * itemsPerDay).sort((a, b) => {
			return parseTime(a.time) - parseTime(b.time);
		});

		days.push({ day: i + 1, items: dayItems });
	}

	return {
		...itinerary,
		days
	};
}

export async function getItineraryByUserId(userId: string) {
	const itinerary = await itineraryRepo.find({ where: { user: { clerkUserId: userId } } });
	if (!itinerary) throw new Error('Itinerary not found');
	return itinerary;
}

export async function getItineraryItem(id: string, placeId: string) {
	const itinerary = await itineraryRepo.findOne({ where: { id } });
	if (!itinerary) throw new Error('Itinerary not found');
	const item = itinerary.items.find((i) => i.placeId === placeId);
	if (!item) throw new Error('Itinerary item not found');
	return item;
}

export async function updateItinerary(id: string, items: any[]) {
	const itinerary = await itineraryRepo.findOne({ where: { id } });
	if (!itinerary) return Error('Itinerary not found');
	itinerary.items = items;
	return itineraryRepo.save(itinerary);
}

export async function getChecklist(id: string) {
	const itinerary = await itineraryRepo.findOne({ where: { id } });
	if (!itinerary) return handleServiceError('Itinerary not found', 404);
	return itinerary.checklist;
}

export async function updateChecklistItem(id: string, taskId: number, completed: boolean) {
	const itinerary = await itineraryRepo.findOne({ where: { id } });
	if (!itinerary) return handleServiceError('Itinerary not found', 404);
	itinerary.checklist[taskId] = { ...itinerary.checklist[taskId], completed };
	return itineraryRepo.save(itinerary);
}

export async function getPlaces() {
	const places = await placeRepo.find();
	return places;
}
