import Router from "router";
import { Upload } from "../middlewares/multer.middlewares.js";
import { currentUser, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import Joi from "joi";
import fs from 'fs'
import { verifyToken } from "../middlewares/auth.middlewares.js";
const router = Router()


const validateRegisterSchema = Joi.object({
username:Joi.string().min(4).max(10).lowercase(),
email:Joi.string().email().required(),
password: Joi.string().min(8).max(14).required().pattern(new RegExp("^(?=.*[^a-zA-Z0-9])(?=.*[A-Z])(?=.*\\d).{8,}$")).messages({
    "string.pattern.base": "Password must include at least one special character, one uppercase letter, and one digit."
  }),
role:Joi.string().valid('admin','user').required(),
gender:Joi.string().valid('male','female').required()
}).unknown(true)
router.route("/register").post(Upload.single("avatar"),async function(req,res,next){
    try {
       await  validateRegisterSchema.validateAsync(req.body)
       next()
    } catch (error) {
        if(req.file){
                    fs.unlink(req.file.path,(err)=>{
                        console.log(err)
                    })
                }
        res.status(500).json({
            message:"Errror validating",
            
        })
    }
},userRegister)


router.route("/login").post(userLogin)
router.route("/get").get(verifyToken,currentUser)
router.route("/logout").post(verifyToken,userLogout)

export default router