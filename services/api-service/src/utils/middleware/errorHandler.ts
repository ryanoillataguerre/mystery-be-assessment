import {
	BadRequestError,
	UnauthorizedError,
	NotFoundError,
	UnprocessableEntityError,
} from "../../modules/errors";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
	error: any,
	req: Request,
	res: Response,
	_: NextFunction
) => {
	console.error(`${req.method} - ${req.path}`);
	console.error(error);

	const { name, message, details, stack } = error;
	const response = {
		error: {
			name,
			message,
			details,
			stack,
		},
	};

	if (error instanceof NotFoundError) {
		return res.status(Number(error.code || 404)).send(response);
	}

	if (error instanceof BadRequestError) {
		return res.status(Number(error.code || 400)).send(response);
	}

	if (error instanceof UnauthorizedError) {
		return res.status(Number(error.code || 401)).send(response);
	}

	if (error instanceof UnprocessableEntityError) {
		return res.status(422).send(response);
	}

	return res.status(500).send(response);
};
