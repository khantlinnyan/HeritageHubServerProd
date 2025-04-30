import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import errorHandler from './shared/common/error-handler';
import routes from './routes';
import AppDataSource from './shared/db/database';
const app = express();
// const corsOptions = {
// 	origin: ['http://localhost:5431', 'https://revisewise.vercel.app'],
// 	methods: ['GET', 'POST', 'PUT', 'DELETE'],
// 	credentials: true
// };

// app.options('*', cors(corsOptions));
app.use(cors({ credentials: true }));
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(passport.initialize());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	validate: { xForwardedForHeader: false }
});
app.use('/api/v1', routes);
app.use(limiter);
app.use(errorHandler);

// app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// const runSeeds = async () => {
//   try {
//     await AppDataSource.initialize();
//     console.log("Database connected!");

//     console.log("Seeding permissions...");
//     await seedPermissions();

//     console.log("Seeding roles...");
//     await seedRoles();

//     console.log("Assigning permissions to roles...");
//     await seedRolePermissions();

//     console.log("All seeds completed successfully!");
//   } catch (error) {
//     console.error("Error running seeds:", error);
//   }
// };

const startServer = async () => {
	try {
		await AppDataSource.initialize();
		console.log('Database initialized!');
		const port = process.env.PORT;
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (error) {
		console.error('Error starting server:', error);
		process.exit(1);
	}
};

startServer();
