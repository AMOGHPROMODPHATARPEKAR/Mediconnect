import { resend } from "../index.js";


export const sendVerificationEmail = async(req,res) => {

  const {  email,username,verifyCode} = req.body;
  
  try {
   await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mediconnect | Verification',
        html:`<div>
            <h3>Verification Code</h3>
            <p>Thank you for signing up. Here is your verification code:</p>
            <p><strong>Username:</strong> <span>${username}</span></p>
            <p><strong>Verification Code:</strong> <span>${verifyCode}</span></p>
        </div>
        `
      });
    return res.status(200).json( {success:true,message:"Sent email successfully"})
} catch (error) {
    console.error("Error while sending  email",error)
    return res.status(500).json( {success:false,message:"Failed to send  email",data:error})  
}
}
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
    return res.status(200).json( {success:true,message:"Sent email successfully"})
} catch (error) {
    console.error("Error while sending  email",error)
    return res.status(500).json( {success:false,message:"Failed to send  email",data:error})  
}
}

export default sendAppointmentEmail

export const deleteAppointmentEmail = async({ email, username, doctorName, date }) => {

  // const {  email,username,doctorName,date} = req.body;
  
  try {
   await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mediconnect | Appointment Deleted',
        html:`<div>
        <h3>Appointment Cancelled</h3>
        <p>We regret to inform you that your appointment has been cancelled.</p>
        <p><strong>Username:</strong> <span>${username}</span></p>
        <p><strong>Doctor Name:</strong> <span>${doctorName}</span></p>
        <p><strong>Date:</strong> <span>${date}</span></p>
      </div>
    `
      });
      console.log("Cancellation email sent successfully.");
} catch (error) {
  console.error("Error while sending cancellation email:", error);
  throw new Error("Failed to send cancellation email."); 
}
}