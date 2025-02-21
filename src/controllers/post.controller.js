import { Post } from "../models/post.model.js"
import { User } from "../models/user.model.js"


const createPost = async function (req,res){
    try {
        const user = await User.findById(req.user._id).select("-password -refresh_token")
        if(user.role!== "admin"){
            return res.status(403).json({
                message:"Access Denied"
            })
        }

        const{title,content,category} = req.body
        console.log(req.body)
        
        const create = await Post.create({
            title,
            content,
            category,
            created_by:req.user._id
        })

        const createdPost = await Post.findById(create._id).populate("created_by","username")
        if(!createdPost){
            return res.status(500).json({
                message:"Could not create post"
            })
        }
            res.status(200).json({
                message:"post created",
                //data:createdPost
            })
    } catch (error) {
        res.status(200).json({
            message:"Error in creating post"
        })
    }
}

const fetchPost = async function (req,res){
    try {
        const page = parseInt(req.query.page)|| 1
        const perPage = parseInt(req.query.perPage)||2
        const category = req.query.category

        const postFilter = {}
        postFilter.category = category

        const postt = await Post.find(postFilter).populate("created_by","username")
        .skip((page -1)*perPage)
        .limit(perPage)

        const totalPost = await Post.countDocuments(postFilter)

        if(!totalPost){
            return res.status(500).json({
                message:"No Post Found"
            })
        }
        res.status(200).json({
            message:"POST FETCHED",
            page:page,
            perPage:perPage,
            total:totalPost,
            post:postt
        })
    } catch (error) {
        res.status(500).json({
            message:"Error in fetching post"
        })
    }
}

const fetchSinglePost = async function (req,res){
    try {
        const post = await Post.findById(req.params._id).populate("created_by","username")
        if(!post){
            return res.status(500).json({
                message:"No Post Found"
            })
        }
        res.status(200).json({
            message:"POST FETCHED",
            data:post
        })
    } catch (error) {
        res.status(500).json({
            message:"Error Fetching single post"
        })
    }
}

const updatePost = async function (req,res){
    try {
        const user = await User.findById(req.user._id)
        const post = await Post.findById(req.params._id)
        if(post.created_by.toString() !== user._id.toString()){
            return res.status(400).json({
                message:"You cannot modify the content"
            })
        }
        const {title,content,category} =req.body
        

        const update = await Post.findByIdAndUpdate(req.params._id,{
            $Set:{
                title,
                content,
                category,
            }
        },
        {new:true}
    ).populate("created_by","username")
        if(!update){
            return res.status(500).json({
                message:"Post Not Updated"
            })
        }
        res.status(200).json({
            message:"UPDATE SUCCESSFULL",
            data:update
        })
    } catch (error) {
       res.status(500).json({
        message:"Error Updating Post"
       }) 
    }
}
const deletePost = async function (req,res){
    try {
        const user = await User.findById(req.user._id)
        const post = await Post.findById(req.params._id)
        if(user._id.toString()!==post.created_by.toString()){
            return res.status(500).json({
                message:"you have no permission"
            })
        }
         await Post.deleteOne({created_by:req.user._id})

         res.status(200).json({
            message:"Successfully deleted",
            data:req.params._id
         })
    } catch (error) {
        res.status(500).json({
            message:"Error deleting the post"
        })
    }
}
export {createPost,fetchPost,fetchSinglePost,updatePost,deletePost}