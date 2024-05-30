import User from "../models/UserSchema.js"


export const updateUser = async(req,res)=>{

    const id =  req.params.id;

    const {role} = req.body;
    if(role)
        {
            return res.status(400)
                .json({
                    status:false,
                    message:"Cannot Update Role",
                    
                })
        }

    try {

        const updateUser = await User.findByIdAndUpdate(
            id,
            {$set:req.body},
            {new:true}
        )

        if(!updateUser)
            {
                return res.status(400)
                .json({
                    status:false,
                    message:"User not available",
                    
                })
            }

        return res.status(200)
                .json({
                    status:true,
                    message:"Successfully updated User",
                    data:updateUser
                })
        
    } catch (error) {

        return res.status(500)
                .json({
                    status:false,
                    message:"Error in Updating User"
                })
        
    }

}
export const getUser = async(req,res)=>{

    const id =  req.params.id;

    try {

        const user = await User.findById(
            id
        ).select("-password")

        if(!user)
            {
                return res.status(400)
                .json({
                    status:false,
                    message:"User not available",
                    
                })
            }
        return res.status(200)
                .json({
                    status:true,
                    message:"Successfully fetched User",
                    data:user
                })
        
    } catch (error) {

        return res.status(500)
                .json({
                    status:false,
                    message:"Error in fetcing User"
                })
        
    }

}
export const deleteUser = async(req,res)=>{

    const id =  req.params.id;

    try {

        const deletedUser = await User.findByIdAndDelete(id);

        

        if(!deletedUser)
            {
                return res.status(400)
                .json({
                    status:false,
                    message:"User not available",
                    
                })
            }

        return res.status(200)
                .json({
                    status:true,
                    message:"Successfully deleted User",
                    data:deletedUser
                })
        
    } catch (error) {

        return res.status(500)
                .json({
                    status:false,
                    message:"Error in deleting User"
                })
        
    }

}
export const getAllUsers = async(req,res)=>{


    try {

        const users = await User.find({}).select("-password")

        return res.status(200)
                .json({
                    status:true,
                    message:"Successfully fetced All Users",
                    data:users
                })
        
    } catch (error) {

        return res.status(500)
                .json({
                    status:false,
                    message:"Error in fetching All Users "
                })
        
    }

}