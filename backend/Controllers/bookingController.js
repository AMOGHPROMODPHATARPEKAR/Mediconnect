import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'
import Stripe from 'stripe'

export const getCheckoutSession = async(req,res)=>{

    try {
        
       const doctor = await Doctor.findById(req.params.doctorId)
       const user = await User.findById(req.userId)
       
       
       const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const priceId = process.env.STRIPE_PRICE_ID
        
       //create stripe checkout session
       const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode:'payment',
        success_url:`${process.env.CLIENT_SITE_URL}/checkout-success/${doctor._id}`,
        cancel_url:`${process.env.CLIENT_SITE_URL}/checkout-reject`,
        customer_email:user.email,
        client_reference_id:req.params.doctorId,
        line_items:[
            {
                price:priceId,
                quantity:doctor.ticketPrice
            }
        ]
       })


       return res.status(200)
       .json({
        success:true,
        message:"Successfully paid",
        session
       })


    } catch (error) {
        console.log(error)
       return res.status(500)
       .json({
        success:false,
        message:"Error creating checkout session",
       
       })
    }

}

export const createBooking = async (req,res)=>{
    //create new booking 
    
    try {

        const doctor = await Doctor.findById(req.params.doctorId)
        const user = await User.findById(req.userId)

        const booking = new Booking({
            doctor:doctor._id,
            user:user._id,
            ticketPrice:doctor.ticketPrice,
            status:'approved'
           })
    
           await booking.save();
        
           return res.status(200)
           .json({
            success:true,
            message:"Successfully Booking done",
            data:booking
           })

    } catch (error) {
        console.log(error)

       return res.status(500)
       .json({
        success:false,
        message:"Error creating booking",
       
       })
    }
}