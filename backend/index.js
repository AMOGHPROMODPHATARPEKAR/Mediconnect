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
import ipfsRoute from './Routes/ipfs.js'
import { Resend } from 'resend';
import axios from 'axios'


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

// initializeScheduler();
    
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
app.use('/api/v1/ipfs',ipfsRoute);


//calendar
import {google} from 'googleapis'
import dayjs from 'dayjs'


const  calendar = google.calendar({
  version:'v3',
  auth:process.env.CALENDER_API_KEY
})

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

const scopes = [
    'https://www.googleapis.com/auth/calendar'
  ];

app.get('/google',(req,res)=>{
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    scope: scopes,
    redirect_uri: 'http://localhost:8000/google/redirect',
  });

  res.redirect(url)
})

app.get('/google/redirect',async (req,res)=>{

  try {
    const  code = req.query.code;
    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
  
    res.redirect(`http://localhost:5173/checkout-success/${req.query.state}?status=success`);
  } catch (error) {
    console.log(error)
    res.redirect(`http://localhost:5173/checkout-success/${req.query.state}?status=error`);
  }
})

app.post('/schedule_event', async (req, res) => {
  const { doctorId, time, summary, location, description, start, timeZone, duration, userEmail } = req.body;

  try {
    // Check authentication
    if (!oauth2Client.credentials.access_token) {
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: `${doctorId}/${time}`, // Pass doctorId and time as state
        redirect_uri: 'http://localhost:8000/google/redirect',
      });

      return res.status(302).json({ 
        redirectUrl: url 
      });
    }

    const event = await calendar.events.insert({
      calendarId: 'primary',
      auth: oauth2Client,
      requestBody: {
        summary,
        location,
        description,
        start: {
          dateTime: start,
          timeZone: timeZone || 'UTC',
        },
        end: {
          dateTime: dayjs(start).add(duration, 'minutes').toISOString(),
          timeZone: timeZone || 'UTC',
        },
        attendees: userEmail ? [{ email: userEmail }] : [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      },
    });

    res.status(200).send({ 
      message: 'Calendar event created successfully',
      eventId: event.data.id 
    });
  } catch (error) {
    console.error('Calendar event creation error:', error);
    
    // If token is expired or invalid, redirect to re-authentication
    if (error.response && error.response.status === 401) {
      return res.status(302).json({ 
        redirectUrl: '/google' 
      });
    }

    res.status(500).send({ 
      message: 'Failed to create calendar event',
      error: error.message 
    });
  }
});

export const PINATA_APIKEY = process.env.PINATA_APIKEY;
console.log(PINATA_APIKEY)
export const PINATA_SECRETKEY = process.env.PINATA_SECRETKEY;

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});


