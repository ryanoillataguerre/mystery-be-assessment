import { Router } from "express";
import usersRoutes from "./users";
import applicationsRoutes from "./applications";
import offersRoutes from "./offers";

const router: Router = Router();

router.use("/users", usersRoutes);
router.use("/applications", applicationsRoutes);
router.use("/offers", offersRoutes);

export default router;
