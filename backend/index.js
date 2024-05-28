import express from 'express';
import dotenv from "dotenv"
import cors from 'cors'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoute from './Routes/auth.js'

const app = express();

const corsOptions = {
    origin:true
}

//database

mongoose.set('strictQuery',false)

const connectDB = async()=>{
    try {
        
        const connectionIn = await mongoose.connect('mongodb+srv://amoghpp:amogh123@amogh.9k2ydve.mongodb.net/Mediconnect',{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log("MongoDb database is connected",connectionIn.connection.host)

    } catch (error) {
        console.log("mongo database connection failed")
    }
}



const PORT = process.env.PORT || 8000;  // Change this to your desired port

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/api/v1/auth',authRoute);


app.listen(PORT, () => {
    connectDB();
  console.log(`Server running on port ${PORT}`);
});
