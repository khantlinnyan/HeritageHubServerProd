import { OpenAI } from 'openai';
import { GoogleGenAI } from '@google/genai';

// export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
Create a ${duration}-day travel itinerary for ${regions.join(', ')}, Myanmar.

Traveler details:
- Budget: ${budget}
- Pace: ${pace}
- Mobility: ${mobility}
- Travel Month: ${travelMonth}

Focus on:
- Historical interests: ${historicalInterests.join(', ')}
- Site preference: ${sitePreference}
- Festivals: ${festivals.length ? festivals.join(', ') : 'no festivals'}
- Activities: ${activities.join(', ')}
- Exploration style: ${explorationStyle}
- Accommodation: ${accommodation}
- Transport: ${transport.join(', ')}
${cuisine ? '- Include Burmese cuisine experiences.' : ''}
${culturalExperiences.length ? `- Add cultural experiences: ${culturalExperiences.join(', ')}.` : ''}
${specialRequests.length ? `- Special requests: ${specialRequests.join(', ')}.` : ''}

For each itinerary item, include:
- Time
- Name
- Description
- A public photo URL (e.g., Unsplash)
- Coordinates: longitude & latitude

Return as valid JSON:
{
  "items": [
    {
      "time": "string",
      "name": "string",
      "description": "string",
      "photoUrl": "string",
      "coordinates": {
        "longitude": number,
        "latitude": number
      }
    }
  ]
}
`;

	const ai = new GoogleGenAI({});

	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: prompt
	});
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
	const result = await model.generateContent(prompt);
	const responseText = result.response.text();

	// Validate and parse JSON response
	let itineraryData;
	try {
		itineraryData = JSON.parse(responseText);
	} catch (error) {
		throw new AppError('Invalid JSON response from Gemini API', 500);
	}

	// Validate response structure
	if (!itineraryData.items || !Array.isArray(itineraryData.items)) {
		throw new AppError('Gemini API response missing items array', 500);
	}

	return itineraryData;
	console.log(response.text);

	// const oneapi = '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';
	// const openai = new OpenAI({
	// 	baseURL: 'https://openrouter.ai/api/v1',
	// 	apiKey: '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'
	// });
	// const response = await openai.chat.completions.create({
	// 	model: 'gpt-4o',
	// 	messages: [{ role: 'user', content: prompt }],
	// 	response_format: 'json' // Correct way for structured JSON output
	// });

	return response.choices[0].message.content;
}
