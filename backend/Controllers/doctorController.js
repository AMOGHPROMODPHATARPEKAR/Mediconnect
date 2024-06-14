import BookingSchema from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js"
import VerifySchema from "../models/VerifySchema.js";


export const updateDoctor = async(req,res)=>{

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

        const updateDoctor = await Doctor.findByIdAndUpdate(
            id,
            {$set:req.body},
            {new:true}
        )

        if(!updateDoctor)
            {
                return res.status(400)
                .json({
                    status:false,
                    message:"Doctor not available",
                    
                })
            }

        return res.status(200)
                .json({
                    status:true,
                    message:"Successfully updated Doctor",
                    data:updateDoctor
                })
        
    } catch (error) {

        return res.status(500)
                .json({
                    status:false,
                    message:"Error in Updating Doctor"
                })
        
    }

}
export const getDoctor = async(req,res)=>{

    const id =  req.params.id;
    console.log(id)
    try {

        const doctor = await Doctor.findById(
            id
        ).populate("reviews")
        .select("-password")

        if(!doctor)
            {
                return res.status(400)
                .json({
                    status:false,
                    message:"Doctor not available",
                    
                })
            }
        return res.status(200)
                .json({
                    status:true,
                    message:"Successfully fetched Doctor",
                    data:doctor
                })
        
    } catch (error) {

        return res.status(500)
                .json({
                    status:false,
                    message:"Error in fetcing Doctor"
                })
        
    }

}
export const deleteDoctor = async(req,res)=>{

    const id =  req.params.id;

    try {

        const deletedDoctor = await Doctor.findByIdAndDelete(id);

        if(!deletedDoctor)
            {
                return res.status(400)
                .json({
                    status:false,
                    message:"Doctor not available",
                    
                })
            }

        return res.status(200)
                .json({
                    status:true,
                    message:"Successfully deleted Doctor",
                    data:deletedDoctor
                })
        
    } catch (error) {

        return res.status(500)
                .json({
                    status:false,
                    message:"Error in deleting Doctor"
                })
        
    }

}
export const getAllDoctors = async(req,res)=>{


    try {
        const query = req.query.query
        console.log(query)
        let doctors;

        if(query)
            {
                doctors = await Doctor.find({isApproved:'approved',
                 $or:[
                    {name:{$regex:query, $options:"i"}},
                    {specialization:{$regex:query, $options:"i"}},
                    {location:{$regex:query, $options:"i"}},
                 ]})
            }
            else
            {
                doctors = await Doctor.find({isApproved:'approved'}).select("-password")
            }

            if(!doctors)
                {
                    return res.status(400)
                    .json({
                        status:false,
                        message:"Unable to fetch  Doctors"
                    })
                }



         

        return res.status(200)
                .json({
                    status:true,
                    message:"Successfully fetced All Doctors",
                    data:doctors
                })
        
    } catch (error) {

        return res.status(500)
                .json({
                    status:false,
                    message:error.message
                })
        
    }

}

export const getDoctorProfile =async (req,res)=>{
    const doctorId =  req.userId;
    
    try {

        const doctor = await Doctor.findById(
            doctorId
        )

        if(!doctor)
            {
                return res.status(400)
                .json({
                    status:false,
                    message:"doctor not available",
                    
                })
            }
        
        const {password, ...rest} = doctor._doc;

        const appointements = await BookingSchema.find({doctor:doctorId})
        console.log(appointements)
        return res.status(200)
                .json({
                    status:true,
                    message:"Successfully fetched doctor Profile",
                    data:{...rest,appointements:appointements}
                })
        
    } catch (error) {

        return res.status(500)
                .json({
                    status:false,
                    message:"Error in fetcing doctor"
                })
        
    }
}

export const CreatVerify = async(req,res)=>{

    const {qualifications,experiences,name,specialization} = req.body;
    const doctorId = req.userId;

    try {
        
        const verification = new VerifySchema({
            name,
            doctor:doctorId,
            specialization,
            qualifications,
            experiences
        })

        await verification.save()

        const updateDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            {$set:{
                isApproved:"processing"
            }},
            {new:true}
        )

        if(!updateDoctor){
          return  res.status(400)
             .json({
                succcess:false,
                message:"Doctor updating  error",
             })
        }

       return res.status(200)
             .json({
                succcess:false,
                message:"Verification in processing !!",
                data:verification
             })

        
    } catch (error) {
        return res.status(500)
        .json({
            success:false,
            message:"Error in creating verification"
        })
    }
}