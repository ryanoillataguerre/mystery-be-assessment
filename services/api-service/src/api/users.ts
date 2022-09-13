import { randomUUID } from "crypto";
import { NextFunction, Request, Response, Router } from "express";
import { body, param } from "express-validator";
import {
	LoanApplication,
	LoanApplicationInterface,
	LoanApplicationStatus,
	User,
	UserInterface,
	UserRelationMapping,
} from "../db";
import { submitApplication } from "../modules/applications";
import { BadRequestError, NotFoundError } from "../modules/errors";
import { handleValidationErrors } from "../utils";

const router: Router = Router();

// Create Application
router.post(
	"/:user_id/applications",
	[
		param("user_id").isString().exists(),
		body("credit_score").isNumeric().exists(),
		body("monthly_income").isNumeric().exists(),
		body("monthly_debt").isNumeric().exists(),
		body("bankruptcies").isNumeric().exists(),
		body("delinquencies").isNumeric().exists(),
		body("vehicle_value").isNumeric().exists(),
		body("loan_amount").isNumeric().exists(),
	],
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			handleValidationErrors(req);
			// Validate user doesn't have an active application
			const { body, params } = req;
			const activeUserApp = await LoanApplication.query().where({
				user_id: params.user_id,
				status: LoanApplicationStatus.Active,
			});
			if (activeUserApp.length) {
				throw new BadRequestError(
					"User already has an active application, ID: " +
						activeUserApp?.[0]?.id
				);
			}
			const newApplication: LoanApplicationInterface = {
				id: randomUUID(),
				user_id: params.user_id,
				credit_score: body.credit_score,
				monthly_income: body.monthly_income,
				monthly_debt: body.monthly_debt,
				bankruptcies: body.bankruptcies,
				delinquencies: body.delinquencies,
				vehicle_value: body.vehicle_value,
				loan_amount: body.loan_amount,
				status: LoanApplicationStatus.Active,
			};

			const app = await LoanApplication.query().insertAndFetch(newApplication);

			res.status(200).send({
				data: app,
			});
		} catch (err) {
			next(err);
		}
	}
);

// Patch application by user ID
router.patch(
	"/:user_id/application",
	[
		param("user_id").isString().exists(),
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
			if (req.params?.user_id) {
				const userActiveApp = await LoanApplication.query().findOne({
					user_id: req.params.user_id,
					status: LoanApplicationStatus.Active,
				});

				let updates: LoanApplicationInterface = {};

				if (userActiveApp) {
					for (const updateKey of Object.keys(req.body)) {
						// @ts-ignore - wouldn't normally do this but don't want to spend too much time debugging
						updates[updateKey] = req.body[updateKey];
					}
				}

				if (Object.keys(updates).length) {
					const app = await LoanApplication.query().patchAndFetchById(
						userActiveApp?.id as string,
						updates
					);
					res.status(200).send({
						data: app,
					});
				}
			} else {
				throw new BadRequestError("user_id is required");
			}
		} catch (err) {
			next(err);
		}
	}
);

// Delete application by User ID
router.delete(
	"/:user_id/application",
	[param("user_id").isString().exists()],
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			handleValidationErrors(req);
			if (req.params?.user_id) {
				const userActiveApp = await LoanApplication.query().findOne({
					user_id: req.params.user_id,
					status: LoanApplicationStatus.Active,
				});

				if (userActiveApp) {
					await userActiveApp.$query().patch({
						status: LoanApplicationStatus.Inactive,
					});
				}
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

// Submit user's application
router.post(
	"/:user_id/application/submit",
	[param("user_id").isString().exists()],
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			handleValidationErrors(req);
			const application = await LoanApplication.query().findOne({
				user_id: req.params.user_id,
				status: LoanApplicationStatus.Active,
			});
			if (!application) {
				throw new NotFoundError("Loan Application not found for user");
			} else {
				const data = await submitApplication(application.id as string);
				res.status(200).send({
					data,
				});
			}
		} catch (err) {
			next(err);
		}
	}
);

// Create User
router.post(
	"/",
	[body("id").isString(), body("name").isString()],
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			handleValidationErrors(req);
			if (req.body?.id) {
				const existingUser = await User.query().findById(req.body?.id);
				if (existingUser) {
					throw new BadRequestError("User with ID already exists");
				}
			}
			const newUser: UserInterface = {
				id: req.body.id,
				name: req.body.name,
			};

			const user = await User.query().insertAndFetch(newUser);

			res.status(200).send({
				data: user,
			});
		} catch (err) {
			next(err);
		}
	}
);

// Get Users
router.get("/", async (_: Request, res: Response, next: NextFunction) => {
	try {
		const users = await User.query();
		res.status(200).send({
			data: users,
		});
	} catch (err) {
		next(err);
	}
});

// Get User by ID
router.get(
	"/:userId",
	[param("userId").isString()],
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			handleValidationErrors(req);
			if (req.params.userId) {
				const user = await User.query()
					.findById(req.params?.userId)
					.withGraphFetched(
						`${UserRelationMapping.LoanApplications}(filterActiveApps)`
					)
					.withGraphFetched(UserRelationMapping.LoanOffers)
					.modifiers({
						// Filter for active applications only
						filterActiveApps: (builder: any) => {
							builder.where("status", LoanApplicationStatus.Active);
						},
					});

				res.status(200).send({
					data: user,
				});
			} else {
				throw new BadRequestError("userId is required");
			}
		} catch (err) {
			next(err);
		}
	}
);

export default router;
