import VerificationEmail from "../../emails/VerificationEmail";
import {Resend} from 'resend'

export async function sendVerificationEmail(
    emial,
    username,
    verifyCode
){
    try {
        const resend = new Resend(import.meta.env.VITE_RESEND_KEY);
      await  resend.emails.send({
            from: 'onboarding@resend.dev',
            to: emial,
            subject: 'Mystry Message | Verification Code',
            react: VerificationEmail({username,otp:verifyCode})
          });
        return {success:true,message:"Sent email successfully"}
    } catch (error) {
        console.error("Error while sending appointment email",error)
        return {success:false,message:"Failed to send  email"}
    }
}