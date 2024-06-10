import express from 'express'
import { CreatVerify, deleteDoctor, getAllDoctors, getDoctor, getDoctorProfile, updateDoctor } from '../Controllers/doctorController.js';
import { authenicate ,restrict } from '../auth/verifyToken.js';

import reviewRouter from './review.js'

const router = express.Router();


//nested route
router.use("/:doctorId/reviews",reviewRouter)

router.get('/:id',authenicate,restrict(["patient"]),getDoctor);
router.get('/', getAllDoctors);
router.put('/:id',authenicate,restrict(["doctor"]),updateDoctor);
router.delete('/:id',authenicate,restrict(["doctor"]),deleteDoctor);
router.get('/profile/me',authenicate,restrict(["doctor"]),getDoctorProfile);
router.post('/profile/verify',authenicate,restrict(["doctor"]),CreatVerify);


export default router;