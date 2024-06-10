import express from 'express'
import {authenicate} from '../auth/verifyToken.js'
import { createBooking, deleteBooking, getCheckoutSession } from '../Controllers/bookingController.js';

const router = express.Router();

router.post('/checkout-session/:doctorId',authenicate, getCheckoutSession)
router.post('/create/:doctorId',authenicate,createBooking)
router.delete('/:bookingId',authenicate,deleteBooking);
export default router;