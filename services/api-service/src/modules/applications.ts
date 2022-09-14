import { randomUUID } from "crypto";
import { pmt } from "financial";
import {
	LoanApplication,
	LoanApplicationInterface,
	LoanApplicationStatus,
	LoanOffer,
	LoanOfferInterface,
} from "../db";
import { NotFoundError } from "./errors";

const retrieveAPRFromApplication = (
	application: LoanApplication
): number | boolean => {
	const crScore = application.credit_score as number;
	if (crScore >= 780) {
		return 0.02;
	}
	if (crScore >= 720) {
		return 0.05;
	}
	if (crScore >= 660) {
		return 0.08;
	}
	return false;
};

export const submitApplication = async (application_id: string) => {
	// Retrieve application
	const application = await LoanApplication.query().findById(application_id);
	if (!application || application.status === LoanApplicationStatus.Inactive) {
		throw new NotFoundError(
			"Application not found for supplied application_id"
		);
	}

	let newLoanOffer: Partial<LoanOfferInterface> = {
		id: randomUUID(),
		user_id: application.user_id,
		loan_application_id: application.id,
		term_length_months: 72,
	};

	let rejected = false;
	let rejectionReasons: string[] = [];

	// Filter decisions
	const apr = retrieveAPRFromApplication(application);
	if (!apr) {
		rejected = true;
		rejectionReasons = [...rejectionReasons, "Credit too low"];
	}
	if (application.bankruptcies ?? 0 > 0) {
		rejected = true;
		rejectionReasons = [...rejectionReasons, "Bankruptcy count too high"];
	}
	if (application.delinquencies ?? 0 > 1) {
		rejected = true;
		rejectionReasons = [...rejectionReasons, "Delinquency count too high"];
	}
	// Calculate loan offer monthly payment
	const monthlyPayment = pmt(
		Number(apr) / 12,
		newLoanOffer.term_length_months as number,
		application.loan_amount as number
	);

	const okDTIRatio =
		Number(application.monthly_debt) + -monthlyPayment <
		0.6 * Number(application.monthly_income);
	const ltvRatio =
		Number(application.loan_amount) / Number(application.vehicle_value);

	// Disqualifying on income/debt
	if (!okDTIRatio) {
		rejected = true;
		rejectionReasons = [...rejectionReasons, "DTI Ratio is too high"];
	}
	if (ltvRatio > 1) {
		rejected = true;
		rejectionReasons = [...rejectionReasons, "LTV Ratio is too high"];
	}
	if (rejected) {
		newLoanOffer.accept = false;
		newLoanOffer.reasons = rejectionReasons;
	} else {
		newLoanOffer.apr = Number(apr);
		newLoanOffer.monthly_payment = (-monthlyPayment * 100) / 100;
		newLoanOffer.accept = true;
	}

	const newOffer = await LoanOffer.query().insertAndFetch(newLoanOffer);
	return newOffer;
};

export const deleteApplicationById = async (application_id: string) => {
	return await LoanApplication.query().findById(application_id).patch({
		status: LoanApplicationStatus.Inactive,
	});
};

export const patchApplication = async (
	application_id: string,
	updates: Partial<LoanApplicationInterface>
) => {
	const application = await LoanApplication.query().findById(application_id);
	let newUpdates: LoanApplicationInterface = {};

	if (application) {
		for (const updateKey of Object.keys(updates)) {
			// @ts-ignore - wouldn't normally do this but don't want to spend too much time debugging
			newUpdates[updateKey] = updates[updateKey];
		}
	}

	if (Object.keys(newUpdates).length) {
		const app = await LoanApplication.query().patchAndFetchById(
			application_id as string,
			updates
		);
		return app;
	}
	return application;
};
