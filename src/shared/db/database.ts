import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from './entities/user.entitiy';
import { Itinerary } from './entities/itinerary.entity';
import { Place } from './entities/place.entity';
import { Rating } from './entities/rating.entity';

// const isProduction = process.env.NODE_ENV === "production";
const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.PGHOST,
	port: Number(process.env.PGPORT),
	username: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
	synchronize: true,
	logging: false,
	entities: [User, Itinerary, Place, Rating],
	migrations: ['./src/migrations/*.ts']
});

export default AppDataSource;
