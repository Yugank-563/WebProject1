import { Router  } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware/middleware.js";
import multer from "multer";

import { storage } from "../cloudConfig.mjs";
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
} from "../controllers/listings.js";

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

//new route
router.get("/new", isLoggedIn, getNewListing);


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



//index.ejs route
// router.get("/", wrapAsync(getAllListings));


//show route
// router.get("/:id",wrapAsync(getListing));


//create route
// router.post("/", 
//   isLoggedIn, 
//   validateListing, 
//   wrapAsync(createListing)
// );


//update route
// router.put("/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(updateLisiting)
// );


//delete route
// router.delete("/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(deleteListing)
// );

export { validateListing, router as listingsRouter};