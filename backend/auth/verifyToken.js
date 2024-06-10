import jwt from 'jsonwebtoken'
import Doctor from '../models/DoctorSchema.js'
import User from '../models/UserSchema.js'


export const authenicate = async(req,res,next)=>{
    //get token
    const authToken = req.headers.authorization;
    
    //check if token exists
    if(!authToken || !authToken.startsWith('Bearer')){
        return res.status(401)
        .json({
            status:false,
            message:"No token, Authorization denied"
        })
    }

    try {
        const token = authToken.split(" ")[1];
       

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = decoded.id;
        req.role = decoded.role;

        next();
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(401)
        .json({
            status:false,
            message:"Token expired"
        })
        }

        return res.status(401)
        .json({
            status:false,
            message:"Invalid token"
        })
    }

}

export const restrict = roles => async(req,res,next)=>{

    console.log("role",req.role,roles)
    
    if(!roles.includes(req.role)){
        return res
        .status(401)
        .json({
            status:false,
            message:"Youre not allowed"
        })
    }

    next();

}