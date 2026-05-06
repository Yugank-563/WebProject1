import Listing from "../models/listing.js";
import ExpressError from "../utils/expressError.js";
import { listingSchema, reviewSchema } from "../../schema.js";
import Review from "../models/review.js";


//validation middleware for listing
export const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else next();
};


//validation middleware for reviews
export const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else next();
}


// Middleware to check if the user is logged in
export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to do that!");
    return res.redirect("/login");
  }
  next();
}


// Middleware to save the redirect URL before login
export const saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


// Middleware to check if the user is the owner of the listing
export const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) throw new ExpressError(404, "Page Not Found");
  if(!listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}


export const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review) throw new ExpressError(404, "Review Not Found");
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You are not author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}