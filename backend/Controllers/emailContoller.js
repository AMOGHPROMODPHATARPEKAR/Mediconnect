import { resend } from "../index.js";


const sendAppointmentEmail = async(req,res) => {

  const {  email,username,doctorName,date} = req.body;
  
  try {
   await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mediconnect | Appointment Booked',
        html:`<div>
        <h3>Booking Information</h3>
        <p>Thank for booking the appointment, here is the information about booking</p>
        <p><strong>Username:</strong> <span>${username}</span></p>
        <p><strong>Doctor Name:</strong> <span ></span> ${doctorName}</p>
        <p><strong>Date:</strong> <span>${date}</span></p>
        </div>`
      });
    return res.status(200).json( {success:true,message:"Sent Verification email successfully"})
} catch (error) {
    console.error("Error while sending Verification email",error)
    return res.status(500).json( {success:false,message:"Failed to send  email",data:error})  
}
}

export default sendAppointmentEmail