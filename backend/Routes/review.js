import express from 'express'
import { createReview, getAllReviews } from '../Controllers/reviewController.js';
import { authenicate ,restrict } from '../auth/verifyToken.js';

const router = express.Router({mergeParams:true});


router
    .route('/')
    .get(getAllReviews)
    .post(authenicate,restrict(['patient']),createReview)

// router.put('/create',authenicate,restrict(["patient"]),createReview);
// router.delete('/:id',authenicate,restrict(["Review"]),deleteReview);

export default router;