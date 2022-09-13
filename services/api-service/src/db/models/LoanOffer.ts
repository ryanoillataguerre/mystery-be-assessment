import { Model, ModelObject, RelationMappings } from "objection";
import path from "path";

export class LoanOffer extends Model {
	id?: string;
	user_id?: string;
	loan_application_id?: string;
	apr?: number;
	monthly_payment?: number;
	term_length_months?: number;
	accept?: boolean;
	reasons?: string[];

	static tableName: string = "loan_offers";

	static getIdColumn(): string {
		return "id";
	}
	static jsonSchema = {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "string" },
			user_id: { type: "string" },
			loan_application_id: { type: "string" },
			apr: { type: ["number", "null"] },
			monthly_payment: { type: ["number", "null"] },
			term_length_months: { type: ["number", "null"] },
			accept: { type: "boolean" },
			reasons: { type: ["array", "null"] },
		},
	};

	static relationMappings = (): RelationMappings => ({
		user: {
			relation: Model.BelongsToOneRelation,
			modelClass: path.join(__dirname, "User"),
			join: {
				from: "loan_offers.user_id",
				to: "users.id",
			},
		},
		application: {
			relation: Model.BelongsToOneRelation,
			modelClass: path.join(__dirname, "LoanApplication"),
			join: {
				from: "loan_offers.loan_application_id",
				to: "loan_applications.id",
			},
		},
	});
}

export type LoanOfferInterface = ModelObject<LoanOffer>;

export enum LoanOfferRelationMapping {
	User = "user",
}

export default LoanOffer;
