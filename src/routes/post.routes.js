import Router from 'express'
import { verifyToken } from '../middlewares/auth.middlewares.js'
import { createPost, fetchPost } from '../controllers/post.controller.js'

const router = Router()

router.route("/create").post(verifyToken,createPost)
router.route("/fetch").get(fetchPost)

export default router