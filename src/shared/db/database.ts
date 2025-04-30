import { DataSource } from 'typeorm';
import 'dotenv/config';

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
	entities: [],
	migrations: ['./src/migrations/*.ts']
});

export default AppDataSource;
