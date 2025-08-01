import { Response } from 'express';

interface ApiResponse<T> {
	status: 'success' | 'error';
	message: string;
	data: T | null;
}

export const responseFn = <T>(res: Response, statusCode: number, message: string, data: T | null = null): void => {
	res.status(statusCode).json({
		status: 'success',
		message,
		data
	} as ApiResponse<T>);
};
