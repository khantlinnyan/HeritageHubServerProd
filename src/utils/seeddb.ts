import AppDataSource from '../shared/db/database';
import { Place } from '../shared/db/entities/place.entity';
import rawData from '../shared/db/bagan-dataset.json';
import { In } from 'typeorm';

export async function seedDatabase() {
	try {
		await AppDataSource.initialize();
		console.log('Data Source has been initialized!');

		// Optional: clear the table before seeding to prevent duplicate data
		await AppDataSource.manager.query(`TRUNCATE TABLE place RESTART IDENTITY CASCADE`);
		console.log('Table `place` has been truncated.');

		const placeRepository = AppDataSource.getRepository(Place);

		// check is data is already exists or not by name if exists skip to next
		const existingPlaces = await placeRepository.find({ where: { name: In(rawData.map((item) => item.name)) } });
		const placesToSeed = rawData.filter((item) => !existingPlaces.some((place) => place.name === item.name));
		console.log('Places to seed:', placesToSeed.length);
		const placesToSeedData = placesToSeed.map((item) => {
			const newPlace = new Place();
			newPlace.name = item.name;
			newPlace.description = item.description;
			newPlace.photoUrl = item.photoUrl;
			newPlace.category = item.category;

			newPlace.coordinates = {
				type: 'Point',
				coordinates: [item.coordinates.longitude, item.coordinates.latitude]
			};

			newPlace.region = item.region;
			newPlace.historicalInterests = item.historicalInterests;
			newPlace.sitePreference = item.sitePreference;
			newPlace.suggestedTime = item.suggestedTime;
			newPlace.pace = item.pace;
			newPlace.activities = item.activities;
			newPlace.explorationStyle = item.explorationStyle;
			newPlace.budget = item.budget;
			newPlace.mobility = item.mobility;
			newPlace.culturalExperiences = item.culturalExperiences;
			newPlace.specialRequests = item.specialRequests;
			newPlace.briefHistory = item.briefHistory;
			newPlace.rules = item.rules;
			return newPlace;
		});
		await placeRepository.save(placesToSeedData);
		console.log('Database seeded successfully!');
	} catch (err) {
		console.error('Error during seeding:', err);
	}
}

seedDatabase();
