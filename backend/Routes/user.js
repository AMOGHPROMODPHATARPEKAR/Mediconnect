import express from 'express'
import { deleteUser, getAllUsers, getMyAppointments, getUser, getUserProfile, updateUser } from '../Controllers/userController.js';
import { authenicate, restrict } from '../auth/verifyToken.js';

const router = express.Router();

router.get('/:id',authenicate,getUser);
router.get('/',authenicate,restrict(["admin"]),getAllUsers);
router.put('/:id',authenicate,restrict(["patient"]),updateUser);
router.delete('/:id',authenicate,restrict(["patient"]),deleteUser);
router.get('/profile/me',authenicate,restrict(["patient"]),getUserProfile);
router.get('/appointement/my-appointements',authenicate,restrict(["patient"]),getMyAppointments);

export default router;