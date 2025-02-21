import { User } from "../models/user.model.js"
import { uploadingOnCloudinary } from "../utils/cloduinary.js"
import fs from 'fs'


const generateAccessTokenOnly = async function(userId){
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        return accessToken
    }
    catch (error) {
        console.log("error in generating access token")
    }}
const generateRefreshTokenOnly = async function (userId){
    try {
        const user = await User.findById(userId)
        const refreshToken = await user.generateRefreshToken()
        user.refresh_token = refreshToken
        await user.save({
            validateBeforeSave:false
        })
        return refreshToken
    } catch (error) {
        console.log("error in generating refreshtoken")
    }
}


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


const userLogin = async function (req,res){
        try {
        const {email,password}=req.body

        
        const user = await User.findOne({email,})
        if(!user){
            return res.status(403).json({
                message:"User doesnot exist"
            })
        }
    
        const isPasswordValid = await user.isPasswordRight(password)
       
        if(!isPasswordValid){
            return res.status(500).json({
                message:"Password incorrect"
            })
        }
        const accessToken = await generateAccessTokenOnly(user._id)
        const refreshToken= await generateRefreshTokenOnly(user._id)
    
        if(!accessToken || !refreshToken){
            return res.status(500).json({
                message:"Error generating tokens"
            })
        }
    
        const loggedUser = await User.findById(user._id).select("-password -refresh_token")
        if(!loggedUser){
            return res.status(500).json({
                message:"User couldnot login"
            })
        }
        const options ={
            httpOnly:true,
            secure:true
        }
            res.status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json({
                message:"User Successfully logged",
                data:loggedUser
            })
    }
 catch (error) {
    res.status(500).json({
        message:"Error Occured in logging in"
    })
}}

const currentUser = async function (req,res){
    try {
        const user = await User.findById(req.user._id).select("-password -refresh_token")
        if(!user){
            return res.status(500).json({
                message:"User not logged in"
            })
        }
        res.status(200).json({
            message:"User fetched",
            data:user
        })
    } catch (error) {
        res.status(500).json({
            message:"Error In Getting Current user"
        })
    }
}

const userLogout = async function (req,res){
try {
    const user = await User.findByIdAndUpdate(req.user._id,{
        $set:{
        refresh_token:undefined
    }
    },
    { new:true}).select("-password -refresh_token")

    if(!user){
        return res.status(400).json({
            message:"Error in getting user"
        })
    }
    const options ={
        httpOnly:true,
        secure:true
    }
    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json({
        message:"Successfully log out"
    })
} catch (error) {
    res.status(500).json({
        message:"Error in logging out"
    })
}
}
export {userRegister,userLogin,currentUser,userLogout}