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

    req.flash("success", "New review added!");
    res.redirect(`/listings/${listing.slug || listing._id}`);
};

//delete review callback
export const deleteReview = async(req, res) => {
    let {id, reviewId} = req.params;  
    const listing = await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${listing.slug || id}`); 
};