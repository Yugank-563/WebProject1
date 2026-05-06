import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isReviewAuthor, validateReview } from "../middleware/middleware.js";
import { createReview, deleteReview } from "../controllers/reviews.js";

const router = Router({mergeParams: true});

//post route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(createReview)
);
  
//delete review route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(deleteReview)
); 
  

export {router as reviewsRouter}; 