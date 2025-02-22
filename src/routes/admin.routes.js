import Router from "express";
import { deleteUser, fetchAllUser } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/del/:_id").delete(verifyToken,deleteUser)
router.route("/fetch").get(verifyToken,fetchAllUser)

export default router