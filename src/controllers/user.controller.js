import { User } from "../models/user.model.js"
import { uploadingOnCloudinary } from "../utils/cloduinary.js"
import fs from 'fs'

const userRegister = async function (req,res){
    try {
        const {username,email,password,role,gender} = req.body
        
        const user = await User.findOne({email,})
        if(user){
            if(req.file){
                fs.unlink(req.file.path,(err)=>{
                    console.log(err)
                })
            }
            return res.status(403).json({
                message:"User Already Exist"
            })
        }

        const avatarUrl = `public/images/${req.file.filename}`
        if(!avatarUrl){
            return res.status(500).json({
                message:"Photo not found"
            })
        }
        const Upload = await uploadingOnCloudinary(avatarUrl)

        const userCreate = await User.create({
            username:username,
            email:email,
            password:password,
            role:role,
            gender:gender,
            avatar:Upload.secure_url
        })
        if(!userCreate){
            if(req.file){
                fs.unlink(req.file.path,(err)=>{
                    console.log(err)
                })
            }
            return res.status(500).json({
                message:"no user"
            })
        }
        //console.log(userCreate)
        const createdUser = await User.findById(userCreate._id).select("-password -refresh_token")
        if(!createdUser){
            if(req.file){
                fs.unlink(req.file.path,(err)=>{
                    console.log(err)
                })
            }
            return res.status(500).json({
                message:"User couldnot create"
            })
        }

        res.status(201).json({
            message:"User Successfully created",
            data:createdUser
        })
    } catch (error) {
        console.log(error)
        if(req.file){
            fs.unlink(req.file.path,(err)=>{
                console.log(err)
            })
        }
        return res.status(500).json({
            message:"Error in creating User"
        })
    }
}

export {userRegister}