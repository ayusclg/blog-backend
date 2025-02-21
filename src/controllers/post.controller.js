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
        postFilter.categories = category

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
export {createPost,fetchPost}