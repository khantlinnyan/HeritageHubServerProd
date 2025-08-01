import itineraryData from '../shared/db/bagan-dataset.json';

export async function generateItinerary(preferences: any): Promise<any> {
	const {
		// regions,
		duration,
		// travelMonth,
		historicalInterests = [],
		sitePreference,
		pace,
		activities = [],
		explorationStyle,
		budget,
		mobility,
		cuisine,
		culturalExperiences = [],
		specialRequests = []
	} = preferences;

	if (!duration || typeof duration !== 'number') {
		throw new Error('Duration must be a number');
	}

	let filteredItems = itineraryData.filter((item) => {
		const matchesRegion = item.region === 'Bagan';

		const matchesHistoricalInterests = historicalInterests.length
			? Array.isArray(item.historicalInterests)
				? item.historicalInterests.some((hi) => historicalInterests.includes(hi))
				: false
			: true;

		const matchesSitePreference = sitePreference ? item.sitePreference === sitePreference : true;

		const matchesPace = pace
			? item.pace
				? Array.isArray(item.pace)
					? item.pace.includes(pace)
					: item.pace === pace
				: false
			: true;

		const matchesActivities = activities.length
			? Array.isArray(item.activities)
				? item.activities.some((act) => activities.includes(act))
				: false
			: true;

		const matchesExplorationStyle = explorationStyle
			? item.explorationStyle
				? Array.isArray(item.explorationStyle)
					? item.explorationStyle.includes(explorationStyle)
					: item.explorationStyle === explorationStyle
				: false
			: true;

		const matchesBudget = budget
			? item.budget
				? Array.isArray(item.budget)
					? item.budget.includes(budget)
					: item.budget === budget
				: false
			: true;

		const matchesMobility = mobility
			? item.mobility
				? Array.isArray(item.mobility)
					? item.mobility.includes(mobility)
					: item.mobility === mobility
				: false
			: true;

		const matchesCulturalExperiences = culturalExperiences.length
			? Array.isArray(item.culturalExperiences)
				? item.culturalExperiences.some((ce) => culturalExperiences.includes(ce))
				: false
			: true;

		const matchesSpecialRequests = specialRequests.length
			? Array.isArray(item.specialRequests)
				? item.specialRequests.some((sr) => specialRequests.includes(sr))
				: false
			: true;

		const matchesCuisine = cuisine
			? Array.isArray(item.culturalExperiences)
				? item.culturalExperiences.includes('cuisine')
				: false
			: true;

		return (
			matchesRegion &&
			matchesHistoricalInterests &&
			matchesSitePreference &&
			matchesPace &&
			matchesActivities &&
			matchesExplorationStyle &&
			matchesBudget &&
			matchesMobility &&
			matchesCulturalExperiences &&
			matchesSpecialRequests &&
			matchesCuisine
		);
	});

	const itemsPerDay = pace === 'fast' ? 4 : 2;
	const totalItems = duration * itemsPerDay;

	filteredItems = filteredItems.slice(0, totalItems);

	if (filteredItems.length < totalItems) {
		const fallbackItems = itineraryData
			.filter((item) => item.region === 'Bagan')
			.slice(0, totalItems - filteredItems.length);

		filteredItems = [...filteredItems, ...fallbackItems];
	}

	const items = filteredItems.map((item) => ({
		time: item.suggestedTime || null,
		name: item.name || 'Unnamed Site',
		description: item.description || '',
		photoUrl: item.photoUrl || '',
		coordinates: item.coordinates || null
	}));

	return { items };
}
