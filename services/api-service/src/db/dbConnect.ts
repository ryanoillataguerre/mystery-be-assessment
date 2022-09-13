import Knex from "knex";
import { Model } from "objection";
const knexConfig = require("./knexfile");

export const dbConnect = async () => {
	if (process.env.NODE_ENV === "test") {
		return;
	}
	const knex = Knex(knexConfig);

	// Generalized query to test connection
	knex
		.raw("SELECT 1")
		.then(() => {
			console.info("connected to database");
		})
		.catch((err: any) => {
			console.error("could not connect to database:" + err);
			process.exit(1);
		});

	Model.knex(knex);
};
