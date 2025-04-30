import createError from 'http-errors';

export const handleServiceError = (error: unknown) => {
	if (createError.isHttpError(error)) {
		return error;
	} else if (error instanceof Error) {
		return createError(500, error.message);
	} else if (typeof error === 'string') {
		return createError(500, error);
	}

	return createError(500, 'An unexpected error occurred');
};
