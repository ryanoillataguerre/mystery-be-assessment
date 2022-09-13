import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.status(200).send({
			data: {},
		});
	} catch (err) {
		next(err);
	}
});

export default router;
