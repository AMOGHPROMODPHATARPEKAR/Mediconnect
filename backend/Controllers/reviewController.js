import Review from '../models/ReviewSchema.js'
import Doctor from '../models/DoctorSchema.js'


//get all review 
export const getAllReviews = async(req,res)=>{

    try {
        const  reviews = await Review.find({});

        if(!reviews)
        {
                return res
                .status(401)
                .json({
                    status:false,
                    message:"Error in finding reviews :: 1"
                })
            }

        return res
        .status(200)
        .json({
            status:true,
            message:"Successfull reviews",
            data:reviews
        })

    } catch (error) {
        
        return res
                .status(401)
                .json({
                        status:false,
                        message:"Error in finding reviews"
                 })
    
    }
}

//create review

export const createReview = async(req,res)=>{

    if(!req.body.doctor) req.body.doctor = req.params.doctorId;
    if(!req.body.user) req.body.user = req.userId;

    const newReview = new Review(req.body);

    try {

        const savedReview = await newReview.save();

       const updatedoctor =  await Doctor.findByIdAndUpdate(
            req.body.doctor,
            {$push:{reviews:savedReview._id}
        });

        if(!updatedoctor)
         {
            return res
            .status(400)
            .json({
                  status:false,
                  message:"Error in adding Review",
                  
           })
         }
        
           return res
                  .status(200)
                  .json({
                        status:true,
                        message:"Review added successfully",
                        data:savedReview
                 })
           
    } catch (error) {
        return res
                  .status(500)
                  .json({
                        status:false,
                        message:error.message,
                       
                 })
    }


}