import { User } from "../models/user.model.js"


const deleteUser = async function (req,res){
    try {
        const user = await User.findById(req.user._id).select("-password -refresh_token")
        if(user.role !== "admin"){
            return res.status(403).json({
                message:"Youre Not Allowed"
            })
        }
        console.log(req.params._id)
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
export {deleteUser}