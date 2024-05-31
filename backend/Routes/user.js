import express from 'express'
import { deleteUser, getAllUsers, getUser, updateUser } from '../Controllers/userController.js';
import { authenicate, restrict } from '../auth/verifyToken.js';

const router = express.Router();

router.get('/:id',authenicate,restrict(["patient"]),getUser);
router.get('/',authenicate,restrict(["admin"]),getAllUsers);
router.put('/:id',authenicate,restrict(["patient"]),updateUser);
router.delete('/:id',authenicate,restrict(["patient"]),deleteUser);

export default router;