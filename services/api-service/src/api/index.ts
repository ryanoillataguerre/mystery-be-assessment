import { Router } from "express";
import usersRoutes from "./users";
import applicationsRoutes from "./applications";

const router: Router = Router();

router.use("/users", usersRoutes);
router.use("/applications", applicationsRoutes);

export default router;
