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

export const getBookedSlots = async (req, res) => {
    try {
        const { doctorId } = req.params;
        console.log("ddd",doctorId)
        // Find all bookings for the specified doctor
        const bookings = await Booking.find({ doctor: doctorId }, 'date').lean();

        // Extract the `date` field from the bookings
        const bookedSlots = bookings.map((booking) => booking.date);
        console.log(bookedSlots)
        return res.status(200).json({
            success: true,
            message: "Booked slots fetched successfully",
            data:bookedSlots,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching booked slots",
        });
    }
};

export const updateBookingStatus = async(req, res) => {
    try {
        const bookingId = req.params.id;
        const { status, remarks, reportUrl } = req.body;
        
        // Validate inputs
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required"
            });
        }

        if (!status || !remarks) {
            return res.status(400).json({
                success: false,
                message: "Status and remarks are required"
            });
        }

        // Update the booking
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                status,
                remarks,
                reportUrl: reportUrl || '',
                completedAt: status === 'completed' ? new Date() : null
            },
            { new: true }
        ).populate('user').populate('doctor');

        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // If status is completed, send email notification
        if (status === 'completed') {
            try {
                await sendEmail({
                    email: updatedBooking.user.email,
                    subject: "Appointment Completed",
                    template: "appointmentCompleted",
                    data: {
                        name: updatedBooking.user.name,
                        doctorName: updatedBooking.doctor.name,
                        date: updatedBooking.date,
                        remarks: remarks,
                        reportUrl: reportUrl || null
                    }
                });
            } catch (emailError) {
                console.error("Error sending completion email:", emailError);
                // Continue execution even if email fails
            }
        }

        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: updatedBooking
        });

    } catch (error) {
        console.error("Error in updateBookingStatus:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update booking status",
            error: error.message
        });
    }
};