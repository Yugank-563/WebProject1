import { Router  } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware/middleware.js";
import multer from "multer";

import { storage } from "../../cloudConfig.mjs";
const upload = multer({storage});


//controller functions
import {
  getAllListings,
  getListing, 
  getNewListing,
  createListing,
  getEditListing,
  updateLisiting,
  deleteListing,
  searchListings,
  toggleWishlist
} from "../controllers/listings.js";

import { showWishlist } from "../controllers/users.js";

const router = Router();

//combine routes
router.route("/")
  .get(wrapAsync(getAllListings))

  .post(
    isLoggedIn, 
    upload.single("image"),
    validateListing, 
    wrapAsync(createListing)
  );

router.get("/search",searchListings);


//new route
router.get("/new", isLoggedIn, getNewListing);

// wishlist view route
router.get("/wishlist", isLoggedIn, wrapAsync(showWishlist));

// wishlist toggle route (both GET and POST to support save-after-login)
router.route("/:id/wishlist")
  .get(isLoggedIn, wrapAsync(toggleWishlist))
  .post(isLoggedIn, wrapAsync(toggleWishlist));

router.route("/:id")
  .get(wrapAsync(getListing))

  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(updateLisiting)
  )

  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(deleteListing)
  );

//edit route
router.get("/:id/edit",
  isLoggedIn,
  isOwner, 
  wrapAsync(getEditListing)
);

export { validateListing, router as listingsRouter};