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
const diseaseToSpecialist = {
    "Fungal infection": "Dermatologist",
    "Allergy": "Allergist/Immunologist",
    "GERD": "Gastroenterologist",
    "Chronic cholestasis": "Hepatologist",
    "Drug Reaction": "Allergist/Immunologist",
    "Peptic ulcer disease": "Gastroenterologist",
    "AIDS": "Infectious Disease Specialist",
    "Diabetes": "Endocrinologist",
    "Gastroenteritis": "Gastroenterologist",
    "Bronchial Asthma": "Pulmonologist",
    "Hypertension": "Cardiologist",
    "Migraine": "Neurologist",
    "Cervical spondylosis": "Orthopedist",
    "Paralysis (brain hemorrhage)": "Neurologist",
    "Jaundice": "Hepatologist",
    "Malaria": "Infectious Disease Specialist",
    "Chicken pox": "Infectious Disease Specialist",
    "Dengue": "Infectious Disease Specialist",
    "Typhoid": "Infectious Disease Specialist",
    "Hepatitis A": "Hepatologist",
    "Hepatitis B": "Hepatologist",
    "Hepatitis C": "Hepatologist",
    "Hepatitis D": "Hepatologist",
    "Hepatitis E": "Hepatologist",
    "Alcoholic hepatitis": "Hepatologist",
    "Tuberculosis": "Pulmonologist",
    "Common Cold": "General Practitioner",
    "Pneumonia": "Pulmonologist",
    "Dimorphic hemorrhoids (piles)": "Proctologist",
    "Heart attack": "Cardiologist",
    "Varicose veins": "Vascular Surgeon",
    "Hypothyroidism": "Endocrinologist",
    "Hyperthyroidism": "Endocrinologist",
    "Hypoglycemia": "Endocrinologist",
    "Osteoarthritis": "Orthopedist",
    "Arthritis": "Rheumatologist",
    "(vertigo) Paroxysmal Positional Vertigo": "ENT Specialist",
    "Acne": "Dermatologist",
    "Urinary tract infection": "Urologist",
    "Psoriasis": "Dermatologist",
    "Impetigo": "Dermatologist",
  };

export const getSpecialist = async (req, res) => {
    try {
      const { disease } = req.body;
        console.log(disease)
      if (!disease) {
        return res.status(400).json({ error: "Disease is required" });
      }
  
      // Map disease to specialization
      const specialization = diseaseToSpecialist[disease] ;
      
      if (!specialization) {
        return res.status(404).json({ error: "No specialist found for this disease" });
      }
  
      // Query MongoDB for doctors with the given specialization
      const doctors = await Doctor.find({ specialization }).select(
        "name email phone photo location specialization qualifications averageRating ticketPrice"
      );
  
      if (!doctors.length && specialization !== "General Practitioner") {
        doctors = await Doctor.find({ specialization: "General Practitioner" }).select(
          "name email phone photo location specialization qualifications averageRating ticketPrice"
        );
    }
      console.log(doctors)
  
      // Respond with the list of doctors
      res.status(200).json({
        specialization,
        doctors,
      });
    } catch (error) {
      console.error("Error fetching specialist:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  