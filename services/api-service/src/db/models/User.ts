import { Model, ModelObject, RelationMappings } from "objection";
import path from "path";

export class User extends Model {
	id?: string;
	name?: string;

	static tableName: string = "users";

	static getIdColumn(): string {
		return "id";
	}
	static jsonSchema = {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "string" },
			name: { type: "string" },
		},
	};

	static relationMappings = (): RelationMappings => ({
		loan_applications: {
			relation: Model.HasManyRelation,
			modelClass: path.join(__dirname, "LoanApplication"),
			join: {
				from: "users.id",
				to: "loan_applications.user_id",
			},
		},
		loan_offers: {
			relation: Model.HasManyRelation,
			modelClass: path.join(__dirname, "LoanOffer"),
			join: {
				from: "users.id",
				to: "loan_offers.user_id",
			},
		},
	});
}

export type UserInterface = ModelObject<User>;

export enum UserRelationMapping {
	LoanApplications = "loan_applications",
	LoanOffers = "loan_offers",
}

export default User;
