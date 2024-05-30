import express from 'express'
import { deleteDoctor, getAllDoctors, getDoctor, updateDoctor } from '../Controllers/doctorController.js';


const router = express.Router();

router.get('/:id',getDoctor);
router.get('/',getAllDoctors);
router.put('/:id',updateDoctor);
router.delete('/:id',deleteDoctor);

export default router;