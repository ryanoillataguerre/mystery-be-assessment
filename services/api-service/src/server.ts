import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import http from "http";
import { dbConnect } from "./db";
import { errorHandler, morganLogger } from "./utils";

const app = express();
dbConnect();

app.use(morganLogger);
app.use((req: Request, res: Response, next: NextFunction) => {
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Credentials, Set-Cookie, Cookie, Cookies, Cross-Origin, Access-Control-Allow-Credentials, Authorization, Access-Control-Allow-Origin"
	);
	res.header("Access-Control-Allow-Credentials", "true");
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

app.use(helmet());

// Routes
app.use(
	"/",
	express.json({
		limit: "50mb",
	})
);

app.get("/health", (_: Request, res: Response) =>
	res.status(200).send({ success: true, service: "api-service" })
);

app.get("*", (_: Request, res: Response) => res.status(404).send("Not Found"));
app.use(errorHandler);

const server = () => {
	const httpServer = http.createServer(app);

	httpServer.on("listening", () => {
		console.info(
			`api-service listening on container port ${process.env.SERVER_PORT}...`
		);
	});

	return httpServer;
};

export { app };
export default server;
