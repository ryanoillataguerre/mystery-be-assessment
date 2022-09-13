import morgan from "morgan";

export const morganLogger = morgan(
	process.env.NODE_ENV === "production" ? "common" : "dev"
);
