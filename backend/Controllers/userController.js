import User from "../models/UserSchema.js"
import Booking from '../models/BookingSchema.js'
import Doctor from '../models/DoctorSchema.js'
import mongoose from "mongoose";

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
        // console.log(req.userId)
        const bookings = await Booking.aggregate([
            {
              $match: { user: new mongoose.Types.ObjectId(req.userId) }  // Match bookings for the specific user
            },
            {
              $lookup: {
                from: 'doctors',            // Name of the doctor collection
                localField: 'doctor',     // Field in the Booking collection
                foreignField: '_id',        // Field in the Doctor collection
                as: 'doctorInfo'            // The name of the new array field to add
              }
            },
            {
              $unwind: '$doctorInfo'        // Unwind the array to de-normalize the result
            },
            {
              $project: {                   // Select fields to include in the output
                _id: 1,
                user: 1,
                doctorInfo: {
                  _id: 1,
                  email: 1,
                  name: 1,
                  photo: 1,
                  role: 1,
                  qualifications: 1,
                  experiences: 1,
                  timeSlots: 1,
                  reviews: 1,
                  averageRating: 1,
                  totalRating: 1,
                  isApproved: 1,
                  appointments: 1,
                  about: 1,
                  bio: 1,
                  phone: 1,
                  specialization: 1,
                  ticketPrice: 1
                }
              }
            }
          ]);
          if(!bookings){
            return res.status(400)
                .json({
                    success:false,
                    message:"No booking found some error"
                })
          }

        return res.status(200)
        .json({
            success:true,
            message:"Appointments doctor ",
            data:bookings
        })


    } catch (error) {
        return res.status(500)
            .json({
                success:false,
                message:error.message
            })
    }
}