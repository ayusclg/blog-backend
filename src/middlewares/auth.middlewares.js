import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
const verifyToken = async function(req,res,next){
 try {
       const token = req.cookies?.accessToken
       if(!token){
           return res.status(500).json({
               message:"Couldnot Find Token"
           })
       }
   
       const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       const user = await User.findById(decodedToken?._id)
       if(!user){
           return res.status(500).json({
               message:"Couldnot Get User Details"
           })
       }
       req.user = user
       next()
 } catch (error) {
    res.status(500).json({
        message:"Error in getting current user"
    })
 }
}
export {verifyToken}