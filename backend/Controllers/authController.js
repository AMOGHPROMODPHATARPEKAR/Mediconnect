import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Doctor from '../models/DoctorSchema.js'
import User from '../models/UserSchema.js'


const generateToken = user =>{
    return jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET,{
        expiresIn:'15d'
    })
}

export const register = async(req,res)=>{
     
    const {email, password,name,role,photo, gender} =req.body;

    try {

        let user= null;

        if(role === 'patient'){
            user = await User.findOne({
                $or: [{ name: name }, { email: email }]
              })
        }else if(role === 'doctor'){
            user = await Doctor.findOne({
                $or: [{ name: name }, { email: email }]
              })
        }

        if(user)
            {
                return res
                .status(400)
                .json({
                    message:'User already exist'
                })
            }
        
            //hash password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password,salt)

            if(role === 'patient')
             {

                user = new User({
                    name,
                    email,
                    password:hashPassword,
                    photo,
                    gender,
                    role
                })
             }

            if(role === 'doctor')
             {

                user = new Doctor({
                    name,
                    email,
                    password:hashPassword,
                    photo,
                    gender,
                    role
                })
             }

             await user.save();

             res.status(200)
             .json({
                succcess:true,
                message:"User successfully created",
                data:user
             })
        



     } catch (error) {
        res.status(500)
             .json({
                succcess:false,
                message:"User failed creating",
             })
     }
}
export const login = async(req,res)=>{

    const {email} = req.body; 
    
    try {

       let user = null;

       const patient = await User.findOne({email});
       const doctor = await Doctor.findOne({email});


       if(patient)
        {
            user = patient;
        }

        if(doctor)
        {
                user = doctor;
         }
        
        if(!user)
            {
                return res.status(404)
                .json({
                    status:false,
                    message:"User not found"
                })
            }

        const isPasswordMatch =  bcrypt.compare(req.body.password ,user?.password)

        if(!isPasswordMatch)
            {
                return res.status(400)
                .json({
                    status:false,
                    message:"Invalid Credentials"
                })
            }
        
        //get token
        const token = generateToken(user);

        const {password,role,appointments, ...rest} = user._doc;

        return res.status(200)
                .json({
                    status:true,
                    message:"SuccessFully Loged In",
                    token,
                    data:{...rest},
                    role
                })


     } catch (error) {
        return res.status(500)
                .json({
                    status:false,
                    message:"Login failed ",
                    
                })
     }
}