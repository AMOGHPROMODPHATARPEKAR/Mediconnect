import { Resend } from 'resend';
const resend_key = import.meta.env.VITE_RESEND_KEY;

export const resend = new Resend(resend_key);
