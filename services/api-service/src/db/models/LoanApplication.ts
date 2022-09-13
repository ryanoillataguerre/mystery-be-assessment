import { Model, ModelObject, RelationMappings } from "objection";
import path from "path";
import User from "./User";

export class LoanApplication extends Model {
	id?: string;
	credit_score?: number;
	monthly_debt?: number;
	monthly_income?: number;
	bankruptcies?: number;
	delinquencies?: number;
	vehicle_value?: number;
	loan_amount?: number;
	status?: string;
	user_id?: string;
	user?: User;

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
			status: { type: "string" },
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

export type LoanApplicationInterface = Partial<ModelObject<LoanApplication>>;

export enum LoanApplicationStatus {
	Active = "active",
	Inactive = "inactive",
}

export enum LoanApplicationRelationMapping {
	User = "user",
}

export default LoanApplication;
