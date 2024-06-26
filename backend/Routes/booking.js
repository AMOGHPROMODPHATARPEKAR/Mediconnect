import express from 'express'
import {authenicate} from '../auth/verifyToken.js'
import { createBooking, deleteBooking, getCheckoutSession } from '../Controllers/bookingController.js';
import sendAppointmentEmail, { deleteAppointmentEmail, sendVerificationEmail } from '../Controllers/emailContoller.js';

const router = express.Router();

router.post('/checkout-session/:doctorId/:time',authenicate, getCheckoutSession)
router.post('/create/:doctorId',authenicate,createBooking)
router.delete('/:bookingId',authenicate,deleteBooking);
router.post('/sendEmail',authenicate,sendAppointmentEmail)
router.post('/verifyEmail',sendVerificationEmail)

export default router;