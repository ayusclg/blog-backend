import mongoose from "mongoose";
import { User } from "./user.model.js";


const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    created_by:{
        type:mongoose.Types.ObjectId,
        ref:User
    }
},{
    timestamps:true
})
export const Post = mongoose.model("Post",postSchema)