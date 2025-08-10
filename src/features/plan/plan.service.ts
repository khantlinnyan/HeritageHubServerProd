import { placeRepo, itineraryRepo, userRepo, ratingRepo } from '../../shared/common/repo';
import { generateItinerary } from '../../utils/itinerary-generator';
import { handleServiceError } from '../../shared/common/handle-service-error';
import parseTime from '../../utils/parse-time';
import { ItineraryDay } from '../../shared/db/entities/itinerary.entity';

function chunkItemsIntoDays(items: any[], duration: number): ItineraryDay[] {
	const days: ItineraryDay[] = [];
	if (!items || items.length === 0) return days;

	const itemsPerDay = Math.ceil(items.length / duration);
	for (let i = 0; i < duration; i++) {
		const dayItems = items.slice(i * itemsPerDay, (i + 1) * itemsPerDay).sort((a, b) => {
			return parseTime(a.time) - parseTime(b.time);
		});
		days.push({ day: i + 1, items: dayItems });
	}
	return days;
}

export async function createItinerary(preferences: any, userId: string) {
	const itineraryData = await generateItinerary(preferences);
	console.log(itineraryData);
	console.log(preferences);
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
						(item.name && item?.name?.includes('Temple')) || item?.name?.includes('Pagoda') ? 'Temple' : 'Activity',
					region: item.region,
					historicalInterests: item.historicalInterests,
					suggestedTime: item.suggestedTime,
					pace: item.pace,
					activities: item.activities,
					explorationStyle: item.explorationStyle,
					budget: item.budget,
					mobility: item.mobility,
					culturalExperiences: item.culturalExperiences,
					specialRequests: item.specialRequests,
					briefHistory: item.briefHistory,
					rules: item.rules,
					sitePreference: item.sitePreference
				});
			}
			return place;
		})
	);
	const user = await userRepo.findOne({ where: { clerkUserId: userId } });
	if (!user) {
		return handleServiceError('User not found', 404);
	}

	// Map the items to include all details and then chunk them into days
	const fullItems = itineraryData.items.map((item: any, index: number) => ({
		placeId: savedPlaces[index].id,
		time: item.time,
		notes: '',
		name: item.name,
		description: item.description,
		photoUrl: item.photoUrl,
		coordinates: item.coordinates,
		category: item.category,
		id: savedPlaces[index].id,
		region: item.region,
		historicalInterests: item.historicalInterests,
		suggestedTime: item.suggestedTime,
		pace: item.pace,
		activities: item.activities,
		explorationStyle: item.explorationStyle,
		budget: item.budget,
		mobility: item.mobility,
		culturalExperiences: item.culturalExperiences,
		specialRequests: item.specialRequests,
		briefHistory: item.briefHistory,
		rules: item.rules,
		sitePreference: item.sitePreference
	}));

	const days = chunkItemsIntoDays(fullItems, preferences.duration);

	const itinerary = await itineraryRepo.save({
		user,
		title: `${preferences.regions} ${preferences.duration}-Day Plan`,
		duration: preferences.duration,
		days: days,
		checklist: [
			{ task: 'Book activities', completed: false },
			{ task: 'Pack essentials', completed: false },
			{ task: preferences.visaAssistance ? 'Apply for visa/ETAK' : 'Confirm travel documents', completed: false }
		]
	});

	return itinerary;
}

export async function getItinerary(id: string, userId: string) {
	const itinerary = await itineraryRepo
		.createQueryBuilder('itinerary')
		.leftJoinAndSelect('itinerary.user', 'user')
		.where('itinerary.id = :id', { id })
		// Check if the user is the owner OR if the itinerary is public
		.andWhere('(user.clerkUserId = :userId OR itinerary.isPublic = :isPublic)', {
			userId,
			isPublic: true
		})
		.getOne();

	if (!itinerary) {
		throw new Error('Itinerary not found or you do not have access.');
	}

	return itinerary;
}

export async function getItineraryByUserId(userId: string) {
	const itinerary = await itineraryRepo.find({ where: { user: { clerkUserId: userId } } });
	if (!itinerary) throw new Error('Itinerary not found');
	return itinerary;
}

export async function getItineraryItem(id: string, userId: string) {
	const itinerary = await itineraryRepo.findOne({ where: { user: { clerkUserId: userId } }, relations: ['user'] });
	if (!itinerary) throw new Error('Itinerary not found');

	// Use flatMap to search for the item across all days
	const allItems = itinerary.days.flatMap((day) => day.items);
	const item = allItems.find((i) => i.placeId === placeId);
	if (!item) throw new Error('Itinerary item not found');
	return item;
}

export async function getPublicItineraries(userId: string) {
	const itineraries = await itineraryRepo
		.createQueryBuilder('itinerary')
		.leftJoinAndSelect('itinerary.user', 'user')
		.leftJoin('itinerary.ratings', 'rating')
		.where('itinerary.isPublic = :isPublic', { isPublic: true })
		.andWhere('user.clerkUserId != :userId', { userId })
		.addSelect('AVG(rating.value)', 'averageRating')
		.addSelect('COUNT(rating.id)', 'ratingCount')
		.groupBy('itinerary.id, user.id')
		.getMany();

	return itineraries;
}

export async function updateItineraryVisibility(id: string, userId: string, isPublic: boolean) {
	const itinerary = await itineraryRepo.findOne({ where: { id, user: { clerkUserId: userId } } });
	if (!itinerary) throw new Error('Itinerary not found or you are not the owner');

	itinerary.isPublic = isPublic;
	return itineraryRepo.save(itinerary);
}

export async function addRating(itineraryId: string, userId: string, value: number) {
	if (value < 1 || value > 5) throw new Error('Rating value must be between 1 and 5');

	const user = await userRepo.findOne({ where: { clerkUserId: userId } });
	if (!user) throw new Error('User not found');

	const itinerary = await itineraryRepo.findOne({ where: { id: itineraryId } });
	if (!itinerary) throw new Error('Itinerary not found');

	const existingRating = await ratingRepo.findOne({ where: { user, itinerary } });
	if (existingRating) {
		existingRating.value = value;
		return ratingRepo.save(existingRating);
	}

	const newRating = ratingRepo.create({ user, itinerary, value });
	return ratingRepo.save(newRating);
}

export async function updateItinerary(
	id: string,
	days: ItineraryDay[],
	title: string,
	duration: number,
	isPublic: boolean
) {
	let itinerary = await itineraryRepo.findOne({ where: { id } });
	if (!itinerary) return Error('Itinerary not found');
	itinerary.days = days;
	itinerary.title = title;
	itinerary.duration = duration;
	itinerary.isPublic = isPublic;
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

export async function deleteItinerary(id: string, userId: string) {
	const itinerary = await itineraryRepo.findOne({ where: { id, user: { clerkUserId: userId } } });
	if (!itinerary) throw new Error('Itinerary not found or you are not the owner');
	return itineraryRepo.remove(itinerary);
}

export async function getPlaces() {
	const places = await placeRepo.find();
	return places;
}
