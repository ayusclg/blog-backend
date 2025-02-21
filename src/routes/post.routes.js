import Router from 'express'
import { verifyToken } from '../middlewares/auth.middlewares.js'
import { createPost } from '../controllers/post.controller.js'

const router = Router()

router.route("/create").post(verifyToken,createPost)

export default router