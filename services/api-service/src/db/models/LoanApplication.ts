import { Model, ModelObject, RelationMappings } from "objection";
import path from "path";

export class LoanApplication extends Model {
	id?: string;
	name?: string;

	static tableName: string = "loan_applications";

	static getIdColumn(): string {
		return "id";
	}
	static jsonSchema = {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "string" },
			user_id: { type: "string" },
			credit_score: { type: "number" },
			monthly_debt: { type: "number" },
			monthly_income: { type: "number" },
			bankruptcies: { type: "number" },
			delinquencies: { type: "number" },
			vehicle_value: { type: ["number", "null"] },
			loan_amount: { type: "number" },
		},
	};

	static relationMappings = (): RelationMappings => ({
		user: {
			relation: Model.BelongsToOneRelation,
			modelClass: path.join(__dirname, "User"),
			join: {
				from: "loan_applications.user_id",
				to: "users.id",
			},
		},
	});
}

export type LoanApplicationInterface = ModelObject<LoanApplication>;

export enum LoanApplicationRelationMapping {
	User = "user",
}

export default LoanApplication;
