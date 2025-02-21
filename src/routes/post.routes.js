import Router from 'express'
import { verifyToken } from '../middlewares/auth.middlewares.js'
import { createPost, fetchPost, fetchSinglePost, updatePost } from '../controllers/post.controller.js'

const router = Router()

router.route("/create").post(verifyToken,createPost)
router.route("/fetch").get(fetchPost)
router.route("/single/:_id").get(fetchSinglePost)
router.route("/update/:_id").post(verifyToken,updatePost)

export default router