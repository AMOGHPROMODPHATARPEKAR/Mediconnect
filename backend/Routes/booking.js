import express from 'express'
import {authenicate} from '../auth/verifyToken.js'
import { createBooking, getCheckoutSession } from '../Controllers/bookingController.js';

const router = express.Router();

router.post('/checkout-session/:doctorId',authenicate, getCheckoutSession)
router.post('/create/:doctorId',authenicate,createBooking)

export default router;