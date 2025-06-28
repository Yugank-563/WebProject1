import Review from "../models/review.js";
import Listing from "../models/listing.js";

//create review callback
export const createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; 
    
    listing.reviews.push(newReview); 
    await newReview.save();
    await listing.save();

    console.log("new review added :", newReview);
    req.flash("success", "New review added!");
    res.redirect(`/listings/${listing.id}`);
};

//delete review callback
export const deleteReview = async(req, res) => {
    // let listing = await Listing.findById(req.params.id);                          //these two line delete only review but not from reviews array 
    // let deletedReviews = await Review.findByIdAndDelete(req.params.reviewId);    
      let {id, reviewId} = req.params;  
      await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});             //this line delete review from reviews array
      let deletedReviews = await Review.findByIdAndDelete(reviewId);
  
      console.log("deleted review :", deletedReviews);
      req.flash("success", "Review deleted successfully!");
      res.redirect(`/listings/${id}`); 
};