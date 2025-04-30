import express, { Request, Response } from 'express';
const router = express.Router();

router.use('/', (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to Revisewise API',
		data: [],
		status: 200
	});
});
export default router;
