import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser'
import dotenv from "dotenv"
import mongoose from 'mongoose';
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import doctorRoute from './Routes/doctor.js'
import reviewRoute from './Routes/review.js'
import bookingRoute from './Routes/booking.js'
import { Resend } from 'resend';

const app = express();
const PORT = process.env.PORT || 8000; 


dotenv.config({
  path:'./.env'
})


app.use(cors({
  origin:process.env.CORS_ORIGIN,
  // credentials:true
}))

app.use(express.json({
  limit:"16kb"
}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())

export const resend = new Resend(process.env.RESEND_KEY);

//database

mongoose.set('strictQuery',false)

const connectDB = async()=>{
    try {
        
        const connectionIn = await mongoose.connect(`${process.env.MANGODB_URL}/Mediconnect`,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        console.log("MongoDb database is connected")

    } catch (error) {
        console.log("mongo database connection failed")
    }
}

    
    const corsOptions = {
        origin:true
    }   

//middleware
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

//routes
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/user',userRoute);
app.use('/api/v1/doctor',doctorRoute);
app.use('/api/v1/review',reviewRoute);
app.use('/api/v1/bookings',bookingRoute);

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});


