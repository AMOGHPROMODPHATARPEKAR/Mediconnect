import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Doctor from '../models/DoctorSchema.js'
import User from '../models/UserSchema.js'


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

            
        



     } catch (error) {
        
     }
}
export const login = async(req,res)=>{
     try {
        
     } catch (error) {
        
     }
}