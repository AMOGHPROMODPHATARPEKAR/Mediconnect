import express from 'express'
import { deleteUser, getAllUsers, getUser, updateUser } from '../Controllers/userController.js';


const router = express.Router();

router.get('/:id',getUser);
router.get('/',getAllUsers);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

export default router;