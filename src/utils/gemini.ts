import { GoogleGenAI, Type } from '@google/genai';
// Initialize Gemini client
export const gemini = new GoogleGenAI({ apiKey: 'AIzaSyA0iJzhWLlHJXwoNay_BeHOIeWrXPCrkfQ' });

// Define the JSON schema for itinerary items
const itinerarySchema = {
	type: Type.ARRAY,
	items: {
		type: Type.OBJECT,
		properties: {
			time: {
				type: Type.STRING,
				description: 'Time of the activity (e.g., "08:00 AM")'
			},
			name: {
				type: Type.STRING,
				description: 'Name of the place (e.g., "Shwezigon Pagoda")'
			},
			description: {
				type: Type.STRING,
				description: 'Brief description of the place or activity'
			},
			photoUrl: {
				type: Type.STRING,
				description: 'Public URL of a photo (e.g., from Unsplash)'
			},
			coordinates: {
				type: Type.OBJECT,
				properties: {
					longitude: {
						type: Type.NUMBER,
						description: 'Longitude of the place'
					},
					latitude: {
						type: Type.NUMBER,
						description: 'Latitude of the place'
					}
				},
				required: ['longitude', 'latitude']
			}
		},
		required: ['time', 'name', 'description', 'coordinates']
	}
};

export async function generateItineraryPrompt(preferences: any): Promise<any> {
	const {
		regions,
		duration,
		travelMonth,
		historicalInterests,
		sitePreference,
		festivals,
		pace,
		activities,
		explorationStyle,
		budget,
		accommodation,
		transport,
		mobility,
		cuisine,
		culturalExperiences,
		specialRequests
	} = preferences;

	const prompt = `
Create a ${duration}-day travel itinerary for ${regions.join(', ')}, Myanmar, for a traveler with a ${budget} budget, ${pace} pace, and ${mobility} mobility. Focus on ${historicalInterests.join(', ')} and ${sitePreference} sites. Include ${festivals.length ? festivals.join(', ') : 'no festivals'}. Add activities: ${activities.join(', ')}. Use ${explorationStyle} exploration style, ${accommodation} accommodation, and ${transport.join(', ')} transport. 
${cuisine ? 'Include Burmese cuisine experiences.' : ''}
${culturalExperiences.length ? `Add cultural experiences: ${culturalExperiences.join(', ')}.` : ''}
${specialRequests.length ? `Special requests: ${specialRequests.join(', ')}.` : ''}

For each itinerary item, include:
- Time (e.g., "08:00 AM")
- Name
- Description
- Public photo URL (e.g., from Unsplash)
- Coordinates (longitude and latitude)

Return a JSON array of itinerary items.
`.trim();

	try {
		// const model = ({ model: 'gemini-1.5-flash' });
		const result = await gemini.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: [{ role: 'user', parts: [{ text: prompt }] }],
			config: {
				responseMimeType: 'application/json',
				responseSchema: itinerarySchema
			}
		});
		console.log(result);

		const response = result.response ?? result;
		const itineraryData = JSON.parse(response.text());

		if (
			!Array.isArray(itineraryData) ||
			!itineraryData.every(
				(item) =>
					item.time &&
					item.name &&
					item.description &&
					item.coordinates &&
					typeof item.coordinates.longitude === 'number' &&
					typeof item.coordinates.latitude === 'number'
			)
		) {
			return { success: false, error: 'Invalid itinerary data from Gemini API' };
		}

		return { success: true, data: itineraryData };
	} catch (error) {
		console.error('Error generating itinerary with Gemini:', error);
		return { success: false, error: 'Failed to generate itinerary' };
	}
}
