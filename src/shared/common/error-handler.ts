import { Request, Response } from 'express';

const errorHandler = (err: any, req: Request, res: Response) => {
	const statusCode = err.status || 500;
	const message = err.message || 'An unknown error occurred.';
	res.status(statusCode).json({
		success: false,
		message: message,
		data: [],
		status: statusCode
	});
};

export default errorHandler;
