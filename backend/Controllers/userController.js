import User from "../models/UserSchema.js"
import Booking from '../models/BookingSchema.js'
import Doctor from '../models/DoctorSchema.js'

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

export const getUserProfile = async(req,res)=>{

    const userId =  req.userId;
    
    try {

        const user = await User.findById(
            userId
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
                    message:"Successfully fetched User Profile",
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

export const getMyAppointments = async(req,res)=>{
    try {
        
        //step1 :retrieve appointments from booking for specific user

        const booking = await Booking.find({user:req.userId})

        //step2 : extract doctor ids from appointement booking

        const doctorIds = booking.map(el=>el.doctor.id);

        //step3 :retrive doctors using doctorID
        const doctors = await Doctor.find({_id:{$in:doctorIds}}).select("-password")

        if(!doctors){
            return res.status(400)
            .json({
                success:false,
                message:"No doctors found some error"
            })
        }
        return res.status(200)
        .json({
            success:true,
            message:"Appointment doctor ",
            data:doctors
        })


    } catch (error) {
        return res.status(500)
            .json({
                success:false,
                message:"No Appointment found some error"
            })
    }
}