import { NextFunction, Request, Response, Router } from "express";
import { body, param } from "express-validator";
import {
	LoanApplication,
	LoanApplicationInterface,
	LoanApplicationStatus,
} from "../db";
import { BadRequestError } from "../modules/errors";
import {
	deleteApplicationById,
	patchApplication,
	submitApplication,
} from "../modules/applications";
import { handleValidationErrors } from "../utils";

const router: Router = Router();

router.patch(
	"/:application_id",
	[
		param("application_id").isString().exists(),
		body("credit_score").isNumeric().optional(),
		body("monthly_income").isNumeric().optional(),
		body("monthly_debt").isNumeric().optional(),
		body("bankruptcies").isNumeric().optional(),
		body("delinquencies").isNumeric().optional(),
		body("vehicle_value").isNumeric().optional(),
		body("loan_amount").isNumeric().optional(),
	],
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			handleValidationErrors(req);

			const response = await patchApplication(
				req.params?.application_id,
				req.body
			);
			res.status(200).send({
				data: response,
			});
		} catch (err) {
			next(err);
		}
	}
);

// Delete application by User ID
router.delete(
	"/:application_id",
	[param("application_id").isString().exists()],
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			handleValidationErrors(req);
			if (req.params?.application_id) {
				await deleteApplicationById(req.params?.application_id);
			}

			res.status(200).send({
				data: {
					success: true,
				},
			});
		} catch (err) {
			next(err);
		}
	}
);

router.post(
	"/:application_id/submit",
	[param("application_id").isString().exists()],
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			handleValidationErrors(req);
			const data = await submitApplication(req.params.application_id);
			res.status(200).send({
				data,
			});
		} catch (err) {
			next(err);
		}
	}
);

export default router;
