import React from 'react'
import AppointmentEmail from '../../emails/AppointmentEmail'
import { resend } from '../utils/resend'

const sendAppointmentEmail = async(
  email,
  username,
  doctorName,
  date
) => {
  console.log(email)
  try {
   await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mediconnect | Appointment Booked',
        react: AppointmentEmail({username,date,doctorName})
      });
    return {success:true,message:"Sent Verification email successfully"}
} catch (error) {
    console.error("Error while sending Verification email",error)
    return {success:false,message:"Failed to send  email",data:error}
}
}

export default sendAppointmentEmail