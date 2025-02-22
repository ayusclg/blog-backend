import Router from "express";
import { deleteUser } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/del/:_id").delete(verifyToken,deleteUser)

export default router