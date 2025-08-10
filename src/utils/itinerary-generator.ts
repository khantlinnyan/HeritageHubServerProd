import itineraryData from '../shared/db/bagan-dataset.json';

function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export async function generateItinerary(preferences: any): Promise<any> {
	const {
		regions = '',
		duration,
		travelMonth,
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

	// A simple check to ensure the duration is a valid number.
	if (!duration || typeof duration !== 'number' || duration <= 0) {
		throw new Error('Duration must be a positive number');
	}

	// Step 1: Filter the entire dataset based on all preferences.
	let filteredItems = itineraryData.filter((item) => {
		// --- Core Filter Conditions (must match) ---
		// Check if the item's region matches the user's preference.
		const matchesRegion = regions
			? Array.isArray(regions)
				? regions.includes(item.region)
				: item.region === regions
			: true;

		// Check if sitePreference is 'mixed' or matches the item's preference.
		const matchesSitePreference = sitePreference
			? sitePreference === 'mixed'
				? true
				: item.sitePreference === sitePreference
			: true;

		// Check if the item's exploration style is 'mixed' or matches the user's preference.
		const matchesExplorationStyle = explorationStyle
			? explorationStyle === 'mixed'
				? true
				: item.explorationStyle && Array.isArray(item.explorationStyle)
					? item.explorationStyle.includes(explorationStyle)
					: item.explorationStyle === explorationStyle
			: true;

		// Check if the item's budget matches the user's preference.
		const matchesBudget = budget
			? item.budget && Array.isArray(item.budget)
				? item.budget.includes(budget)
				: item.budget === budget
			: true;

		// Check if the item's mobility matches the user's preference.
		const matchesMobility = mobility
			? item.mobility && Array.isArray(item.mobility)
				? item.mobility.includes(mobility)
				: item.mobility === mobility
			: true;

		// --- Flexible Filter Conditions (at least one must match if provided) ---
		// Check for overlap in historical interests.
		const matchesHistoricalInterests = historicalInterests.length
			? item.historicalInterests && Array.isArray(item.historicalInterests)
				? item.historicalInterests.some((hi) => historicalInterests.includes(hi))
				: false
			: true;

		// Check for overlap in activities.
		const matchesActivities = activities.length
			? item.activities && Array.isArray(item.activities)
				? item.activities.some((act) => activities.includes(act))
				: false
			: true;

		// Check for overlap in cultural experiences.
		const matchesCulturalExperiences = culturalExperiences.length
			? item.culturalExperiences && Array.isArray(item.culturalExperiences)
				? item.culturalExperiences.some((ce) => culturalExperiences.includes(ce))
				: false
			: true;

		// The original code checked for cuisine in culturalExperiences.
		// This is a reasonable assumption based on the data.
		const matchesCuisine = cuisine
			? item.culturalExperiences && Array.isArray(item.culturalExperiences)
				? item.culturalExperiences.includes(cuisine)
				: false
			: true;

		// Check for overlap in special requests.
		const matchesSpecialRequests = specialRequests.length
			? item.specialRequests && Array.isArray(item.specialRequests)
				? item.specialRequests.some((sr) => specialRequests.includes(sr))
				: false
			: true;

		// Check if the item's pace matches the user's preference.
		const matchesPace = pace
			? item.pace && Array.isArray(item.pace)
				? item.pace.includes(pace)
				: item.pace === pace
			: true;

		return (
			matchesRegion &&
			(matchesSitePreference ||
				matchesHistoricalInterests ||
				matchesBudget ||
				matchesPace ||
				matchesActivities ||
				matchesCulturalExperiences)
		);
	});

	const shuffledItems = shuffleArray(filteredItems);
	const itemsPerDay = pace === 'slow' ? 2 : pace === 'moderate' ? 3 : pace === 'fast' ? 4 : 2;
	const totalItems = duration * itemsPerDay;

	filteredItems = shuffledItems.slice(0, totalItems);

	const items = filteredItems.map((item) => ({
		time: item.suggestedTime || null,
		name: item.name || 'Unnamed Site',
		description: item.description || '',
		photoUrl: item.photoUrl || '',
		coordinates: item.coordinates || null,
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

	return { items };
}
