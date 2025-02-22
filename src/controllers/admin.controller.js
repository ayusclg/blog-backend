import { User } from "../models/user.model.js"


const deleteUser = async function (req,res){
    try {
        const user = await User.findById(req.user._id).select("-password -refresh_token")
        if(user.role !== "admin"){
            return res.status(403).json({
                message:"Youre Not Allowed"
            })
        }

        await User.deleteOne({_id:req.params._id})
        res.status(200).json({
            message:"Successfully deleted"
        })
        
    } catch (error) {
        res.status(500).json({
            message:"Error in deleting the user"
        })
    }
}

const fetchAllUser = async function (req,res){
    try {
        const user = await User.findById(req.user._id).select("-password -refresh_token")
        if(user.role !== "admin"){
            return res.status(403).json({
                message:"Access Denied"
            })
        }

        let page = parseInt(req.query.page) || 1
        let perPage = parseInt(req.query.perPage) || 3
        let role = req.query.role 

        let fetchUser = {}
        if(role)
        fetchUser.role = role

        const allUser = await User.find(fetchUser).select("-password -refresh_token")
        .skip((page-1)*perPage)
        .limit(perPage)

        if(!allUser){
            return res.status(400).json({
                message:"No User Found"
            })
        }
        const totalUser = await User.countDocuments(fetchUser)

        res.status(200).json({
            message:"User fetched Successfully",
            page:page,
            perPage:perPage,
            TotalUser:totalUser,
            details:allUser
        })
        }
     catch (error) {
        res.status(500).json({
            message:"unsucessfull"
        })
    }
}
export {deleteUser,fetchAllUser}