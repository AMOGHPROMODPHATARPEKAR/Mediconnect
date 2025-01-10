import express from 'express'
import { authenicate } from '../auth/verifyToken.js';
import { getImageController, uploadImageController } from '../Controllers/IpfsController.js';
import { uploadUserImage } from '../utils/multer.js';

const router = express.Router();

router.post('/uploadImage',authenicate,uploadUserImage,uploadImageController)
router.post('/getImage',authenicate,getImageController)


export default router;
