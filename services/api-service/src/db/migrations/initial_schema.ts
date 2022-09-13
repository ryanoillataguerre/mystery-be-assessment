import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema
		.createTable("users", (table: Knex.TableBuilder) => {
			table.string("id").primary();
			table.string("name").nullable();
		})
		.createTable("loan_applications", (table: Knex.TableBuilder) => {
			table.string("id").primary();
			table
				.string("user_id")
				.references("id")
				.inTable("users")
				.onDelete("CASCADE")
				.index();
			table.string("status").notNullable();
			table.integer("credit_score").notNullable();
			table.integer("monthly_debt").notNullable();
			table.integer("monthly_income").notNullable();
			table.integer("bankruptcies").notNullable();
			table.integer("delinquencies").notNullable();
			table.integer("vehicle_value").nullable();
			table.integer("loan_amount").notNullable();
		})
		.createTable("loan_offers", (table: Knex.TableBuilder) => {
			table.string("id").primary();
			table
				.string("user_id")
				.references("id")
				.inTable("users")
				.onDelete("CASCADE")
				.index();
			table
				.string("loan_application_id")
				.references("id")
				.inTable("loan_applications")
				.index();
			table.integer("apr").nullable();
			table.integer("monthly_payment").nullable();
			table.integer("term_length_months").nullable();
			table.boolean("accept").nullable();
			table.jsonb("reasons").nullable();
		});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema
		.dropTableIfExists("loan_offers")
		.dropTableIfExists("loan_applications")
		.dropTableIfExists("users");
}
