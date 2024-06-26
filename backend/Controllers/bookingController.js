import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'
import Stripe from 'stripe'

export const getCheckoutSession = async(req,res)=>{

    try {
        
       const doctor = await Doctor.findById(req.params.doctorId)
       const user = await User.findById(req.userId)
       const time = req.params.time
       
       const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const priceId = process.env.STRIPE_PRICE_ID
        
       //create stripe checkout session
       const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode:'payment',
        success_url:`${process.env.CLIENT_SITE_URL}/checkout-success/${doctor._id}/${time}`,
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
        const {date} = req.body
        const d = new Date(date);
        const booking = new Booking({
            doctor:doctor._id,
            user:user._id,
            ticketPrice:doctor.ticketPrice,
            status:'approved',
            date:date,
            expiresAt:d,
           })
    
         await booking.save();
         await booking.populate('user doctor')
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

export const deleteBooking = async(req,res)=>{

    const {bookingId} = req.params;
   
    try {
        
        const booking = await Booking.findById(bookingId);
        if (!booking) {
        throw new Error('Booking not found');
        }

    // Remove the booking from the doctor's and user's appointments
    await Booking.removeAppointments(booking);

    // Delete the booking
    const deleted = await Booking.findByIdAndDelete(bookingId);
    
    return res.status(200)
    .json({
        success:true,
        message:"Deleted Booking successfully",
        data:deleted
    })

    } catch (error) {
        return res.status(500)
        .json({
            success:false,
            message:error.message
        })
    }

}