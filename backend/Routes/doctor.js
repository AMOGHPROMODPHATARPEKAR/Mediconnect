import express from 'express'
import { deleteDoctor, getAllDoctors, getDoctor, updateDoctor } from '../Controllers/doctorController.js';
import { authenicate ,restrict } from '../auth/verifyToken.js';

import reviewRouter from './review.js'

const router = express.Router();


//nested route
router.use("/:doctorId/reviews",reviewRouter)

router.get('/:id',authenicate,restrict(["patient"]),getDoctor);
router.get('/', getAllDoctors);
router.put('/:id',authenicate,restrict(["doctor"]),updateDoctor);
router.delete('/:id',authenicate,restrict(["doctor"]),deleteDoctor);

export default router;